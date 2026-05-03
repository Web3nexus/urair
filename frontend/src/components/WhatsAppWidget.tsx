import React from 'react';
import { MessageCircle } from 'lucide-react';
import { useCMSStore } from '@/store/cmsStore';

const WhatsAppWidget: React.FC = () => {
  const cms = useCMSStore();
  const whatsappNumber = cms.whatsapp_number;

  if (!whatsappNumber) return null;

  const handleClick = () => {
    const message = encodeURIComponent('Hello URAIR Support, I would like to inquire about...');
    window.open(`https://wa.me/${whatsappNumber.replace('+', '')}?text=${message}`, '_blank');
  };

  return (
    <button
      onClick={handleClick}
      className="fixed bottom-8 right-8 z-[100] bg-[#25D366] text-white p-4 rounded-full shadow-2xl hover:scale-110 active:scale-95 transition-all group"
      aria-label="Contact on WhatsApp"
    >
      <MessageCircle size={28} className="fill-current" />
      <span className="absolute right-full mr-4 top-1/2 -translate-y-1/2 bg-white text-black text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap border border-premium-divider">
        Chat with us
      </span>
    </button>
  );
};

export default WhatsAppWidget;
