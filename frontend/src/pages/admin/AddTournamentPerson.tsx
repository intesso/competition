import { Button, Container, FormControl, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material'
import { DatePicker } from '@mui/x-date-pickers'
import { useContext, useEffect, useState } from 'react'
import { DateTime } from 'luxon'
import SendIcon from '@mui/icons-material/Send'
import { ApiContext } from '../../contexts/ApiContext'
import { Person, Tournament, TournamentPerson } from '../../contexts/ApiContextInterface'
import { parseError } from '../../lib/common'
import { useSnackbar } from 'notistack'

interface AddTournamentPersonProps {
  role: 'tournamentAthlete' | 'tournamentJudge'
}

type RoleActions = {
  // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-explicit-any
  [key in AddTournamentPersonProps['role']]: () => any;
};

export function AddTournamentPerson ({ role }: AddTournamentPersonProps) {
  const { listTournaments, addTournamentAthlete, addTournamentJudge } = useContext(ApiContext)
  const { enqueueSnackbar } = useSnackbar()
  const [tournaments, setTournaments] = useState([] as Tournament[])
  const [tournamentId, setTournamentId] = useState('')

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [gender, setGender] = useState('')
  const [birthDate, setBirthDate] = useState<DateTime>(DateTime.now())

  useEffect(() => {
    const fetchData = async () => {
      const t = await listTournaments()
      setTournaments(t)
    }
    fetchData().catch((err) => enqueueSnackbar(parseError(err), { variant: 'error' }))
  }, [])

  function handleSend () {
    const person: TournamentPerson = {
      tournamentId,
      firstName,
      lastName,
      gender: gender as Person['gender'],
      birthDate: birthDate?.toISODate()
    }
    const roleActions: RoleActions = {
      tournamentAthlete: async () =>
        await addTournamentAthlete(person)
          .then(() => enqueueSnackbar('Done', { variant: 'success' }))
          .catch((err) => enqueueSnackbar(parseError(err), { variant: 'error' })),
      tournamentJudge: async () =>
        await addTournamentJudge(person)
          .then(() => enqueueSnackbar('Done', { variant: 'success' }))
          .catch((err) => enqueueSnackbar(parseError(err), { variant: 'error' }))
    }
    roleActions[role]()
  }

  return (
    <Container>
      <form>
        <Typography variant={'h4'} sx={{ marginTop: '22px', textAlign: 'center' }}>
          {getRoleName(role)} hinzufügen
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

        <TextField
          fullWidth={true}
          margin="normal"
          required
          label="Vorname"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />
        <TextField
          fullWidth={true}
          margin="normal"
          required
          label="Nachname"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />
        <FormControl fullWidth margin="normal">
          <InputLabel id="demo-simple-select-label">Geschlecht</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={gender}
            label="Geschlecht"
            onChange={(e) => setGender(e.target.value)}
          >
            <MenuItem value={'male'}>Männlich</MenuItem>
            <MenuItem value={'female'}>Weiblich</MenuItem>
            <MenuItem value={'diverse'}>Divers</MenuItem>
            <MenuItem value={'unknown'}>keine Angabe</MenuItem>
          </Select>
        </FormControl>
        <DatePicker
          label="Geburtsdatum"
          PopperProps={{
            placement: 'auto'
          }}
          DialogProps={{ sx: { marginTop: '40px' } }}
          value={birthDate}
          onChange={(newValue) => {
            if (newValue) {
              setBirthDate(newValue)
            }
          }}
          renderInput={(params) => <TextField {...params} fullWidth={true} margin="normal" />}
        />
        <FormControl fullWidth margin="normal">
          <Button variant="contained" fullWidth={true} endIcon={<SendIcon />} onClick={handleSend}>
            Senden
          </Button>
        </FormControl>
      </form>
    </Container>
  )
}

function getRoleName (role: AddTournamentPersonProps['role']) {
  switch (role) {
    case 'tournamentAthlete':
      return 'Athlet'
    case 'tournamentJudge':
      return 'Jury'
  }
}
