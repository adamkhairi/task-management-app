# Guide de Déploiement

## 🚀 Déploiement en Production

### Prérequis
- Serveur avec PHP 8.1+
- MySQL/PostgreSQL
- Node.js 16+
- Composer
- Serveur web (Apache/Nginx)

### Backend (Laravel)

1. **Cloner et configurer**
```bash
git clone [repository-url]
cd task-management-app
composer install --optimize-autoloader --no-dev
```

2. **Configuration environnement**
```bash
cp .env.example .env
php artisan key:generate
```

3. **Configurer .env pour production**
```env
APP_ENV=production
APP_DEBUG=false
APP_URL=https://votre-domaine.com

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=task_management_prod
DB_USERNAME=your_username
DB_PASSWORD=your_password

QUEUE_CONNECTION=database
```

4. **Base de données**
```bash
php artisan migrate --force
```

5. **Optimisations**
```bash
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan optimize
```

6. **Permissions**
```bash
chmod -R 755 storage bootstrap/cache
```

7. **Queue Worker (avec Supervisor)**
```ini
[program:laravel-worker]
process_name=%(program_name)s_%(process_num)02d
command=php /path/to/artisan queue:work --sleep=3 --tries=3
directory=/path/to/project
autostart=true
autorestart=true
user=www-data
numprocs=8
redirect_stderr=true
stdout_logfile=/path/to/project/worker.log
```

### Frontend (Vue.js)

1. **Build pour production**
```bash
cd frontend
npm install
npm run build
```

2. **Configuration serveur web**

**Nginx:**
```nginx
server {
    listen 80;
    server_name votre-domaine.com;
    root /path/to/project/frontend/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://localhost:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

**Apache (.htaccess dans frontend/dist):**
```apache
<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteBase /
    RewriteRule ^index\.html$ - [L]
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteRule . /index.html [L]
</IfModule>
```

### SSL/HTTPS

1. **Certbot (Let's Encrypt)**
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d votre-domaine.com
```

2. **Mise à jour automatique**
```bash
sudo crontab -e
# Ajouter :
0 12 * * * /usr/bin/certbot renew --quiet
```

## 🔧 Configuration Avancée

### Monitoring

1. **Laravel Telescope (développement uniquement)**
```bash
composer require laravel/telescope --dev
php artisan telescope:install
php artisan migrate
```

2. **Logs**
```bash
# Rotation des logs
sudo nano /etc/logrotate.d/laravel
```

### Performance

1. **Redis pour cache et sessions**
```env
CACHE_DRIVER=redis
SESSION_DRIVER=redis
REDIS_HOST=127.0.0.1
REDIS_PASSWORD=null
REDIS_PORT=6379
```

2. **CDN pour assets**
```env
ASSET_URL=https://cdn.votre-domaine.com
```

### Sécurité

1. **Firewall**
```bash
sudo ufw allow 22
sudo ufw allow 80
sudo ufw allow 443
sudo ufw enable
```

2. **Fail2ban**
```bash
sudo apt install fail2ban
sudo systemctl enable fail2ban
```

## 📊 Monitoring et Maintenance

### Commandes utiles

```bash
# Vérifier les logs
tail -f storage/logs/laravel.log

# Vider le cache
php artisan cache:clear
php artisan config:clear
php artisan route:clear
php artisan view:clear

# Redémarrer les workers
php artisan queue:restart

# Vérifier l'état de l'application
php artisan about
```

### Backup automatique

```bash
#!/bin/bash
# backup.sh
DATE=$(date +%Y%m%d_%H%M%S)
mysqldump -u username -p password database_name > backup_$DATE.sql
tar -czf backup_$DATE.tar.gz backup_$DATE.sql storage/app/public
```

### Mise à jour

```bash
# Sauvegarder
php artisan down
git pull origin main
composer install --optimize-autoloader --no-dev
php artisan migrate --force
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan queue:restart
php artisan up
```

## 🚨 Troubleshooting

### Problèmes courants

1. **Erreur 500**
   - Vérifier les permissions sur storage/
   - Vérifier les logs dans storage/logs/

2. **Queue ne fonctionne pas**
   - Vérifier que le worker tourne
   - Redémarrer avec `php artisan queue:restart`

3. **CORS issues**
   - Configurer les headers CORS dans config/cors.php

4. **Performance lente**
   - Activer les caches
   - Optimiser les requêtes DB
   - Utiliser Redis