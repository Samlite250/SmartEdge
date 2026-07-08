import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Button } from '../ui/Button'
import { ArrowRight, Shield, Zap, Globe, BarChart3, Wallet, TrendingUp, Users } from 'lucide-react'
import { Navbar } from '../layout/Navbar'
import { Footer } from '../layout/Footer'
import { HeroSection, StatsSection, HowItWorksSection, FeaturesSection, CountriesSection, CTASection } from '../components/landing/LandingSections'

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <HeroSection />
      <StatsSection />
      <HowItWorksSection />
      <FeaturesSection />
      <CountriesSection />
      <CTASection />
      <Footer />
    </div>
  )
}
