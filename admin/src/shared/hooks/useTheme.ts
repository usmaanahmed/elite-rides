import { useEffect, useState } from 'react'

export type Theme = 'light' | 'dark'

// Must match the key used by the inline script in index.html
const THEME_STORAGE_KEY = 'elite-rides-theme'

function getInitialTheme(): Theme {
  // 1. Use the theme the user picked last time, if there is one
  const savedTheme = localStorage.getItem(THEME_STORAGE_KEY)
  if (savedTheme === 'light' || savedTheme === 'dark') {
    return savedTheme
  }

  // 2. Otherwise follow the operating system setting
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  return prefersDark ? 'dark' : 'light'
}

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(getInitialTheme)

  useEffect(() => {
    // The colour tokens in index.css switch when <html> has the `dark` class
    document.documentElement.classList.toggle('dark', theme === 'dark')
    localStorage.setItem(THEME_STORAGE_KEY, theme)
  }, [theme])

  function toggleTheme() {
    setTheme((currentTheme) => (currentTheme === 'dark' ? 'light' : 'dark'))
  }

  return { theme, toggleTheme }
}
