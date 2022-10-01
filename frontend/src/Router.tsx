import { Route, Routes } from 'react-router-dom'
import { App } from './App'
import { OrientationInfo } from './components/OrientationInfo'
import { AddPerson } from './pages/AddPerson'
import { Form } from './pages/Form'
import Speed from './pages/Speed'

export const Router = () => (
  <Routes>
    <Route path='/' element={<App />}>
      <Route path='' element={<Form />} />
      <Route path='speed' element={<Speed />} />
      <Route path='add-judge' element={<AddPerson role='tournamentJudge'/>}/>
      <Route path='add-athlete' element={<AddPerson role='tournamentAthlete'/>}/>
    </Route>

    <Route path='/orientation' element={<OrientationInfo />} />
  </Routes>
)
