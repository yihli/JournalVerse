import entriesService from './services/entries'
import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'

import EntriesDisplay from './components/EntriesDisplay'
import EntryForm from './components/EntryForm'
import LoginForm from './components/LoginForm'
import CreateAccountForm from './components/CreateAccountForm'
import Sidebar from './components/Sidebar'

import './styles.css'

const App = () => {
  const [entries, setEntries] = useState([])

  const entries_test = useSelector(state => state.entries)

  const [showEntryForm, setShowEntryForm] = useState(false)

  const user = useSelector(state => state.user)

  const [loginState, setLoginState] = useState(true)
  const [nowDisplaying, setNowDisplaying] = useState('All entries')

  useEffect(() => {
    entriesService.getAll().then(returnedEntries => {
      setEntries(returnedEntries)
    })
  }, [user])

  const handleShowEntryForm = () => {
    setShowEntryForm(!showEntryForm)
  }

  const handleSwitchForm = () => {
    console.log('switch!')
    setLoginState(!loginState)
  }

  const handleSetEntries = (entries) => {
    setEntries(entries)
  }

  return (
    <div className='
      flex flex-col items-center
      bg-gray-300
      w-screen
      h-screen
      overflow-y-auto'>
        <Sidebar 

          user={user} setNowDisplaying={setNowDisplaying}/>
        <EntriesDisplay 

          entries={entries_test} setEntries={handleSetEntries} nowDisplaying={nowDisplaying} user={user} />
        {
          Object.keys(user).length !== 0
          ? <div className="third-column" >
            {showEntryForm ? <EntryForm 
                              className='
                                w-full'
                              handleShowEntryForm={handleShowEntryForm} setEntries={setEntries} entries = {entries} user={user} /> : <button className="create-entry-button" onClick={handleShowEntryForm}>+</button>}
            </div>
          : 
            <div className="third-column" >
              { loginState ? <LoginForm 
                                className='
                                w-full' /> : <CreateAccountForm setLoginState={setLoginState}/>}
              <p className="switch-account-text" onClick={handleSwitchForm}>{loginState ? 'New user? Create an account' : 'Already a user? Log In'}</p>
            </div>
        }
    </div>
  )
}

export default App
