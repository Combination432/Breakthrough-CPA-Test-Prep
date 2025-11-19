import { MarketingNavbar } from '@/components/marketing/MarketingNavbar'
import { HeroSection } from '@/components/marketing/HeroSection'
import { FeatureGrid } from '@/components/marketing/FeatureGrid'
import { SocialProof } from '@/components/marketing/SocialProof'
import { MarketingFooter } from '@/components/marketing/MarketingFooter'

export default function Home() {
  return (
    <div className="min-h-screen">
      <MarketingNavbar />
      <HeroSection />
      <FeatureGrid />
      <SocialProof />
      <MarketingFooter />
    </div>
  )
}
