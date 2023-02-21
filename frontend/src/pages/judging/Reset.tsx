import { useSearchParams } from 'react-router-dom'
import { Box } from '@mui/system'
import { Button } from '@mui/material'

export function Reset () {
  const [searchParams] = useSearchParams()
  const judgeId = searchParams.get('judgeId') || searchParams.get('id') || ''

  return (
    <>
      <Box sx={{ textAlign: 'center' }}>
        <h1>Reset Wertungen (lokal)</h1>
        <h4>JudgeId: {judgeId}</h4>
      </Box>
      <Box sx={{ textAlign: 'center' }}>
        <Button
          variant="outlined"
          onClick={() => {
            window.localStorage.clear()
          }}
        >
          <h2>Reset Lokaler Zustand</h2>
        </Button>
      </Box>
      <Box sx={{ textAlign: 'center' }}>
        <h4>Achtung: alle nicht gesendeten Daten gehen verloren!</h4>
      </Box>
    </>
  )
}
