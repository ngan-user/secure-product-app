# 🔐 Secure Product Management App
### Đồ án: An Toàn Điện Toán Đám Mây

> Website quản lý sản phẩm với **5 lớp bảo mật** triển khai trên Docker + Render Cloud

---

## 📁 Cấu trúc dự án

```
secure-product-app/
├── src/
│   ├── server.js              # Entry point
│   ├── app.js                 # Express app + middleware
│   ├── config/
│   │   └── database.js        # MySQL connection pool
│   ├── routes/
│   │   ├── auth.js            # Login / Register
│   │   ├── products.js        # CRUD sản phẩm
│   │   └── health.js          # Health check
│   ├── middleware/
│   │   ├── auth.js            # JWT verification
│   │   ├── validate.js        # Input validation
│   │   └── errorHandler.js    # Global error handler
│   └── utils/
│       └── logger.js          # Winston logger
├── public/
│   └── index.html             # Frontend SPA
├── mysql/
│   ├── init.sql               # Khởi tạo DB + hardening
│   └── my.cnf                 # MySQL security config
├── nginx/
│   └── nginx.conf             # Reverse proxy + SSL
├── monitoring/
│   └── prometheus/
│       ├── prometheus.yml     # Scrape config
│       └── alert_rules.yml    # Alert rules
├── .github/workflows/
│   └── ci-cd.yml              # GitHub Actions pipeline
├── scripts/
│   └── setup.sh               # Script cài đặt Ubuntu
├── Dockerfile                 # Multi-stage, non-root
├── Dockerfile.mysql           # MySQL cho Render
├── docker-compose.yml         # Full stack
├── render.yaml                # Render Cloud config
├── .env.example               # Template env vars
└── .gitignore                 # Bảo vệ file nhạy cảm
```

---

## 🚀 Cài đặt & Chạy trên Ubuntu

### Bước 1: Clone dự án
```bash
git clone https://github.com/your-username/secure-product-app.git
cd secure-product-app
```

### Bước 2: Chạy script setup tự động
```bash
chmod +x scripts/setup.sh
./scripts/setup.sh
```

Script sẽ tự động:
- ✅ Cài Docker + Docker Compose
- ✅ Tạo file `.env` với secrets ngẫu nhiên
- ✅ Tạo SSL certificate tự ký
- ✅ Build và khởi động tất cả containers

### Bước 3: Truy cập ứng dụng
| Dịch vụ | URL |
|---------|-----|
| 🌐 Web App | http://localhost |
| 🔒 HTTPS | https://localhost |
| 📊 Grafana | http://localhost/grafana |
| 📡 Prometheus | http://localhost:9090 (internal) |

**Tài khoản mặc định:** `admin` / `Admin@12345`
> ⚠️ Đổi mật khẩu sau khi đăng nhập!

---

## 🛡️ 5 Lớp Bảo Mật

### 1️⃣ Secure Docker Configuration
| Biện pháp | File |
|-----------|------|
| Non-root user (appuser:1001) | `Dockerfile` |
| Image alpine tối giản | `Dockerfile` |
| read_only filesystem | `docker-compose.yml` |
| cap_drop: ALL | `docker-compose.yml` |
| no-new-privileges | `docker-compose.yml` |
| Giới hạn CPU/RAM | `docker-compose.yml` |
| Network isolation | `docker-compose.yml` |

### 2️⃣ Environment Variable Protection
| Biện pháp | File |
|-----------|------|
| Không hard-code secrets | `src/**` |
| .env trong .gitignore | `.gitignore` |
| Template .env.example | `.env.example` |
| GitHub Secrets cho CI/CD | `.github/workflows/ci-cd.yml` |
| Log sanitization | `src/utils/logger.js` |

### 3️⃣ Database Security
| Biện pháp | File |
|-----------|------|
| Tắt remote root login | `mysql/init.sql` |
| Least privilege user | `mysql/init.sql` |
| Parameterized queries | `src/routes/**` |
| multipleStatements: false | `src/config/database.js` |
| MySQL hardening config | `mysql/my.cnf` |
| Không expose port 3306 | `docker-compose.yml` |

### 4️⃣ CI/CD Bảo mật
| Biện pháp | File |
|-----------|------|
| Minimal permissions | `.github/workflows/ci-cd.yml` |
| npm audit trong pipeline | `.github/workflows/ci-cd.yml` |
| Trivy image scanning | `.github/workflows/ci-cd.yml` |
| GitHub Secrets | `.github/workflows/ci-cd.yml` |
| Production environment approval | `.github/workflows/ci-cd.yml` |

### 5️⃣ Logging & Monitoring
| Biện pháp | File |
|-----------|------|
| Winston logger | `src/utils/logger.js` |
| Morgan HTTP logs | `src/app.js` |
| Prometheus metrics | `monitoring/prometheus/` |
| Grafana dashboards | `docker-compose.yml` |
| Alert rules | `monitoring/prometheus/alert_rules.yml` |
| Health check endpoint | `src/routes/health.js` |

---

## 📡 API Endpoints

### Auth
```
POST /api/auth/login     — Đăng nhập, nhận JWT token
POST /api/auth/register  — Đăng ký tài khoản mới
```

### Products (yêu cầu JWT token)
```
GET    /api/products          — Danh sách sản phẩm (có phân trang, tìm kiếm)
GET    /api/products/:id      — Chi tiết sản phẩm
POST   /api/products          — Tạo sản phẩm mới
PUT    /api/products/:id      — Cập nhật sản phẩm
DELETE /api/products/:id      — Xóa sản phẩm (soft delete)
```

### System
```
GET /api/health           — Basic health check
GET /api/health/detailed  — Chi tiết CPU, RAM, DB status
```

---

## ☁️ Deploy lên Render Cloud

### Bước 1: Push lên GitHub
```bash
git add .
git commit -m "feat: secure product management app"
git push origin main
```

### Bước 2: Tạo project trên Render
1. Vào https://render.com → New → Blueprint
2. Connect GitHub repository
3. Render tự đọc `render.yaml`

### Bước 3: Cấu hình Secrets trên Render Dashboard
Vào **Environment** tab, thêm:
- `DB_USER` = appuser
- `DB_PASSWORD` = (mật khẩu mạnh)
- `JWT_SECRET` = (auto-generated)

### Bước 4: GitHub Secrets cho CI/CD
Vào **Settings → Secrets** của repository:
```
TEST_DB_ROOT_PASSWORD  = password cho test DB
TEST_DB_PASSWORD       = password cho test user
TEST_JWT_SECRET        = secret cho test
RENDER_DEPLOY_HOOK_URL = URL từ Render Dashboard
```

---

## 🔧 Lệnh hữu ích

```bash
# Xem logs app
docker compose logs -f app

# Xem logs tất cả services
docker compose logs -f

# Kiểm tra status
docker compose ps

# Dừng tất cả
docker compose down

# Dừng + xóa data
docker compose down -v

# Rebuild image
docker compose build --no-cache app

# Exec vào container
docker compose exec app sh

# Kiểm tra security headers
curl -I https://localhost --insecure
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | Node.js 20 + Express 4 |
| Database | MySQL 8.0 |
| Auth | JWT (jsonwebtoken) + bcryptjs |
| Validation | express-validator |
| Security Headers | helmet |
| Rate Limiting | express-rate-limit |
| Logging | winston + morgan |
| Reverse Proxy | Nginx 1.25 |
| Containerization | Docker + Docker Compose |
| CI/CD | GitHub Actions |
| Image Scanning | Trivy |
| Monitoring | Prometheus + Grafana |
| Cloud Deployment | Render.com |

---

## 👨‍💻 Tác giả
Đồ án môn: **An Toàn Điện Toán Đám Mây**  
Trường: Đại học Đà Nẵng
# secure-product-app
# secure-product-app
