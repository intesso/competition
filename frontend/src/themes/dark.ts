import { ThemeOptions } from '@mui/material'

export const darkTheme: ThemeOptions = {
  palette: {
    mode: 'dark'
  },
  components: {
    MuiButtonBase: {
      defaultProps: {
        // No more ripple, on the whole application 💣!
        // improves button performance on mobile devices
        disableRipple: true
      }
    }
  },
  transitions: {
    // So we have `transition: none;` everywhere
    create: () => 'none'
  }
}
