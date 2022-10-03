import { Route, Routes } from 'react-router-dom'
import { App } from './App'
import { AddClub } from './pages/AddClub'
import { AddPerson } from './pages/AddPerson'
import { AddTournament } from './pages/AddTournament'
import { Form } from './pages/Form'
import Speed from './pages/Speed'

export const Router = () => (
  <Routes>
    <Route path='/' element={<App />}>
      <Route path='' element={<Form />} />
      <Route path='speed' element={<Speed />} />
      <Route path='add-club' element={<AddClub />}/>
      <Route path='add-tournament' element={<AddTournament />}/>
      <Route path='add-judge' element={<AddPerson role='tournamentJudge'/>}/>
      <Route path='add-athlete' element={<AddPerson role='tournamentAthlete'/>}/>
    </Route>

  </Routes>
)
