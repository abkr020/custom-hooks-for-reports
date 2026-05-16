
import { BrowserRouter } from 'react-router-dom'
import './App.css'
import Dashboard from './dashboard/Dashboard'
import FloatingRouteCreateButton from './module/createReport/FloatingRouteCreateButton'
import MarksReport from './reports/MarksReport'
import Report1 from './reports/Report1'
import Report2 from './reports/Report2'
import StudentsReport from './reports/StudentsReport'
import TempLearn from './temp/TempLearn'

function App() {


  return (
    <>
      <BrowserRouter>
{/* <TempLearn /> */}

        <FloatingRouteCreateButton />
        {/* <div>hi</div> */}
        {/* <Report1 /> */}
        {/* <Report2 /> */}
        <StudentsReport />
        <MarksReport />
        {/* <Dashboard /> */}
      </BrowserRouter>
    </>
  )
}

export default App
