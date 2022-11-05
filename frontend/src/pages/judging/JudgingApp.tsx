import { ReactNode, useContext, useEffect, useState } from 'react'
import { Outlet, useSearchParams } from 'react-router-dom'
import type {} from '@mui/x-date-pickers/themeAugmentation'
import { ApiContext } from '../../contexts/ApiContext'
import { Category, Criteria, JudgingRule, Performance, TournamentPerson } from '../../contexts/ApiContextInterface'
import {
  AppBar,
  Box,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Stack,
  Toolbar,
  Typography
} from '@mui/material'

import Logo from '../../themes/default/assets/ropeskipping_swiss_logo.png'
import { parseError, snakeToPascal } from '../../lib/common'
import { useSnackbar } from 'notistack'

export interface AppProps {
  children?: ReactNode
}

export function JudgingApp ({ children }: AppProps) {
  const { getTournamentJudge, getPerformance, getCategory, getCriteria, getJudgingRule } = useContext(ApiContext)
  const { enqueueSnackbar } = useSnackbar()
  const [showTopDrawer, setShowTopDrawer] = useState(false)
  const [searchParams] = useSearchParams()
  const tournamentId = searchParams.get('tournamentId')
  const tournamentJudgeId = searchParams.get('tournamentJudgeId')
  const [tournamentJudge, setTournamentJudge] = useState(null as TournamentPerson | null)
  const performanceId = searchParams.get('performanceId')
  const [performance, setPerformance] = useState(null as Performance | null)
  const [category, setCategory] = useState(null as Category | null)
  const criteriaId = searchParams.get('criteriaId')
  const [criteria, setCriteria] = useState(null as Criteria | null)
  const judgingRuleId = searchParams.get('judgingRuleId')
  const [judgingRule, setJudgingRule] = useState(null as JudgingRule | null)

  // TODO remove judgingRule if not neeeded
  console.log('judgingRule', judgingRule)

  useEffect(() => {
    const fetchData = async () => {
      if (tournamentId && performanceId) {
        setPerformance(await getPerformance(tournamentId, performanceId))
      }
      if (criteriaId) {
        setCriteria(await getCriteria(criteriaId))
      }
      if (judgingRuleId) {
        setJudgingRule(await getJudgingRule(judgingRuleId))
      }
    }
    fetchData().catch((err) => enqueueSnackbar(parseError(err), { variant: 'error' }))
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      if (performance) {
        setCategory(await getCategory(performance.categoryId))
        if (tournamentJudgeId) {
          setTournamentJudge(await getTournamentJudge(performance.tournamentId, tournamentJudgeId))
        }
      }
    }
    fetchData().catch((err) => enqueueSnackbar(parseError(err), { variant: 'error' }))
  }, [performance])

  function Infos () {
    return (
      <Stack sx={{ flexGrow: 1 }} direction={{ xs: 'column', sm: 'column' }} spacing={{ xs: 0, sm: 0, md: 0 }}>
        <Stack sx={{ flexGrow: 1 }} direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 1, sm: 2, md: 2 }}>
          <List sx={{ width: '100%', bgcolor: 'primary ' }}>
            <ListItem>
              <ListItemText primary="Kriterium" secondary={criteria?.criteriaName} />
            </ListItem>
          </List>
          <List sx={{ width: '100%', bgcolor: 'primary ' }}>
            <ListItem>
              <ListItemText primary="PERFORMANCE NAME" secondary={performance?.performanceName} />
            </ListItem>
          </List>
          <List sx={{ width: '100%', bgcolor: 'primary ' }}>
            <ListItem>
              <ListItemText primary="PERFORMANCE NUMMER" secondary={performance?.performanceNumber} />
            </ListItem>
          </List>
        </Stack>
        <Stack sx={{ flexGrow: 1 }} direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 1, sm: 2, md: 2 }}>
          <List sx={{ width: '100%', bgcolor: 'primary ' }}>
            <ListItem>
              <ListItemText primary="KATEGORIE" secondary={snakeToPascal(category?.categoryName || '')} />
            </ListItem>
          </List>
          <List sx={{ width: '100%', bgcolor: 'primary ' }}>
            <ListItem>
              <ListItemText primary="DISZIPLIN" secondary={category?.discipline} />
            </ListItem>
          </List>
          <List sx={{ width: '100%', bgcolor: 'primary ' }}>
            <ListItem>
              <ListItemText
                primary="WERTUNGSRICHTER"
                secondary={(tournamentJudge?.firstName || '') + ' ' + (tournamentJudge?.lastName || '')}
              />
            </ListItem>
          </List>
        </Stack>
      </Stack>
    )
  }

  return (
    <>
      {/* Small Device AppBar */}
      <AppBar position="static" sx={{ display: { xs: 'block', sm: 'block', md: 'none' } }}>
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
            onClick={() => setShowTopDrawer(!showTopDrawer)}
          >
            <Box
              component="img"
              sx={{
                height: 30
              }}
              alt="logo"
              src={Logo}
            />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            {/* Title */}
          </Typography>
          <Drawer anchor="top" open={showTopDrawer} onClose={() => setShowTopDrawer(false)}>
            <Infos />
          </Drawer>
        </Toolbar>
      </AppBar>

      {/* Big Device AppBar */}
      <AppBar position="static" sx={{ display: { xs: 'none', sm: 'none', md: 'block' } }}>
        <Toolbar>
          <IconButton size="large" edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
            <Box
              component="img"
              sx={{
                height: 100
              }}
              alt="logo"
              src={Logo}
            />
          </IconButton>
          <Infos />
        </Toolbar>
      </AppBar>

      {children}
      <Outlet />
    </>
  )
}
