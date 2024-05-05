/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react'
import { ReportItemFormat } from '../contexts/ApiContextInterface'

export interface LatestPointsReportProps {
  items: ReportItemFormat[]
}

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

function emptyRow () {
  return (
    <tr className={classes.emptyCell}>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
    </tr>
  )
}

export function LatestPointsReport ({ items }: LatestPointsReportProps) {
  return (
    <>
      {items && items.length > 0 && (
        <table width="100%" style={classes.mainTable} border={0}>
          <tbody>
            {/* Placeholder for Image */}
            {emptyRow()}
            {emptyRow()}
            {emptyRow()}

                {/* title */}
                {items.map((point, i) => (
                  <React.Fragment key={i}>
                    <tr>
                    {Object.keys(point).length > 0 &&
                     Object.keys(point[0]).map((val, j) => (
                       <th key={j} style={classes.tLeft}>
                         {val}
                       </th>
                     ))}

                    </tr>
                    {/* value rows */}
                    {Object.values(point).map((point, i) => (
                   <tr key={i}>
                     {Object.values(point).map((value, i) => (
                       <td key={i}>{value}</td>
                     ))}
                   </tr>
                    ))}
                 {emptyRow()}
                 {emptyRow()}
                 {emptyRow()}
                 </React.Fragment>
                ))}
          </tbody>
        </table>
      )}
    </>
  )
}
