import { Route, Routes } from 'react-router-dom'
import { App } from './App'
import { AddClub } from './pages/admin/AddClub'
import { AddTournament } from './pages/admin/AddTournament'
import { EditLocation } from './pages/admin/EditLocation'
import Speed from './pages/admin/Speed'
import { AddTournamentPerson } from './pages/admin/AddTournamentPerson'
import { AddPerformance } from './pages/admin/AddPerformance'
import { AddRawPoint } from './pages/admin/AddRawPoint'
import { SelectRawPoint } from './pages/admin/SelectRawPoint'
import { JudgingApp } from './pages/judging/JudgingApp'

export const Router = () => (
  <Routes>
    <Route path='/' element={<App />}>
      <Route path='speed' element={<Speed />} />
      <Route path='add-club' element={<AddClub />}/>
      <Route path='add-tournament' element={<AddTournament />}/>
      <Route path='edit-location' element={<EditLocation />}/>
      <Route path='add-judge' element={<AddTournamentPerson role='tournamentJudge'/>}/>
      <Route path='add-athlete' element={<AddTournamentPerson role='tournamentAthlete'/>}/>
      <Route path='add-performance' element={<AddPerformance/>}/>
      <Route path='select-raw-point' element={<SelectRawPoint/>}/>
      <Route path='add-raw-point' element={<AddRawPoint/>}/>
      <Route path='/judging' element={<JudgingApp />}>
        <Route path='' element={<AddRawPoint />} />
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
