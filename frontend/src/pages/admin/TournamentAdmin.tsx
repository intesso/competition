import {
  Box,
  Button,
  Container,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Switch,
  Typography,
  useTheme
} from '@mui/material'
import { useContext, useEffect, useState } from 'react'
import { ApiContext, getEnvVariables } from '../../contexts/ApiContext'
import { Tournament, Performance } from '../../contexts/ApiContextInterface'
import { useSnackbar } from 'notistack'
import { dedupe, parseError, snakeToPascal } from '../../lib/common'
import { useLocalStorage } from 'usehooks-ts'
import { useSearchParams } from 'react-router-dom'
import axios from 'axios'
import { Dictionary, keyBy } from 'lodash'

export function TournamentAdmin () {
  const {
    listTournaments,
    listPerformances,
    disqualifyPerformance,
    calculateAllPoints,
    calculateAllCategoryRanks,
    calculateAllCombinationRanks,
    deleteAllCalculations
  } = useContext(ApiContext)
  const theme = useTheme()
  const { enqueueSnackbar } = useSnackbar()
  const [searchParams] = useSearchParams()
  const admin = searchParams.get('admin')
  const [tournaments, setTournaments] = useState([] as Tournament[])
  const [tournamentId, setTournamentId] = useLocalStorage('tournamentId', '')
  const [performances, setPerformances] = useState([] as Performance[])
  const [performanceLookup, setPerformanceLookup] = useState({} as Dictionary<Performance>)
  const [performanceId, setPerformanceId] = useLocalStorage('performanceId', '')
  const [disqualified, setDisqualified] = useState(false)

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
        const p = await listPerformances(tournamentId)
        setPerformances(p)
        setPerformanceLookup(keyBy(p, 'id'))
      }
    }
    fetchData().catch((err) => enqueueSnackbar(parseError(err), { variant: 'error' }))
  }, [tournamentId, disqualified])

  useEffect(() => {
    const fetchData = async () => {
      if (performanceLookup[performanceId]) {
        setDisqualified(performanceLookup[performanceId].disqualified || false)
      }
    }
    fetchData().catch((err) => enqueueSnackbar(parseError(err), { variant: 'error' }))
  }, [performanceLookup, performanceId])

  const colHeight = 200

  const classes = {
    queueElements: { p: 2, border: '1px dashed grey', borderRadius: 1 },
    styledButton: {
      width: '100%',
      minHeight: `${colHeight}px`
    }
  }

  // DANGEROUS apis are listed only here
  const { serverAddress } = getEnvVariables()
  const serverBaseUrl = serverAddress
  const headers = {}

  async function deleteTournamentQueueDANGER (tournamentId: string) {
    return (
      await axios({
        headers,
        url: `${serverBaseUrl}/api/tournaments/${tournamentId}/queue/DANGER`,
        method: 'DELETE'
      })
    ).data
  }

  async function deleteAllPointsDANGER (tournamentId: string) {
    return (
      await axios({
        headers,
        url: `${serverBaseUrl}/api/tournaments/${tournamentId}/points/DANGER`,
        method: 'DELETE'
      })
    ).data
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async function handleDisqualified (_checked: boolean) {
    if (tournamentId && performanceId) {
      const newDisqualified = !disqualified
      setDisqualified(newDisqualified)
      disqualifyPerformance(tournamentId, performanceId, newDisqualified)
    }
  }

  return (
    <Container>
      <form>
        <Typography variant={'h4'} sx={{ marginTop: '22px', textAlign: 'center' }}>
          Turnier Admin Dashboard
        </Typography>

        {tournaments.length > 0 &&
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
        }

        <Grid container spacing={4} sx={{ marginTop: '10px' }}>
          <Grid item xs={6}>
            <Button
              style={classes.styledButton}
              variant="outlined"
              onClick={() => {
                calculateAllPoints(tournamentId)
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
                calculateAllCategoryRanks(tournamentId)
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
                calculateAllCombinationRanks(tournamentId)
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
                deleteAllCalculations(tournamentId)
              }}
              sx={{ color: theme.palette.warning.main }}
            >
              <div>
              <h2>DELETE all Calculations</h2>
              <h3> *** Raw Points are not touched ***</h3>
              <h3>you can always recalculate the Results</h3>
              </div>
            </Button>
          </Grid>

          {admin && (
            <Grid item xs={12}>
              <Button
                style={classes.styledButton}
                variant="outlined"
                onClick={() => {
                  deleteAllPointsDANGER(tournamentId)
                }}
                sx={{ color: theme.palette.error.main }}
              >
                <div>
                <h2>DANGER DELETE all Points</h2>
                <h3>!!! including the raw points !!!</h3>
                <h3>!!! there is no way back !!!</h3>
                </div>
              </Button>
            </Grid>
          )}

          {admin && (
            <Grid item xs={12}>
              <Button
                style={classes.styledButton}
                variant="outlined"
                onClick={() => {
                  deleteTournamentQueueDANGER(tournamentId)
                }}
                sx={{ color: theme.palette.error.main }}
              >
                <div>
                  <h2>DANGER DELETE Tournament Queue History</h2>
                  <h3>basically resets the current queue</h3>
                  <h3>!!! there is no way back !!!</h3>
                </div>

              </Button>
            </Grid>
          )}

          {performanceLookup && Object.keys(performanceLookup).length && (
            <Grid item xs={12}>
              <FormControl fullWidth margin="normal">
                <InputLabel id="performanceId">Performance</InputLabel>
                <Select
                  labelId="performanceId"
                  value={performanceId}
                  label="Performance"
                  onChange={(e) => setPerformanceId(e.target.value)}
                >
                  {performances.map((performance) => (
                    <MenuItem key={performance.id} value={performance.id}>
                      {performance.slotNumber} | {dedupe(snakeToPascal(performance.performanceName || ''))}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          )}

          <Grid item xs={12}>
            {performanceLookup && performanceLookup[performanceId] && (
              <Stack
                sx={{ marginBottom: '10px' }}
                direction={{ xs: 'row', sm: 'row' }}
                spacing={{ xs: 1, sm: 2, md: 4 }}
                justifyContent="center"
                alignItems="center"
              >
                <Box component='div'>
                  Disqualifiziert
                </Box>
                <Switch
                  checked={disqualified}
                  onChange={(event) => handleDisqualified(event.target.checked)}
                  inputProps={{ 'aria-label': 'inputType' }}
                />
              </Stack>
            )}
          </Grid>

        </Grid>

      </form>
    </Container>
  )
}
