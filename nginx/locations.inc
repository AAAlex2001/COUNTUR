# Маршруты, общие для HTTP и HTTPS.

# Картинки раздаёт nginx напрямую из общего тома — Python их не трогает.
location /media/ {
    alias /srv/media/;
    expires 30d;
    add_header Cache-Control "public, immutable";
    access_log off;
}

# Статика Next.js с хешами в именах — кэшируем навсегда.
location /_next/static/ {
    proxy_pass http://frontend;
    expires 1y;
    add_header Cache-Control "public, immutable";
    access_log off;
}

location /api/ {
    proxy_pass http://backend;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
}

# Админка: роботам закрыта заголовком; чтобы пускать только со своих адресов, раскомментируй allow/deny.
location /admin {
    # allow 203.0.113.10;
    # deny all;
    add_header X-Robots-Tag "noindex, nofollow, noarchive" always;
    proxy_pass http://frontend;
    proxy_set_header Host $host;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
}

location / {
    proxy_pass http://frontend;
    proxy_set_header Host $host;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
}
