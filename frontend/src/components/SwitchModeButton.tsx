import { Box, IconButton, useTheme } from '@mui/material'
import DarkIcon from '@mui/icons-material/Brightness4'
import LightIcon from '@mui/icons-material/Brightness7'

import { ColorContext } from '../contexts/ColorContext'
import { useContext } from 'react'

export const SwitchModeButton = () => {
  const theme = useTheme()
  const colorMode = useContext(ColorContext)

  return (
    <Box>
      <IconButton
        onClick={colorMode.toggleColorMode}
        color='inherit'
      >
        {theme.palette.mode === 'dark' ? <LightIcon /> : <DarkIcon />}
      </IconButton>
    </Box>
  )
}
