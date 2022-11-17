import { FormControl, InputLabel, MenuItem, Select, Typography } from '@mui/material'
import { useContext, useEffect, useState } from 'react'
import {
  DataGrid,
  GridColDef,
  GridRenderCellParams,
  GridRowHeightParams
} from '@mui/x-data-grid'
import { ApiContext } from '../../contexts/ApiContext'
import { PerformanceJudge, Tournament, TournamentPlanDetails } from '../../contexts/ApiContextInterface'
import { useSnackbar } from 'notistack'
import { parseError } from '../../lib/common'

export function TournamentPlanList () {
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
        field: 'slotNumber',
        headerName: 'slotNumber',
        description: '',
        type: 'number',
        sortable: false,
        width: 100
      },
      {
        field: 'locationName',
        headerName: 'locationName',
        description: '',
        sortable: false,
        width: 110
      },
      {
        field: 'categoryName',
        headerName: 'categoryName',
        description: '',
        sortable: false,
        width: 420
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
        width: 140
      },
      {
        field: 'clubName',
        headerName: 'clubName',
        description: '',
        sortable: false,
        width: 240
      },
      // {
      //   field: 'performanceName',
      //   headerName: 'performanceName',
      //   description: '',
      //   sortable: false,
      //   width: 300
      // },
      {
        field: 'judges',
        headerName: 'judges',
        description: '',
        sortable: false,
        width: 380,
        renderCell: (params: GridRenderCellParams<PerformanceJudge[]>) => (
          <table>
            <tbody>
              {params.value?.map((judge, i) => (
                <tr key={i}>
                  <td>{judge.judgeId}</td>
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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
  function getRowHeight (_params: GridRowHeightParams): any {
    return 'auto'
  }

  return (
    <div style={{ height: 'calc(100vh -  160px)' }}>
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

      {/* <div style={{ width: '100%' }}> */}
        <DataGrid
        // sx={{ height: '1000px' }}
          rows={getRows()}
          columns={getColumns()}
          getRowHeight={getRowHeight}
          pageSize={100}
          rowsPerPageOptions={[1000]}
        />
      {/* </div> */}
    </div>
  )
}
