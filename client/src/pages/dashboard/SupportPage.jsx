import { motion } from 'framer-motion'
import { MessageSquare, Mail, Phone, Headphones, ExternalLink, User } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card'

const WHATSAPP_LINK = 'https://chat.whatsapp.com/KeL8QRse8ro5FOGJZWL37F'
const CEO_WHATSAPP = 'https://wa.me/+255796634436?text=Hello%20mfasha%20gukora%20account%20muri%20SmartEdge%20kuri%20vip%20ya%2013'

export default function SupportPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Support</h1>
        <p className="text-text-secondary">We're here to help</p>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0 }}>
          <a href={CEO_WHATSAPP} target="_blank" rel="noopener noreferrer" className="block">
            <Card hover>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl text-[#25D366] bg-[#25D366]/10 flex items-center justify-center">
                  <User className="w-5 h-5 text-[#25D366]" />
                </div>
                <div>
                  <p className="font-semibold text-text-primary">Get in Touch with CEO</p>
                  <p className="text-sm text-text-muted">Chat on WhatsApp</p>
                </div>
              </div>
            </Card>
          </a>
        </motion.div>
        {[
          { icon: Mail, label: 'Email Us', desc: 'support@smartedge.com', color: 'text-info' },
          { icon: Phone, label: 'Call Us', desc: '+256 700 000 000', color: 'text-accent' },
        ].map((item, i) => {
          const Icon = item.icon
          return (
            <motion.div key={item.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: (i + 1) * 0.1 }}>
              <Card hover>
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-xl ${item.color} bg-current/10 flex items-center justify-center`}>
                    <Icon className={`w-5 h-5 ${item.color}`} />
                  </div>
                  <div>
                    <p className="font-semibold text-text-primary">{item.label}</p>
                    <p className="text-sm text-text-muted">{item.desc}</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          )
        })}
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <div className="relative rounded-3xl p-px bg-gradient-to-b from-emerald-500 to-green-600 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent" />
          <div className="relative bg-background rounded-[23px] p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-[#25D366]/20 flex items-center justify-center mx-auto mb-5">
              <Headphones className="w-8 h-8 text-[#25D366]" />
            </div>
            <h3 className="text-xl font-bold text-text-primary mb-2">Join Our WhatsApp Group</h3>
            <p className="text-sm text-text-secondary mb-6 max-w-sm mx-auto">
              Get instant support, updates, and connect with the SmartEdge community directly on WhatsApp.
            </p>
            <a
              href={WHATSAPP_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-xl bg-[#25D366] text-white font-bold text-sm hover:bg-[#1ebe5d] shadow-lg shadow-[#25D366]/25 transition-all duration-200 hover:scale-[1.03] active:scale-[0.97]"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Join WhatsApp Group
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
