import { useEffect } from 'react'
import { useLocation } from 'react-router'
import { SiteFooter } from '../../../shared/components/layout/footer/SiteFooter'
import { AirportsSection } from '../../airports/components/AirportsSection'
import { FleetSection } from '../../fleet/components/FleetSection'
import { StationsSection } from '../../stations/components/StationsSection'
import { ToursSection } from '../../tours/components/ToursSection'
import { HeroSection } from '../components/HeroSection'

// Home page of the website: hero, the fleet, the airports, then the stations, and the footer at the end.
// More sections (services…) will go above the footer.
export function HomePage() {
  const location = useLocation()

  // Links like "/#quote" (e.g. "Change journey") scroll to that part of the page
  useEffect(() => {
    if (location.hash === '') {
      return
    }
    const section = document.getElementById(location.hash.slice(1))
    if (section) {
      section.scrollIntoView()
    }
  }, [location.hash])

  return (
    <>
      <main>
        <HeroSection />
        <FleetSection />
        <AirportsSection />
        <StationsSection />
        <ToursSection />
      </main>
      <SiteFooter />
    </>
  )
}
