<?php

namespace App\Http\Controllers\Editor;

use App\Events\NewArticlePublished;
use App\Http\Controllers\Controller;
use App\Models\Article;
use App\Models\ArticleStatus;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class EditorController extends Controller
{
    /** Show a claimed article in side-by-side review mode. */
    public function show(Request $request, Article $article): Response|RedirectResponse
    {
        if ($article->user_id === $request->user()->id) {
            return redirect()->route('editor.dashboard')->with('error', 'You cannot review your own submission.');
        }

        if ((int) $article->claimed_by_editor_id !== (int) $request->user()->id) {
            return redirect()->route('editor.dashboard')->with('error', 'Claim this article before reviewing.');
        }

        return Inertia::render('Editor/ReviewArticle', [
            'article' => $article->load([
                'author:id,name',
                'category:id,name',
                'status:id,name,slug',
                'revisions' => fn ($query) => $query->with('requester:id,name')->latest(),
                'comments' => fn ($query) => $query->with('user:id,name')->latest(),
            ]),
            'availableRoles' => $request->user()->getRoleNames()->values(),
        ]);
    }

    /** Claim an article for first-come, first-served review. */
    public function claim(Request $request, Article $article): RedirectResponse
    {
        if ($article->user_id === $request->user()->id) {
            return back()->with('error', 'You cannot claim your own submission.');
        }

        $submittedStatusId = ArticleStatus::query()->where('slug', 'submitted')->value('id');
        $claimQuery = Article::query()
            ->whereKey($article->id)
            ->whereNull('claimed_by_editor_id')
            ->whereNull('published_at')
            ->where('user_id', '!=', $request->user()->id);

        if ($submittedStatusId) {
            $claimQuery->where('article_status_id', $submittedStatusId);
        } else {
            $claimQuery->whereNotNull('submitted_at');
        }

        $updated = $claimQuery->update([
            'claimed_by_editor_id' => $request->user()->id,
            'claimed_at' => now(),
            'rejected_by_editor_id' => null,
            'rejected_at' => null,
        ]);

        if ($updated === 0) {
            return back()->with('error', 'This article is already claimed or no longer reviewable.');
        }

        return back()->with('success', 'Article claimed successfully.');
    }

    /** Release a previously claimed article back into the review queue. */
    public function release(Request $request, Article $article): RedirectResponse
    {
        if ((int) $article->claimed_by_editor_id !== (int) $request->user()->id) {
            return back()->with('error', 'Only the claiming editor can release this article.');
        }

        $article->update([
            'claimed_by_editor_id' => null,
            'claimed_at' => null,
        ]);

        return back()->with('success', 'Article released back to the queue.');
    }

    /** Request content updates from the writer for an article. */
    public function requestRevision(Request $request, Article $article): RedirectResponse
    {
        if ($article->user_id === $request->user()->id) {
            return back()->with('error', 'You cannot request revisions for your own article.');
        }

        if ((int) $article->claimed_by_editor_id !== (int) $request->user()->id) {
            return back()->with('error', 'Claim this article before sending a revision request.');
        }

        $validated = $request->validate([
            'notes' => ['required', 'string'],
        ]);

        $revisionStatusId = ArticleStatus::query()->where('slug', 'revision-requested')->value('id');

        $article->revisions()->create([
            'requested_by' => $request->user()->id,
            'notes' => $validated['notes'],
        ]);

        $article->update([
            'article_status_id' => $revisionStatusId ?: $article->article_status_id,
            'editorial_decision_notes' => $validated['notes'],
            'claimed_by_editor_id' => null,
            'claimed_at' => null,
        ]);

        return redirect()->route('editor.dashboard')->with('success', 'Revision request sent to writer.');
    }

    /** Reject an entry with a required reason. */
    public function reject(Request $request, Article $article): RedirectResponse
    {
        if ($article->user_id === $request->user()->id) {
            return back()->with('error', 'You cannot reject your own article.');
        }

        if ((int) $article->claimed_by_editor_id !== (int) $request->user()->id) {
            return back()->with('error', 'Claim this article before rejecting it.');
        }

        $validated = $request->validate([
            'reason' => ['required', 'string'],
        ]);

        $rejectedStatusId = ArticleStatus::query()->where('slug', 'rejected')->value('id');

        $article->update([
            'article_status_id' => $rejectedStatusId ?: $article->article_status_id,
            'editorial_decision_notes' => $validated['reason'],
            'rejected_by_editor_id' => $request->user()->id,
            'rejected_at' => now(),
            'claimed_by_editor_id' => null,
            'claimed_at' => null,
        ]);

        return redirect()->route('editor.dashboard')->with('success', 'Entry rejected and archived from queue.');
    }

    /** Publish a submitted article for authenticated readers. */
    public function publish(Request $request, Article $article): RedirectResponse
    {
        if ($article->user_id === $request->user()->id) {
            return back()->with('error', 'You cannot publish your own article as editor.');
        }

        if ((int) $article->claimed_by_editor_id !== (int) $request->user()->id) {
            return back()->with('error', 'Claim this article before publishing.');
        }

        $publishedStatusId = ArticleStatus::query()->where('slug', 'published')->value('id');

        $article->update([
            'article_status_id' => $publishedStatusId ?: $article->article_status_id,
            'published_at' => now(),
            'is_public' => false,
            'public_approved_by' => null,
            'public_approved_at' => null,
            'claimed_by_editor_id' => null,
            'claimed_at' => null,
            'rejected_by_editor_id' => null,
            'rejected_at' => null,
        ]);

        event(new NewArticlePublished($article->fresh(['category'])));

        return redirect()->route('editor.dashboard')->with('success', 'Article published successfully.');
    }

    /** Approve a published article for public homepage visibility. */
    public function approvePublic(Request $request, Article $article): RedirectResponse
    {
        $this->authorize('approvePublic', $article);

        if ($article->user_id === $request->user()->id) {
            return back()->with('error', 'You cannot approve your own article for public listing.');
        }

        $article->update([
            'is_public' => true,
            'public_approved_by' => $request->user()->id,
            'public_approved_at' => now(),
        ]);

        return back()->with('success', 'Article approved for public landing visibility.');
    }
}
