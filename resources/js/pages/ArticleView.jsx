import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

const API_BASE = '/api';

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

    if (loading) return <p className="text-[#706f6c]">Загрузка...</p>;
    if (error) return <p className="text-red-600">Ошибка: {error}</p>;
    if (!article) return null;

    return (
        <article>
            <Link to="/" className="text-sm text-[#706f6c] hover:underline mb-4 inline-block">
                ← Назад к списку
            </Link>
            <h1 className="text-2xl font-semibold mb-2">{article.title}</h1>
            <p className="text-sm text-[#706f6c] dark:text-[#A1A09A] mb-6">
                {formatDate(article.created_at)}
            </p>
            <div className="prose dark:prose-invert max-w-none mb-8 whitespace-pre-wrap">
                {article.content}
            </div>

            <section className="border-t border-[#e3e3e0] dark:border-[#3E3E3A] pt-6">
                <h2 className="text-lg font-medium mb-4">Комментарии</h2>
                <ul className="space-y-3 mb-6">
                    {(article.comments || []).map((c) => (
                        <li
                            key={c.id}
                            className="p-3 bg-white dark:bg-[#161615] border border-[#e3e3e0] dark:border-[#3E3E3A] rounded"
                        >
                            <p className="font-medium text-sm">{c.author_name}</p>
                            <p className="text-sm text-[#706f6c] dark:text-[#A1A09A]">
                                {formatDate(c.created_at)}
                            </p>
                            <p className="mt-1">{c.content}</p>
                        </li>
                    ))}
                </ul>

                <form onSubmit={handleSubmitComment} className="space-y-3 max-w-md">
                    <div>
                        <label htmlFor="author_name" className="block text-sm font-medium mb-1">
                            Ваше имя
                        </label>
                        <input
                            id="author_name"
                            type="text"
                            value={authorName}
                            onChange={(e) => setAuthorName(e.target.value)}
                            required
                            className="w-full px-3 py-2 border border-[#e3e3e0] dark:border-[#3E3E3A] rounded bg-white dark:bg-[#161615]"
                        />
                    </div>
                    <div>
                        <label htmlFor="content" className="block text-sm font-medium mb-1">
                            Комментарий
                        </label>
                        <textarea
                            id="content"
                            value={commentContent}
                            onChange={(e) => setCommentContent(e.target.value)}
                            required
                            rows={3}
                            className="w-full px-3 py-2 border border-[#e3e3e0] dark:border-[#3E3E3A] rounded bg-white dark:bg-[#161615]"
                        />
                    </div>
                    {submitError && <p className="text-sm text-red-600">{submitError}</p>}
                    <button
                        type="submit"
                        disabled={submitting}
                        className="px-4 py-2 bg-[#1b1b18] dark:bg-white text-white dark:text-[#1b1b18] rounded hover:opacity-90 disabled:opacity-50"
                    >
                        {submitting ? 'Отправка...' : 'Отправить'}
                    </button>
                </form>
            </section>
        </article>
    );
}
