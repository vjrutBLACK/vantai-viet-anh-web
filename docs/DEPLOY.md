# Deploy Frontend Vận Tải Anh Việt

## 1. Cấu hình API URL cho production

Đã có sẵn file `.env.production`:

```
VITE_API_URL=https://vantaianhviet.net/api/v1
```

Nếu domain khác, sửa lại cho đúng.

---

## 2. Build frontend

Trên máy local (hoặc CI):

```bash
cd vantaiAnhViet-web
yarn install   # hoặc npm install
yarn build     # hoặc npm run build
```

Output nằm trong thư mục `dist/`.

---

## 3. Upload lên VPS

### Cách A: SCP từ máy local

```bash
scp -r dist/* root@112.78.3.109:/var/www/vantaianhviet/frontend/
```

### Cách B: Git + build trên VPS

```bash
# Trên VPS
cd /var/www
mkdir -p vantaianhviet/frontend
# Clone repo (hoặc git pull nếu đã có)
git clone https://github.com/your-username/vantaiAnhViet-web.git
cd vantaiAnhViet-web

# Cấu hình production
echo "VITE_API_URL=https://vantaianhviet.net/api/v1" > .env.production
yarn install
yarn build
cp -r dist/* ../frontend/
```

---

## 4. Cấu hình Nginx

Trên VPS, chỉnh sửa:

```bash
sudo nano /etc/nginx/sites-available/vantaianhviet
```

Nội dung:

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name vantaianhviet.net www.vantaianhviet.net;
    root /var/www/vantaianhviet/frontend;
    index index.html;

    # Frontend SPA - mọi route về index.html
    location / {
        try_files $uri $uri/ /index.html;
    }

    # API Backend
    location /api {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Nếu đã cài SSL (Certbot), Certbot sẽ tự thêm `listen 443 ssl` và các cấu hình SSL.

Kiểm tra và reload:

```bash
sudo nginx -t
sudo systemctl reload nginx
```

---

## 5. Tạo thư mục frontend (nếu chưa có)

```bash
sudo mkdir -p /var/www/vantaianhviet/frontend
sudo chown -R www-data:www-data /var/www/vantaianhviet
```

Nếu dùng `root` upload: `chown -R www-data` để Nginx đọc được.

---

## 6. Kiểm tra

- Frontend: https://vantaianhviet.net
- API: https://vantaianhviet.net/api/v1
- Login: `test-seed@vantai.local` / `Test@123`

---

## Cập nhật sau này

```bash
# Local: build lại
yarn build
scp -r dist/* root@IP_VPS:/var/www/vantaianhviet/frontend/
```
