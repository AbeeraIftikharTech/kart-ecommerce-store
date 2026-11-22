# Kart – Next.js + Node.js E-Commerce (v2)

Requirements: Node.js 18.18+.   Run:  npm run install:all  then  npm run dev   ->  http://localhost:3000

API (http://localhost:5000)
- GET  /api/products, /api/products/:id (with related), /api/brands
- POST /api/orders  (validated, priced server-side, saved to server/data/orders.json, rate limited)
- GET  /api/orders/:id

Pages: / (catalog) · /products/[id] (detail) · custom 404.
Brand logos: add SVGs to client/public/brands/ (see README.txt there).
Production: npm run build  then  npm start
