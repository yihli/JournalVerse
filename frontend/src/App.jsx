import entriesService from './services/entries'
import { useState, useEffect } from 'react'

import EntriesDisplay from './components/EntriesDisplay'
import EntryForm from './components/EntryForm'
import LoginForm from './components/LoginForm'
import CreateAccountForm from './components/CreateAccountForm'
import Sidebar from './components/Sidebar'

import './styles.css'

const App = () => {
  const [entries, setEntries] = useState([])
  const [showEntryForm, setShowEntryForm] = useState(false)
  const [user, setUser] = useState(null)
  const [loginState, setLoginState] = useState(true)
  const [nowDisplaying, setNowDisplaying] = useState('Global entries')

  useEffect(() => {
    entriesService.getAll().then(returnedEntries => {
      setEntries(returnedEntries)
    })
    console.log(entries)
  }, [user])

  const handleShowEntryForm = () => {
    setShowEntryForm(!showEntryForm)
  }

  const handleSwitchForm = () => {
    console.log('switch!')
    setLoginState(!loginState)
  }



  return (
    <div className='app'>
      <EntriesFilter />
      <EntriesDisplay entries={entries} setEntries={setEntries} nowDisplaying={nowDisplaying} user={user} setUser={setUser}/>
      {
        user 
        ? <div className="third-column" style={{border: '1px solid black'}}>
          {showEntryForm ? <EntryForm handleShowEntryForm={handleShowEntryForm} setEntries={setEntries} entries = {entries} user={user} setUser={setUser}/> : <button className="create-entry-button" onClick={handleShowEntryForm}>+</button>}
          {/* <button className="create-entry-button" onClick={handleShowEntryForm}>+</button> */}
          </div>
        : 
          <div className="third-column" style={{border: '1px solid black'}}>
            { loginState ? <LoginForm setUser={setUser} /> : <CreateAccountForm setLoginState={setLoginState}/>}
            <p className="switch-account-text" onClick={handleSwitchForm}>{loginState ? 'New user? Create an account' : 'Already a user? Log In'}</p>
          </div>
      }

    </div>
  )
}

export default App
