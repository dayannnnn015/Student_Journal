<?php

namespace App\Http\Controllers\Writer;

use App\Http\Controllers\Controller;
use App\Models\Article;
use App\Services\ArticleService;
use App\Services\EditorialMailService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class WriterController extends Controller
{
    public function __construct(
        private readonly ArticleService $articleService,
        private readonly EditorialMailService $mailService,
    )
    {
    }

    /** Store a new draft article from writer input. */
    public function store(Request $request): RedirectResponse
    {
        $this->authorize('create', Article::class);

        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'content' => ['required', 'string'],
            'category_id' => ['nullable', 'exists:categories,id'],
        ]);

        $article = $this->articleService->createDraft($request->user(), $validated);

        return redirect()->route('writer.articles.edit', $article)->with('success', 'Draft created successfully.');
    }

    /** Submit an existing article for editorial review. */
    public function submit(Request $request, Article $article): RedirectResponse|\Illuminate\Http\JsonResponse
    {
        $this->authorize('submit', $article);
        $previousStatus = $article->status?->slug;
        $this->articleService->submit($article);
        $freshArticle = $article->refresh()->load(['author:id,name,email', 'status:id,slug,name']);
        $isResubmission = $previousStatus === 'revision-requested';
        $this->mailService->sendArticleSubmittedToEditors($freshArticle, $isResubmission);

        if ($request->expectsJson()) {
            return response()->json([
                'ok' => true,
                'article' => $freshArticle,
            ]);
        }

        return back()->with('success', $isResubmission ? 'Article resubmitted for review.' : 'Article submitted for review.');
    }

    /** Save a requested revision to the article content. */
    public function revise(Request $request, Article $article): RedirectResponse
    {
        $this->authorize('requestRevision', $article);

        $validated = $request->validate([
            'content' => ['required', 'string'],
        ]);

        $article->update(['content' => $validated['content']]);

        return back()->with('success', 'Article revision saved.');
    }
}
