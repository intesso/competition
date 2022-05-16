import { Button, Container, TextField, Typography } from '@mui/material'

export function Form () {
  return (
    <Container>
    <form>
      <Typography variant='h2'>Form Input</Typography>
        <TextField
          fullWidth={true}
          required
          label="Judge"
          defaultValue=""
          margin="normal"
        />
        <TextField
          fullWidth={true}
          label="Score"
          type="number"
          margin="normal"
          // InputLabelProps={{
          //   shrink: true
          // }}
        />
        <Button variant="contained" fullWidth={true} >Send</Button>
    </form>
    </Container>

  )
}
