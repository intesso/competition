import { Route, Routes } from 'react-router-dom'
import { App } from './App'
import { OrientationInfo } from './components/OrientationInfo'
import { Form } from './pages/Form'
import Speed from './pages/Speed'

export const Router = () => (
  <Routes>
    <Route path='/' element={<App />}>
      <Route path='' element={<Form />} />
      <Route path='speed' element={<Speed />} />
    </Route>

    <Route path='/orientation' element={<OrientationInfo />} />
  </Routes>
)
