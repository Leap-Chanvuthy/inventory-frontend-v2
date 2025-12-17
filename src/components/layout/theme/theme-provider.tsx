import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import type { RootState } from '../../../redux/store';
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useSelector((state: RootState) => state.theme.mode)
  useEffect(() => {
    const root = document.documentElement
    root.classList.remove(theme === 'dark' ? 'light' : 'dark')
    root.classList.add(theme)
  }, [theme])
  return <>{children}</>
}