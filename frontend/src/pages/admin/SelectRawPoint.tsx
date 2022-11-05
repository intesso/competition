import { Button, Container, FormControl, InputLabel, MenuItem, Select, Typography } from '@mui/material'
import { useContext, useEffect, useState } from 'react'
import SendIcon from '@mui/icons-material/Send'
import { ApiContext } from '../../contexts/ApiContext'
import { Criteria, JudgingRule, Performance, TorunamentJudge, Tournament } from '../../contexts/ApiContextInterface'
import { parseError, snakeToPascal } from '../../lib/common'
import { createSearchParams, useNavigate } from 'react-router-dom'
import { useSnackbar } from 'notistack'

export function SelectRawPoint () {
  const { listTournaments, listPerformances, listCriteria, listTournamentJudges, getJudgingRuleByCategoryId: getJudgingRule } = useContext(ApiContext)
  const { enqueueSnackbar } = useSnackbar()
  const navigate = useNavigate()
  const [tournaments, setTournaments] = useState([] as Tournament[])
  const [tournamentId, setTournamentId] = useState('')
  const [performances, setPerformances] = useState([] as Performance[])
  const [performanceId, setPerformanceId] = useState('')
  const [categoryId, setCategoryId] = useState('')

  const [criteria, setCriteria] = useState([] as Criteria[])
  const [criteriaId, setCriteriaId] = useState('')

  const [judgingRule, setJudgingRule] = useState(null as JudgingRule | null)

  const [tournamentJudges, setTournamentJudges] = useState([] as TorunamentJudge[])
  const [tournamentJudgeId, setTournamentJudgeId] = useState('')

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
        const p = await listPerformances(tournamentId)
        setPerformances(p)

        const j = await listTournamentJudges(tournamentId)
        setTournamentJudges(j)
      }
    }
    fetchData().catch((err) => enqueueSnackbar(parseError(err), { variant: 'error' }))
  }, [tournamentId])

  useEffect(() => {
    const fetchData = async () => {
      const performance = performances.find(p => p.id === performanceId)
      if (performance) {
        setCategoryId(performance.categoryId)
        const c = await listCriteria(performance.categoryId)
        c.forEach(it => console.log(it.criteriaName, it.subCriteriaDefinition))
        setCriteria(c)
        const j = await getJudgingRule(performance.categoryId)
        setJudgingRule(j)
      }
    }
    fetchData().catch((err) => enqueueSnackbar(parseError(err), { variant: 'error' }))
  }, [performanceId])

  async function handleSelect () {
    const judgingRuleName = judgingRule?.judgingRuleName || ''
    const foundCriteria = criteria.find(it => it.id === criteriaId)
    if (foundCriteria) {
      const criteriaName = foundCriteria.criteriaName
      const criteriaUiLayout = foundCriteria.criteriaUiLayout

      navigate({
        pathname: `/judging/${criteriaUiLayout}`,
        search: `?${createSearchParams({
          tournamentId,
          performanceId,
          categoryId,
          criteriaId,
          tournamentJudgeId,
          judgingRuleName,
          criteriaName
        })}`
      })
    } else {
      const msg = `no criteria found for criteriaId: ${criteriaId}`
      console.error(msg)
      enqueueSnackbar(msg, { variant: 'error' })
    }
  }

  return (
    <Container>
      <form>
        <Typography variant={'h4'} sx={{ marginTop: '22px', textAlign: 'center' }}>
          Wertung selektieren
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

        <FormControl fullWidth margin="normal">
          <InputLabel id="performanceId">Performance</InputLabel>
          <Select labelId="performanceId" value={performanceId} label="Performance" onChange={(e) => setPerformanceId(e.target.value)}>
            {performances.map((performance) => (
              <MenuItem key={performance.id} value={performance.id}>
                {performance.performanceName}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth margin="normal">
          <InputLabel id="criteriaId">Kriterium</InputLabel>
          <Select
            labelId="criteriaId"
            value={criteriaId}
            label="Kriterium"
            onChange={(e) => setCriteriaId(e.target.value)}
          >
            {criteria.map((criteria) => (
              <MenuItem key={criteria.id} value={criteria.id}>
                {snakeToPascal(criteria.criteriaName)}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth margin="normal">
          <InputLabel id="judgeId">Wertungsrichter(in)</InputLabel>
          <Select
            labelId="judgeId"
            value={tournamentJudgeId}
            label="Wertungsrichter(in)"
            onChange={(e) => setTournamentJudgeId(e.target.value)}
          >
            {tournamentJudges.map((judge) => (
              <MenuItem key={judge.id} value={judge.id}>
               {judge.firstName}{' '}{judge.lastName}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth margin="normal">
          <Button variant="contained" fullWidth={true} endIcon={<SendIcon />} onClick={handleSelect}>
            Selektieren
          </Button>
        </FormControl>
      </form>
    </Container>
  )
}
