import { Route, Routes } from 'react-router-dom'
import { App } from './App'
import { AddClub } from './pages/admin/AddClub'
import { AddTournament } from './pages/admin/AddTournament'
import { EditLocation } from './pages/admin/EditLocation'
import { AddTournamentPerson } from './pages/admin/AddTournamentPerson'
import { AddPerformance } from './pages/admin/AddPerformance'
import { RawPointInput } from './pages/judging/RawPointInput'
import { SelectRawPoint } from './pages/admin/SelectRawPoint'
import { JudgingApp } from './pages/judging/JudgingApp'
import { AdminApp } from './pages/admin/AdminApp'
import { Overview } from './pages/admin/Overview'
import { AddPerformer } from './pages/admin/AddPerformer'
import { Nothing } from './pages/judging/Nothing'
import { Start } from './pages/judging/Start'
import { TournamentPlanList } from './pages/admin/TournamentPlanList'
import { TournamentQueueDashboard } from './pages/admin/TournamentQueue'
import { CategoryRanks } from './pages/admin/CategoryRanks'
import { CombinationRanks } from './pages/admin/CombinationRanks'
import { CalculationAdmin } from './pages/admin/CalculationAdmin'
import { TournamentAdmin } from './pages/admin/TournamentAdmin'
import { Reset } from './pages/judging/Reset'
import { CategoryPoints } from './pages/admin/CategoryPoints'
import { LatestPoints } from './pages/admin/LatestPoints'

export const Router = () => (
  <Routes>
    <Route path="/" element={<App />}>

      <Route path="/admin" element={<AdminApp />}>
        <Route path="overview" element={<Overview />} />
        <Route path="tournament-queue" element={<TournamentQueueDashboard />} />
        <Route path="tournament-plan" element={<TournamentPlanList />} />
        <Route path="select-raw-point" element={<SelectRawPoint />} />
        <Route path="latest-points" element={<LatestPoints />} />
        <Route path="category-points" element={<CategoryPoints />} />
        <Route path="category-ranks" element={<CategoryRanks />} />
        <Route path="combination-ranks" element={<CombinationRanks />} />
        <Route path="calculation" element={<CalculationAdmin />} />
        <Route path="tournament" element={<TournamentAdmin />} />
        <Route path="add-club" element={<AddClub />} />
        <Route path="add-tournament" element={<AddTournament />} />
        <Route path="edit-location" element={<EditLocation />} />
        <Route path="add-judge" element={<AddTournamentPerson role="tournamentJudge" />} />
        <Route path="add-athlete" element={<AddTournamentPerson role="tournamentAthlete" />} />
        <Route path="add-performer" element={<AddPerformer />} />
        <Route path="add-performance" element={<AddPerformance />} />
      </Route>

      <Route path="/judging" element={<JudgingApp />}>
        <Route path="start" element={<Start />}/>
        <Route path="reset" element={<Reset />}/>
        <Route path="select" element={<SelectRawPoint />}/>
        <Route path="nothing" element={<Nothing />} />
        <Route path="3x3" element={<RawPointInput layout="3x3" />} />
        <Route path="3x2" element={<RawPointInput layout="3x2" />} />
        <Route path="1-3x1" element={<RawPointInput layout="1-3x1" />} />
      </Route>
    </Route>

    <Route
      path="*"
      element={
        <main style={{ padding: '1rem' }}>
          <p>There's nothing here!</p>
        </main>
      }
    />
  </Routes>
)
