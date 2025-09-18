'use client';

import Link from 'next/link';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#0f1729]/80 backdrop-blur-xl border-t border-blue-500/20 mt-16 py-8 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Main footer content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand section */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold bg-gradient-to-r from-blue-100 to-blue-200 bg-clip-text text-transparent">
              WASHI HOTSPOT
            </h3>
            <p className="text-blue-300/80 text-sm">
              High-speed internet access for all your needs. Connect seamlessly with our reliable hotspot services.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-white font-semibold">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-blue-300/80 hover:text-blue-200 text-sm transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-blue-300/80 hover:text-blue-200 text-sm transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-blue-300/80 hover:text-blue-200 text-sm transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-blue-300/80 hover:text-blue-200 text-sm transition-colors">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Information */}
          <div className="space-y-4">
            <h4 className="text-white font-semibold">Contact Us</h4>
            <div className="space-y-2 text-sm text-blue-300/80">
              <p className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                +254 757 597 007
              </p>
              <p className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
                WhatsApp Available
              </p>
            </div>
          </div>

          {/* Developer Info */}
          <div className="space-y-4">
            <h4 className="text-white font-semibold">Developed By</h4>
            <div className="space-y-2 text-sm text-blue-300/80">
              <h3><p>Adkim Solutions</p></h3>
              <h4><p>Developer info</p></h4>

              <div className="flex space-x-4 pt-2">
                <a 
                  href="www.linkedin.com/in/jesse-nyangao-927428242" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-300/80 hover:text-blue-200 transition-colors"
                  aria-label="LinkedIn"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                  </svg>
                </a>
                <a 
                  href="https://portfoliojesse-blond.vercel.app/#home" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-300/80 hover:text-blue-200 transition-colors"
                  aria-label="Portfolio"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom section */}
        <div className="border-t border-blue-500/20 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-blue-300/60 text-sm">
            © {currentYear} WASHI HOTSPOT. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link href="/privacy" className="text-blue-300/60 hover:text-blue-200 text-sm transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-blue-300/60 hover:text-blue-200 text-sm transition-colors">
              Terms of Service
            </Link>
            <Link href="/cookies" className="text-blue-300/60 hover:text-blue-200 text-sm transition-colors">
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;