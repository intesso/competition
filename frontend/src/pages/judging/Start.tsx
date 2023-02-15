import { createSearchParams, useNavigate, useSearchParams } from 'react-router-dom'
import { Box } from '@mui/system'
import { useContext, useEffect } from 'react'
import { ApiContext } from '../../contexts/ApiContext'
import { useSnackbar } from 'notistack'
import { parseError } from '../../lib/common'

export function Start () {
  const { getCurrentTournamentName, getTournamentByName } = useContext(ApiContext)
  const navigate = useNavigate()
  const { enqueueSnackbar } = useSnackbar()

  const [searchParams] = useSearchParams()
  const judgeId = searchParams.get('judgeId') || searchParams.get('id') || ''
  let tournamentName = searchParams.get('tournamentName') || ''
  const isAdmin = searchParams.get('admin') || ''

  useEffect(() => {
    const fetchData = async () => {
      if (!tournamentName) {
        tournamentName = (await getCurrentTournamentName()).tournamentName
      }
      if (tournamentName) {
        const tournament = await getTournamentByName(tournamentName)
        const nothingPath = '/judging/nothing'
        const params = {
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
        }
        navigate({
          pathname: nothingPath,
          search: `?${createSearchParams(isAdmin ? { ...params, admin: 'true' } : params)}`
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
    </>
  )
}
