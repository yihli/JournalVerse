import MainLogo from '../assets/square-logo.png'

const NavBar = ({ setShowForms }) => {
    return (
        <div className="
           fixed w-screen h-[4rem] bg-gray-400
           flex flex-row justify-between items-center"
        >
            <div className="
                h-full aspect-square">
                <img src={MainLogo}/>
            </div>
            <div className="
                flex flex-row items-center justify-between gap-3
                w-[6rem]"
            >
                <button className='
                    p-[0.4rem] rounded
                    bg-gray-300'
                    onClick={setShowForms}>Enter!</button>
                <p>Acc Img</p>
            </div>
        </div>
    )
}

export default NavBar