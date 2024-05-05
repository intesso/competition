import { Container, Grid, Paper, Typography } from '@mui/material'
import { ReactNode } from 'react'

export interface AppProps {
  children?: ReactNode
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const styledLink: any = {
  textDecoration: 'none',
  textAlign: 'center',
  verticalAlign: 'center',
  width: '100%'
}

export const pages = {
  '/admin/tournament-queue': 'Turnier Queue Dashboard',
  '/admin/tournament-plan': 'Turnier Plan',
  '/admin/select-raw-point': 'Wertung Auswählen',

  '/admin/latest-points': 'Neuste Punkte',
  '/admin/category-points': 'Kategorie Punkte',
  '/admin/category-ranks': 'Kategorie Rangliste',
  '/admin/combination-ranks': 'Kombination Rangliste',

  '/admin/calculation': 'Kalkulation Admin',

  '/admin/tournament-queue?admin=true': 'Turnier Queue Admin Dashboard'
}

export const enhancedPages = {
  '/admin/add-club': 'Club hinzufügen',
  '/admin/add-tournament': 'Turnier hinzufügen',
  '/admin/edit-location': 'Feld hinzufügen',
  '/admin/add-judge': 'Wertungsrichter hinzufügen',
  '/admin/add-athlete': 'Athlet:in hinzufügen',
  '/admin/add-performer': 'Performer:in hinzufügen',
  '/admin/add-performance': 'Performance hinzufügen'
}

export function Overview () {
  return (
    <>
      <Container>
        <Typography variant={'h4'} sx={{ marginTop: '22px', textAlign: 'center' }}>
          Admin
        </Typography>
        <Grid container spacing={2}>
          {/* 1. row */}
          {Object.entries(pages).map(([link, name], i) => (
            <Grid key={i} item xs={12}>
              <a style={styledLink} href={link}>
                <Paper
                  elevation={9}
                  sx={{ textAlign: 'center', verticalAlign: 'center', padding: '10px', textTransform: 'uppercase' }}
                >
                  {name}
                </Paper>
              </a>
            </Grid>
          ))}
        </Grid>
      </Container>
    </>
  )
}
