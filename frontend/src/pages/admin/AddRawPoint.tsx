import { Button, Container, FormControl, InputLabel, MenuItem, Select, Typography } from '@mui/material'
import { useContext, useEffect, useState } from 'react'
import SendIcon from '@mui/icons-material/Send'
import { ApiContext } from '../../contexts/ApiContext'
import { Criteria, JudgingRule, Performance, RawPoint, TorunamentJudge, Tournament } from '../../contexts/ApiContextInterface'
import { snakeToPascal } from '../../lib/common'
import { DateTime } from 'luxon'

export function AddRawPoint () {
  const { listTournaments, listPerformances, listCriteria, listTournamentJudges, getJudgingRuleByCategoryId: getJudgingRule, addRawPoint } = useContext(ApiContext)

  const [tournaments, setTournaments] = useState([] as Tournament[])
  const [tournamentId, setTournamentId] = useState('')
  const [performances, setPerformances] = useState([] as Performance[])
  const [performanceId, setPerformanceId] = useState('')

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
    fetchData().catch(console.error)
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
    fetchData().catch(console.error)
  }, [tournamentId])

  useEffect(() => {
    const fetchData = async () => {
      const performance = performances.find(p => p.id === performanceId)
      if (performance) {
        const c = await listCriteria(performance.categoryId)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        c.forEach((it: { criteriaName: any, subCriteriaDefinition: any }) => console.log(it.criteriaName, it.subCriteriaDefinition))
        setCriteria(c)
        const j = await getJudgingRule(performance.categoryId)
        setJudgingRule(j)
      }
    }
    fetchData().catch(console.error)
  }, [performanceId])

  async function handleSend () {
    const rawPoint: RawPoint = {
      performanceId,
      tournamentJudgeId,
      criteriaId,
      subCriteriaPoints: {
        earlyStart: false,
        count: 0
      },
      timestamp: DateTime.now().toISO()
    }
    addRawPoint(rawPoint)
  }

  return (
    <Container>
      <form>
        <Typography variant={'h4'} sx={{ marginTop: '22px', textAlign: 'center' }}>
          Wertung hinzufügen
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
          <Button variant="contained" fullWidth={true} endIcon={<SendIcon />} onClick={handleSend}>
            Senden
          </Button>
        </FormControl>
      </form>
    </Container>
  )
}
