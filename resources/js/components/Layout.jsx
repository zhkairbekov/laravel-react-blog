import { Link } from 'react-router-dom';

export default function Layout({ children }) {
    return (
        <div className="min-h-screen bg-stone-50 text-stone-900">
            <header className="border-b border-stone-200 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
                    <Link
                        to="/"
                        className="text-xl font-semibold text-stone-900 hover:text-teal-600 transition-colors"
                        style={{ fontFamily: 'var(--font-serif)' }}
                    >
                        Блог
                    </Link>
                    <nav className="flex items-center gap-3">
                        <Link
                            to="/"
                            className="text-sm font-medium text-stone-600 hover:text-stone-900 hidden sm:inline"
                        >
                            Статьи
                        </Link>
                        <Link
                            to="/articles/new"
                            className="inline-flex items-center gap-2 text-sm font-medium px-4 py-2.5 rounded-full bg-teal-600 text-white hover:bg-teal-700 shadow-sm transition-all hover:shadow"
                        >
                            <span className="sr-only sm:not-sr-only">Новая статья</span>
                            <svg className="w-4 h-4 sm:hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                        </Link>
                    </nav>
                </div>
            </header>
            <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
                {children}
            </main>
        </div>
    );
}
