import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

const API_BASE = '/api';

function Avatar({ name }) {
    const initial = name ? name.charAt(0).toUpperCase() : '?';
    return (
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center font-semibold text-sm">
            {initial}
        </div>
    );
}

export default function ArticleView() {
    const { id } = useParams();
    const [article, setArticle] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [authorName, setAuthorName] = useState('');
    const [commentContent, setCommentContent] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState(null);

    useEffect(() => {
        fetch(`${API_BASE}/articles/${id}`)
            .then((res) => {
                if (!res.ok) throw new Error('Статья не найдена');
                return res.json();
            })
            .then(setArticle)
            .catch(setError)
            .finally(() => setLoading(false));
    }, [id]);

    const handleSubmitComment = (e) => {
        e.preventDefault();
        setSubmitError(null);
        setSubmitting(true);
        fetch(`${API_BASE}/articles/${id}/comments`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
            body: JSON.stringify({ author_name: authorName, content: commentContent }),
        })
            .then((res) => {
                if (!res.ok) return res.json().then((d) => { throw new Error(d.message || 'Ошибка'); });
                return res.json();
            })
            .then((comment) => {
                setArticle((prev) => ({ ...prev, comments: [...(prev.comments || []), comment] }));
                setAuthorName('');
                setCommentContent('');
            })
            .catch((err) => setSubmitError(err.message))
            .finally(() => setSubmitting(false));
    };

    const formatDate = (dateStr) =>
        new Date(dateStr).toLocaleDateString('ru-RU', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        });

    if (loading) {
        return (
            <div className="space-y-6 animate-pulse">
                <div className="h-5 w-24 bg-stone-200 rounded" />
                <div className="h-9 w-3/4 bg-stone-200 rounded" />
                <div className="h-4 w-32 bg-stone-100 rounded" />
                <div className="space-y-3 h-4 bg-stone-100 rounded" />
                <div className="h-4 w-full bg-stone-100 rounded" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center">
                <p className="text-red-700 font-medium">Статья не найдена</p>
                <p className="text-sm text-red-600 mt-1">{error}</p>
                <Link to="/" className="mt-4 inline-block text-sm font-medium text-teal-600 hover:text-teal-700">
                    ← Вернуться к списку
                </Link>
            </div>
        );
    }

    if (!article) return null;

    const comments = article.comments || [];

    return (
        <article>
            <Link
                to="/"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-stone-500 hover:text-teal-600 mb-6"
            >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Назад к списку
            </Link>

            <header className="mb-8">
                <time className="text-xs font-medium text-teal-600 uppercase tracking-wide">
                    {formatDate(article.created_at)}
                </time>
                <h1 className="mt-2 text-3xl font-semibold text-stone-900 leading-tight" style={{ fontFamily: 'var(--font-serif)' }}>
                    {article.title}
                </h1>
            </header>

            <div className="text-stone-700 leading-relaxed whitespace-pre-wrap text-[15px]">
                {article.content}
            </div>

            <section className="mt-12 pt-8 border-t border-stone-200">
                <h2 className="text-xl font-semibold text-stone-900 mb-6" style={{ fontFamily: 'var(--font-serif)' }}>
                    Комментарии
                    {comments.length > 0 && (
                        <span className="ml-2 text-sm font-normal text-stone-500">({comments.length})</span>
                    )}
                </h2>

                <ul className="space-y-4 mb-8">
                    {comments.map((c) => (
                        <li key={c.id} className="flex gap-4 rounded-xl border border-stone-200 bg-white p-4 shadow-sm">
                            <Avatar name={c.author_name} />
                            <div className="min-w-0 flex-1">
                                <p className="font-semibold text-stone-900">{c.author_name}</p>
                                <p className="text-xs text-stone-500 mt-0.5">{formatDate(c.created_at)}</p>
                                <p className="mt-2 text-stone-600 text-sm leading-relaxed">{c.content}</p>
                            </div>
                        </li>
                    ))}
                </ul>

                <div className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm">
                    <h3 className="text-sm font-semibold text-stone-900 mb-4">Оставить комментарий</h3>
                    <form onSubmit={handleSubmitComment} className="space-y-4">
                        <div>
                            <label htmlFor="author_name" className="block text-sm font-medium text-stone-700 mb-1.5">
                                Ваше имя
                            </label>
                            <input
                                id="author_name"
                                type="text"
                                value={authorName}
                                onChange={(e) => setAuthorName(e.target.value)}
                                required
                                placeholder="Имя"
                                className="w-full px-4 py-2.5 rounded-lg border border-stone-300 bg-stone-50 text-stone-900 placeholder-stone-400 focus:bg-white focus:border-teal-500"
                            />
                        </div>
                        <div>
                            <label htmlFor="content" className="block text-sm font-medium text-stone-700 mb-1.5">
                                Комментарий
                            </label>
                            <textarea
                                id="content"
                                value={commentContent}
                                onChange={(e) => setCommentContent(e.target.value)}
                                required
                                rows={3}
                                placeholder="Напишите комментарий..."
                                className="w-full px-4 py-2.5 rounded-lg border border-stone-300 bg-stone-50 text-stone-900 placeholder-stone-400 focus:bg-white focus:border-teal-500 resize-y min-h-[80px]"
                            />
                        </div>
                        {submitError && (
                            <p className="text-sm text-red-600">{submitError}</p>
                        )}
                        <button
                            type="submit"
                            disabled={submitting}
                            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-teal-600 text-white font-medium text-sm hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                        >
                            {submitting ? (
                                <>
                                    <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    Отправка...
                                </>
                            ) : (
                                'Отправить'
                            )}
                        </button>
                    </form>
                </div>
            </section>
        </article>
    );
}
