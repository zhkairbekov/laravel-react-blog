# Laravel React Blog

Блог на **Laravel** и **React**: статьи и комментарии. REST API для статей (CRUD), фронтенд на React (Vite), контейнеризация (Docker: Laravel + MySQL + Nginx).

---

## Содержание

- [Требования к окружению](#требования-к-окружению)
- [Быстрый старт (Docker)](#быстрый-старт-docker)
- [REST API](#rest-api)
- [Модели и БД](#модели-и-бд)
- [Фронтенд](#фронтенд)
- [Локальный запуск без Docker](#локальный-запуск-без-docker)
- [Структура проекта](#структура-проекта)

---

## Требования к окружению

- **Docker** и **Docker Compose** — для запуска приложения в контейнерах
- **Node.js 18+** — для сборки фронтенда (на хосте или в отдельном контейнере)

---

## Быстрый старт (Docker)

### 1. Клонирование и переход в каталог

```bash
git clone <repository-url>
cd laravel-react-blog
```

### 2. Конфигурация окружения

Скопируйте пример конфигурации и настройте БД под Docker:

```bash
cp .env.example .env
```

### 3. Запуск контейнеров

```bash
docker compose up -d --build
```

Будут запущены сервисы: **app** (PHP-FPM + Laravel), **nginx**, **mysql**.

### 4. Установка зависимостей Laravel

```bash
docker compose exec app composer install --no-interaction
```

### 5. Ключ приложения

```bash
docker compose exec app php artisan key:generate --force
```

### 6. Миграции

```bash
docker compose exec app php artisan migrate --force
```

### 7. Сидеры (тестовые данные)

Заполнение БД 3–5 статьями и примерами комментариев:

```bash
docker compose exec app php artisan db:seed --force
```

### 8. Сборка фронтенда

На хосте (при установленном Node.js):

```bash
npm install
npm run build
```

Собранные файлы попадут в `public/build` и будут доступны через Nginx (volume смонтирован с проектом).

### 9. Открытие в браузере

- **Приложение:** [http://localhost](http://localhost)
- **API (список статей):** [http://localhost/api/articles](http://localhost/api/articles)

---

## REST API

Авторизация для эндпоинтов **не требуется**.

| Метод | URL | Описание |
|-------|-----|----------|
| `GET` | `/api/articles` | Список статей |
| `GET` | `/api/articles/{id}` | Одна статья с комментариями |
| `POST` | `/api/articles` | Создание статьи (тело: `title`, `content`) |
| `POST` | `/api/articles/{id}/comments` | Добавление комментария (тело: `author_name`, `content`) |

Примеры:

```bash
# Список статей
curl http://localhost/api/articles

# Одна статья
curl http://localhost/api/articles/1

# Создать статью
curl -X POST http://localhost/api/articles \
  -H "Content-Type: application/json" \
  -d '{"title":"Заголовок","content":"Текст статьи"}'

# Добавить комментарий
curl -X POST http://localhost/api/articles/1/comments \
  -H "Content-Type: application/json" \
  -d '{"author_name":"Имя","content":"Текст комментария"}'
```

---

## Модели и БД

### Article

| Поле       | Тип      |
|-----------|----------|
| id        | bigint   |
| title     | string   |
| content   | text     |
| created_at | timestamp |
| updated_at | timestamp |

### Comment

| Поле       | Тип      |
|-----------|----------|
| id        | bigint   |
| article_id| foreignId → articles.id (cascade on delete) |
| author_name | string |
| content   | text     |
| created_at | timestamp |
| updated_at | timestamp |

Миграции: `database/migrations/`. Сидер с тестовыми статьями и комментариями: `database/seeders/ArticleSeeder.php`.

---

## Фронтенд

Реализован на **React** (Vite), стили — **Tailwind CSS**.

- **Страница со списком статей** — заголовок, дата, краткое содержание (excerpt), ссылка «Читать далее».
- **Страница статьи** — полный текст, список комментариев, форма добавления нового комментария (имя, текст).
- **Форма новой статьи** — поля «Заголовок» и «Содержание» (простая форма, без WYSIWYG).

Маршруты SPA: `/` (список), `/articles/:id` (статья), `/articles/new` (новая статья).

Сборка для продакшена: `npm run build`. Режим разработки с hot reload: `npm run dev`.

---

## Локальный запуск без Docker

1. Установите **PHP 8.4+**, **Composer**, **Node.js 18+**, **MySQL** (или SQLite).
2. Скопируйте `.env.example` в `.env` и настройте `DB_*` под свою БД.
3. Установите зависимости и ключ:

   ```bash
   composer install
   php artisan key:generate
   ```

4. Миграции и сидеры:

   ```bash
   php artisan migrate --force
   php artisan db:seed --force
   ```

5. Сборка фронтенда:

   ```bash
   npm install
   npm run build
   ```

6. Запуск сервера Laravel:

   ```bash
   php artisan serve
   ```

   Приложение: [http://localhost:8000](http://localhost:8000). Для разработки фронта в отдельном терминале: `npm run dev`.

---

## Структура проекта

```
laravel-react-blog/
├── app/
│   ├── Http/Controllers/Api/   # ArticleController, CommentController
│   └── Models/                 # Article, Comment
├── database/
│   ├── migrations/             # articles, comments
│   └── seeders/                # ArticleSeeder, DatabaseSeeder
├── docker/
│   ├── nginx/default.conf      # конфиг Nginx
│   └── php/Dockerfile          # образ PHP 8.4-FPM
├── resources/
│   ├── css/app.css             # глобальные стили, Tailwind
│   ├── js/
│   │   ├── app.jsx             # точка входа React, роутинг
│   │   ├── components/         # Layout
│   │   └── pages/              # ArticleList, ArticleView, NewArticle
│   └── views/welcome.blade.php  # SPA-оболочка
├── routes/
│   ├── api.php                 # маршруты API
│   └── web.php                 # fallback для SPA
├── docker-compose.yml          # app, nginx, mysql
└── README.md
```

---

## Лицензия

Проект создан в учебных целях.
