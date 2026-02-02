# 🚀 Deploy & SEO Guide - Lên Top 1 Google

## 1. Deploy Web Lên VPS

### A. Chuẩn bị VPS
```bash
# SSH vào VPS
ssh root@your-server-ip

# Update
apt update && apt upgrade -y

# Cài Docker
curl -fsSL https://get.docker.com | sh

# Cài Docker Compose
apt install docker-compose -y
```

### B. Clone & Config
```bash
# Clone code
git clone https://github.com/nduc99911/digital-accounts-shops.git /opt/shop
cd /opt/shop

# Tạo .env
nano .env
```

**File .env:**
```env
DATABASE_URL=postgresql://postgres:yourpassword@localhost:5432/shop_db
NEXT_PUBLIC_APP_URL=https://your-domain.com
NEXT_PUBLIC_SHOP_NAME=Your Shop Name
JWT_SECRET=your-super-secret-key
NEXT_PUBLIC_FB_PIXEL_ID=your_pixel_id
NEXT_PUBLIC_GA_ID=your_ga_id
```

### C. Chạy bằng Docker
```bash
# Tạo docker-compose.yml
cat > docker-compose.yml << 'EOF'
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: yourpassword
      POSTGRES_DB: shop_db
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://postgres:yourpassword@postgres:5432/shop_db
    env_file:
      - .env
    depends_on:
      - postgres

volumes:
  postgres_data:
EOF

# Build và chạy
docker-compose up -d

# Migration
npx prisma migrate deploy
npm run db:seed
```

---

## 2. Cấu Hình Domain + SSL

### A. Trỏ Domain
Vào DNS manager, thêm records:
```
Type: A
Name: @
Value: your-server-ip
TTL: 3600

Type: A  
Name: www
Value: your-server-ip
TTL: 3600
```

### B. Cài Nginx + SSL
```bash
# Cài Nginx
apt install nginx certbot python3-certbot-nginx -y

# Config Nginx
cat > /etc/nginx/sites-available/shop << 'EOF'
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
EOF

# Enable site
ln -s /etc/nginx/sites-available/shop /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx

# SSL

certbot --nginx -d your-domain.com -d www.your-domain.com
```

---

## 3. 🎯 SEO Strategy - Lên Top 1

### A. On-Page SEO (Đã có sẵn)
✅ Title tags optimized
✅ Meta descriptions
✅ Heading structure (H1, H2, H3)
✅ Image alt tags
✅ URL structure
✅ Internal linking
✅ Schema markup (JSON-LD)
✅ Sitemap.xml
✅ Robots.txt
✅ Mobile responsive
✅ Page speed optimized

### B. Content Strategy (Quan trọng nhất)

**1. Viết Blog chuẩn SEO:**
```
/topics/
├── netflix-gia-re.mdx
├── spotify-premium-mien-phi.mdx
├── chatgpt-plus-gia.mdx
├── canva-pro-mien-phi.mdx
├── so-sanh-netflix-va-fpt-play.mdx
├── huong-dan-dang-ky-spotify.mdx
└── cach-su-dung-chatgpt-hieu-qua.mdx
```

**2. Mẫu bài viết chuẩn SEO:**
```md
---
title: "Cách Mua Netflix Giá Rẻ Chỉ 79K/Tháng [2025]"
description: "Hướng dẫn mua Netflix giá rẻ chỉ 79K/tháng. Xem 4K, không quảng cáo, bảo hành 100%."
keywords: ["netflix giá rẻ", "mua netflix", "netflix 4k giá rẻ"]
---

# Cách Mua Netflix Giá Rẻ Chỉ 79K/Tháng [2025]

## Tại sao nên mua Netflix giá rẻ?
- Xem phim 4K chất lượng cao
- Không quảng cáo
- Xem được trên 4 thiết bị
...

## So sánh Netflix chính chủ vs tài khoản share
| Tính năng | Chính chủ (260K) | Tài khoản share (79K) |
|-----------|------------------|----------------------|
| Giá | 260K/tháng | 79K/tháng |
| Chất lượng | 4K | 4K |
| Bảo hành | Không | Có |

## Hướng dẫn mua tại Shop X
1. Vào trang chủ
2. Chọn gói Netflix
3. Thanh toán
4. Nhận tài khoản

## FAQ
**Netflix giá rẻ có ổn định không?**
Có, tài khoản được bảo hành đầy đủ...

**Có xem được 4K không?**
Có, hỗ trợ xem 4K trên TV, điện thoại...
```

### C. Technical SEO Checklist

**1. Tốc độ load (Core Web Vitals):**
```bash
# Kiểm tra
curl -sL https://pagespeed.web.dev/insights/?url=your-domain.com

# Tối ưu
docker-compose exec app npm run build
```

**2. Schema Markup (Đã có):**
- Product schema
- Organization schema
- FAQ schema
- Review schema

**3. Internal Linking:**
- Mỗi product page link đến 3-5 products liên quan
- Blog post link về category và products
- Breadcrumb navigation

### D. Off-Page SEO (Backlinks)

**1. Xây dựng backlinks chất lượng:**
- Đăng bài trên VnExpress, Zing, Kenh14 (guest post)
- Forum: Tinhte, Voz (share hữu ích, không spam)
- Reddit: r/VietNam, r/technology
- Facebook groups về tech
- Quora: Trả lờii câu hỏi liên quan

**2. Social Signals:**
- Share mỗi bài blog lên Facebook Fanpage
- Pinterest pins cho infographics
- TikTok videos hướng dẫn

### E. Local SEO

**1. Google Business Profile:**
- Tạo profile doanh nghiệp
- Thêm địa chỉ, SĐT, giờ làm việc
- Upload hình ảnh
- Thu thập reviews

**2. NAP Consistency:**
- Name, Address, Phone giống nhau ở mọi nơi

### F. Content Calendar (Đăng bài đều đặn)

**Tuần 1-4:**
- 2 bài blog/tuần (1000-2000 từ)
- 3 bài social media/ngày
- 1 video YouTube/tuần

**Chủ đề:**
- So sánh các dịch vụ
- Hướng dẫn sử dụng
- Review sản phẩm
- Tin tức công nghệ
- Khuyến mãi, deals

---

## 4. 🚀 Công cụ SEO cần dùng

**Miễn phí:**
- Google Search Console
- Google Analytics 4
- Google PageSpeed Insights
- Ubersuggest (giới hạn)

**Trả phí (nếu có budget):**
- Ahrefs / SEMrush
- SurferSEO
- Screaming Frog

---

## 5. ⏱️ Timeline dự kiến lên Top 1

| Thờii gian | Mục tiêu |
|-----------|---------|
| Tháng 1-2 | Index all pages, fix technical issues |
| Tháng 3-4 | 20-30 bài blog, xây 50-100 backlinks |
| Tháng 5-6 | Top 10 cho keywords long-tail |
| Tháng 7-12 | Top 3-5 cho keywords chính |
| 12+ tháng | Top 1 cho keywords chính |

**Lưu ý:** SEO là marathon, không phải sprint. Kiên nhẫn và consistent!

---

## 6. 🔥 Quick Wins (Làm ngay)

1. ✅ Đăng ký Google Search Console
2. ✅ Submit sitemap.xml
3. ✅ Tạo 5 bài blog đầu tiên
4. ✅ Share lên 10 Facebook groups
5. ✅ Tạo Google Business Profile
6. ✅ Thu thập 10 reviews đầu tiên

---

**Cần mình hỗ trợ gì thêm không?** 🚀
