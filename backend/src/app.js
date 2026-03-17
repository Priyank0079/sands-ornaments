const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const rateLimit = require("express-rate-limit");
const compression = require("compression");
const morgan = require("morgan");

const { notFound, errorHandler } = require("./middlewares/errorHandler");
const authenticate = require("./middlewares/authenticate");
const requireRole = require("./middlewares/requireRole");

const app = express();

// ── GLOBAL MIDDLEWARES ───────────────────────────────────────────────────────
app.use(helmet()); // Security headers
app.use(cors({ origin: process.env.CLIENT_URL || "*", credentials: true }));   // Enable CORS
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(mongoSanitize()); // Prevent NoSQL injection
app.use(compression());  // Performance: Gzip compression
app.use(morgan("dev")); // Logging (Production: use "combined")

// Rate limiting
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 1000 // limit each IP to 1000 requests per windowMs
});
app.use("/api/", limiter);

// ── ROUTES ───────────────────────────────────────────────────────────────────
// Auth (user + admin + seller)
app.use("/api/auth",   require("./modules/auth/routes/auth.routes"));

// Public storefront (no auth)
app.use("/api/public",        require("./modules/public/routes/index"));

// Customer routes (must be authenticated)
app.use("/api/user",   authenticate, requireRole("user"), require("./modules/user/routes/index"));

// Admin routes
app.use("/api/admin",  authenticate, requireRole("admin"), require("./modules/admin/routes/index"));

// Seller routes
app.use("/api/seller", authenticate, requireRole("seller"), require("./modules/seller/routes/index"));

// -- Error Handling -------------------------------------------------------------
app.use(notFound);
app.use(errorHandler);

module.exports = app;
