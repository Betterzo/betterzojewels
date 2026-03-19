import Link from 'next/link';
import { Sparkles } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
      
      <div className="container mx-auto px-4 py-14 relative z-10">

        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">

          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="h-6 w-6 text-pink-400" />
              <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent tracking-wide">
                Jewtone
              </h3>
            </div>
            <p className="text-slate-300 leading-relaxed">
              Discover the finest collection of jewelry and precious stones,
              crafted with passion and precision.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold mb-4 text-white text-lg">
              Quick Links
            </h4>
            <ul className="space-y-3">
              {["rings", "necklaces", "earrings", "bracelets"].map((item) => (
                <li key={item}>
                  <Link
                    href={`/category/${item}`}
                    className="text-slate-300 hover:text-pink-400 transition-colors hover:translate-x-1 inline-block"
                  >
                    {item.charAt(0).toUpperCase() + item.slice(1)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="font-bold mb-4 text-white text-lg">
              Customer Service
            </h4>
            <ul className="space-y-3">
              {[
                { name: "Contact Us", link: "/contact-us" },
                { name: "Shipping Info", link: "/shipping-info" },
                { name: "Returns", link: "/returns" },
                { name: "Size Guide", link: "/size-guide" },
              ].map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.link}
                    className="text-slate-300 hover:text-pink-400 transition-colors hover:translate-x-1 inline-block"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Account */}
          <div>
            <h4 className="font-bold mb-4 text-white text-lg">
              My Account
            </h4>
            <ul className="space-y-3">
              {[
                { name: "Sign In", link: "/login" },
                { name: "Create Account", link: "/register" },
                { name: "Order History", link: "/order-history" },
                { name: "Dashboard", link: "/dashboard" },
              ].map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.link}
                    className="text-slate-300 hover:text-pink-400 transition-colors hover:translate-x-1 inline-block"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-purple-800/50 mt-10 pt-8 text-center">
          <p className="text-slate-400 text-sm">
            © 2024 Jewtone. All rights reserved. |{' '}
            <Link href="/privacy" className="hover:text-pink-400 transition-colors">Privacy Policy</Link>
            {' '}|{' '}
            <Link href="/terms" className="hover:text-pink-400 transition-colors">Terms of Service</Link>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;