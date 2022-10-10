import { Route, Routes } from 'react-router-dom'
import { App } from './App'
import { AddClub } from './pages/AddClub'
import { AddTournament } from './pages/AddTournament'
import { Form } from './pages/Form'
import { EditLocation } from './pages/EditLocation'
import Speed from './pages/Speed'
import { AddTournamentPerson } from './pages/AddTournamentPerson'
import { AddPerformance } from './pages/AddPerformance'
import { AddRawPoint } from './pages/AddRawPoint'

export const Router = () => (
  <Routes>
    <Route path='/' element={<App />}>
      <Route path='' element={<Form />} />
      <Route path='speed' element={<Speed />} />
      <Route path='add-club' element={<AddClub />}/>
      <Route path='add-tournament' element={<AddTournament />}/>
      <Route path='edit-location' element={<EditLocation />}/>
      <Route path='add-judge' element={<AddTournamentPerson role='tournamentJudge'/>}/>
      <Route path='add-athlete' element={<AddTournamentPerson role='tournamentAthlete'/>}/>
      <Route path='add-performance' element={<AddPerformance/>}/>
      <Route path='add-raw-point' element={<AddRawPoint/>}/>
    </Route>

  </Routes>
)
