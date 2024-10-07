import journalverseLogo from '../assets/journalverse-logo.png'

const Sidebar = ({user}) => {


    return (
        <div className="sidebar-container">
            <img className="sidebar-logo" src={journalverseLogo}/>
            { user ? <h1>Hello, {user.name}!</h1> : <h1>Welcome!</h1>}
            { user && 
            <div className="entry-filter-container">
                <div className="entry-filter"><h2>All entries</h2></div>
                <div className="entry-filter"><h2>Liked entries</h2></div>
                <div className="entry-filter"></div>
            </div>
            }
        </div>
    )
}

export default Sidebar