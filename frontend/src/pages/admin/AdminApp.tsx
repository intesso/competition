import { ReactNode } from 'react'
import { Outlet } from 'react-router-dom'
import type {} from '@mui/x-date-pickers/themeAugmentation'

export interface AppProps {
  children?: ReactNode
}

export function AdminApp ({ children }: AppProps) {
  return (
    <>
      {children}
      <Outlet />
    </>
  )
}
