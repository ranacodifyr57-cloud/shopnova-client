import { createContext, useContext, useState, useEffect } from 'react'

const ThemeContext = createContext()

const getInitial = () => {
  try {
    const saved = localStorage.getItem('shopnova_theme')
    if (saved === 'light' || saved === 'dark') return saved
  } catch { /* ignore */ }
  // Default to the signature Midnight (dark) experience
  return 'dark'
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(getInitial)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    document.documentElement.style.colorScheme = theme
    try { localStorage.setItem('shopnova_theme', theme) } catch { /* ignore */ }
  }, [theme])

  const toggleTheme = () => setTheme(t => (t === 'dark' ? 'light' : 'dark'))

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, isDark: theme === 'dark' }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => useContext(ThemeContext)
