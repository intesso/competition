import { TournamentPlanDetails } from '../contexts/ApiContextInterface'

import CategoryIcon from '@mui/icons-material/Category'
import PeopleAltIcon from '@mui/icons-material/PeopleAlt'
import TableRowsIcon from '@mui/icons-material/TableRows'
import PlaceIcon from '@mui/icons-material/Place'
import GavelIcon from '@mui/icons-material/Gavel'
import { Tooltip } from '@mui/material'
import { getCategoryTitle } from '../lib/reportUtils'

export interface TournamentPlanProps {
  items: TournamentPlanDetails[]
}

export function TournamentPlanItems ({ items }: TournamentPlanProps) {
  return (
    <>
      {items && items.length > 0 && (
        <table width="100%">
          <thead style={{ textAlign: 'left' }}>
            <tr>
              <th>
                <TableRowsIcon />
              </th>
              <th>
                <PlaceIcon />
              </th>
              <th>
                <PeopleAltIcon />
              </th>
              <th>
                <CategoryIcon />
              </th>
              <th>
                <GavelIcon />
              </th>
            </tr>
          </thead>
          <tbody>
            {items.map((it, i) => (
              <tr key={i}>
                <td>{it.slotNumber}</td>
                <td>{it.locationName}</td>
                <td>{`${it.performerName} | ${it.performerNumber}`}</td>
                <td>{getCategoryTitle(it.categoryName)}</td>
                <td>
                  <Tooltip
                    title={
                      <table>
                        <tbody>
                        {it.judges.map((judge, j) => (
                          <tr key={j}>
                            <td>{judge.judgeId}</td>
                            <td>{judge.judgeName}</td>
                            <td>{judge.criteriaName}</td>
                          </tr>
                        ))}
                        </tbody>
                      </table>
                    }
                    disableInteractive
                  >
                    <span>{it.judges.map((j) => j.judgeId).join('|')}</span>
                  </Tooltip>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  )
}
