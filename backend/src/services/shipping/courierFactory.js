/**
 * 📦 Courier Factory
 *    Returns the correct ShippingProvider instance based on courier name.
 *    Designed for easy extension – add new providers here.
 */

const DelhiveryProvider = require("./delhivery.service");
const BlueDartProvider = require("./bluedart.service");

const providers = {
  delhivery: null,
  bluedart: null,
};

/**
 * Lazy-initialize and return the shipping provider instance.
 * @param {string} courier - "delhivery" | "bluedart"
 * @returns {import("./ShippingProvider")}
 */
const getCourierProvider = (courier) => {
  const key = String(courier || "").toLowerCase().trim();

  if (!providers.hasOwnProperty(key)) {
    throw new Error(`Unsupported courier provider: "${courier}". Supported: ${Object.keys(providers).join(", ")}`);
  }

  // Lazy singleton
  if (!providers[key]) {
    switch (key) {
      case "delhivery":
        providers[key] = new DelhiveryProvider();
        break;
      case "bluedart":
        providers[key] = new BlueDartProvider();
        break;
      default:
        throw new Error(`No provider implementation for: "${key}"`);
    }
  }

  return providers[key];
};

/**
 * Returns list of available courier names.
 */
const getAvailableCouriers = () => Object.keys(providers);

module.exports = { getCourierProvider, getAvailableCouriers };
