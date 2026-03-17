const Seller = require("../../../models/Seller");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { success, error } = require("../../../utils/apiResponse");

const signToken = (id) => {
  return jwt.sign({ userId: id, role: "seller" }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

exports.register = async (req, res) => {
  try {
    const { shopName, fullName, email, mobileNumber, password } = req.body;

    const existing = await Seller.findOne({ $or: [{ email }, { mobileNumber }] });
    if (existing) return error(res, "Seller with this email or mobile already exists", 400);

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const seller = await Seller.create({
      shopName,
      fullName,
      email,
      mobileNumber,
      password: hashedPassword,
      status: "PENDING"
    });

    return success(res, { sellerId: seller._id }, "Registration submitted. Awaiting admin approval.", 201);
  } catch (err) { return error(res, err.message); }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const seller = await Seller.findOne({ email });
    if (!seller) return error(res, "Invalid credentials", 401);

    if (seller.status !== "APPROVED") {
      return error(res, `Account ${seller.status.toLowerCase()}. Please contact support.`, 403);
    }

    const isMatch = await bcrypt.compare(password, seller.password);
    if (!isMatch) return error(res, "Invalid credentials", 401);

    const token = signToken(seller._id);
    
    // Remove password from response
    const sellerObj = seller.toObject();
    delete sellerObj.password;

    return success(res, { token, user: sellerObj }, "Seller login successful");
  } catch (err) { return error(res, err.message); }
};

exports.logout = async (req, res) => {
  return success(res, {}, "Logged out");
};
