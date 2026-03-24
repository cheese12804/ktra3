# Sales Microservices System (Customer + Staff)

Hệ thống bán hàng tách thành microservices, có 2 backend độc lập và 2 frontend độc lập.

## Kiến trúc

- `customer-service` (Node.js/Express + MySQL + PostgreSQL)
- `staff-service` (Node.js/Express + MySQL + PostgreSQL)
- `customer-ui` (React/Vite)
- `staff-ui` (React/Vite)
- `mysql` quản lý `staff`, `customers`, `carts`, `cart_items`
- `postgres` quản lý `products`

## Cấu trúc thư mục

```text
.
├── customer-service
├── staff-service
├── customer-ui
├── staff-ui
├── db
│   ├── mysql-init
│   │   ├── 00-schema.sql
│   │   └── mysql_seed.sql
│   └── postgres-init
│       ├── 00-schema.sql
│       └── postgres_seed.sql
├── mysql_seed.sql
├── postgres_seed.sql
└── docker-compose.yml
```

## API

### customer-service (`http://localhost:3001`)
- `POST /auth/register`
- `POST /auth/login`
- `GET /products`
- `GET /products/search?q=`
- `POST /cart`
- `POST /cart/add`
- `PUT /cart/item`
- `DELETE /cart/item`
- `GET /cart/:id`

### staff-service (`http://localhost:3002`)
- `POST /staff/login`
- `POST /products`
- `PUT /products/:id`
- `DELETE /products/:id`
- `GET /products`

> Product payload hỗ trợ thêm `image_url` để hiển thị ảnh.

## Seed data

### MySQL
- `staff`: 6 account (`admin`, `admin01`, `staff01`...`staff04`) với mật khẩu bcrypt hash
- `customers`: 20 account với username/email/full_name/phone realistic
- `carts`: 30 cart (mỗi customer 1-2 cart)
- `cart_items`: dữ liệu liên kết hợp lệ, mỗi cart 2-5 item

### PostgreSQL
- `products`: 30 sản phẩm
  - 15 `mobile`
  - 15 `laptop`
- Giá trong khoảng 7.990.000 → 39.990.000 VND

### Tài khoản test
- Staff: `admin / 123456`
- Customer: `user1 / 123456`

## Dữ liệu mẫu (rút gọn)

### 5 staff
- admin (admin)
- admin01 (admin)
- staff01 (staff)
- staff02 (staff)
- staff03 (staff)

### 5 customers
- user1 - Nguyễn Minh Anh - user1@gmail.com
- tranthanhnam - Trần Thanh Nam - tranthanhnam@gmail.com
- lethuyduong - Lê Thùy Dương - lethuyduong@gmail.com
- phamquanghuy - Phạm Quang Huy - phamquanghuy@gmail.com
- doanlinhchi - Đoàn Linh Chi - doanlinhchi@gmail.com

### 5 mobile
- iPhone 13 128GB
- iPhone 15 128GB
- Samsung Galaxy S24
- Xiaomi 13T Pro
- Google Pixel 8

### 5 laptop
- MacBook Air M3 13"
- Dell XPS 13
- HP Victus 16
- ASUS Zenbook 14 OLED
- Lenovo ThinkPad E14

## Chạy hệ thống

```bash
docker-compose up --build
```

Sau khi chạy:
- Customer UI: `http://localhost:5173`
- Staff UI: `http://localhost:5174`
- Customer API: `http://localhost:3001`
- Staff API: `http://localhost:3002`

## Import seed thủ công (optional)

Nếu muốn import thủ công thay vì để docker auto-init:

```bash
# MySQL
docker exec -i sales-mysql mysql -uapp_user -papp_password sales_mysql < mysql_seed.sql

# PostgreSQL
docker exec -i sales-postgres psql -Upostgres -dsales_pg < postgres_seed.sql
```

## Flow

### Customer flow
`Register → Login → Home → Search/Filter → Product Detail → Add to cart → View/Edit/Delete cart → Logout`

### Staff flow
`Login → Dashboard (table UI) → Add/Edit/Delete product + Add/Delete image → Logout`
