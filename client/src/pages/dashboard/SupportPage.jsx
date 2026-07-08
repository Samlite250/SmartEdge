import { useState } from 'react'
import { motion } from 'framer-motion'
import { MessageSquare, Mail, Phone, Headphones, Send } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'

export default function SupportPage() {
  const [form, setForm] = useState({ subject: '', message: '' })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => setLoading(false), 1000)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Support</h1>
        <p className="text-text-secondary">We're here to help</p>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        {[
          { icon: MessageSquare, label: 'Live Chat', desc: 'Chat with us now', color: 'text-primary' },
          { icon: Mail, label: 'Email Us', desc: 'support@smartedge.com', color: 'text-info' },
          { icon: Phone, label: 'Call Us', desc: '+256 700 000 000', color: 'text-accent' },
        ].map((item, i) => {
          const Icon = item.icon
          return (
            <motion.div key={item.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
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

      <Card>
        <CardHeader>
          <CardTitle>Send us a message</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input label="Subject" placeholder="How can we help?" value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} required />
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-text-secondary">Message</label>
              <textarea
                placeholder="Describe your issue..."
                rows={5}
                value={form.message}
                onChange={e => setForm({ ...form, message: e.target.value })}
                className="w-full px-4 py-3 bg-white border-2 border-border rounded-xl text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 resize-none"
                required
              />
            </div>
            <Button type="submit" loading={loading}>
              <Send className="w-4 h-4" /> Send Message
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
