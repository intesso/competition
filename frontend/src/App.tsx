import { createTheme, CssBaseline, ThemeProvider } from '@mui/material'
import { ReactNode, useMemo } from 'react'
import { ColorContext, provideColorContext } from './contexts/ColorContext'
import { darkTheme } from './themes/dark'
import { lightTheme } from './themes/light'
import { Outlet } from 'react-router-dom'
import { ApiContext, provideApiContext } from './contexts/ApiContext'

export interface AppProps {
  children?: ReactNode
}

export function App ({ children }: AppProps) {
  const { colorMode, colorProviderValue } = provideColorContext()
  const theme = useMemo(() => createTheme(colorMode === 'light' ? lightTheme : darkTheme), [colorMode])

  return (
    <ColorContext.Provider value={colorProviderValue}>
      <ThemeProvider theme={theme}>
        <CssBaseline enableColorScheme />
        <ThemedApp children={children} />
      </ThemeProvider>
    </ColorContext.Provider>
  )
}

function ThemedApp ({ children }: AppProps) {
  return (
    <ApiContext.Provider value={provideApiContext()}>
      {children}
      <Outlet />
    </ApiContext.Provider>
  )
}
