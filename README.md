# Laravel React Blog

Блог на Laravel + React: статьи и комментарии. REST API для статей (CRUD), фронтенд на React, контейнеризация (Docker).

## Требования

- Docker и Docker Compose
- (Опционально) Node.js 18+ для локальной сборки фронтенда

## Запуск через Docker

1. **Клонируйте репозиторий и перейдите в каталог проекта:**

   ```bash
   cd laravel-react-blog
   ```

2. **Скопируйте конфигурацию окружения и настройте БД для Docker:**

   ```bash
   cp .env.example .env
   ```

   В `.env` для работы с Docker установите:

   ```env
   DB_CONNECTION=mysql
   DB_HOST=mysql
   DB_PORT=3306
   DB_DATABASE=laravel
   DB_USERNAME=laravel
   DB_PASSWORD=secret
   ```

   (Закомментируйте или удалите строки для SQLite, если они есть.)

3. **Соберите и запустите контейнеры:**

   ```bash
   docker compose up -d --build
   ```

4. **Установите зависимости Laravel внутри контейнера приложения:**

   ```bash
   docker compose exec app composer install
   ```

5. **Сгенерируйте ключ приложения (если ещё не сгенерирован):**

   ```bash
   docker compose exec app php artisan key:generate
   ```

6. **Выполните миграции:**

   ```bash
   docker compose exec app php artisan migrate --force
   ```

7. **Заполните БД тестовыми данными (сидеры):**

   ```bash
   docker compose exec app php artisan db:seed --force
   ```

8. **Соберите фронтенд (React) и поместите сборку в `public/build`:**

   На хосте (при установленном Node.js):

   ```bash
   npm install
   npm run build
   ```

   Либо внутри контейнера с Node (если добавлен сервис `node` в `docker-compose`):

   ```bash
   docker compose run --rm node npm install && npm run build
   ```

   Если используете только контейнеры `app`, `nginx`, `mysql`, установите Node.js локально и выполните `npm install` и `npm run build` в корне проекта — папка `public/build` будет смонтирована в контейнер через volume.

9. **Откройте в браузере:**

   - Приложение: **http://localhost**
   - API (список статей): **http://localhost/api/articles**

## API

- `GET /api/articles` — список статей
- `GET /api/articles/{id}` — одна статья с комментариями
- `POST /api/articles` — создание статьи (тело: `title`, `content`; авторизация не требуется)
- `POST /api/articles/{id}/comments` — добавление комментария (тело: `author_name`, `content`)

## Локальный запуск без Docker

- Установите PHP 8.2+, Composer, Node.js, MySQL (или SQLite).
- Скопируйте `.env.example` в `.env`, настройте `DB_*` для своей БД.
- Выполните: `composer install`, `php artisan key:generate`, `php artisan migrate`, `php artisan db:seed`.
- Сборка фронтенда: `npm install && npm run build`.
- Запуск сервера: `php artisan serve`. Для разработки фронта в другом терминале: `npm run dev`.

## Структура

- **Backend:** Laravel (API в `routes/api.php`, контроллеры в `app/Http/Controllers/Api/`).
- **Frontend:** React в `resources/js/` (Vite), страницы: список статей, статья с комментариями, форма новой статьи.
- **Docker:** `docker-compose.yml` (app на PHP-FPM, nginx, MySQL), образ PHP в `docker/php/Dockerfile`, конфиг Nginx в `docker/nginx/default.conf`.
