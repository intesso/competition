import { createSearchParams, useNavigate, useSearchParams } from 'react-router-dom'
import { Box } from '@mui/system'
import { useContext, useEffect } from 'react'
import { ApiContext } from '../../contexts/ApiContext'
import { useSnackbar } from 'notistack'
import { parseError } from '../../lib/common'
import { Button } from '@mui/material'

export function Reset () {
  const { getTournamentByName } = useContext(ApiContext)
  const navigate = useNavigate()
  const { enqueueSnackbar } = useSnackbar()

  const [searchParams] = useSearchParams()
  const judgeId = searchParams.get('judgeId') || searchParams.get('id') || ''
  const tournamentName = searchParams.get('tournamentName') || ''

  useEffect(() => {
    const fetchData = async () => {
      if (tournamentName) {
        const tournament = await getTournamentByName(tournamentName)
        const nothingPath = '/judging/nothing'
        navigate({
          pathname: nothingPath,
          search: `?${createSearchParams({
            slotNumber: '',
            locationName: '',
            tournamentId: tournament?.id || '',
            categoryId: '',
            criteriaId: '',
            criteriaName: '',
            tournamentJudgeId: '',
            performanceId: '',
            judgeId,
            judgeName: ''
          })}`
        })
      }
    }
    fetchData().catch((err) => enqueueSnackbar(parseError(err), { variant: 'error' }))
  }, [])

  return (
    <>
      <Box sx={{ textAlign: 'center' }}>
        <h1>Start</h1>
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
    </>
  )
}
