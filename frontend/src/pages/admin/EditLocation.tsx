import {
  Container,
  Fab,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  Stack,
  Typography
} from '@mui/material'
import { useContext, useEffect, useState } from 'react'
import { ApiContext } from '../../contexts/ApiContext'
import { Location, Tournament } from '../../contexts/ApiContextInterface'
import AddIcon from '@mui/icons-material/Add'
import EditIcon from '@mui/icons-material/Edit'
import SaveIcon from '@mui/icons-material/Save'
import DeleteIcon from '@mui/icons-material/Delete'
import { useSnackbar } from 'notistack'
import { parseError } from '../../lib/common'

export function EditLocation () {
  const { listTournaments, listLocations, modifyLocation, addLocation, removeLocation } = useContext(ApiContext)
  const { enqueueSnackbar } = useSnackbar()
  const [tournaments, setTournaments] = useState([] as Tournament[])
  const [tournamentId, setTournamentId] = useState('')
  const [locations, setLocations] = useState([] as Location[])
  const [editing, setEditing] = useState(false)

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
        const l = await listLocations(tournamentId)
        setLocations(l)
      }
    }
    fetchData().catch((err) => enqueueSnackbar(parseError(err), { variant: 'error' }))
  }, [tournamentId])

  useEffect(() => {
    if (!editing) {
      const saveData = async () => {
        for (const location of locations) {
          if (location.id) {
            await modifyLocation(location)
          } else {
            await addLocation(location)
          }
        }
      }
      saveData()
        .then(() => {
          if (tournamentId) {
            listLocations(tournamentId).then((l) => {
              setLocations(l)
            })
          }
        })
        .then(() => enqueueSnackbar('Done', { variant: 'success' }))
        .catch((err) => enqueueSnackbar(parseError(err), { variant: 'error' }))
    }
  }, [editing])

  function addNewLocation () {
    const newLocation: Location = {
      tournamentId,
      locationName: ''
    }
    setLocations([...locations, newLocation])
  }

  function updateLocationName (locationName: string, index: number) {
    locations[index].locationName = locationName
    setLocations([...locations])
  }

  async function deleteLocation (location: Location, index: number) {
    if (location.id) {
      await removeLocation(location)
      const updatedLocations = await listLocations(tournamentId)
      setLocations([...updatedLocations])
    } else {
      locations.splice(index, 1)
      setLocations([...locations])
    }
  }

  return (
    <Container>
      <form>
        <Typography variant={'h4'} sx={{ marginTop: '22px', textAlign: 'center' }}>
          Wettkampf Plätze verwalten
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

        {locations.map((location, index) => (
          <FormControl key={index} fullWidth margin="normal" required variant="outlined">
            <InputLabel htmlFor={'location-' + index.toString()}>Platz Name</InputLabel>
            <OutlinedInput
              disabled={!editing}
              id={'location-' + index.toString()}
              value={location.locationName}
              onChange={(e) => updateLocationName(e.target.value, index)}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    disabled={!editing}
                    aria-label="delete"
                    onClick={() => deleteLocation(location, index)}
                    edge="end"
                  >
                    <DeleteIcon />
                  </IconButton>
                </InputAdornment>
              }
              label="Platz Name"
            />
          </FormControl>
        ))}

        <Stack spacing={1} direction="row" margin="normal" justifyContent={'flex-end'}>
          {editing && (
            <Fab color="primary" aria-label="add" onClick={() => addNewLocation()}>
              <AddIcon />
            </Fab>
          )}

          <Fab color="secondary" aria-label="save-edit" onClick={() => setEditing((v) => !v)}>
            {editing ? <SaveIcon /> : <EditIcon />}
          </Fab>
        </Stack>
      </form>
    </Container>
  )
}
