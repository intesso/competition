import { Container, FormControl, InputLabel, MenuItem, Select, Typography } from '@mui/material'
import { useContext, useEffect, useState } from 'react'
import { DataGrid, GridColDef, GridRenderCellParams, GridRowHeightParams, GridValueGetterParams } from '@mui/x-data-grid'
import { ApiContext } from '../../contexts/ApiContext'
import { PerformanceJudge, Tournament, TournamentPlanDetails } from '../../contexts/ApiContextInterface'
import { useSnackbar } from 'notistack'
import { parseError } from '../../lib/common'

export function ListTournamentPlan () {
  const { listTournaments, listTournamentPlan } = useContext(ApiContext)

  const { enqueueSnackbar } = useSnackbar()
  const [tournaments, setTournaments] = useState([] as Tournament[])
  const [tournamentId, setTournamentId] = useState('')
  const [plan, setPlan] = useState([] as TournamentPlanDetails[])

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
        const p = await listTournamentPlan(tournamentId)
        setPlan(p)
      }
    }
    fetchData().catch((err) => enqueueSnackbar(parseError(err), { variant: 'error' }))
  }, [tournamentId])

  function getColumns (): GridColDef[] {
    return [
      {
        field: '#',
        headerName: '#',
        description: '',
        sortable: false,
        width: 40,
        valueGetter: (params: GridValueGetterParams) => `${params.row.slotNumber}-${params.row.locationName}`
      },
      {
        field: 'slotNumber',
        headerName: 'slotNumber',
        description: '',
        type: 'number',
        sortable: false,
        width: 160
      },
      {
        field: 'locationName',
        headerName: 'locationName',
        description: '',
        sortable: false,
        width: 160
      },
      {
        field: 'categoryName',
        headerName: 'categoryName',
        description: '',
        sortable: false,
        width: 300
      },
      {
        field: 'performerName',
        headerName: 'performerName',
        description: '',
        sortable: false,
        width: 200
      },
      {
        field: 'performerNumber',
        headerName: 'performerNumber',
        description: '',
        sortable: false,
        type: 'number',
        width: 160
      },
      {
        field: 'clubName',
        headerName: 'clubName',
        description: '',
        sortable: false,
        width: 200
      },
      {
        field: 'performanceName',
        headerName: 'performanceName',
        description: '',
        sortable: false,
        width: 300
      },
      {
        field: 'judges',
        headerName: 'judges',
        description: '',
        sortable: false,
        width: 260,
        renderCell: (params: GridRenderCellParams<PerformanceJudge[]>) => (
          <table>
            <tbody>
            {params.value?.map((judge, i) => (
            <tr key={i}>
              <td>{judge.judgeDevice}</td>
              <td>{judge.judgeName}</td>
              <td>{judge.criteriaName}</td>
            </tr>
            ))}
            </tbody>

          </table>
        )
      }
    ]
  }

  function getRows () {
    if (!plan || plan.length < 1) return []
    return plan.map((it, i) => ({ ...it, id: i }))
  }

  function getRowHeight (_params: GridRowHeightParams) {
    return 80
  }

  return (
    <Container>
      <form>
        <Typography variant={'h4'} sx={{ marginTop: '22px', textAlign: 'center' }}>
          Turnier Plan anzeigen
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

        <div style={{ height: 400, width: '100%' }}>
          <DataGrid rows={getRows()} columns={getColumns()} getRowHeight={getRowHeight} pageSize={50} rowsPerPageOptions={[50]} />
        </div>
      </form>
    </Container>
  )
}
