/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react'
import { ReportFormat } from '../contexts/ApiContextInterface'

export interface PointsReportProps {
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

export function PointsReport ({ items }: PointsReportProps) {
  const criteriaItems = Object.fromEntries(
    Object.entries(items).map(([title, points]) => {
      const criteria = points.reduce((memo, point) => {
        const criteriaName = point.criteriaName || ''
        memo[criteriaName] = memo[criteriaName] || []
        memo[criteriaName].push(point)
        return memo
      }, {} as ReportFormat)
      return [title, criteria]
    })
  )
  return (
    <>
      {Object.entries(criteriaItems) && Object.entries(criteriaItems).length > 0 && (
        <table width="100%" style={classes.mainTable} border={0}>
          <tbody>
            {/* Placeholder for Image */}
            {emptyRow()}
            {emptyRow()}
            {emptyRow()}
            {Object.entries(criteriaItems).map(([title, points], i) => (
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
                {Object.entries(points).map(([criteriaName, point], i) => (
                  <React.Fragment key={i}>
                                   <tr>
                  <td colSpan={4}>
                    <em>{criteriaName}</em>
                  </td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>
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
                ))
                }
              </React.Fragment>
            ))}
          </tbody>
        </table>
      )}
    </>
  )
}
