import { Container, FormControl, InputLabel, MenuItem, Select, Typography } from '@mui/material'
import { useContext, useEffect, useState } from 'react'
import { ApiContext } from '../../contexts/ApiContext'
import { CategoryPointDetails, Tournament } from '../../contexts/ApiContextInterface'
import { useSnackbar } from 'notistack'
import { parseError } from '../../lib/common'
import { useLocalStorage } from 'usehooks-ts'
import { beautifyCategoryPoint } from '../../lib/reportUtils'
import { useSearchParams } from 'react-router-dom'
import { PointsReport } from '../../components/PointsReport'

export function CategoryPoints () {
  const { listTournaments, getCategoryPoints } = useContext(ApiContext)
  const { enqueueSnackbar } = useSnackbar()
  const [searchParams] = useSearchParams()
  const json = searchParams.get('json')
  const [tournaments, setTournaments] = useState([] as Tournament[])
  const [tournamentId, setTournamentId] = useLocalStorage('tournamentId', '')
  const [categoryPoints, setCategoryPoints] = useState({} as CategoryPointDetails)

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
        const r = await getCategoryPoints(tournamentId)
        setCategoryPoints(r)
      }
    }
    fetchData().catch((err) => enqueueSnackbar(parseError(err), { variant: 'error' }))
  }, [tournamentId])

  return (
    <Container maxWidth={false}>
      <form>
        <Typography variant={'h4'} sx={{ marginTop: '22px', textAlign: 'center' }}>
          Kategorie Punkte
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
          <pre>{JSON.stringify(beautifyCategoryPoint(categoryPoints), null, 2)}</pre>
          )
        : (
          <PointsReport items={beautifyCategoryPoint(categoryPoints)} />
          )}
    </Container>
  )
}
