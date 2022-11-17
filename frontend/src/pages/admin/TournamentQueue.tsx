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
import { Tournament, TournamentPlanDetails, TournamentQueue } from '../../contexts/ApiContextInterface'
import { useSnackbar } from 'notistack'
import { parseError } from '../../lib/common'
import { useLocalStorage } from 'usehooks-ts'
import ArrowBackIosRounded from '@mui/icons-material/ArrowBackIosRounded'
import ArrowForwardIosRounded from '@mui/icons-material/ArrowForwardIosRounded'
import { sortBy } from 'lodash-es'
import { TournamentPlanItems } from '../../components/TournamentPlanItems'

export function TournamentQueueDashboard () {
  const { listTournaments, listTournamentPlan, moveQueueBackward, moveQueueForward, setQueue, getQueue } =
    useContext(ApiContext)
  const theme = useTheme()
  const { enqueueSnackbar } = useSnackbar()
  const [tournaments, setTournaments] = useState([] as Tournament[])
  const [tournamentId, setTournamentId] = useLocalStorage('tournamentId', '')
  const [queue, storeQueue] = useState({} as TournamentQueue)
  const [slotNumber, setSlotNumber] = useState(-1)
  const [plan, setPlan] = useState([] as TournamentPlanDetails[])

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
    await setQueue(tournamentId, slotNumber)
    storeQueueAndSlotNumber(tournamentId)
  }

  async function storeQueueAndSlotNumber (tournamentId: string) {
    const q = await getQueue(tournamentId)
    storeQueue({ ...q })
    setSlotNumber(q.slotNumber)
  }

  const classes = {
    queueElements: { p: 2, border: '1px dashed grey', borderRadius: 1 }
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
            {queue.status?.map((s, i) => (
              <Box
                key={i}
                component="span"
                sx={{ textAlign: 'center', justifyItems: 'center', minWidth: '40px', padding: '5px' }}
                style={{ backgroundColor: s.sent ? theme.palette.primary.main : theme.palette.warning.main }}
              >
                {s.judgeId}
              </Box>
            ))}
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
