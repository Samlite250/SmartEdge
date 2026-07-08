import { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, Phone, MapPin, Send, MessageSquare, Clock } from 'lucide-react'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Card, CardContent } from '../components/ui/Card'
import { useToast } from '../components/ui/Toast'

const contactMethods = [
  { icon: Mail, label: 'Email', value: 'support@smartedge.com', desc: 'We reply within 24 hours' },
  { icon: Phone, label: 'Phone', value: '+256 700 000 000', desc: 'Mon-Fri 8AM-6PM EAT' },
  { icon: MapPin, label: 'Office', value: 'Kampala, Uganda', desc: 'Visit us during business hours' },
  { icon: MessageSquare, label: 'Live Chat', value: 'Available 24/7', desc: 'Instant support via chat' },
]

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [loading, setLoading] = useState(false)
  const toast = useToast()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      toast('Message sent! We\'ll get back to you soon.', 'success')
      setForm({ name: '', email: '', subject: '', message: '' })
    }, 1500)
  }

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-text-primary mb-4">Contact Us</h1>
          <p className="text-text-secondary text-lg max-w-2xl mx-auto">
            Have a question or need help? We'd love to hear from you.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          {contactMethods.map((method, i) => {
            const Icon = method.icon
            return (
              <motion.div
                key={method.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <Card hover>
                  <CardContent>
                    <div className="flex items-center gap-4 mb-3">
                      <div className="w-10 h-10 rounded-xl card-gradient flex items-center justify-center">
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-sm text-text-muted">{method.label}</p>
                        <p className="font-semibold text-text-primary text-sm">{method.value}</p>
                      </div>
                    </div>
                    <p className="text-xs text-text-muted flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {method.desc}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </div>

        <div className="max-w-2xl mx-auto">
          <Card>
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-text-primary mb-6 text-center">Send Us a Message</h2>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-5">
                  <Input label="Full Name" placeholder="John Doe" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
                  <Input label="Email" type="email" placeholder="you@example.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
                </div>
                <Input label="Subject" placeholder="How can we help?" value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} required />
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-text-secondary">Message</label>
                  <textarea
                    placeholder="Tell us more about your inquiry..."
                    rows={5}
                    value={form.message}
                    onChange={e => setForm({ ...form, message: e.target.value })}
                    className="w-full px-4 py-3 bg-white border-2 border-border rounded-xl text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 resize-none"
                    required
                  />
                </div>
                <Button type="submit" className="w-full" loading={loading}>
                  <Send className="w-4 h-4" /> Send Message
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
