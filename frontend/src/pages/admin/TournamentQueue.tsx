import {
  Box,
  Button,
  Container,
  FormControl,
  InputLabel,
  List,
  ListItem,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
  useTheme
} from '@mui/material'
import { useContext, useEffect, useState } from 'react'
import { ApiContext } from '../../contexts/ApiContext'
import {
  Tournament,
  TournamentPlanDetails,
  TournamentQueue,
  TournamentQueueMode,
  TournamentQueueStatus
} from '../../contexts/ApiContextInterface'
import { useSnackbar } from 'notistack'
import { parseError } from '../../lib/common'
import { useInterval, useLocalStorage } from 'usehooks-ts'
import ArrowBackIosRounded from '@mui/icons-material/ArrowBackIosRounded'
import ArrowForwardIosRounded from '@mui/icons-material/ArrowForwardIosRounded'
import { sortBy } from 'lodash'
import { TournamentPlanItems } from '../../components/TournamentPlanItems'
import { Link, useSearchParams } from 'react-router-dom'

export function TournamentQueueDashboard () {
  const {
    listTournaments,
    listTournamentPlan,
    moveQueueBackward,
    moveQueueForward,
    setTournamentQueue,
    setTournamentQueueMode,
    getTournamentQueue
  } = useContext(ApiContext)
  const theme = useTheme()
  const { enqueueSnackbar } = useSnackbar()
  const [searchParams] = useSearchParams()
  const admin = searchParams.get('admin')
  const [tournaments, setTournaments] = useState([] as Tournament[])
  const [tournamentId, setTournamentId] = useLocalStorage('tournamentId', '')
  const [queue, storeQueue] = useState({} as TournamentQueue)
  const [judgeStatus, setJudgeStatus] = useState([] as TournamentQueueStatus[])
  const [slotNumber, setSlotNumber] = useState(-1)
  const [plan, setPlan] = useState([] as TournamentPlanDetails[])

  // poll for current queue judge status
  useInterval(
    () => {
      async function getCurrentQueue () {
        if (tournamentId) {
          return await getTournamentQueue(tournamentId)
        }
        return null
      }
      getCurrentQueue()
        .then((queue) => {
          if (queue) {
            // store the current queue status in another variable, to avaoid problems with moving the queue while polling the same item
            setJudgeStatus(queue.status ? queue.status : [])
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
      const t = await listTournaments()
      setTournaments(t)
    }
    fetchData().catch((err) => enqueueSnackbar(parseError(err), { variant: 'error' }))
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      if (tournamentId) {
        await storeQueueAndSlotNumber(tournamentId)
        const p = await listTournamentPlan(tournamentId)
        setPlan(sortBy(p, 'slotNumber'))
      }
    }
    fetchData().catch((err) => enqueueSnackbar(parseError(err), { variant: 'error' }))
  }, [tournamentId])

  async function forward () {
    await moveQueueForward(tournamentId)
    storeQueueAndSlotNumber(tournamentId)
  }

  async function backward () {
    await moveQueueBackward(tournamentId)
    storeQueueAndSlotNumber(tournamentId)
  }

  async function jumpToSlot (slotNumber: number) {
    await setTournamentQueue(tournamentId, slotNumber)
    storeQueueAndSlotNumber(tournamentId)
  }

  async function changeMode (mode: TournamentQueueMode) {
    const q = await setTournamentQueueMode(tournamentId, mode)
    if (q) {
      storeQueue({ ...queue, mode })
    }
  }

  async function storeQueueAndSlotNumber (tournamentId: string) {
    const q = await getTournamentQueue(tournamentId)
    storeQueue({ ...q })
    setSlotNumber(q.slotNumber)
    // set status as well for immediate feedback
    setJudgeStatus(q.status ? q.status : [])
  }

  function getTournamentName (tournamentId: string) {
    if (!tournaments) return ''
    return tournaments.find((t) => t.id === tournamentId)?.tournamentName || ''
  }

  const classes = {
    queueElements: { p: 2, border: '1px dashed grey', borderRadius: 1 }
  }

  const modes = {
    normal: 'Normal',
    pause: 'Pause für Alle',
    reset: 'Zeige Reset Screen'
  }

  return (
    <Container>
      <form>
        <Typography variant={'h4'} sx={{ marginTop: '22px', textAlign: 'center' }}>
          Turnier Queue Dashboard
        </Typography>

        <FormControl fullWidth margin="normal">
          <InputLabel id="tournamentId">Wettkampf</InputLabel>
          <Select
            labelId="tournamentId"
            value={tournamentId}
            label="Wettkampf"
            onChange={(e) => setTournamentId(e.target.value)}
          >
            {tournaments.map((tournament) => (
              <MenuItem key={tournament.id} value={tournament.id}>
                {tournament.tournamentName}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Stack
          sx={{ marginBottom: '10px' }}
          direction={{ xs: 'row', sm: 'row' }}
          spacing={{ xs: 1, sm: 2, md: 4 }}
          justifyContent="center"
          alignItems="center"
        >
          <Box component="span" sx={classes.queueElements} onClick={backward}>
            <List>
              <ListItem>
                <Button>
                  <ArrowBackIosRounded /> Zurück
                </Button>
              </ListItem>
            </List>
          </Box>
          <Box component="span" sx={{ ...classes.queueElements, borderColor: theme.palette.primary.main }}>
            <List>
              <ListItem>
                <TextField
                  label="Number"
                  type="number"
                  value={slotNumber}
                  inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                  onChange={(e) => setSlotNumber(parseInt(e.target.value))}
                />
                <Button sx={{ marginLeft: '10px' }} onClick={() => jumpToSlot(slotNumber)}>
                  Go
                </Button>
              </ListItem>
            </List>
          </Box>

          <Box component="span" sx={classes.queueElements} onClick={forward}>
            <List>
              <ListItem>
                <Button>
                  Vorwärts <ArrowForwardIosRounded />
                </Button>
              </ListItem>
            </List>
          </Box>
        </Stack>

        {admin &&
          <Box
            component="div"
            sx={{ ...classes.queueElements, marginBottom: '10px' }}
          >
            <h2>Modus</h2>
            <Stack
              sx={{ marginBottom: '10px' }}
              direction={{ xs: 'row', sm: 'row' }}
              spacing={{ xs: 1, sm: 2, md: 4 }}
              justifyContent="center"
              alignItems="center"
            >
              <div style={{
                display: 'flex',
                flexFlow: 'row wrap',
                justifyContent: 'center'
              }}>
              {Object.entries(modes)?.map(([mode, modeText], i) => (
                <Box
                  key={i}
                  component="span"
                  sx={{ textAlign: 'center', justifyItems: 'center', minWidth: '40px', padding: '5px', margin: '5px', whiteSpace: 'nowrap' }}
                  style={{
                    backgroundColor: mode === queue.mode ? theme.palette.success.main : theme.palette.primary.main,
                    color: theme.palette.primary.contrastText,
                    ...classes.queueElements
                  }}
                >
                  <div onClick={() => changeMode(mode as TournamentQueueMode)}>
                    {modeText}
                  </div>

                </Box>
              ))}
              </div>

            </Stack>
          </Box>
        }

        <Box
          component="div"
          sx={{ ...classes.queueElements, marginBottom: '10px', borderColor: theme.palette.primary.main }}
        >
          <h2>Aktuell</h2>
          <Stack
            sx={{ marginBottom: '10px' }}
            direction={{ xs: 'row', sm: 'row' }}
            spacing={{ xs: 1, sm: 2, md: 4 }}
            justifyContent="center"
            alignItems="center"
          >
            <div style={{
              display: 'flex',
              flexFlow: 'row wrap',
              justifyContent: 'center'
            }}>
            {judgeStatus && sortBy(judgeStatus, 'judgeId').map((s, i) => (
              <Box
                key={i}
                component="span"
                sx={{ textAlign: 'center', justifyItems: 'center', minWidth: '40px', padding: '5px', margin: '5px', whiteSpace: 'nowrap' }}
                style={{
                  backgroundColor: s.sent ? theme.palette.success.main : theme.palette.primary.main,
                  color: theme.palette.primary.contrastText,
                  ...classes.queueElements
                }}
              >
                {admin
                  ? (
                  <Link
                    target={'_blank'}
                    to={`/judging/start?tournamentName=${getTournamentName(tournamentId)}&id=${s.judgeId}&admin=true`}
                    style={{ color: theme.palette.primary.contrastText, textDecoration: 'none' }}
                  >
                    {s.judgeId} {s.criteriaName}
                  </Link>
                    )
                  : (
                  <>{s.judgeId}</>
                    )}
              </Box>
            ))}
            </div>

          </Stack>
          <TournamentPlanItems items={plan.filter((p) => p.slotNumber === queue.slotNumber)} />
        </Box>

        <Box component="div" sx={{ ...classes.queueElements, marginBottom: '10px' }}>
          <h2>Nächste</h2>
          <TournamentPlanItems
            items={plan.filter((p) => p.slotNumber >= queue.slotNumber + 1 && p.slotNumber <= queue.slotNumber + 5)}
          />
        </Box>
      </form>
    </Container>
  )
}
