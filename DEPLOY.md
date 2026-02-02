# Deployment Guide - VPS Production

## Prerequisites
- VPS with Docker & Docker Compose
- Domain name (optional but recommended)
- SSL certificate (Let's Encrypt)

## 1. VPS Setup

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker $USER

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

## 2. Deploy Application

```bash
# Clone repo
git clone <your-repo-url> /opt/shop
cd /opt/shop

# Create production .env
cp .env.example .env
# Edit .env with production values

# Start services
docker-compose -f docker-compose.prod.yml up -d
```

## 3. Nginx Reverse Proxy

```nginx
# /etc/nginx/sites-available/shop
server {
    listen 80;
    server_name your-domain.com;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/shop /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

## 4. SSL with Let's Encrypt

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

## 5. Database Backup (Cron)

```bash
# Add to crontab: crontab -e
0 2 * * * docker exec shop-db pg_dump -U postgres shop_db > /backup/shop-$(date +%Y%m%d).sql
```

## 6. Monitoring

```bash
# Check logs
docker-compose logs -f

# Check health
curl http://localhost:3000/api/health
```
