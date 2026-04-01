const Seller = require("../../../models/Seller");
const Notification = require("../../../models/Notification");
const Page = require("../../../models/Page");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { success, error } = require("../../../utils/apiResponse");
const { sendEmail } = require("../../../services/emailService");

const signToken = (id) => {
  return jwt.sign({ userId: id, role: "seller" }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

exports.register = async (req, res) => {
  try {
    const {
      shopName,
      fullName,
      email,
      mobileNumber,
      password,
      gstNumber,
      panNumber,
      bisNumber,
      shopAddress,
      city,
      state,
      pincode,
      bankAccount,
      acceptTerms
    } = req.body;

    const normalizedEmail = String(email || "").trim().toLowerCase();
    const normalizedMobile = String(mobileNumber || "").trim();

    if (!shopName || !String(shopName).trim()) return error(res, "Shop name is required", 400);
    if (!fullName || !String(fullName).trim()) return error(res, "Full name is required", 400);
    if (!normalizedEmail) return error(res, "Email is required", 400);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) return error(res, "Please enter a valid email address", 400);
    if (!normalizedMobile) return error(res, "Mobile number is required", 400);
    if (!/^\d{10}$/.test(normalizedMobile)) return error(res, "Mobile number must be 10 digits", 400);
    if (!password || !String(password).trim()) return error(res, "Password is required", 400);
    if (!gstNumber || !String(gstNumber).trim()) return error(res, "GST number is required", 400);
    if (!panNumber || !String(panNumber).trim()) return error(res, "PAN number is required", 400);
    if (!bisNumber || !String(bisNumber).trim()) return error(res, "BIS license number is required", 400);
    if (!shopAddress || !String(shopAddress).trim()) return error(res, "Shop address is required", 400);
    if (!city || !String(city).trim()) return error(res, "City is required", 400);
    if (!state || !String(state).trim()) return error(res, "State is required", 400);
    if (!pincode || !String(pincode).trim()) return error(res, "Pincode is required", 400);

    const existingEmail = normalizedEmail
      ? await Seller.findOne({ email: normalizedEmail })
      : null;
    if (existingEmail) return error(res, "Seller with this email already exists", 400);

    const existingMobile = normalizedMobile
      ? await Seller.findOne({ mobileNumber: normalizedMobile })
      : null;
    if (existingMobile) return error(res, "Seller with this mobile number already exists", 400);

    const sellerTermsPage = await Page.findOne({ slug: "seller-terms" });
    if (!sellerTermsPage || !String(sellerTermsPage.content || "").trim()) {
      return error(res, "Seller terms are not configured yet. Please contact support.", 400);
    }

    const acceptedTerms = acceptTerms === true || acceptTerms === "true" || acceptTerms === "1";
    if (!acceptedTerms) {
      return error(res, "Please accept the seller terms & conditions to continue.", 400);
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const aadharFile = req.files?.aadhar?.[0];
    const shopLicenseFile = req.files?.shopLicense?.[0];
    const certificateFile = req.files?.certificate?.[0];

    let parsedBankAccount = bankAccount;
    if (typeof bankAccount === "string") {
      try {
        parsedBankAccount = JSON.parse(bankAccount);
      } catch (err) {
        parsedBankAccount = undefined;
      }
    }
    if (!parsedBankAccount || !String(parsedBankAccount.accountNumber || "").trim()) {
      return error(res, "Bank account number is required", 400);
    }
    if (!String(parsedBankAccount.ifscCode || "").trim()) {
      return error(res, "Bank IFSC code is required", 400);
    }

    if (!aadharFile?.path) return error(res, "Aadhar document is required", 400);
    if (!shopLicenseFile?.path) return error(res, "Shop license document is required", 400);
    if (!certificateFile?.path) return error(res, "Certificate document is required", 400);

    const seller = await Seller.create({
      shopName,
      fullName,
      email: normalizedEmail,
      mobileNumber: normalizedMobile,
      password: hashedPassword,
      gstNumber,
      panNumber,
      bisNumber,
      shopAddress,
      city,
      state,
      pincode,
      bankAccount: parsedBankAccount,
      termsAcceptedAt: new Date(),
      termsVersion: sellerTermsPage.lastUpdated || sellerTermsPage.updatedAt || new Date(),
      documents: {
        aadharUrl: aadharFile?.path || undefined,
        shopLicenseUrl: shopLicenseFile?.path || undefined,
        certificateUrl: certificateFile?.path || undefined
      },
      status: "PENDING"
    });

    await Notification.create({
      title: "New seller registration",
      message: `${fullName} applied with shop ${shopName}. Email: ${email}. Mobile: ${mobileNumber}. Location: ${city || "N/A"}, ${state || "N/A"}.`,
      type: "SELLER_REQUEST",
      priority: "High",
      link: `/admin/seller-details/${seller._id}`,
      isBroadcast: true
    });

    if (process.env.ADMIN_EMAIL) {
      try {
        await sendEmail({
          email: process.env.ADMIN_EMAIL,
          subject: "New seller registration pending approval",
          message: `New seller registration received.\n\nName: ${fullName}\nShop: ${shopName}\nEmail: ${normalizedEmail}\nMobile: ${normalizedMobile}\nGST: ${gstNumber || "N/A"}\nPAN: ${panNumber || "N/A"}\nBIS: ${bisNumber || "N/A"}\nLocation: ${city || "N/A"}, ${state || "N/A"}\n\nReview in admin panel.`,
        });
      } catch (mailErr) {
        console.error("Admin seller registration email failed:", mailErr.message);
      }
    }

    return success(res, { sellerId: seller._id }, "Registration submitted. Awaiting admin approval.", 201);
  } catch (err) { return error(res, err.message); }
};

exports.login = async (req, res) => {
  try {
    const { email, password, identifier } = req.body;
    const lookup = String(identifier || email || "").trim().toLowerCase();

    const seller = await Seller.findOne({
      $or: [{ email: lookup }, { mobileNumber: lookup }]
    });
    if (!seller) return error(res, "Invalid credentials", 401);

    if (seller.status === "PENDING") {
      return error(res, "Your seller account is under review. Please wait for admin approval.", 403);
    }

    if (seller.status === "REJECTED") {
      const rejectionMessage = seller.rejectionReason
        ? `Your seller account was rejected. Reason: ${seller.rejectionReason}`
        : "Your seller account was rejected. Please contact support.";
      return error(res, rejectionMessage, 403);
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
