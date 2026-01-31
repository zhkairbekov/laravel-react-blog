import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const API_BASE = '/api';

export default function ArticleList() {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch(`${API_BASE}/articles`)
            .then((res) => {
                if (!res.ok) throw new Error('Ошибка загрузки');
                return res.json();
            })
            .then(setArticles)
            .catch(setError)
            .finally(() => setLoading(false));
    }, []);

    const excerpt = (text, len = 160) =>
        text.length <= len ? text : text.slice(0, len).trim() + '…';

    const formatDate = (dateStr) =>
        new Date(dateStr).toLocaleDateString('ru-RU', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        });

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="h-9 w-32 bg-stone-200 rounded animate-pulse" />
                <ul className="space-y-4">
                    {[1, 2, 3].map((i) => (
                        <li key={i} className="rounded-xl border border-stone-200 bg-white p-6 animate-pulse">
                            <div className="h-6 w-3/4 bg-stone-200 rounded mb-3" />
                            <div className="h-4 w-24 bg-stone-100 rounded mb-4" />
                            <div className="h-4 w-full bg-stone-100 rounded" />
                            <div className="h-4 w-2/3 bg-stone-100 rounded mt-2" />
                        </li>
                    ))}
                </ul>
            </div>
        );
    }

    if (error) {
        return (
            <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center">
                <p className="text-red-700 font-medium">Не удалось загрузить статьи</p>
                <p className="text-sm text-red-600 mt-1">{error.message}</p>
                <button
                    type="button"
                    onClick={() => window.location.reload()}
                    className="mt-4 text-sm font-medium text-teal-600 hover:text-teal-700"
                >
                    Обновить страницу
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-semibold text-stone-900" style={{ fontFamily: 'var(--font-serif)' }}>
                    Статьи
                </h1>
                <p className="mt-1 text-stone-500 text-sm">
                    {articles.length === 0 ? 'Пока нет статей' : `Всего статей: ${articles.length}`}
                </p>
            </div>

            {articles.length === 0 ? (
                <div className="rounded-xl border border-stone-200 bg-white p-12 text-center">
                    <p className="text-stone-500">Статей пока нет. Создайте первую.</p>
                    <Link
                        to="/articles/new"
                        className="inline-flex mt-4 text-sm font-medium text-teal-600 hover:text-teal-700"
                    >
                        Написать статью →
                    </Link>
                </div>
            ) : (
                <ul className="space-y-4">
                    {articles.map((article) => (
                        <li key={article.id}>
                            <Link
                                to={`/articles/${article.id}`}
                                className="block rounded-xl border border-stone-200 bg-white p-6 shadow-sm hover:shadow-md hover:border-stone-300 transition-all duration-200 group"
                            >
                                <time className="text-xs font-medium text-teal-600 uppercase tracking-wide">
                                    {formatDate(article.created_at)}
                                </time>
                                <h2 className="mt-2 text-xl font-semibold text-stone-900 group-hover:text-teal-600 transition-colors" style={{ fontFamily: 'var(--font-serif)' }}>
                                    {article.title}
                                </h2>
                                <p className="mt-2 text-stone-600 text-sm leading-relaxed line-clamp-2">
                                    {excerpt(article.content)}
                                </p>
                                <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-teal-600 group-hover:gap-2 transition-all">
                                    Читать далее
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </span>
                            </Link>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
