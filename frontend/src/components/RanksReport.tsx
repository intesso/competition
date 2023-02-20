/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react'
import { ReportFormat } from '../lib/reportDefinitions'

export interface RanksReportProps {
  items: ReportFormat
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
    </tr>
  )
}

export function RanksReport ({ items }: RanksReportProps) {
  return (
    <>
      {Object.entries(items) && Object.entries(items).length > 0 && (
        <table width="100%" style={classes.mainTable} border={0}>
          <tbody>
            {/* Placeholder for Image */}
            {emptyRow()}
            {emptyRow()}
            {emptyRow()}
            {Object.entries(items).map(([title, ranks], i) => (
              <React.Fragment key={i}>
                <tr>
                  <td colSpan={4}>
                    <h1>{title}</h1>
                  </td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>
                {/* title */}
                <tr>
                  {Object.keys(ranks).length > 0 &&
                    Object.keys(ranks[0]).map((key, i) => (
                      <th key={i} style={classes.tLeft}>
                        {key}
                      </th>
                    ))}
                </tr>
                {/* value rows */}
                {ranks.map((rank, i) => (
                  <tr key={i}>
                    {Object.values(rank).map((value, i) => (
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
