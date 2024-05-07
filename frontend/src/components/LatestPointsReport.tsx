/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react'
import { ReportItemFormat } from '../contexts/ApiContextInterface'

export interface LatestPointsReportProps {
  items: ReportItemFormat[]
}

const cols = 20

const classes = {
  mainTable: {
    backgroundColor: 'white',
    color: 'black',
    borderCollapse: 'collapse'
  } as any,
  emptyCell: {
    paddingTop: '10px',
    paddingBottom: '10px'
  } as any,

  tLeft: {
    textAlign: 'left'
  } as any,
  tCenter: {
    textAlign: 'center'
  } as any,

  tRight: {
    textAlign: 'right'
  } as any
}

export function LatestPointsReport ({ items }: LatestPointsReportProps) {
  return (
    <>
      <table width="100%" style={classes.mainTable} border={0}>
        <thead>
          <tr>
            {[...Array(cols).keys()].map((_, j) => (
              <th key={j} style={classes.tLeft}>{' '}</th>
            ))}
          </tr>
        </thead>
        <tbody>

          {items && items.length > 0 && items.map((item, i) => (

            <tr key={i}>
              {Object.entries(item).map(([key, value], j) => (
                <td key={j}><em style={{ color: 'gray' }}>{key}</em><br />{value}</td>
              ))}
            </tr>

          ))}
        </tbody>
      </table>
    </>
  )
}
