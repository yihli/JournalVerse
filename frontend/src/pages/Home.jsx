import Navbar from '../components/NavBar'

// refer to instagram landing page
const Main = () => {
    const buttonClass = 'p-[0.7rem] bg-blue-200 rounded-md w-[6rem]'
    return (
        <div className='
            w-screen  bg-white
            flex flex-col flex-1 items-center justify-center'>
                <div className='
                    flex flex-col items-center'>
                    <p className='text-4xl'>JournalVerse</p>
                    <p className='w-[20rem] mt-[1rem] text-xl text-center'>A <strong>space</strong> where you can share your thoughts</p>
                    <div className='mt-[0.8rem]'>
                        <button className={buttonClass}>Login </button>
                        --- 
                        <button className={buttonClass}>Register </button>
                    </div>
                </div>
               
        </div>
    )
}

const Home = () => {
    return (
        <div className='
        flex flex-col items-center
        bg-gray-300
        w-screen
        h-screen
        overflow-y-auto'>
            <Navbar />
            <Main />

        </div>
    )
}

export default Home