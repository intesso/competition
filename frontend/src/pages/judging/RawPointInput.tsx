import { Button, Container, Grid, Slider, Stack } from '@mui/material'
import { SyntheticEvent, useContext, useEffect, useState } from 'react'
import { useLocalStorage } from 'usehooks-ts'
import { ApiContext } from '../../contexts/ApiContext'
import {
  Criteria,
  Performance,
  RawPoint,
  SubCriteriaValue,
  TournamentPerson
} from '../../contexts/ApiContextInterface'
import { DateTime } from 'luxon'
import { useSearchParams } from 'react-router-dom'
import { useSnackbar } from 'notistack'
import { parseError } from '../../lib/common'
import { InputType } from './JudgingApp'

export interface RawPointInputProps {
  layout: string
}

export function RawPointInput ({ layout }: RawPointInputProps) {
  const { getPerformance, getTournamentJudge, getCriteria, addRawPoint } =
    useContext(ApiContext)
  const { enqueueSnackbar } = useSnackbar()

  const [searchParams] = useSearchParams()
  const judgeId = searchParams.get('judgeId') || searchParams.get('id')
  const judgeName = searchParams.get('judgeName')
  const tournamentId = searchParams.get('tournamentId')
  const tournamentJudgeId = searchParams.get('tournamentJudgeId')
  const [inputType] = useLocalStorage<InputType>('inputType', 'button')
  const [tournamentJudge, setTournamentJudge] = useState(null as TournamentPerson | null)
  const performanceId = searchParams.get('performanceId')
  const [performance, setPerformance] = useState(null as Performance | null)
  const criteriaId = searchParams.get('criteriaId')
  const subCriteriaKey = `subCriteria_${performanceId}_${criteriaId}`
  const [subCriteria, setSubCriteria] = useLocalStorage<SubCriteriaValue>(subCriteriaKey, {})
  const finishedKey = `finished_${performanceId}_${criteriaId}`
  const [finished, setFinished] = useLocalStorage<string>(finishedKey, '')
  const [fns, setFns] = useState({} as SelectFn)

  useEffect(() => {
    const fetchData = async () => {
      if (tournamentId && performanceId) {
        setPerformance(await getPerformance(tournamentId, performanceId))
      }
      if (criteriaId) {
        // try read from localStorage (previously visited page)
        const storedFinishedString = localStorage.getItem(finishedKey)
        if (storedFinishedString) {
          const storedFinished = JSON.parse(storedFinishedString)
          setFinished(storedFinished)
        }

        const storedSubCriteriaString = localStorage.getItem(subCriteriaKey)
        if (storedSubCriteriaString) {
          const storedSubCriteria = JSON.parse(storedSubCriteriaString)
          setSubCriteria(storedSubCriteria)
        } else {
          // fetch criteria from server
          const c = await getCriteria(criteriaId)
          console.log('criteria', c)
          if (c) {
            console.log('criteriaDefinitionToSubCriteria(c)', criteriaDefinitionToSubCriteria(c))
            setSubCriteria(criteriaDefinitionToSubCriteria(c))
          }
        }
      }
    }
    fetchData().catch((err) => enqueueSnackbar(parseError(err), { variant: 'error' }))
  }, [tournamentId, performanceId, criteriaId])

  useEffect(() => {
    const fetchData = async () => {
      if (performance && tournamentJudgeId) {
        setTournamentJudge(await getTournamentJudge(performance.tournamentId, tournamentJudgeId))
      }
    }
    fetchData().catch((err) => enqueueSnackbar(parseError(err), { variant: 'error' }))
  }, [performance])
  function criteriaDefinitionToSubCriteria (c: Criteria) {
    return Object.entries(c.subCriteriaDefinition).reduce((memo, [, value]) => {
      memo[value.uiPosition] = { ...value, value: value.rangeStart }
      return memo
    }, {} as SubCriteriaValue)
  }

  function registerFns (fns: SelectFn) {
    setFns(fns)
  }

  function getJudgeId () {
    return judgeId || tournamentJudgeId || ''
  }

  function getJudgeName () {
    return judgeName || (tournamentJudge ? `${tournamentJudge?.firstName} ${tournamentJudge?.lastName}` : '')
  }

  async function handleSend () {
    if (performanceId && getJudgeId() && criteriaId) {
      const rawPoint: RawPoint = {
        performanceId,
        tournamentJudgeId: tournamentJudgeId || undefined,
        criteriaId,
        judgeId: getJudgeId(),
        judgeName: getJudgeName(),
        subCriteriaPoints: Object.entries(subCriteria).reduce((memo, [, value]) => {
          memo[value.subCriteriaName] = value
          return memo
        }, {} as SubCriteriaValue),
        timestamp: DateTime.now().toISO()
      }
      addRawPoint(rawPoint)
        .then(() => {
          setFinished('success')
          enqueueSnackbar('Done', { variant: 'success', autoHideDuration: 5000 })
        })
        .catch((err) => {
          setFinished('error')
          enqueueSnackbar(parseError(err), { variant: 'error', autoHideDuration: 10000 })
        })
    } else {
      const msg = 'must provide performanceId && (id || tournamentJudgeId) && criteriaId'
      console.error(msg)
      enqueueSnackbar(msg, { variant: 'error' })
    }
  }

  function getSubmitButtonColor () {
    switch (finished) {
      case 'error':
        return 'error'
      case 'success':
        return 'success'
      default:
        return 'primary'
    }
  }

  const colHeight = 142

  const styledButton = {
    width: '100%',
    minHeight: `${colHeight}px`
  }

  interface InstantButtonProps {
    uiPosition: string
    cols?: number
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    buttonStyle?: any
    inputType?: InputType
    onSelect: (fn: SelectFn) => void
  }

  interface SelectFn {
    updateValue: (value: number) => void
    incrementValue: () => void
    decrementValue: () => void
  }

  function InstantButton ({ uiPosition, cols = 4, buttonStyle = styledButton, onSelect }: InstantButtonProps) {
    function updateValue (value: number) {
      setSubCriteria((prevValue) => {
        prevValue[uiPosition].value = value
        return { ...prevValue }
      })
    }

    function incrementValue () {
      setSubCriteria((prevValue) => {
        if (prevValue[uiPosition].value < prevValue[uiPosition].rangeEnd) {
          prevValue[uiPosition].value += prevValue[uiPosition].step
          return { ...prevValue }
        } else {
          return prevValue
        }
      })
    }

    function decrementValue () {
      setSubCriteria((prevValue) => {
        if (prevValue[uiPosition].value > prevValue[uiPosition].rangeStart) {
          prevValue[uiPosition].value -= prevValue[uiPosition].step
          return { ...prevValue }
        } else {
          return prevValue
        }
      })
    }

    function isDisabled () {
      return !subCriteria[uiPosition] || subCriteria[uiPosition].rangeEnd === 0
    }

    function handleSliderChange (event: Event | SyntheticEvent<Element, Event>, newValue: number | number[]) {
      event.preventDefault()
      event.stopPropagation()
      setSubCriteria((prevValue) => {
        prevValue[uiPosition].value = newValue as number
        return { ...prevValue }
      })
    }

    return (
      <Grid item xs={12} sm={cols}>
        {inputType === 'button'
        // button
          ? (
          <Button
            className="raw-point-button"
            disabled={isDisabled()}
            style={buttonStyle}
            variant="outlined"
            onClick={() => {
              incrementValue()
              onSelect({
                incrementValue,
                decrementValue,
                updateValue
              })
            }}
          >
            <Stack direction="column" justifyContent="space-between" alignItems="center" spacing={4}>
              <div style={{ fontSize: '1.4em', fontWeight: '700' }}>
                {subCriteria[uiPosition]?.subCriteriaDescription}
              </div>
              <div style={{ fontSize: '1em' }}>
                {isDisabled() ? '' : 'Anzahl '}
                {subCriteria[uiPosition]?.value}
              </div>
            </Stack>
          </Button>
            )
        // slider
          : (
              subCriteria[uiPosition]
                ? (
                <Button
                className="raw-point-button"
                disabled={isDisabled()}
                style={buttonStyle}
                variant="outlined"
                onClick={() => {
                  onSelect({
                    incrementValue,
                    decrementValue,
                    updateValue
                  })
                }}
              >
              <Stack direction="column" justifyContent="space-between" alignItems="center" spacing={4} width='100%'>
                <div style={{ fontSize: '1.4em', fontWeight: '700' }}>
                  {subCriteria[uiPosition]?.subCriteriaDescription}
                </div>
                  <Slider
                  sx={{ width: '90%' }}
                    aria-label="Value"
                    defaultValue={subCriteria[uiPosition].value}
                    disableSwap={true}
                    onChangeCommitted={(event, newValue) => {
                      handleSliderChange(event, newValue)
                      onSelect({
                        incrementValue,
                        decrementValue,
                        updateValue
                      })
                    }}
                    valueLabelDisplay="on"
                    step={subCriteria[uiPosition].step}
                    marks={subCriteria[uiPosition].step > 1}
                    min={subCriteria[uiPosition].rangeStart}
                    max={subCriteria[uiPosition].rangeEnd}
                  />
              </Stack>
              </Button>
                  )
                  // disabled (placeholder) button
                : (
                <Button
                className="raw-point-button"
                disabled={isDisabled()}
                style={buttonStyle}
                variant="outlined"
                onClick={() => {
                  onSelect({
                    incrementValue,
                    decrementValue,
                    updateValue
                  })
                }}
              ></Button>
                  )
            )}
      </Grid>
    )
  }

  function ButtonLayout ({ layout }: RawPointInputProps) {
    switch (layout) {
      case '3x3':
        return <Layout1 />
      case '3x2':
        return <Layout2 />
      case '1-3x1':
        return <Layout3 />
      default:
        return <Layout1 />
    }
  }

  const classes = {
    root: { marginTop: '0px' }
  }

  function Layout1 () {
    return (
      <Container>
        <Grid container spacing={2} sx={classes.root}>
          {/* 1. row */}
          <InstantButton uiPosition="1" onSelect={registerFns} />
          <InstantButton uiPosition="2" onSelect={registerFns} />
          <InstantButton uiPosition="3" onSelect={registerFns} />

          {/* 2. row */}
          <InstantButton uiPosition="4" onSelect={registerFns} />
          <InstantButton uiPosition="5" onSelect={registerFns} />
          <InstantButton uiPosition="6" onSelect={registerFns} />

          {/* 3. row */}
          <InstantButton uiPosition="7" onSelect={registerFns} />
          <Grid item xs={12} sm={4}>
            <Stack sx={{ flexGrow: 1 }} direction={{ xs: 'row', sm: 'row' }} spacing={{ xs: 2, sm: 2, md: 2 }}>
              <Button
                style={styledButton}
                variant="contained"
                color="secondary"
                onClick={() => {
                  fns.decrementValue()
                }}
              >
                REMOVE
              </Button>
              <Button style={styledButton} variant="contained" color={getSubmitButtonColor()} onClick={handleSend}>
                SUBMIT
              </Button>
            </Stack>
          </Grid>
          <InstantButton uiPosition="9" onSelect={registerFns} />
        </Grid>
      </Container>
    )
  }

  function Layout2 () {
    return (
      <Container>
        <Grid container spacing={2} sx={classes.root}>
          {/* 1. row */}
          <InstantButton
            uiPosition="1"
            buttonStyle={{
              width: '100%',
              minHeight: `${2 * colHeight}px`
            }}
            onSelect={registerFns}
          />
          <InstantButton
            uiPosition="2"
            buttonStyle={{
              width: '100%',
              minHeight: `${2 * colHeight}px`
            }}
            onSelect={registerFns}
          />
          <InstantButton
            uiPosition="3"
            buttonStyle={{
              width: '100%',
              minHeight: `${2 * colHeight}px`
            }}
            onSelect={registerFns}
          />

          {/* 2. row */}
          <InstantButton uiPosition="7" onSelect={registerFns} />
          <Grid item xs={12} sm={4}>
            <Stack sx={{ flexGrow: 1 }} direction={{ xs: 'row', sm: 'row' }} spacing={{ xs: 2, sm: 2, md: 2 }}>
              <Button
                style={styledButton}
                variant="contained"
                color="secondary"
                onClick={() => {
                  fns.decrementValue()
                }}
              >
                REMOVE
              </Button>
              <Button style={styledButton} variant="contained" color={getSubmitButtonColor()} onClick={handleSend}>
                SUBMIT
              </Button>
            </Stack>
          </Grid>
          <InstantButton uiPosition="9" onSelect={registerFns} />
        </Grid>
      </Container>
    )
  }

  function Layout3 () {
    return (
      <Container>
        <Grid container spacing={2} sx={classes.root}>
          {/* 1. row */}
          <InstantButton
            uiPosition="1"
            cols={12}
            buttonStyle={{
              width: '100%',
              minHeight: `${2 * colHeight}px`
            }}
            onSelect={registerFns}
          />

          {/* 2. row */}
          <InstantButton uiPosition="2" onSelect={registerFns} />
          <Grid item xs={12} sm={4}>
            <Stack sx={{ flexGrow: 1 }} direction={{ xs: 'row', sm: 'row' }} spacing={{ xs: 2, sm: 2, md: 2 }}>
              <Button
                style={styledButton}
                variant="contained"
                color="secondary"
                onClick={() => {
                  fns.decrementValue()
                }}
              >
                REMOVE
              </Button>
              <Button style={styledButton} variant="contained" color={getSubmitButtonColor()} onClick={handleSend}>
                SUBMIT
              </Button>
            </Stack>
          </Grid>
          <InstantButton uiPosition="3" onSelect={registerFns} />
        </Grid>
      </Container>
    )
  }

  return ButtonLayout({ layout })
}
