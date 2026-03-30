import { Link } from 'react-router-dom';

const shopLinks = [
  { label: 'All Products', to: '/' },
  { label: 'New Arrivals', to: '/collection?promo=new-arrivals' },
  { label: 'Best Sellers', to: '/collection?promo=bestsellers' },
  { label: 'Discounts', to: '/collection?promo=sale' },
];

const supportLinks = [
  'Shipping Policy',
  'Returns & Exchanges',
  'FAQs',
  'Contact Us',
];

export const SiteFooter = () => {
  return (
    <footer className="bg-white border-t border-slate-100 pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
        <div className="col-span-1 md:col-span-1">
          <Link to="/" className="text-2xl font-display font-bold tracking-tight text-slate-900 mb-6 block">
            Pet Shop<span className="text-orange-500">.</span>
          </Link>
          <p className="text-slate-500 text-sm leading-relaxed">
            Curating the finest essentials for your modern lifestyle. Quality meets minimalist design.
          </p>
        </div>

        <div>
          <h4 className="font-bold text-slate-900 mb-6">Shop</h4>
          <ul className="space-y-4 text-sm text-slate-500">
            {shopLinks.map((link) => (
              <li key={link.label}>
                <Link to={link.to} className="hover:text-emerald-600 transition-colors">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-slate-900 mb-6">Support</h4>
          <ul className="space-y-4 text-sm text-slate-500">
            {supportLinks.map((link) => (
              <li key={link}>
                <button type="button" className="hover:text-emerald-600 transition-colors text-left">
                  {link}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-slate-900 mb-6">Newsletter</h4>
          <p className="text-sm text-slate-500 mb-4">Subscribe to get special offers and first look at new products.</p>
          <div className="flex gap-2">
            <input
              type="email"
              placeholder="Your email"
              className="flex-1 bg-slate-50 border border-slate-100 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-emerald-600 transition-colors"
              aria-label="Newsletter email"
            />
            <button className="bg-slate-900 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-slate-800 transition-colors" aria-label="Subscribe to newsletter">
              Join
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 pt-10 border-t border-slate-50 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-400 font-medium">
        <p>2026 Pet Shop. All rights reserved.</p>
        <div className="flex gap-6">
          <button type="button" className="hover:text-slate-600">Privacy Policy</button>
          <button type="button" className="hover:text-slate-600">Terms of Service</button>
        </div>
      </div>
    </footer>
  );
};
