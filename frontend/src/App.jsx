import entriesService from './services/entries'
import { useState, useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import { Routes, Route, Link, useMatch, useNavigate } from 'react-router-dom'

import Home from './pages/Home'
import './styles.css'

const App = () => {
  const user = useSelector(state => state.user)

  const [nowDisplaying, setNowDisplaying] = useState('All entries')
  const [showForms, setShowForms] = useState(false)

  return (
    <div className='
      flex flex-col items-center
      bg-gray-300
      w-screen
      h-screen
      overflow-y-auto'>
        {/* <NavBar setShowForms={() => setShowForms(!showForms)}/>
        <div className='mt-[4.5rem]'></div>
        <EnterForms visible={showForms}/>
        <Sidebar user={user} setNowDisplaying={setNowDisplaying}/>
        <EntriesDisplay nowDisplaying={nowDisplaying}/> */}
      <Routes>
        <Route path='/' element={<Home />}></Route>
      </Routes>
    </div>
  )
}

export default App
