'use client';

import { useLanguage } from "@/contexts/LanguageContext";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const { t } = useLanguage();

  const footerText = t('footer.text').replace('{year}', currentYear);

  return (
    <footer className="bg-dark text-white border-t-2 border-secondary py-4 px-6">
      <p className="text-center text-sm font-medium">
        {footerText}
      </p>
    </footer>
  );
};

export default Footer;
