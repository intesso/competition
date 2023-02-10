import { ReactNode, useContext, useEffect, useState } from 'react'
import { createSearchParams, Outlet, useNavigate, useSearchParams } from 'react-router-dom'
import { useLocalStorage, useInterval } from 'usehooks-ts'
import type {} from '@mui/x-date-pickers/themeAugmentation'
import { ApiContext } from '../../contexts/ApiContext'

import {
  Category,
  Criteria,
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
  Switch,
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
import TuneIcon from '@mui/icons-material/Tune'
import { categoryTitles, criteriaNames } from '../../lib/reportDefinitions'

export interface AppProps {
  children?: ReactNode
}

export type InputType = 'button' | 'slider';

export function JudgingApp ({ children }: AppProps) {
  const {
    getTournamentQueueForJudge,
    getTournamentJudge,
    getPerformance,
    getPerformer,
    getCategory,
    getCriteria,
    getLocation
  } = useContext(ApiContext)
  const navigate = useNavigate()
  const { enqueueSnackbar } = useSnackbar()
  const [showTopDrawer, setShowTopDrawer] = useState(false)
  const [searchParams] = useSearchParams()
  const judgeId = searchParams.get('judgeId') || searchParams.get('id')
  const slotNumber = searchParams.get('slotNumber')
  const judgeName = searchParams.get('judgeName')
  const tournamentId = searchParams.get('tournamentId')
  const tournamentJudgeId = searchParams.get('tournamentJudgeId')
  const isAdmin = searchParams.get('admin') || ''
  const [inputType, setInputType] = useLocalStorage<InputType>('inputType', 'slider') // TODO change: 'slider' -> 'button'
  const [tournamentJudge, setTournamentJudge] = useState(null as TournamentPerson | null)
  const performanceId = searchParams.get('performanceId')
  const [performance, setPerformance] = useState(null as Performance | null)
  const performerId = searchParams.get('performerId')
  const [performer, setPerformer] = useState(null as Performer | null)
  const [category, setCategory] = useState(null as Category | null)
  const [location, setLocation] = useState(null as Location | null)
  const criteriaId = searchParams.get('criteriaId')
  const [criteria, setCriteria] = useState(null as Criteria | null)

  function getJudgeId () {
    return judgeId || tournamentJudgeId || ''
  }
  console.log('getJudgeId', getJudgeId())

  function getJudgeName () {
    return judgeName || (tournamentJudge ? `${tournamentJudge?.firstName} ${tournamentJudge?.lastName}` : '')
  }

  // periodically check the current queue, and decide what to display
  useInterval(
    () => {
      async function getCurrentQueue () {
        if (tournamentId && judgeId) {
          return await getTournamentQueueForJudge(tournamentId, judgeId)
        }
        return null
      }

      getCurrentQueue()
        .then((queue) => {
          console.log('interval')
          const nothingPath = '/judging/nothing'
          if (!queue) {
            if (window.location.pathname !== nothingPath) {
              const params = {
                slotNumber: '',
                locationName: '',
                tournamentId: (tournamentId as string) || '',
                categoryId: '',
                criteriaId: '',
                criteriaName: '',
                tournamentJudgeId: '',
                performanceId: '',
                judgeId: getJudgeId(),
                judgeName: ''
              }
              navigate({
                pathname: nothingPath,
                search: `?${createSearchParams(isAdmin ? { ...params, admin: 'true' } : params)}`
              })
            }
          } else {
            if (performanceId !== queue.query.performanceId) {
              const params = Object.fromEntries(
                Object.entries(queue.query).map(([key, value]) => [key, value !== null ? value.toString() : ''])
              )
              navigate({
                pathname: queue.path,
                search: `?${createSearchParams(isAdmin ? { ...params, admin: 'true' } : params)}`
              })
            }
          }
        })
        .catch((err) => {
          console.error(err)
          enqueueSnackbar(err.message, { variant: 'error' })
        })
    },
    // poll time in milliseconds or null to stop it
    3000
  )

  useEffect(() => {
    const fetchData = async () => {
      if (!performanceId && !performerId && !criteriaId) {
        setPerformance(null)
        setPerformer(null)
        setCriteria(null)
        setCategory(null)
        setLocation(null)
      }
      if (tournamentId && performanceId) {
        setPerformance(await getPerformance(tournamentId, performanceId))
      }
      if (tournamentId && performerId) {
        setPerformer(await getPerformer(tournamentId, performerId))
      }
      if (criteriaId) {
        setCriteria(await getCriteria(criteriaId))
      }
    }
    fetchData().catch((err) => enqueueSnackbar(parseError(err), { variant: 'error' }))
  }, [undefined, window.location.href])

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
    list: { bgcolor: 'primary', margin: 0, padding: 0 },
    listItem: { padding: '0px 8px', textAlign: 'center' }
  }

  function getSlotNumber () {
    return (performance && performance?.slotNumber) || slotNumber
  }

  function getCategoryTitle (categoryName = '') {
    return categoryTitles[categoryName] || dedupe(snakeToPascal(categoryName))
  }

  function getCriteriaTitle (criteriaName = '') {
    return criteriaNames[criteriaName] || snakeToPascal(criteriaName)
  }

  function Infos () {
    return (
      <Stack sx={{ flexGrow: 1 }} direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 1, sm: 2, md: 2 }}>
        {getSlotNumber() && (
          <List sx={classes.list}>
            <ListItem sx={{ ...classes.listItem, width: '38px' }}>
              <ListItemText primary={<TableRowsIcon />} secondary={getSlotNumber()} />
            </ListItem>
          </List>
        )}
        {location && (
          <List sx={classes.list}>
            <ListItem sx={{ ...classes.listItem, width: '38px' }}>
              <ListItemText primary={<PlaceIcon />} secondary={location?.locationName} />
            </ListItem>
          </List>
        )}
        {performer && (
          <List sx={classes.list}>
            <ListItem sx={{ ...classes.listItem, minWidth: '160px' }}>
              <ListItemText
                primary={<PeopleAltIcon />}
                secondary={`${performer?.performerName} | ${performer?.performerNumber}`}
              />
            </ListItem>
          </List>
        )}
        <List sx={classes.list}>
          <ListItem sx={{ ...classes.listItem, minWidth: '160px' }}>
            <ListItemText primary={<CategoryIcon />} secondary={getCategoryTitle(category?.categoryName)} />
          </ListItem>
        </List>

        <List sx={classes.list}>
          <ListItem sx={classes.listItem}>
            <ListItemText primary={<WorkspacesIcon />} secondary={getCriteriaTitle(criteria?.criteriaName)} />
          </ListItem>
        </List>
        <List sx={classes.list}>
          <ListItem sx={classes.listItem}>
            <ListItemText primary={<GavelIcon />} secondary={getJudgeName()} />
          </ListItem>
        </List>
        <List sx={classes.list}>
          <ListItem sx={classes.listItem}>
            <ListItemText
              primary={<TuneIcon />}
              secondary={
                <Switch
                  checked={inputType === 'slider'}
                  onChange={(event) => setInputType(event.target.checked ? 'slider' : 'button')}
                  inputProps={{ 'aria-label': 'inputType' }}
                />
              }
            />
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
          <IconButton size="large" edge="start" color="inherit" aria-label="menu">
            <Box
              component="img"
              sx={{
                height: 40
              }}
              alt="logo"
              src={Logo}
            />
          </IconButton>
          {performanceId && <Infos />}
        </Toolbar>
      </AppBar>

      {children}
      <Outlet />
    </>
  )
}
