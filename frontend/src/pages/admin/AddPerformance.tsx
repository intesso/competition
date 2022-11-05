import { Button, Container, FormControl, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material'
import { DateTimePicker } from '@mui/x-date-pickers'
import { useContext, useEffect, useState } from 'react'
import { DateTime } from 'luxon'
import SendIcon from '@mui/icons-material/Send'
import { ApiContext } from '../../contexts/ApiContext'
import { Category, Club, Location, Performer, Tournament } from '../../contexts/ApiContextInterface'
import { parseError, snakeToPascal } from '../../lib/common'
import { useSnackbar } from 'notistack'

export function AddPerformance () {
  const { listTournaments, listLocations, listCategories, listClubs, listPerformer, addPerformance } = useContext(ApiContext)
  const { enqueueSnackbar } = useSnackbar()
  const [tournaments, setTournaments] = useState([] as Tournament[])
  const [tournamentId, setTournamentId] = useState('')
  const [locations, setLocations] = useState([] as Location[])
  const [locationId, setLocationId] = useState('')
  const [categories, setCategories] = useState([] as Category[])
  const [categoryId, setCategoryId] = useState('')
  const [clubs, setClubs] = useState([] as Club[])
  const [clubId, setClubId] = useState('')
  const [performers, setPerformers] = useState([] as Performer[])
  const [performerId, setPerformerId] = useState('')

  const [performanceName, setPerformanceName] = useState('')
  const [performanceNumber, setPerformanceNumber] = useState(null as unknown as number)
  const [performanceStartTime, setPerformanceStartTime] = useState<DateTime>(DateTime.now())

  useEffect(() => {
    const fetchData = async () => {
      const t = await listTournaments()
      setTournaments(t)

      const l = await listCategories()
      setCategories(l)

      const c = await listClubs()
      setClubs(c)
    }
    fetchData().catch((err) => enqueueSnackbar(parseError(err), { variant: 'error' }))
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      if (tournamentId) {
        const l = await listLocations(tournamentId)
        setLocations(l)

        const p = await listPerformer(tournamentId)
        setPerformers(p)
      }
    }
    fetchData().catch((err) => enqueueSnackbar(parseError(err), { variant: 'error' }))
  }, [tournamentId])

  async function handleSend () {
    addPerformance({
      tournamentId,
      categoryId,
      clubId,
      performerId,
      locationId,
      judges: [],
      performanceName,
      // TODO add slotNumber
      slotNumber: null,
      performanceNumber,
      performanceStartTime: performanceStartTime.toISO()
    })
      .then(() => enqueueSnackbar('Done', { variant: 'success' }))
      .catch((err) => enqueueSnackbar(parseError(err), { variant: 'error' }))
  }

  return (
    <Container>
      <form>
        <Typography variant={'h4'} sx={{ marginTop: '22px', textAlign: 'center' }}>
          Performance hinzufügen
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

        <FormControl fullWidth margin="normal">
          <InputLabel id="locationId">Platz</InputLabel>
          <Select labelId="locationId" value={locationId} label="Platz" onChange={(e) => setLocationId(e.target.value)}>
            {locations.map((location) => (
              <MenuItem key={location.id} value={location.id}>
                {location.locationName}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth margin="normal">
          <InputLabel id="categoryId">Kategorie</InputLabel>
          <Select
            labelId="categoryId"
            value={categoryId}
            label="Kategorie"
            onChange={(e) => setCategoryId(e.target.value)}
          >
            {categories.map((category) => (
              <MenuItem key={category.id} value={category.id}>
                {snakeToPascal(category.categoryName)}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth margin="normal">
          <InputLabel id="clubId">Club</InputLabel>
          <Select labelId="clubId" value={clubId} label="Club" onChange={(e) => setClubId(e.target.value)}>
            {clubs.map((club) => (
              <MenuItem key={club.id} value={club.id}>
                {club.clubName}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth margin="normal">
          <InputLabel id="performerId">Performer</InputLabel>
          <Select labelId="performerId" value={performerId} label="Performer" onChange={(e) => setPerformerId(e.target.value)}>
            {performers.map((performer) => (
              <MenuItem key={performer.id} value={performer.id}>
                {performer.performerName}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          fullWidth={true}
          margin="normal"
          label="Performance Name"
          value={performanceName}
          onChange={(e) => setPerformanceName(e.target.value)}
        />
        <TextField
          fullWidth={true}
          margin="normal"
          label="Performance Nummer"
          value={performanceNumber}
          onChange={(e) => setPerformanceNumber(parseInt(e.target.value))}
        />

        <DateTimePicker
          label="Performance Start"
          PopperProps={{
            placement: 'auto'
          }}
          DialogProps={{ sx: { marginTop: '40px' } }}
          minutesStep={1}
          value={performanceStartTime}
          onChange={(newValue) => {
            if (newValue) {
              setPerformanceStartTime(newValue)
            }
          }}
          renderInput={(params) => <TextField {...params} fullWidth={true} margin="normal" />}
        />

        <FormControl fullWidth margin="normal">
          <div>Note: Slot noch nicht implementiert</div>
        </FormControl>

        <FormControl fullWidth margin="normal">
          <Button variant="contained" fullWidth={true} endIcon={<SendIcon />} onClick={handleSend}>
            Senden
          </Button>
        </FormControl>
      </form>
    </Container>
  )
}
