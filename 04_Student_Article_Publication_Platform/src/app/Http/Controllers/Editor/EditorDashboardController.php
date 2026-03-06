<?php

namespace App\Http\Controllers\Editor;

use App\Http\Controllers\Controller;
use App\Models\Article;
use App\Models\ArticleStatus;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class EditorDashboardController extends Controller
{
    /** Render the editor dashboard with actionable queue, claimed items, and published list. */
    public function index(Request $request): Response
    {
        $user = $request->user();
        $submittedStatusId = ArticleStatus::query()->where('slug', 'submitted')->value('id');
        $publishedStatusId = ArticleStatus::query()->where('slug', 'published')->value('id');

        $queueQuery = Article::query()
            ->with(['author:id,name', 'category:id,name', 'status:id,name,slug'])
            ->withCount('comments')
            ->where('user_id', '!=', $user->id)
            ->whereNull('published_at')
            ->whereNull('claimed_by_editor_id');

        if ($submittedStatusId) {
            $queueQuery->where('article_status_id', $submittedStatusId);
        } else {
            $queueQuery->whereNotNull('submitted_at');
        }

        $myClaimsQuery = Article::query()
            ->with(['author:id,name', 'category:id,name', 'status:id,name,slug'])
            ->withCount('comments')
            ->where('claimed_by_editor_id', $user->id)
            ->whereNull('published_at');

        if ($submittedStatusId) {
            $myClaimsQuery->where('article_status_id', $submittedStatusId);
        } else {
            $myClaimsQuery->whereNotNull('submitted_at');
        }

        $publishedQuery = Article::query()
            ->with(['author:id,name', 'category:id,name', 'status:id,name,slug', 'publicApprover:id,name'])
            ->withCount('comments')
            ->whereNotNull('published_at');

        if ($publishedStatusId) {
            $publishedQuery->where('article_status_id', $publishedStatusId);
        }

        $queueArticles = $queueQuery->latest('submitted_at')->limit(50)->get();
        $myClaimedArticles = $myClaimsQuery->latest('claimed_at')->limit(50)->get();
        $publishedArticles = $publishedQuery->latest('published_at')->limit(100)->get();

        return Inertia::render('Editor/Dashboard', [
            'queueArticles' => $queueArticles,
            'myClaimedArticles' => $myClaimedArticles,
            'publishedArticles' => $publishedArticles,
            'kpis' => [
                'queueCount' => $queueArticles->count(),
                'myClaimsCount' => $myClaimedArticles->count(),
                'publishedCount' => $publishedArticles->count(),
                'publicApprovedCount' => $publishedArticles->where('is_public', true)->count(),
            ],
            'availableRoles' => $user->getRoleNames()->values(),
        ]);
    }
}
