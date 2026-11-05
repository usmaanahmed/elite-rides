import { useEffect, useState } from 'react'

// Returns true once the page has been scrolled further down than `distance` pixels
export function useIsScrolled(distance: number) {
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    function handleScroll() {
      setIsScrolled(window.scrollY > distance)
    }

    // Check once straight away, in case the page is already scrolled
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [distance])

  return isScrolled
}
