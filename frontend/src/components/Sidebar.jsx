import { useSelector } from 'react-redux'
import journalverseLogo from '../assets/journalverse-logo.png'

const Sidebar = ({ setNowDisplaying }) => {
    const user = useSelector(state => state.user)

    const handleSelectFilter = (filter) => {
        setNowDisplaying(filter)
    }

    return (
        <div className="
            flex flex-col justify-center"
        >
            <img className="
                w-[10rem] h-auto " src={journalverseLogo}/>
            { Object.keys(user).length !== 0 ? <h1>Hello, {user.name}!</h1> : <h1>Welcome!</h1>}
            { Object.keys(user).length !== 0  && 
            <div >
                <div  onClick={() => handleSelectFilter('All entries')}><h2>All entries</h2></div>
                <div  onClick={() => handleSelectFilter('Liked entries')}><h2>Liked entries</h2></div>
                <div  onClick={() => handleSelectFilter('Your entries')}><h2>Your entries</h2></div>
            </div>
            }
        </div>
    )
}

export default Sidebar