import { Button, Container, FormControl, TextField, Typography } from '@mui/material'
import { useContext, useState } from 'react'
import SendIcon from '@mui/icons-material/Send'
import { ApiContext } from '../contexts/ApiContext'
import { Address, Tournament } from '../contexts/ApiContextInterface'
import { EditAddress } from '../components/EditAddress'
import { DateTime } from 'luxon'
import { DateTimePicker } from '@mui/x-date-pickers'

export function AddTournament () {
  const { addTournament } = useContext(ApiContext)

  const [address, setAddress] = useState({} as Address)
  const [tournamentName, setTournamentName] = useState('')
  // const [tournamentCoordinates, setTournamentCoordinates] = useState('')
  const [competition, setCompetition] = useState('')
  const [tournamentStartTime, setTournamentStartTime] = useState<DateTime>(DateTime.now())
  const [tournamentEndTime, setTournamentEndTime] = useState<DateTime>(DateTime.now())

  function handleSend () {
    const tournament: Tournament = {
      ...address,
      tournamentName,
      competition,
      tournamentStartTime: tournamentStartTime.toISO(),
      tournamentEndTime: tournamentEndTime.toISO()
    }
    addTournament(tournament)
  }

  return (
    <Container>
      <form>
        <Typography variant={'h4'} sx={{ marginTop: '22px', textAlign: 'center' }}>
          Wettkampf hinzufügen
        </Typography>

        <TextField
          fullWidth={true}
          margin="normal"
          required
          label="Wettkampf Name"
          value={tournamentName}
          onChange={(e) => setTournamentName(e.target.value)}
        />
        <TextField
          fullWidth={true}
          margin="normal"
          label="Wettkampfart"
          value={competition}
          onChange={(e) => setCompetition(e.target.value)}
        />

        <DateTimePicker
          label="Wettkampf Start"
          PopperProps={{
            placement: 'auto'
          }}
          DialogProps={{ sx: { marginTop: '40px' } }}
          minutesStep={15}
          value={tournamentStartTime}
          onChange={(newValue) => {
            if (newValue) {
              setTournamentStartTime(newValue)
            }
          }}
          renderInput={(params) => <TextField {...params} fullWidth={true} margin="normal" required />}
        />

        <DateTimePicker
          label="Wettkampf Ende"
          PopperProps={{
            placement: 'auto'
          }}
          DialogProps={{ sx: { marginTop: '40px' } }}
          minutesStep={15}
          value={tournamentEndTime}
          onChange={(newValue) => {
            if (newValue) {
              setTournamentEndTime(newValue)
            }
          }}
          renderInput={(params) => <TextField {...params} fullWidth={true} margin="normal" required />}
        />

        <EditAddress onUpdate={setAddress}></EditAddress>

        <FormControl fullWidth margin="normal">
          <Button variant="contained" fullWidth={true} endIcon={<SendIcon />} onClick={handleSend}>
            Senden
          </Button>
        </FormControl>
      </form>
    </Container>
  )
}
