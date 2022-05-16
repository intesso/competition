import { createTheme, CssBaseline, ThemeProvider } from '@mui/material'
import { ReactNode, useMemo } from 'react'
import { ColorContext, provideColorContext } from './contexts/ColorContext'
import { darkTheme } from './themes/dark'
import { lightTheme } from './themes/light'
import { Outlet } from 'react-router-dom'

export interface AppProps { children?: ReactNode }

export function App ({ children }: AppProps) {
  const { colorMode, colorProviderValue } = provideColorContext()
  const theme = useMemo(() => createTheme(colorMode === 'light' ? lightTheme : darkTheme), [colorMode])

  return (
    <ColorContext.Provider value={colorProviderValue}>
      <ThemeProvider theme={theme}>
        <CssBaseline enableColorScheme />
        {children}
        <Outlet />
      </ThemeProvider>
    </ColorContext.Provider>
  )
}
