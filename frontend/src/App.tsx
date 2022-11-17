import { createTheme, CssBaseline, ThemeProvider } from '@mui/material'
import { ReactNode, useMemo } from 'react'
import { ColorContext, provideColorContext } from './contexts/ColorContext'
import { darkTheme } from './themes/dark'
import { lightTheme } from './themes/light'
import { Outlet } from 'react-router-dom'
import { ApiContext, provideApiContext } from './contexts/ApiContext'
import { AdapterLuxon } from '@mui/x-date-pickers/AdapterLuxon'
import type {} from '@mui/x-date-pickers/themeAugmentation'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { SnackbarProvider } from 'notistack'

export interface AppProps {
  children?: ReactNode
}

export function App ({ children }: AppProps) {
  const { colorMode, colorProviderValue } = provideColorContext()
  const theme = useMemo(() => createTheme(colorMode === 'light' ? lightTheme : darkTheme), [colorMode])

  return (
    <ColorContext.Provider value={colorProviderValue}>
      <ThemeProvider theme={theme}>
        <LocalizationProvider adapterLocale={'de'} dateAdapter={AdapterLuxon}>
          <CssBaseline enableColorScheme />
          <SnackbarProvider
            autoHideDuration={3000}
            maxSnack={2}
            preventDuplicate={true}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          >
            <ThemedApp children={children} />
          </SnackbarProvider>
        </LocalizationProvider>
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
