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
const allowedOrigins = process.env.CLIENT_URL ? process.env.CLIENT_URL.split(",").map(origin => origin.trim()) : ["*"];
app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (like mobile apps or curl requests)
    if (!origin || allowedOrigins.includes(origin) || allowedOrigins.includes("*")) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));   // Enable CORS
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
// Allow both users and sellers to access user-related routes if they have the token, 
// but requireRole("user") for specific ones inside the module.
// However, to be safe, I'll just allow "seller" for the notifications specifically.
app.use("/api/user", authenticate, (req, res, next) => {
  // Allow all authenticated users (User, Seller, Admin) to access personal data endpoints
  // If they are not an 'admin' or 'seller', they default to requireRole('user')
  return requireRole("user", "seller", "admin")(req, res, next);
}, require("./modules/user/routes/index"));

// Admin routes
app.use("/api/admin",  authenticate, requireRole("admin"), require("./modules/admin/routes/index"));

// Seller routes
app.use("/api/seller", authenticate, requireRole("seller"), require("./modules/seller/routes/index"));

// -- Error Handling -------------------------------------------------------------
app.use(notFound);
app.use(errorHandler);

module.exports = app;
