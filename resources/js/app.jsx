import './bootstrap';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ArticleList from './pages/ArticleList';
import ArticleView from './pages/ArticleView';
import NewArticle from './pages/NewArticle';
import Layout from './components/Layout';

const App = () => (
    <BrowserRouter>
        <Layout>
            <Routes>
                <Route path="/" element={<ArticleList />} />
                <Route path="/articles/new" element={<NewArticle />} />
                <Route path="/articles/:id" element={<ArticleView />} />
            </Routes>
        </Layout>
    </BrowserRouter>
);

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<App />);
