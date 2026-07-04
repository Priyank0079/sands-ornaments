import React from 'react';
import { MessageCircle, Phone, Mail } from 'lucide-react';

export const SUPPORT_PHONE_DISPLAY = '+91 90083 81564';
export const SUPPORT_PHONE_TEL = '+919008381564';
export const SUPPORT_EMAIL = 'support@sandsornaments.com';

const StillNeedHelpCard = ({
  onContactSupport,
  className = '',
  compact = false,
}) => (
  <div
    className={`bg-black text-white rounded-3xl shadow-xl relative overflow-hidden ${compact ? 'p-5' : 'p-6 md:p-8'} ${className}`}
  >
    <div className="relative z-10">
      <h3 className={`font-display font-bold mb-2 ${compact ? 'text-lg' : 'text-xl md:text-2xl md:mb-4'}`}>
        Still need help?
      </h3>
      <p className={`text-white/80 leading-relaxed font-serif ${compact ? 'mb-5 text-xs' : 'mb-6 md:mb-8 text-xs md:text-sm'}`}>
        Our support team is available from 10 AM to 7 PM to help you.
      </p>

      <div className={compact ? 'space-y-4' : 'space-y-4 md:space-y-6'}>
        <button
          type="button"
          onClick={onContactSupport}
          className={`w-full bg-white text-black rounded-xl font-bold flex items-center justify-center gap-2 md:gap-3 hover:bg-[#EBCDD0] transition-all shadow-lg active:scale-95 ${
            compact ? 'py-3 text-sm' : 'py-3 md:py-4 text-sm md:text-base'
          }`}
        >
          <MessageCircle className={compact ? 'w-4 h-4' : 'w-4 h-4 md:w-5 md:h-5'} />
          Contact Support
        </button>

        <div className={`pt-2 ${compact ? 'space-y-3' : 'space-y-4'}`}>
          <a
            href={`tel:${SUPPORT_PHONE_TEL}`}
            className="flex items-center gap-4 text-xs md:text-sm font-medium hover:text-[#EBCDD0] transition-colors"
          >
            <div className={`bg-white/10 rounded-full flex items-center justify-center shrink-0 ${compact ? 'w-8 h-8' : 'w-8 h-8 md:w-10 md:h-10'}`}>
              <Phone className={compact ? 'w-4 h-4' : 'w-4 h-4 md:w-5 md:h-5'} />
            </div>
            <div>
              <p className="text-white/60 text-[10px] md:text-xs uppercase tracking-widest font-bold">Call us</p>
              <p>{SUPPORT_PHONE_DISPLAY}</p>
            </div>
          </a>
          <a
            href={`mailto:${SUPPORT_EMAIL}`}
            className="flex items-center gap-4 text-xs md:text-sm font-medium hover:text-[#EBCDD0] transition-colors"
          >
            <div className={`bg-white/10 rounded-full flex items-center justify-center shrink-0 ${compact ? 'w-8 h-8' : 'w-8 h-8 md:w-10 md:h-10'}`}>
              <Mail className={compact ? 'w-4 h-4' : 'w-4 h-4 md:w-5 md:h-5'} />
            </div>
            <div className="min-w-0">
              <p className="text-white/60 text-[10px] md:text-xs uppercase tracking-widest font-bold">Email us</p>
              <p className="break-all">{SUPPORT_EMAIL}</p>
            </div>
          </a>
        </div>
      </div>
    </div>
    <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-[#D39A9F]/20 rounded-full blur-3xl pointer-events-none" />
  </div>
);

export default StillNeedHelpCard;
