FROM php:8.0-fpm

# Install base dependencies including pdo & xdebug.
RUN apt update \
    && apt install -y zlib1g-dev g++ git libicu-dev zip libzip-dev zip vim net-tools \
    && docker-php-ext-install intl opcache pdo pdo_mysql \
    && pecl install apcu xdebug \
    && docker-php-ext-enable apcu xdebug \
    && docker-php-ext-configure zip \
    && docker-php-ext-install zip

WORKDIR /var/www/vaults_api

# Catch environment variables from the docker-compose.yml file.
ARG GITHUB_USERNAME
ARG GITHUB_EMAIL
ARG SYSTEM_UID
ARG XDEBUG_HOST_PORT

# Xdebug port, only avaliable container wide.
EXPOSE ${XDEBUG_HOST_PORT}

# Change the www-data user's id to the specified system user id.
RUN usermod -u ${SYSTEM_UID} www-data

# Install composer globally.
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

# Install symfony cli and set git username, email, and some useful settings & aliases if needed.
RUN curl -sS https://get.symfony.com/cli/installer | bash
RUN mv /root/.symfony/bin/symfony /usr/local/bin/symfony
RUN git config --global user.email ${GITHUB_EMAIL} \
    && git config --global user.name ${GITHUB_USERNAME} \
    && git config --global core.autocrlf input \
    && git config --global core.editor vim \
    && git config --global auto.crlf false \
    && git config --global alias.co checkout \
    && git config --global alias.br branch \
    && git config --global alias.cm commit \
    && git config --global alias.st status \
    && git config --global pull.rebase false \
