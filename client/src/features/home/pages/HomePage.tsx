import { useEffect } from 'react'
import { useLocation } from 'react-router'
import { AirportsSection } from '../../airports/components/AirportsSection'
import { FleetSection } from '../../fleet/components/FleetSection'
import { HeroSection } from '../components/HeroSection'

// Home page of the website: hero, the fleet, then the airports. More sections (services…) will go below.
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
    <main>
      <HeroSection />
      <FleetSection />
      <AirportsSection />
    </main>
  )
}
