import { Container, Grid, Paper, Typography } from '@mui/material'
import { ReactNode } from 'react'

export interface AppProps {
  children?: ReactNode
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const styledLink: any = {
  textDecoration: 'none',
  textAlign: 'center',
  verticalAlign: 'center',
  width: '100%'
}

const pages = [
  '/admin/add-club',
  '/admin/add-tournament',
  '/admin/edit-location',
  '/admin/add-judge',
  '/admin/add-athlete',
  '/admin/add-performance',
  '/admin/select-raw-point'
]

export function Overview () {
  function getPageName (page: string) {
    const segments = page.split('/')
    return segments[segments.length - 1].replace(/-/g, ' ')
  }

  return (
    <>
      <Container>
        <Typography variant={'h4'} sx={{ marginTop: '22px', textAlign: 'center' }}>
          Admin
        </Typography>
        <Grid container spacing={2}>
          {/* 1. row */}
          {pages.map((page) => (
            <Grid item xs={12}>
              <a style={styledLink} href={page}>
                <Paper
                  elevation={9}
                  sx={{ textAlign: 'center', verticalAlign: 'center', padding: '10px', textTransform: 'uppercase' }}
                >
                  {getPageName(page)}
                </Paper>
              </a>
            </Grid>
          ))}
        </Grid>
      </Container>
    </>
  )
}
