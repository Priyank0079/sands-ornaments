import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Phone,
  Mail,
  Clock,
  HelpCircle,
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  ShoppingBag,
  Percent,
  Wallet,
  Key,
} from "lucide-react";
import { useResetScroll } from "../../../hooks/useResetScroll";

const SellerSupport = () => {
  useResetScroll();
  const navigate = useNavigate();

  const merchantFaqs = [
    {
      icon: <ShieldCheck className="w-5 h-5 text-[#3E2723]" />,
      question: "How do I get my merchant profile approved?",
      answer:
        "Upon completing registration, our administration team reviews your business credentials (including GSTIN, PAN, and Bank details). Verification typically takes 24–48 business hours. You will receive an SMS and email notification once your account status is set to APPROVED.",
    },
    {
      icon: <ShoppingBag className="w-5 h-5 text-[#3E2723]" />,
      question: "How do I add and manage my products?",
      answer:
        "Once approved, log in to the Seller Gateway and click on 'Products' in the sidebar. You can create new products, set pricing, adjust inventory levels, manage variant attributes, and view product barcodes.",
    },
    {
      icon: <Percent className="w-5 h-5 text-[#3E2723]" />,
      question: "How is my seller commission calculated?",
      answer:
        "Commissions are processed based on the commission tier assigned to your profile by the admin. You can track your sales, commission rates, and real-time accruals in the 'Commission' section of your dashboard.",
    },
    {
      icon: <Wallet className="w-5 h-5 text-[#3E2723]" />,
      question: "When and how are payouts processed?",
      answer:
        "Weekly payouts are initiated directly to your registered bank account for all completed orders. You can request manually triggered payouts or monitor transaction logs from the 'Wallet' tab.",
    },
    {
      icon: <Key className="w-5 h-5 text-[#3E2723]" />,
      question: "What should I do if I cannot log in or forgot my password?",
      answer:
        "If you cannot log in, navigate to the Seller Login gateway and click on the 'Forgot Password' link. You can reset your password using a verified mobile number SMS OTP or email verification.",
    },
  ];

  return (
    <div className="min-h-screen bg-[#FDF5F6] text-gray-900 font-sans pb-16 selection:bg-[#3E2723] selection:text-white">
      {/* Header Navigation */}
      <div className="container mx-auto px-6 py-6 flex items-center justify-between border-b border-[#3E2723]/5">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-[#3E2723]/60 hover:text-[#3E2723] transition-all group font-bold uppercase tracking-widest text-[10px]"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back
        </button>
        <span className="text-xs font-black uppercase tracking-[0.2em] text-[#3E2723]">
          Sands Jewels
        </span>
      </div>

      {/* Hero Section */}
      <div className="max-w-4xl mx-auto text-center px-6 pt-16 pb-12 relative overflow-hidden">
        <span className="text-[#3E2723]/60 text-[10px] md:text-xs font-bold uppercase tracking-[0.25em] mb-3 block">
          Seller gateway
        </span>
        <h1 className="text-3xl md:text-5xl lg:text-6xl font-display font-black text-black mb-6 uppercase tracking-tight leading-tight">
          Merchant Help Center
        </h1>
        <p className="text-gray-500 font-serif text-sm md:text-base max-w-xl mx-auto leading-relaxed">
          Welcome to the Sands Jewels Seller Help Center. Find information on
          account setup, listing products, tracking sales commissions, and
          setting up payouts.
        </p>
      </div>

      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Contact and Portal Access */}
        <div className="space-y-6">
          {/* Access Portal Card */}
          <div className="bg-[#3E2723] text-white p-8 rounded-[2rem] shadow-xl space-y-6">
            <h3 className="text-xl font-display font-bold">Merchant Portal</h3>
            <p className="text-white/75 text-xs md:text-sm leading-relaxed font-serif">
              Access your inventory tools, check your sales metrics, or register
              a new merchant account.
            </p>
            <div className="space-y-3">
              <button
                onClick={() => navigate("/seller/login")}
                className="w-full bg-white text-[#3E2723] py-3.5 rounded-xl font-bold uppercase tracking-wider text-xs flex items-center justify-center gap-2 hover:bg-[#EBCDD0] hover:text-[#3E2723] transition-all shadow-md"
              >
                Seller Gateway Login
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => navigate("/seller/register")}
                className="w-full border border-white/20 text-white py-3.5 rounded-xl font-bold uppercase tracking-wider text-xs flex items-center justify-center gap-2 hover:bg-white/10 transition-all"
              >
                Register Store
              </button>
            </div>
          </div>

          {/* Support Contact Card */}
          <div className="bg-white p-8 rounded-[2rem] border border-[#3E2723]/5 shadow-sm space-y-6">
            <h3 className="text-lg font-display font-bold text-black uppercase tracking-tight">
              Direct Support Channels
            </h3>
            <p className="text-gray-500 text-xs leading-relaxed font-serif">
              Need direct support regarding commission disputes or banking
              updates? Contact our admin team:
            </p>
            <div className="space-y-4 pt-2">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-[#3E2723]/5 rounded-xl flex items-center justify-center text-[#3E2723]">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-gray-400 text-[9px] uppercase tracking-widest font-black">
                    Call Support
                  </p>
                  <p className="text-xs md:text-sm font-bold text-black">
                    +91 91 1334 4051
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-[#3E2723]/5 rounded-xl flex items-center justify-center text-[#3E2723]">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-gray-400 text-[9px] uppercase tracking-widest font-black">
                    Email Support
                  </p>
                  <p className="text-xs md:text-sm font-bold text-black">
                    care@sandsjewels.com
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-[#3E2723]/5 rounded-xl flex items-center justify-center text-[#3E2723]">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-gray-400 text-[9px] uppercase tracking-widest font-black">
                    Hours of Operation
                  </p>
                  <p className="text-xs md:text-sm font-bold text-black">
                    Mon–Sat, 10 AM–7 PM IST
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ List */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-xl md:text-2xl font-display font-bold text-black mb-6 flex items-center gap-2">
            <HelpCircle className="w-6 h-6 text-[#3E2723]" />
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {merchantFaqs.map((faq, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl border border-[#3E2723]/5 p-6 space-y-3 shadow-sm hover:border-[#3E2723]/10 transition-colors"
              >
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-lg bg-[#3E2723]/5 flex items-center justify-center flex-shrink-0 mt-0.5">
                    {faq.icon}
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-sm md:text-base font-bold text-black">
                      {faq.question}
                    </h4>
                    <p className="text-xs md:text-sm text-gray-500 leading-relaxed font-serif">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerSupport;
