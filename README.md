# Vận Tải Anh Việt - Frontend

React + Vite + Ant Design + Pro Components. Cấu trúc SOLID, tối ưu performance.

## Cấu trúc

```
web/
├── src/
│   ├── api/          # API layer - axios client, endpoints
│   ├── config/       # App config, routes
│   ├── hooks/        # Custom hooks (useAuth)
│   ├── layouts/      # MainLayout với ProLayout
│   ├── pages/        # Trang theo route
│   └── App.tsx       # Routing, ProtectedRoute
├── vite.config.ts
└── package.json
```

## Chạy

```bash
cd web
yarn install
yarn dev
```

Mở http://localhost:5173

## Cấu hình API

- **Dev**: Vite proxy `/api` → `http://localhost:3000`. Không cần .env.
- **Production/Demo**: Tạo `.env` với `VITE_API_URL=https://your-api.onrender.com/api/v1`

## Build & Deploy

```bash
yarn build
```

Output: `dist/`. Deploy lên Vercel, Netlify, hoặc Render Static Site.
