import WriterLayout from '@/Layouts/WriterLayout';
import ArticleForm from './Components/ArticleForm';
import { useTheme } from '@/Contexts/ThemeContext';

export default function CreateArticle({ categories = [] }) {
    const { colors } = useTheme();

    return (
        <WriterLayout>
            <div className="w-full px-2 py-4 sm:px-3 lg:px-4">
                <header
                    className="relative overflow-hidden rounded-xl border px-5 py-4"
                    style={{ backgroundColor: colors.surface, borderColor: colors.border }}
                >
                    <div
                        className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full blur-3xl"
                        style={{ backgroundColor: colors.accent, opacity: 0.12 }}
                    />
                    <div
                        className="pointer-events-none absolute -left-20 -bottom-24 h-64 w-64 rounded-full blur-3xl"
                        style={{ backgroundColor: colors.secondary, opacity: 0.12 }}
                    />

                    <div className="relative">
                        <h2 className="text-xl font-semibold" style={{ color: colors.text }}>
                            Create Article
                        </h2>
                        <p className="mt-1 text-sm" style={{ color: colors.textSecondary }}>
                            Drafts auto-save while you write. Submit when you’re ready for review.
                        </p>
                    </div>
                </header>
            </div>

            <ArticleForm categories={categories} />
        </WriterLayout>
    );
}

