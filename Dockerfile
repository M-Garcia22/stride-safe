FROM php:8.3-fpm

# Install system dependencies
RUN apt-get update && apt-get install -y \
    git \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    zip \
    unzip \
    nodejs \
    npm \
    nginx \
    supervisor \
    && docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /var/www

# Copy package files first for better caching
COPY package*.json ./
RUN rm -rf node_modules package-lock.json && npm install && npm install @rollup/rollup-linux-x64-gnu @swc/core-linux-x64-gnu

# Copy composer files
COPY backend/composer.json backend/composer.lock ./backend/
RUN cd backend && composer install --no-dev --optimize-autoloader --no-scripts

# Copy all source code
COPY . .

# Build frontend (ensure production mode)
ENV NODE_ENV=production
RUN npm run build && cp -r dist/* backend/public/

# Set permissions
RUN chown -R www-data:www-data /var/www/backend/storage /var/www/backend/bootstrap/cache

# Nginx config
RUN echo 'server { \n\
    listen 8001; \n\
    root /var/www/backend/public; \n\
    index index.php index.html; \n\
    \n\
    location / { \n\
        try_files $uri $uri/ /index.php?$query_string; \n\
    } \n\
    \n\
    location ~ \.php$ { \n\
        fastcgi_pass 127.0.0.1:9000; \n\
        fastcgi_index index.php; \n\
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name; \n\
        include fastcgi_params; \n\
    } \n\
}' > /etc/nginx/sites-available/default

# Supervisor config to run both nginx and php-fpm
RUN echo '[supervisord] \n\
nodaemon=true \n\
\n\
[program:php-fpm] \n\
command=/usr/local/sbin/php-fpm \n\
autostart=true \n\
autorestart=true \n\
\n\
[program:nginx] \n\
command=/usr/sbin/nginx -g "daemon off;" \n\
autostart=true \n\
autorestart=true' > /etc/supervisor/conf.d/app.conf

EXPOSE 8001

CMD ["/usr/bin/supervisord", "-c", "/etc/supervisor/supervisord.conf"]

