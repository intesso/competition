import { Switch } from '@mui/material'
import { ChangeEvent } from 'react'
import { useDeviceOrientation } from '../lib/useDeviceOrientation'

// @see https://itnext.io/gyro-web-accessing-the-device-orientation-in-javascript-387da43eeb84
export function OrientationInfo () {
  const { orientation, requestAccess, revokeAccess, error } = useDeviceOrientation()

  const onToggle = (event: ChangeEvent<HTMLInputElement>): void => {
    const toggleState = event.target.checked
    const result = toggleState ? requestAccess() : revokeAccess()
    console.log(result)
  }

  const orientationInfo = (orientation != null) && (
    <ul>
      <li>ɑ: <code>{orientation.alpha}</code></li>
      <li>β: <code>{orientation.beta}</code></li>
      <li>γ: <code>{orientation.gamma}</code></li>
    </ul>
  )

  const errorElement = (error != null)
    ? (
      <div className='error'>{error.message}</div>
      )
    : null

  return (
    <>
      <Switch onChange={onToggle} />
      {orientationInfo}
      {errorElement}
    </>
  )
}
