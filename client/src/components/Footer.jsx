import { Building2, Mail, MessageCircle, Phone } from "lucide-react";

/**
 * Footer
 * ------------------------------------------------------
 * Bottom section of the Live Rates card.
 */
export default function Footer() {
  return (
    <div className="border-t border-gold-600/40 bg-gradient-to-b from-brown-900 to-brown-950 py-5 pl-2 pr-4 sm:px-8 sm:py-8">
      <div className="flex flex-col items-start gap-8 px-1 sm:flex-row sm:items-center sm:justify-between sm:px-10 lg:px-16">
        <div className="flex justify-start">
          <FooterBlock icon={Building2} title="Our Address">
            <p className="font-medium text-gold-100">
              Siddhanath Refinery
            </p>
            <p>#000, Ground Floor</p>
            <p>Opp XYZ Complex</p>
            <p>Main Road, City – 000000</p>
          </FooterBlock>
        </div>

        {/* <FooterBlock icon={Mail} title="Email">
          <p className="break-all">
            info@siddhanathrefinery.com
          </p>
        </FooterBlock> */}

        <div className="flex justify-start sm:justify-end">
          <FooterBlock icon={Phone} title="Contact">
            <p>+91 90000 00000</p>
            <p>0000-0000000</p>
          </FooterBlock>
        </div>
        
        {/* <FooterBlock icon={MessageCircle} title="WhatsApp">
          <p>+91 90000 00000</p>
        </FooterBlock> */}

      </div>

      {/* <div className="mt-6 border-t border-gold-700/20 pt-4 text-center text-[11px] text-gold-400/60 sm:text-sm">
        © {new Date().getFullYear()} Siddhanath Refinery. All rights reserved.
      </div> */}
    </div>
  );
}

/**
 * Footer Block
 */
function FooterBlock({ icon: Icon, title, children }) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border border-gold-500/40 bg-brown-800">
        <Icon
          className="h-5 w-5 text-gold-400"
          strokeWidth={2}
        />
      </div>

      <div className="min-w-0 flex-1">
        <h3 className="mb-1 font-display text-sm font-semibold text-gold-200 sm:text-base">
          {title}
        </h3>

        <div className="space-y-1 break-words font-body text-xs leading-relaxed text-gold-100/70 sm:text-sm">
          {children}
        </div>
      </div>
    </div>
  );
}