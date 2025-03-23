const NavBar = () => {
    const handleEnter = () => {
        
    }
    return (
        <div className="
           fixed w-screen h-[4rem] bg-gray-400
           flex flex-row justify-between items-center"
        >
            <div>
                <p>Logo</p>
            </div>
            <div className="
                flex flex-row items-center gap-2
                w-[5rem]"
            >
                <button>Enter!</button>
                <p>Acc Img</p>
            </div>
        </div>
    )
}

export default NavBar