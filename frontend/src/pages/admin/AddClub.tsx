import { Button, Container, FormControl, TextField, Typography } from '@mui/material'
import { useContext, useState } from 'react'
import SendIcon from '@mui/icons-material/Send'
import { ApiContext } from '../../contexts/ApiContext'
import { Address, Club } from '../../contexts/ApiContextInterface'
import { EditAddress } from '../../components/EditAddress'
import { parseError } from '../../lib/common'
import { useSnackbar } from 'notistack'

export function AddClub () {
  const { addClub } = useContext(ApiContext)
  const { enqueueSnackbar } = useSnackbar()
  const [address, setAddress] = useState({} as Address)
  const [clubName, setClubName] = useState('')
  const [associationId, setAssociationId] = useState('')

  function handleSend () {
    const club: Club = {
      ...address,
      clubName,
      associationId
    }
    addClub(club)
      .then(() => enqueueSnackbar('Done', { variant: 'success' }))
      .catch((err) => enqueueSnackbar(parseError(err), { variant: 'error' }))
  }

  return (
    <Container>
      <form>
        <Typography variant={'h4'} sx={{ marginTop: '22px', textAlign: 'center' }}>
          Club hinzufügen
        </Typography>

        <TextField
          fullWidth={true}
          margin="normal"
          required
          label="Club Name"
          value={clubName}
          onChange={(e) => setClubName(e.target.value)}
        />
        <TextField
          fullWidth={true}
          margin="normal"
          label="Assoziation Nummer"
          value={associationId}
          onChange={(e) => setAssociationId(e.target.value)}
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
