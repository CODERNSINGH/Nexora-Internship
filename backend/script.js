const express = require("express");
const cors = require("cors");
const { PrismaClient } = require("@prisma/client");
require("dotenv").config();

const prisma = new PrismaClient();
const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

const mapProduct = (product) => ({
  id: product.id,
  title: product.title,
  description: product.description,
  price: Number(product.price),
  image: product.image,
  category: product.category,
  rating: product.rating,
});

const mapCartItem = (item) => ({
  id: item.id,
  quantity: item.quantity,
  product: mapProduct(item.product),
  lineTotal: Number(item.product.price) * item.quantity,
});

async function formatCartSummary() {
  const cartItems = await prisma.cartItem.findMany({
    include: { product: true },
    orderBy: { id: "asc" },
  });

  const items = cartItems.map(mapCartItem);
  const subtotal = items.reduce((sum, item) => sum + item.lineTotal, 0);

  return {
    items,
    subtotal,
    total: subtotal,
  };
}

app.get("/health", async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ status: "ok" });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
});

app.get("/api/products", async (_req, res, next) => {
  try {
    const products = await prisma.product.findMany({ orderBy: { id: "asc" } });
    res.json(products.map(mapProduct));
  } catch (error) {
    next(error);
  }
});

app.get("/api/cart", async (_req, res, next) => {
  try {
    const cart = await formatCartSummary();
    res.json(cart);
  } catch (error) {
    next(error);
  }
});

app.post("/api/cart", async (req, res, next) => {
  const { productId, qty = 1 } = req.body || {};

  if (!productId || qty <= 0) {
    return res.status(400).json({ message: "productId and qty must be provided" });
  }

  try {
    const product = await prisma.product.findUnique({ where: { id: productId } });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const existingItem = await prisma.cartItem.findFirst({ where: { productId } });

    if (existingItem) {
      await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + qty },
      });
    } else {
      await prisma.cartItem.create({ data: { productId, quantity: qty } });
    }

    const cart = await formatCartSummary();
    res.status(201).json(cart);
  } catch (error) {
    next(error);
  }
});

app.delete("/api/cart/:id", async (req, res, next) => {
  const cartItemId = Number(req.params.id);

  if (!cartItemId) {
    return res.status(400).json({ message: "Invalid cart item id" });
  }

  try {
    await prisma.cartItem.delete({ where: { id: cartItemId } });
    const cart = await formatCartSummary();
    res.json(cart);
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({ message: "Cart item not found" });
    }
    next(error);
  }
});

app.patch("/api/cart/:id", async (req, res, next) => {
  const cartItemId = Number(req.params.id);
  const { qty } = req.body || {};

  if (!cartItemId || !Number.isInteger(qty) || qty <= 0) {
    return res.status(400).json({ message: "qty must be a positive integer" });
  }

  try {
    await prisma.cartItem.update({
      where: { id: cartItemId },
      data: { quantity: qty },
    });

    const cart = await formatCartSummary();
    res.json(cart);
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({ message: "Cart item not found" });
    }
    next(error);
  }
});

app.post("/api/checkout", async (req, res, next) => {
  const { name, email } = req.body || {};

  if (!name || !email) {
    return res.status(400).json({ message: "name and email are required" });
  }

  try {
    const cart = await formatCartSummary();

    if (cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    await prisma.cartItem.deleteMany();

    res.json({
      receipt: {
        customer: { name, email },
        items: cart.items,
        total: cart.total,
        issuedAt: new Date().toISOString(),
        message: "Thank You for Shopping with us! 😅",
      },
    });
  } catch (error) {
    next(error);
  }
});

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ message: "Something went wrong", detail: err.message });
});

app.listen(PORT, () => {
  console.log(`Server Host http://localhost:${PORT}`);
});

process.on("SIGINT", async () => {
  await prisma.$disconnect();
  process.exit(0);
});

