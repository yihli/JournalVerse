import entriesService from './services/entries'
import { useState, useEffect } from 'react'

import EntriesDisplay from './components/EntriesDisplay'
import EntryForm from './components/EntryForm'
import LoginForm from './components/LoginForm'
import CreateAccountForm from './components/CreateAccountForm'

import './styles.css'

const App = () => {
  const [entries, setEntries] = useState([])
  const [showEntryForm, setShowEntryForm] = useState(false)
  const [user, setUser] = useState(null)
  const [userLikedEntries, setUserLikedEntries] = useState(null)
  const [loginState, setLoginState] = useState(true)
  const [nowDisplaying, setNowDisplaying] = useState('Global entries')

  useEffect(() => {
    entriesService.getAll().then(returnedEntries => {
      setEntries(returnedEntries)
    })
    console.log(entries)
  }, [userLikedEntries])

  const handleShowEntryForm = () => {
    setShowEntryForm(!showEntryForm)
  }

  const handleSwitchForm = () => {
    console.log('switch!')
    setLoginState(!loginState)
  }



  return (
    <div className='app'>
      <h1>Hello World!</h1>
      <EntriesDisplay entries={entries} showPostToolbar = {user !== null ? true : false} userLikedEntries={userLikedEntries ? userLikedEntries: []} setUserLikedEntries={setUserLikedEntries} nowDisplaying={nowDisplaying}/>
      {
        user 
        ? <div className="third-column" style={{border: '1px solid black'}}>
          {showEntryForm ? <EntryForm handleShowEntryForm={handleShowEntryForm} setEntries={setEntries} entries = {entries} /> : <button className="create-entry-button" onClick={handleShowEntryForm}>+</button>}
          {/* <button className="create-entry-button" onClick={handleShowEntryForm}>+</button> */}
          </div>
        : 
          <div className="third-column" style={{border: '1px solid black'}}>
            { loginState ? <LoginForm setUser={setUser} setUserLikedEntries={setUserLikedEntries}/> : <CreateAccountForm setLoginState={setLoginState}/>}
            <p className="switch-account-text" onClick={handleSwitchForm}>{loginState ? 'New user? Create an account' : 'Already a user? Log In'}</p>
          </div>
      }

    </div>
  )
}

export default App
