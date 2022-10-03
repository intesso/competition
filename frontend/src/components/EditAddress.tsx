import { TextField } from '@mui/material'
import { useState } from 'react'
import { Address } from '../contexts/ApiContextInterface'

export interface EditAddressProps {
  onUpdate: (address: Address) => void
}

export function EditAddress ({ onUpdate }: EditAddressProps) {
  const [street, setStreet] = useState('')
  const [houseNumber, setHouseNumber] = useState('')
  const [zipCode, setZipCode] = useState('')
  const [city, setCity] = useState('')
  const [country, setCountry] = useState('')

  function handleOnUpdate () {
    const address: Address = {
      street,
      houseNumber,
      zipCode,
      city,
      country
    }
    onUpdate(address)
  }

  return (
    <div onChange={handleOnUpdate}>
      <TextField
        fullWidth={true}
        margin="normal"
        required
        label="Strasse"
        value={street}
        onChange={(e) => setStreet(e.target.value)}
      />
      <TextField
        fullWidth={true}
        margin="normal"
        label="Hausnummer"
        value={houseNumber}
        onChange={(e) => setHouseNumber(e.target.value)}
      />
      <TextField
        fullWidth={true}
        margin="normal"
        required
        label="Postleitzahl"
        value={zipCode}
        onChange={(e) => setZipCode(e.target.value)}
      />
      <TextField
        fullWidth={true}
        margin="normal"
        required
        label="Stadt"
        value={city}
        onChange={(e) => setCity(e.target.value)}
      />
      <TextField
        fullWidth={true}
        margin="normal"
        required
        label="Land"
        value={country}
        onChange={(e) => setCountry(e.target.value)}
      />
    </div>
  )
}
