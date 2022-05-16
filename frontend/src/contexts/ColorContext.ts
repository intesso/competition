import { PaletteMode } from '@mui/material'
import { createContext, useMemo, useState } from 'react'

interface ColorContextSchema {
  toggleColorMode: () => void
}

export function provideColorContext () {
  const [colorMode, setColorMode] = useState<PaletteMode>('dark')
  const colorProviderValue = useMemo(
    () => ({
      toggleColorMode: () => {
        setColorMode((prevMode: PaletteMode) =>
          prevMode === 'light' ? 'dark' : 'light'
        )
      }
    }),
    [colorMode]
  )
  return { colorMode, colorProviderValue }
}

export const ColorContext = createContext<ColorContextSchema>(
  {} as ColorContextSchema
)
