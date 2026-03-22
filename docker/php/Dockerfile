FROM php:8.0-fpm

# Install base dependencies including pdo & xdebug.
RUN apt update \
    && apt install -y \
        zlib1g-dev \
        g++ \
        git \
        libicu-dev \
        zip \
        libzip-dev \
        vim \
        net-tools \
        curl \
    && docker-php-ext-install intl opcache pdo pdo_mysql \
    && pecl install apcu xdebug \
    && docker-php-ext-enable apcu xdebug \
    && docker-php-ext-configure zip \
    && docker-php-ext-install zip

WORKDIR /var/www/vaults_api

# Build arguments
ARG GITHUB_USERNAME
ARG GITHUB_EMAIL
ARG SYSTEM_UID
ARG XDEBUG_HOST_PORT

COPY composer.json composer.lock ./
#RUN composer install --no-dev --optimize-autoloader
COPY . ./

# Expose Xdebug port
EXPOSE ${XDEBUG_HOST_PORT}

# Fix www-data UID safely (only if provided)
RUN if [ -n "$SYSTEM_UID" ]; then usermod -u $SYSTEM_UID www-data; fi

# Install Symfony CLI
RUN curl -sS https://get.symfony.com/cli/installer | bash \
    && ln -s /root/.symfony*/bin/symfony /usr/local/bin/symfony

CMD ["php-fpm"]
