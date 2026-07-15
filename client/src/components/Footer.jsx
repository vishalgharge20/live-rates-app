import { Building2, Phone } from "lucide-react";

const MAPS_URL = "https://maps.app.goo.gl/3YWXoXzWqestN4vH6";

export default function Footer() {
  return (
    <div className="border-t border-gold-600/40 bg-gradient-to-b from-brown-900 to-brown-950 py-5 pl-2 pr-4 sm:px-8 sm:py-8">
      <div className="flex flex-col items-start gap-8 px-1 sm:flex-row sm:items-center sm:justify-between sm:px-10 lg:px-16">
        <div className="flex justify-start">
          <FooterBlock icon={Building2} title="Our Address">
            <a href={MAPS_URL} target="_blank" rel="noopener noreferrer" className="block transition-colors hover:text-gold-300">
              <p className="font-medium text-gold-100">Siddhanath Refinery</p>
              <p>#1203/2, Irwin Road</p>
              <p>Kurubageri, Lashkar Mohalla</p>
              <p>Mysore – 570001</p>
            </a>
          </FooterBlock>
        </div>

        <div className="flex justify-start sm:justify-end">
          <FooterBlock icon={Phone} title="Contact">
            <a href="tel:+919902687124" className="block transition-colors hover:text-gold-300">
              Karan More: +91 99026 87124
            </a>
            <a href="tel:+918147319446" className="block transition-colors hover:text-gold-300">
              Akshay More: +91 81473 19446
            </a>
          </FooterBlock>
        </div>
      </div>
    </div>
  );
}

function FooterBlock({ icon: Icon, title, children }) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border border-gold-500/40 bg-brown-800">
        <Icon className="h-5 w-5 text-gold-400" strokeWidth={2} />
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