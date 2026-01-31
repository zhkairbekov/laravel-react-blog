import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const API_BASE = '/api';

export default function NewArticle() {
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = (e) => {
        e.preventDefault();
        setError(null);
        setSubmitting(true);
        fetch(`${API_BASE}/articles`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
            body: JSON.stringify({ title, content }),
        })
            .then((res) => {
                if (!res.ok) return res.json().then((d) => { throw new Error(d.message || 'Ошибка'); });
                return res.json();
            })
            .then((article) => navigate(`/articles/${article.id}`))
            .catch((err) => setError(err.message))
            .finally(() => setSubmitting(false));
    };

    return (
        <div>
            <Link to="/" className="text-sm text-[#706f6c] hover:underline mb-4 inline-block">
                ← Назад к списку
            </Link>
            <h1 className="text-2xl font-semibold mb-6">Новая статья</h1>
            <form onSubmit={handleSubmit} className="space-y-4 max-w-xl">
                <div>
                    <label htmlFor="title" className="block text-sm font-medium mb-1">
                        Заголовок
                    </label>
                    <input
                        id="title"
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        maxLength={255}
                        className="w-full px-3 py-2 border border-[#e3e3e0] dark:border-[#3E3E3A] rounded bg-white dark:bg-[#161615]"
                    />
                </div>
                <div>
                    <label htmlFor="content" className="block text-sm font-medium mb-1">
                        Содержание
                    </label>
                    <textarea
                        id="content"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        required
                        rows={10}
                        className="w-full px-3 py-2 border border-[#e3e3e0] dark:border-[#3E3E3A] rounded bg-white dark:bg-[#161615]"
                    />
                </div>
                {error && <p className="text-sm text-red-600">{error}</p>}
                <button
                    type="submit"
                    disabled={submitting}
                    className="px-4 py-2 bg-[#1b1b18] dark:bg-white text-white dark:text-[#1b1b18] rounded hover:opacity-90 disabled:opacity-50"
                >
                    {submitting ? 'Сохранение...' : 'Опубликовать'}
                </button>
            </form>
        </div>
    );
}
