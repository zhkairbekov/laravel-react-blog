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

    if (loading) return <p className="text-[#706f6c]">Загрузка...</p>;
    if (error) return <p className="text-red-600">Ошибка: {error.message}</p>;

    const excerpt = (text, len = 150) =>
        text.length <= len ? text : text.slice(0, len).trim() + '…';

    const formatDate = (dateStr) =>
        new Date(dateStr).toLocaleDateString('ru-RU', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        });

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-semibold">Статьи</h1>
            <ul className="space-y-4">
                {articles.map((article) => (
                    <li key={article.id}>
                        <Link
                            to={`/articles/${article.id}`}
                            className="block p-4 bg-white dark:bg-[#161615] border border-[#e3e3e0] dark:border-[#3E3E3A] rounded-lg hover:border-black dark:hover:border-white transition-colors"
                        >
                            <h2 className="text-lg font-medium mb-1">{article.title}</h2>
                            <p className="text-sm text-[#706f6c] dark:text-[#A1A09A] mb-2">
                                {formatDate(article.created_at)}
                            </p>
                            <p className="text-sm text-[#1b1b18] dark:text-[#EDEDEC]">
                                {excerpt(article.content)}
                            </p>
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}
