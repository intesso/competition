import {
  Button,
  Container,
  Fab,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography
} from '@mui/material'
import { useContext, useEffect, useState } from 'react'
import { ApiContext } from '../../contexts/ApiContext'
import { TorunamentAthlete, Tournament } from '../../contexts/ApiContextInterface'
import AddIcon from '@mui/icons-material/Add'
// import EditIcon from '@mui/icons-material/Edit'
// import SaveIcon from '@mui/icons-material/Save'
import DeleteIcon from '@mui/icons-material/Delete'
import SendIcon from '@mui/icons-material/Send'
import { useSnackbar } from 'notistack'
import { parseError } from '../../lib/common'

export function AddPerformer () {
  const { listTournaments, listTournamentAthletes, addPerformer } = useContext(ApiContext)

  const { enqueueSnackbar } = useSnackbar()
  const [tournaments, setTournaments] = useState([] as Tournament[])
  const [tournamentId, setTournamentId] = useState('')
  const [performerName, setPerformerName] = useState('')
  const [athletes, setAthletes] = useState([] as TorunamentAthlete[])
  const [selectedAthletes, setSelectedAthletes] = useState([] as (TorunamentAthlete | null)[])
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [editing, _setEditing] = useState(true)

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
        const l = await listTournamentAthletes(tournamentId)
        setAthletes(l)
      }
    }
    fetchData().catch((err) => enqueueSnackbar(parseError(err), { variant: 'error' }))
  }, [tournamentId])

  useEffect(() => {
    if (!editing && tournamentId && performerName) {
      /** */
    }
  }, [editing])

  function handleSend () {
    addPerformer({
      tournamentId,
      performerName,
      tournamentAthletes: selectedAthletes.filter((athlete) => athlete)
    })
      .then(() => enqueueSnackbar('Done', { variant: 'success' }))
      .catch((err) => enqueueSnackbar(parseError(err), { variant: 'error' }))
  }

  function addSelectedAthlete () {
    setSelectedAthletes([...selectedAthletes, null])
  }

  function updateSelectedAthletes (athleteId: string, index: number) {
    const selectedAthlete = athletes.find((a) => a.id === athleteId)
    if (selectedAthlete) {
      selectedAthletes[index] = selectedAthlete
      setSelectedAthletes([...selectedAthletes])
    }
  }

  async function removeSelectedAthlete (index: number) {
    selectedAthletes.splice(index, 1)
    setSelectedAthletes([...selectedAthletes])
  }

  return (
    <Container>
      <form>
        <Typography variant={'h4'} sx={{ marginTop: '22px', textAlign: 'center' }}>
          Performer verwalten
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
          label="Performer Name"
          value={performerName}
          onChange={(e) => setPerformerName(e.target.value)}
        />

        {selectedAthletes.map((selectedAthlete, index) => (
          <FormControl key={index} fullWidth margin="normal" variant="outlined">
            <InputLabel htmlFor={'athlete-' + index.toString()}>Athlet</InputLabel>

            <Select
              labelId={'athlete-' + index.toString()}
              value={selectedAthlete?.id}
              label="Athlet"
              onChange={(e) => updateSelectedAthletes(e.target.value, index)}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    disabled={!editing}
                    aria-label="delete"
                    onClick={() => removeSelectedAthlete(index)}
                    edge="end"
                  >
                    <DeleteIcon />
                  </IconButton>
                </InputAdornment>
              }
            >
              {athletes.map((athlete) => (
                <MenuItem key={athlete.id} value={athlete.id}>
                  {athlete.firstName} {athlete.lastName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        ))}

        <Stack spacing={1} direction="row" margin="normal" justifyContent={'flex-end'}>
          {editing && (
            <Fab color="primary" aria-label="add" onClick={() => addSelectedAthlete()}>
              <AddIcon />
            </Fab>
          )}

          {/* <Fab color="secondary" aria-label="save-edit" onClick={() => setEditing((v) => !v)}>
            {editing ? <SaveIcon /> : <EditIcon />}
          </Fab> */}
        </Stack>

        <FormControl fullWidth margin="normal">
          <Button variant="contained" fullWidth={true} endIcon={<SendIcon />} onClick={handleSend}>
            Senden
          </Button>
        </FormControl>
      </form>
    </Container>
  )
}
