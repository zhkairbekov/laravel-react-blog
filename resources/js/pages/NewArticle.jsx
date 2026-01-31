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
            <Link
                to="/"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-stone-500 hover:text-teal-600 mb-6"
            >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Назад к списку
            </Link>

            <h1 className="text-3xl font-semibold text-stone-900 mb-8" style={{ fontFamily: 'var(--font-serif)' }}>
                Новая статья
            </h1>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm space-y-6">
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-stone-700 mb-1.5">
                            Заголовок
                        </label>
                        <input
                            id="title"
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                            maxLength={255}
                            placeholder="Введите заголовок статьи"
                            className="w-full px-4 py-2.5 rounded-lg border border-stone-300 bg-stone-50 text-stone-900 placeholder-stone-400 focus:bg-white focus:border-teal-500"
                        />
                        <p className="mt-1 text-xs text-stone-500">{title.length}/255</p>
                    </div>
                    <div>
                        <label htmlFor="content" className="block text-sm font-medium text-stone-700 mb-1.5">
                            Содержание
                        </label>
                        <textarea
                            id="content"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            required
                            rows={12}
                            placeholder="Напишите текст статьи..."
                            className="w-full px-4 py-2.5 rounded-lg border border-stone-300 bg-stone-50 text-stone-900 placeholder-stone-400 focus:bg-white focus:border-teal-500 resize-y min-h-[200px]"
                        />
                    </div>
                </div>

                {error && (
                    <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                        {error}
                    </div>
                )}

                <div className="flex flex-wrap items-center gap-3">
                    <button
                        type="submit"
                        disabled={submitting}
                        className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-teal-600 text-white font-medium text-sm hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                    >
                        {submitting ? (
                            <>
                                <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                Публикация...
                            </>
                        ) : (
                            'Опубликовать'
                        )}
                    </button>
                    <Link
                        to="/"
                        className="text-sm font-medium text-stone-500 hover:text-stone-700"
                    >
                        Отмена
                    </Link>
                </div>
            </form>
        </div>
    );
}
