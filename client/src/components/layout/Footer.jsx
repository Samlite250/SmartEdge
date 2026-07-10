import { Link } from 'react-router-dom'
import { Mail, Phone, MapPin, ArrowUpRight } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-secondary text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          <div>
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                <span className="text-white font-bold text-sm">SE</span>
              </div>
              <span className="text-xl font-bold">Smart<span className="text-primary-light">Edge</span></span>
            </Link>
            <p className="text-white/60 text-sm leading-relaxed">
              Premium digital investment platform combining modern wealth management with cryptocurrency opportunities.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-4 text-white">Quick Links</h3>
            <div className="space-y-3">
              {[
                { name: 'Investment Plans', path: '/plans' },
                { name: 'About', path: '/about' },
                { name: 'FAQ', path: '/faq' },
                { name: 'Contact', path: '/contact' }
              ].map(item => (
                <Link key={item.name} to={item.path} className="block text-white/60 hover:text-white text-sm transition-colors">
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <div className="space-y-3 text-white/60 text-sm">
              <a href="mailto:support@smartedge.com" className="flex items-center gap-2 hover:text-white transition-colors">
                <Mail className="w-4 h-4" /> support@smartedge.com
              </a>
              <a href="tel:+256700000000" className="flex items-center gap-2 hover:text-white transition-colors">
                <Phone className="w-4 h-4" /> +256 700 000 000
              </a>
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-0.5" />
                <span>Kampala, Uganda</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Newsletter</h4>
            <p className="text-white/60 text-sm mb-4">Stay updated with the latest investment opportunities.</p>
            <form className="flex gap-2" onSubmit={e => e.preventDefault()}>
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 px-4 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-white/40 text-sm focus:outline-none focus:border-primary-light"
              />
              <button type="submit" className="p-2.5 rounded-xl card-gradient text-white">
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-white/40">
          <p>&copy; {new Date().getFullYear()} Smart Edge. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link to="/privacy" className="hover:text-white/60 transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-white/60 transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
