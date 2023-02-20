/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react'
import { CategoryPointDetails } from '../contexts/ApiContextInterface'

export interface PointsReportProps {
  items: CategoryPointDetails
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
  return (
    <>
      {Object.entries(items) && Object.entries(items).length > 0 && (
        <table width="100%" style={classes.mainTable} border={0}>
          <tbody>
            {/* Placeholder for Image */}
            {emptyRow()}
            {emptyRow()}
            {emptyRow()}
            {Object.entries(items).map(([title, points], i) => (
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
                  {Object.keys(points).length > 0 &&
                    Object.keys(points[0]).map((key, i) => (
                      <th key={i} style={classes.tLeft}>
                        {key}
                      </th>
                    ))}
                </tr>
                {/* value rows */}
                {points.map((rank, i) => (
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
