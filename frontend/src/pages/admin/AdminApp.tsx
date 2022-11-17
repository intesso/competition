import { ReactNode, useState } from 'react'
import { Outlet } from 'react-router-dom'
import type {} from '@mui/x-date-pickers/themeAugmentation'
import { Fab, Drawer, MenuItem, Paper } from '@mui/material'
import LunchDiningIcon from '@mui/icons-material/LunchDining'
import { pages, styledLink } from './Overview'

export interface AppProps {
  children?: ReactNode
}

export function AdminApp ({ children }: AppProps) {
  const [drawer, setDrawer] = useState(false)

  function toggleDrawer () {
    setDrawer(!drawer)
  }
  return (
    <>
      <Fab
        color="primary"
        aria-label="add"
        style={{ position: 'fixed', top: '10px', left: '10px' }}
        onClick={() => toggleDrawer()}
      >
        <LunchDiningIcon />
      </Fab>
      <Drawer anchor="top" open={drawer} onClose={() => toggleDrawer()}>
        {Object.entries(pages).map(([url, name], i) => (<>
          <MenuItem sx={{ justifyContent: 'center' }}>
          <a style={styledLink} href={url}>
                <Paper
                  elevation={9}
                  sx={{ textAlign: 'center', verticalAlign: 'center', padding: '10px', textTransform: 'uppercase' }}
                >
                  {name}
                </Paper>
              </a>
          </MenuItem>

        </>))}
      </Drawer>
      {children}
      <Outlet />
    </>
  )
}
