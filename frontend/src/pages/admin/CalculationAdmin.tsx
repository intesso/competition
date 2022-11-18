import {
  Button,
  Container,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Typography,
  useTheme
} from '@mui/material'
import { useContext, useEffect, useState } from 'react'
import { ApiContext } from '../../contexts/ApiContext'
import {
  Tournament,
  TournamentPlanDetails,
  TournamentQueue,
  TournamentQueueStatus
} from '../../contexts/ApiContextInterface'
import { useSnackbar } from 'notistack'
import { parseError } from '../../lib/common'
import { useLocalStorage } from 'usehooks-ts'
import { sortBy } from 'lodash-es'
import { useSearchParams } from 'react-router-dom'

export function CalculationAdmin () {
  const { listTournaments, listTournamentPlan } = useContext(ApiContext)
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
        const p = await listTournamentPlan(tournamentId)
        setPlan(sortBy(p, 'slotNumber'))
      }
    }
    fetchData().catch((err) => enqueueSnackbar(parseError(err), { variant: 'error' }))
  }, [tournamentId])

  function getTournamentName (tournamentId: string) {
    if (!tournaments) return ''
    return tournaments.find((t) => t.id === tournamentId)?.tournamentName || ''
  }

  const colHeight = 200

  const classes = {
    queueElements: { p: 2, border: '1px dashed grey', borderRadius: 1 },
    styledButton: {
      width: '100%',
      minHeight: `${colHeight}px`
    }
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

        <Grid container spacing={4} sx={{ marginTop: '10px' }}>
          <Grid item xs={6}>
            <Button
              style={classes.styledButton}
              variant="outlined"
              onClick={() => {
                console.log('a')
              }}
            >
              Calculate All Category Points
            </Button>
          </Grid>
          <Grid item xs={6}>
            <Button
              style={classes.styledButton}
              variant="outlined"
              onClick={() => {
                console.log('a')
              }}
            >
              Calculate All Category Ranks
            </Button>
          </Grid>
          <Grid item xs={6}>
            <Button
              style={classes.styledButton}
              variant="outlined"
              onClick={() => {
                console.log('a')
              }}
            >
              Calculate All Combination Ranks
            </Button>
          </Grid>
          <Grid item xs={6}>
            <Button
              style={classes.styledButton}
              variant="outlined"
              onClick={() => {
                console.log('a')
              }}
            >
              <h2>DELETE all Points</h2>
            </Button>
          </Grid>
        </Grid>

        <Stack
          sx={{ marginBottom: '10px' }}
          direction={{ xs: 'row', sm: 'row' }}
          spacing={{ xs: 1, sm: 2, md: 4 }}
          justifyContent="center"
          alignItems="center"
        ></Stack>
      </form>
    </Container>
  )
}
