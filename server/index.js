const express = require('express');
const cors = require('cors');

const fs = require('fs');
const path = require('path');
const app = express();
app.disable('x-powered-by');

/* Orders are stored in server/data/orders.json (swap for a real DB later) */
const DATA_DIR = path.join(__dirname, 'data');
const ORDERS_FILE = path.join(DATA_DIR, 'orders.json');
const readOrders = () => { try { return JSON.parse(fs.readFileSync(ORDERS_FILE, 'utf8')); } catch { return []; } };
const saveOrder = o => { fs.mkdirSync(DATA_DIR, { recursive: true }); const all = readOrders(); all.push(o); fs.writeFileSync(ORDERS_FILE, JSON.stringify(all, null, 2)); };

/* Tiny in-memory rate limiter: 10 orders per 10 minutes per IP */
const hits = new Map();
const limitOrders = (req, res, next) => {
  const now = Date.now(), list = (hits.get(req.ip) || []).filter(t => now - t < 600000);
  if (list.length >= 10) return res.status(429).json({ error: 'Too many orders. Please try again later.' });
  list.push(now); hits.set(req.ip, list); next();
};
const PORT = process.env.PORT || 5000;
const SOURCE_API = 'https://fakestoreapi.com/products';
const TAX_RATE = 0.08, SHIPPING = 5.99, FREE_OVER = 100;

app.use(cors());
app.use(express.json());

/* Brands: clicking one opens the official website */
const BRANDS = [
  { name: 'Samsung', key: 'samsung', slug: 'samsung', short: 'S', color: '#1428A0', url: 'https://www.samsung.com' },
  { name: 'Western Digital', key: 'wd', slug: 'western-digital', short: 'WD', color: '#C8102E', url: 'https://www.westerndigital.com' },
  { name: 'SanDisk', key: 'sandisk', slug: 'sandisk', short: 'SD', color: '#D9262C', url: 'https://www.sandisk.com' },
  { name: 'Silicon Power', key: 'silicon power', slug: 'silicon-power', short: 'SP', color: '#0072BC', url: 'https://www.silicon-power.com' },
  { name: 'Acer', key: 'acer', slug: 'acer', short: 'A', color: '#83B81A', url: 'https://www.acer.com' },
  { name: 'John Hardy', key: 'john hardy', slug: 'john-hardy', short: 'JH', color: '#7A5C2E', url: 'https://www.johnhardy.com' },
  { name: 'Fjällräven', key: 'fjallraven', slug: 'fjallraven', short: 'F', color: '#2E5E3E', url: 'https://www.fjallraven.com' },
];
const brandOf = title => {
  const b = BRANDS.find(b => new RegExp('\\b' + b.key + '\\b', 'i').test(title));
  return b ? { name: b.name, url: b.url } : null;
};
const groupOf = c => c === 'electronics' ? 'Electronics' : c === 'jewelery' ? 'Jewelry' : 'Clothing';
const shape = p => ({ ...p, group: groupOf(p.category), brand: brandOf(p.title) });

/* Offline fallback catalog (used only if the source API is unreachable) */
const svg = (bg, t) => 'data:image/svg+xml,' + encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400"><rect width="400" height="400" fill="${bg}"/><text x="200" y="212" font-family="Arial" font-size="30" font-weight="700" text-anchor="middle" fill="#0B1730">${t}</text></svg>`);
const FALLBACK = [
  [1, 'Samsung 49-Inch Curved Gaming Monitor', 999.99, 'electronics', '#DCE6FF', 'Monitor', 4.7, 140],
  [2, 'WD 4TB Gaming Drive for PS4', 114, 'electronics', '#E3F5EC', 'WD Drive', 4.8, 400],
  [3, 'SanDisk SSD PLUS 1TB Internal SSD', 109, 'electronics', '#FFF1D6', 'SanDisk SSD', 4.2, 470],
  [4, 'Acer SB220Q 21.5 inch Full HD Monitor', 599, 'electronics', '#E5EAF7', 'Acer Monitor', 4.1, 250],
  [5, 'John Hardy Legends Naga Gold & Silver Bracelet', 695, 'jewelery', '#F4E4F7', 'Bracelet', 4.6, 400],
  [6, 'Gold Plated Princess Ring', 9.99, 'jewelery', '#FDE7E0', 'Ring', 3.0, 400],
  [7, 'Fjallraven Foldsack No. 1 Backpack', 109.95, "men's clothing", '#E0EEF7', 'Backpack', 3.9, 120],
  [8, 'Mens Cotton Jacket', 55.99, "men's clothing", '#EAEAEA', 'Jacket', 4.7, 500],
  [9, 'Womens Rain Jacket Windbreaker', 39.99, "women's clothing", '#E5F4E3', 'Rain Jacket', 3.8, 679],
].map(([id, title, price, category, bg, label, rate, count]) => ({
  id, title, price, category, image: svg(bg, label), rating: { rate, count },
  description: 'Demo product shown because the live catalog could not be reached.',
}));

let cache = { at: 0, source: '', products: [] };
async function getProducts() {
  if (cache.products.length && Date.now() - cache.at < 10 * 60 * 1000) return cache;
  try {
    const res = await fetch(SOURCE_API, { signal: AbortSignal.timeout(6000) });
    if (!res.ok) throw new Error('HTTP ' + res.status);
    cache = { at: Date.now(), source: 'live', products: (await res.json()).map(shape) };
  } catch (err) {
    console.warn('Source API failed:', err.message);
    if (!cache.products.length) cache = { at: Date.now() - 9 * 60 * 1000, source: 'fallback', products: FALLBACK.map(shape) };
  }
  return cache;
}

app.get('/api/health', (_req, res) => res.json({ ok: true }));
app.get('/api/brands', (_req, res) => res.json(BRANDS.map(({ name, url, slug, short, color }) => ({ name, url, slug, short, color }))));
app.get('/api/products', async (_req, res) => {
  const { source, products } = await getProducts();
  res.json({ source, count: products.length, products });
});

app.get('/api/products/:id', async (req, res) => {
  const { products } = await getProducts();
  const p = products.find(x => x.id === Number(req.params.id));
  if (!p) return res.status(404).json({ error: 'Product not found' });
  res.json({ product: p, related: products.filter(x => x.group === p.group && x.id !== p.id).slice(0, 4) });
});

/* Orders: totals are recomputed on the server, never trusted from the client */
app.post('/api/orders', limitOrders, async (req, res) => {
  const { customer = {}, items } = req.body || {};
  const { name, email, address } = customer;
  if (!name || !/^\S+@\S+\.\S+$/.test(email || '') || !address) return res.status(400).json({ error: 'Please provide a valid name, email and address.' });
  if (!Array.isArray(items) || !items.length) return res.status(400).json({ error: 'Your cart is empty.' });
  const { products } = await getProducts();
  let subtotal = 0; const lines = [];
  for (const { id, qty } of items) {
    const p = products.find(p => p.id === Number(id));
    if (!p || !Number.isInteger(qty) || qty < 1 || qty > 99) return res.status(400).json({ error: 'Invalid cart item.' });
    subtotal += p.price * qty; lines.push({ id: p.id, title: p.title, price: p.price, qty });
  }
  const shipping = subtotal >= FREE_OVER ? 0 : SHIPPING;
  const tax = +(subtotal * TAX_RATE).toFixed(2);
  const total = +(subtotal + shipping + tax).toFixed(2);
  const order = { orderId: 'ORD-' + Date.now().toString(36).toUpperCase(), createdAt: new Date().toISOString(), customer: { name, email, address }, items: lines, subtotal: +subtotal.toFixed(2), shipping, tax, total };
  saveOrder(order);
  res.status(201).json(order);
});

app.get('/api/orders/:id', (req, res) => {
  const o = readOrders().find(x => x.orderId === req.params.id);
  o ? res.json(o) : res.status(404).json({ error: 'Order not found' });
});

app.listen(PORT, () => console.log(`Kart API running on http://localhost:${PORT}`));
