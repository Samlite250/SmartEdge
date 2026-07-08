import { motion } from 'framer-motion'
import { Wallet, ArrowDownCircle, ArrowUpCircle, Copy } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { useToast } from '../../components/ui/Toast'

export default function WalletPage() {
  const toast = useToast()

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text)
    toast('Address copied to clipboard', 'success')
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Wallet</h1>
        <p className="text-text-secondary">Manage your funds and transactions</p>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="card-gradient text-white">
          <CardHeader>
            <CardTitle className="text-white/80 text-sm font-medium">Available Balance</CardTitle>
            <Wallet className="w-6 h-6 text-white/60" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold mb-1">$0.00</p>
            <p className="text-white/60 text-sm">USD Wallet</p>
          </CardContent>
        </Card>
      </motion.div>

      <div className="grid grid-cols-2 gap-4">
        <Button variant="primary" className="w-full">
          <ArrowDownCircle className="w-5 h-5" /> Deposit
        </Button>
        <Button variant="outline" className="w-full">
          <ArrowUpCircle className="w-5 h-5" /> Withdraw
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Deposit Addresses</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-text-secondary text-sm text-center py-4">
            Deposit addresses will appear here when you make a deposit.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
