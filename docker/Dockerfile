FROM wordpress

RUN apt-get update \
    && apt-get install -y subversion git mysql-client unzip \
    && php -r "readfile('http://getcomposer.org/installer');" | php -- --install-dir=/usr/bin/ --filename=composer

ENV COMPOSER_ALLOW_SUPERUSER 1
