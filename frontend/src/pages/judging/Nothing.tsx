import { useSearchParams } from 'react-router-dom'
import { Box } from '@mui/system'

export function Nothing () {
  const [searchParams] = useSearchParams()
  const judgeId = searchParams.get('judgeId') || searchParams.get('id')

  return (<>
  <Box sx={{ textAlign: 'center' }}>
    <h1>Pause</h1>
    <h4>JudgeId: {judgeId}</h4>
  </Box>
  </>)
}
