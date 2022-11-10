import { ReactNode, useContext, useEffect, useState } from 'react'
import { Outlet, useSearchParams } from 'react-router-dom'
import type {} from '@mui/x-date-pickers/themeAugmentation'
import { ApiContext } from '../../contexts/ApiContext'

import {
  Category,
  Criteria,
  JudgingRule,
  Location,
  Performance,
  Performer,
  TournamentPerson
} from '../../contexts/ApiContextInterface'
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
import { dedupe, parseError, snakeToPascal } from '../../lib/common'
import { useSnackbar } from 'notistack'
import CategoryIcon from '@mui/icons-material/Category'
import PeopleAltIcon from '@mui/icons-material/PeopleAlt'
import WorkspacesIcon from '@mui/icons-material/Workspaces'
import TableRowsIcon from '@mui/icons-material/TableRows'
import PlaceIcon from '@mui/icons-material/Place'
import GavelIcon from '@mui/icons-material/Gavel'
export interface AppProps {
  children?: ReactNode
}

export function JudgingApp ({ children }: AppProps) {
  const { getTournamentJudge, getPerformance, getPerformer, getCategory, getCriteria, getJudgingRule, getLocation } =
    useContext(ApiContext)
  const { enqueueSnackbar } = useSnackbar()
  const [showTopDrawer, setShowTopDrawer] = useState(false)
  const [searchParams] = useSearchParams()
  const judgeId = searchParams.get('id')
  const judgeName = searchParams.get('judgeName')
  const tournamentId = searchParams.get('tournamentId')
  const tournamentJudgeId = searchParams.get('tournamentJudgeId')
  const [tournamentJudge, setTournamentJudge] = useState(null as TournamentPerson | null)
  const performanceId = searchParams.get('performanceId')
  const [performance, setPerformance] = useState(null as Performance | null)
  const performerId = searchParams.get('performerId')
  const [performer, setPerformer] = useState(null as Performer | null)
  const [category, setCategory] = useState(null as Category | null)
  const [location, setLocation] = useState(null as Location | null)
  const criteriaId = searchParams.get('criteriaId')
  const [criteria, setCriteria] = useState(null as Criteria | null)
  const judgingRuleId = searchParams.get('judgingRuleId')
  const [judgingRule, setJudgingRule] = useState(null as JudgingRule | null)

  // TODO remove judgingRule if not neeeded
  console.log('judgingRule', judgingRule)

  function getJudgeId () {
    return judgeId || tournamentJudgeId || ''
  }
  console.log('getJudgeId', getJudgeId())

  function getJudgeName () {
    return judgeName || (tournamentJudge ? `${tournamentJudge?.firstName} ${tournamentJudge?.lastName}` : '')
  }

  useEffect(() => {
    const fetchData = async () => {
      if (tournamentId && performanceId) {
        setPerformance(await getPerformance(tournamentId, performanceId))
      }
      if (tournamentId && performerId) {
        setPerformer(await getPerformer(tournamentId, performerId))
      }
      if (criteriaId) {
        setCriteria(await getCriteria(criteriaId))
      }
      if (judgingRuleId) {
        setJudgingRule(await getJudgingRule(judgingRuleId))
      }
    }
    fetchData().catch((err) => enqueueSnackbar(parseError(err), { variant: 'error' }))
  }, [undefined, window.location.pathname])

  useEffect(() => {
    const fetchData = async () => {
      if (performance) {
        setCategory(await getCategory(performance.categoryId))
        if (tournamentJudgeId) {
          setTournamentJudge(await getTournamentJudge(performance.tournamentId, tournamentJudgeId))
        }
        if (tournamentId) {
          setLocation(await getLocation(tournamentId, performance.locationId))
        }
      }
    }
    fetchData().catch((err) => enqueueSnackbar(parseError(err), { variant: 'error' }))
  }, [performance])

  const classes = {
    list: { width: '100%', bgcolor: 'primary', margin: 0, padding: 0 },
    listItem: { padding: 0 }
  }

  function Infos () {
    return (
      <Stack sx={{ flexGrow: 1 }} direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 1, sm: 2, md: 2 }}>
        {performance && performance?.slotNumber && (
          <List sx={classes.list}>
            <ListItem sx={classes.listItem}>
              <ListItemText primary={<TableRowsIcon />} secondary={performance?.slotNumber} />
            </ListItem>
          </List>
        )}
        {location && (
          <List sx={classes.list}>
            <ListItem sx={classes.listItem}>
              <ListItemText primary={<PlaceIcon />} secondary={location?.locationName} />
            </ListItem>
          </List>
        )}
        <ListItem sx={classes.listItem}>
          <ListItemText primary={<CategoryIcon />} secondary={dedupe(snakeToPascal(category?.categoryName || ''))} />
        </ListItem>
        {performer && (
          <List sx={classes.list}>
            <ListItem sx={classes.listItem}>
              <ListItemText
                primary={<PeopleAltIcon />}
                secondary={`${performer?.performerName} ${performer?.performerNumber}`}
              />
            </ListItem>
          </List>
        )}
        <List sx={classes.list}>
          <ListItem sx={classes.listItem}>
            <ListItemText primary={<WorkspacesIcon />} secondary={criteria?.criteriaName} />
          </ListItem>
        </List>
        <List sx={classes.list}>
          <ListItem sx={classes.listItem}>
            <ListItemText primary={<GavelIcon />} secondary={getJudgeName()} />
          </ListItem>
        </List>
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
                height: 40
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
