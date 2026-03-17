const axios = require("axios");

/**
 * SMS India OTP Service
 * -------------------------------------------------------------
 * DEV MODE  : USE_REAL_OTP=false  ? OTP is always DEFAULT_OTP (1234), NO SMS sent
 * PROD MODE : USE_REAL_OTP=true   ? Send real OTP via SMS India API
 * -------------------------------------------------------------
 */
const sendOtpSms = async (phone, otp) => {
  if (process.env.USE_REAL_OTP !== "true") {
    console.log(`[DEV] OTP for ${phone}: ${otp} (SMS not sent)`);
    return { success: true, dev: true };
  }

  // -- SMS India API integration (activate before production) --
  try {
    const url = "https://www.smsindia.com/api/sendotp";   // confirm final endpoint
    const response = await axios.get(url, {
      params: {
        userid:      process.env.SMS_INDIA_API_KEY,
        password:    process.env.SMS_INDIA_PASSWORD,
        mobile:      `91${phone}`,
        msg:         `Your Sands Ornaments OTP is ${otp}. Valid for 5 minutes. Do not share with anyone. - SANDS`,
        sid:         process.env.SMS_INDIA_SENDER_ID,
        mtype:       "N",
        DR:          "Y",
      },
    });
    return { success: true, response: response.data };
  } catch (err) {
    console.error("[SMSIndia] Failed to send OTP:", err.message);
    throw new Error("Failed to send OTP. Please try again.");
  }
};

module.exports = { sendOtpSms };
