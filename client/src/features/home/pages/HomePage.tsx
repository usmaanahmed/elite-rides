import { useEffect } from 'react'
import { useLocation } from 'react-router'
import { HeroSection } from '../components/HeroSection'

// Home page of the website. More sections (services, fleet, airports…) will go under the hero.
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
    </main>
  )
}
