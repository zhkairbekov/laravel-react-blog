<?php

namespace Database\Seeders;

use App\Models\Article;
use App\Models\Comment;
use Illuminate\Database\Seeder;

class ArticleSeeder extends Seeder
{
    public function run(): void
    {
        $articles = [
            [
                'title' => 'Добро пожаловать в блог',
                'content' => 'Это первая статья в нашем блоге. Здесь мы будем делиться мыслями о разработке, Laravel, React и многом другом. Надеемся, вам понравится!',
            ],
            [
                'title' => 'Laravel и REST API',
                'content' => 'Laravel предоставляет удобные инструменты для создания REST API. Маршруты в routes/api.php автоматически получают префикс /api, а контроллеры позволяют легко возвращать JSON-ответы.',
            ],
            [
                'title' => 'React на фронтенде',
                'content' => 'React — популярная библиотека для создания пользовательских интерфейсов. В связке с Laravel и Vite можно быстро собрать современное SPA-приложение.',
            ],
            [
                'title' => 'Docker для разработки',
                'content' => 'Контейнеризация упрощает настройку окружения: один docker-compose up — и у вас работают PHP, Nginx и MySQL. Никаких конфликтов версий на локальной машине.',
            ],
            [
                'title' => 'Комментарии и обратная связь',
                'content' => 'Возможность комментировать статьи делает блог живым. Пользователи могут делиться мнениями и задавать вопросы прямо под каждой записью.',
            ],
        ];

        foreach ($articles as $data) {
            $article = Article::create($data);

            if ($article->id <= 2) {
                Comment::create([
                    'article_id' => $article->id,
                    'author_name' => 'Читатель',
                    'content' => 'Отличная статья, спасибо!',
                ]);
            }
        }
    }
}
