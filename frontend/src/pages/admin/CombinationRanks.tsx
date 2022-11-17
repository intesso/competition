import { Container, FormControl, InputLabel, MenuItem, Select, Typography } from '@mui/material'
import { useContext, useEffect, useState } from 'react'
import { ApiContext } from '../../contexts/ApiContext'
import { ReportFormat, Tournament } from '../../contexts/ApiContextInterface'
import { useSnackbar } from 'notistack'
import { parseError } from '../../lib/common'
import { useLocalStorage } from 'usehooks-ts'
import { beautifyCombinationRank } from '../../lib/reportUtils'
import { RanksReport } from '../../components/Report'
import { useSearchParams } from 'react-router-dom'

export function CombinationRanks () {
  const { listTournaments, getCombinationRanks } = useContext(ApiContext)
  const { enqueueSnackbar } = useSnackbar()
  const [searchParams] = useSearchParams()
  const json = searchParams.get('json')
  const [tournaments, setTournaments] = useState([] as Tournament[])
  const [tournamentId, setTournamentId] = useLocalStorage('tournamentId', '')
  const [combinationRanks, setCombinationRanks] = useState({} as ReportFormat)

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
        const r = await getCombinationRanks(tournamentId)
        setCombinationRanks(r)
      }
    }
    fetchData().catch((err) => enqueueSnackbar(parseError(err), { variant: 'error' }))
  }, [tournamentId])

  return (
    <Container>
      <form>
        <Typography variant={'h4'} sx={{ marginTop: '22px', textAlign: 'center' }}>
          Kombinationen Rangliste
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
      </form>

      {json
        ? (
        <pre>{JSON.stringify(beautifyCombinationRank(combinationRanks), null, 2)}</pre>
          )
        : (
        <RanksReport items={beautifyCombinationRank(combinationRanks)} />
          )}
    </Container>
  )
}
