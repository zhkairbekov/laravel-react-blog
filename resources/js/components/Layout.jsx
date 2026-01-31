import { Link } from 'react-router-dom';

export default function Layout({ children }) {
    return (
        <div className="min-h-screen bg-[#FDFDFC] dark:bg-[#0a0a0a] text-[#1b1b18] p-6 lg:p-8">
            <header className="max-w-4xl mx-auto mb-6">
                <nav className="flex items-center gap-4">
                    <Link to="/" className="text-lg font-medium hover:underline">
                        Блог
                    </Link>
                    <Link to="/articles/new" className="text-sm px-4 py-2 border border-[#19140035] rounded hover:bg-black hover:text-white hover:border-black transition-colors">
                        Новая статья
                    </Link>
                </nav>
            </header>
            <main className="max-w-4xl mx-auto">
                {children}
            </main>
        </div>
    );
}
