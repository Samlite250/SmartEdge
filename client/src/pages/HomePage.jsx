import { HeroSection, StatsSection, HowItWorksSection, FeaturesSection, CountriesSection, CTASection, TickerMarquee } from '../components/landing/LandingSections'

export default function HomePage() {
  return (
    <>
      <TickerMarquee />
      <HeroSection />
      <StatsSection />
      <HowItWorksSection />
      <FeaturesSection />
      <CountriesSection />
      <CTASection />
    </>
  )
}
