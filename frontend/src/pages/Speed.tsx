import { useContext, useState } from 'react'
import fscreen from 'fscreen'
import {
  Box,
  Button,
  Checkbox,
  Container,
  FormControl,
  FormControlLabel,
  Typography
} from '@mui/material'
import '@fortawesome/fontawesome-free/css/all.min.css'
import { enterFullscreen } from '../lib/device'
import SendIcon from '@mui/icons-material/Send'
import AddCircleIcon from '@mui/icons-material/AddCircle'

import intessoLogo from '../themes/default/assets/intesso.svg'
import { ApiContext } from '../contexts/ApiContext'
import { RawPoints } from '../contexts/ApiContextInterface'

export default function Speed () {
  const { sendRawPoints } = useContext(ApiContext)
  const [fullscreen, setfullscreen] = useState(false)
  const [count, setCount] = useState(0)
  const [earlyStart, setEarlyStart] = useState(false)

  const handleBodyOnClick = () => {
    if (!fullscreen) {
      setfullscreen(true)
      if (fscreen.fullscreenEnabled) {
        fscreen.requestFullscreen(document.documentElement)
      } else {
        console.log('fullscreen not supported on this device')
      }
    }
  }

  const handleEarlyStart = async (value: boolean) => {
    setEarlyStart(value)
  }

  const handleCount = async () => {
    setCount((c) => c + 1)
  }

  const handleOnSubmit = async () => {
    handleBodyOnClick()

    const rawPoints: RawPoints = {
      performanceId: '123',
      tournamentJudgeId: '123',
      criteriaId: '123',
      subCriteriaPoints: {
        earlyStart,
        count
      },
      timestamp: Date.now()
    }

    await sendRawPoints(rawPoints)
  }

  const shouldDisableSubmit = () => {
    return false
  }

  const classes = {
    root: {
      justifyContent: 'center',
      alignContent: 'center',
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      textAlign: 'center' as any
    },
    formElement: { width: '100%', margin: '22px 5px 10px 5px' }
  }

  return (
    <div
      style={classes.root}
      onFocus={() => enterFullscreen(document.documentElement)}
      onClick={() => handleBodyOnClick()}
    >
      <Container maxWidth="xs">
        <Box sx={{ marginTop: '22px' }}></Box>

        <Typography variant={'h4'} sx={{ marginTop: '22px', textAlign: 'center' }}>
          Speed
        </Typography>
        <FormControl fullWidth>
          <Button
            style={classes.formElement}
            variant="contained"
            color="primary"
            onClick={handleCount}
            endIcon={<AddCircleIcon />}
            sx={{
              minHeight: '100px'
            }}
          >
            Count {count}
          </Button>

          <>
            <FormControlLabel
              style={classes.formElement}
              control={<Checkbox checked={earlyStart || false} onChange={(e) => handleEarlyStart(e.target.checked)} />}
              label="Fehlstart"
            />
          </>

          <Button
            style={classes.formElement}
            variant="outlined"
            color="primary"
            disabled={shouldDisableSubmit()}
            onClick={handleOnSubmit}
            endIcon={<SendIcon />}
          >
            Senden
          </Button>
        </FormControl>

        <>
          <Box sx={{ marginTop: '22px' }}>by</Box>
          <a href="//intesso.com" target="_blank">
            <Box
              component="img"
              sx={{
                maxWidth: { xs: 100, md: 140 },
                marginTop: '10px'
              }}
              alt="intesso"
              src={intessoLogo}
            />
          </a>
        </>
      </Container>
    </div>
  )
}
