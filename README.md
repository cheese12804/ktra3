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
│   └── postgres-init
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
- `GET /cart/:id`

### staff-service (`http://localhost:3002`)
- `POST /staff/login`
- `POST /products`
- `PUT /products/:id`
- `GET /products`

## Seed data

### MySQL
- Staff: `staff1 / 123456`
- Customer: `customer1 / 123456`

### PostgreSQL
- `iPhone 15`, `Samsung Galaxy S24`, `MacBook Air M3`, `Dell XPS 13`

## Chạy hệ thống

```bash
docker-compose up --build
```

Sau khi chạy:
- Customer UI: `http://localhost:5173`
- Staff UI: `http://localhost:5174`
- Customer API: `http://localhost:3001`
- Staff API: `http://localhost:3002`

## Flow

### Customer flow
`Register → Login → Home → Search/Filter → Add to cart → View cart`

### Staff flow
`Login → Dashboard → Add product/Edit product`
