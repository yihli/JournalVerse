import entriesService from './services/entries'
import { useState, useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import { Routes, Route, Link, useMatch, useNavigate } from 'react-router-dom'

import EntriesDisplay from './components/EntriesDisplay'
import EntryForm from './components/EntryForm'
import LoginForm from './components/LoginForm'
import CreateAccountForm from './components/CreateAccountForm'
import Sidebar from './components/Sidebar'
import NavBar from './components/NavBar'
import EnterForms from './components/EnterForms'

import './styles.css'

const Home = () => {
  return (
    <div>
      Hello world!
    </div>
  )
}


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
                <Route path='/test' element={
          <div className='contents'>
            <NavBar setShowForms={() => setShowForms(!showForms)}/>
            <div className='mt-[4.5rem]'></div>
            <EnterForms visible={showForms}/>
            <Sidebar user={user} setNowDisplaying={setNowDisplaying}/>
            <EntriesDisplay nowDisplaying={nowDisplaying}/>
          </div>
        }></Route>
      </Routes>
    </div>
  )
}

export default App
