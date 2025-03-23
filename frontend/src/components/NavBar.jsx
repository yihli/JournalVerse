const NavBar = ({ setShowForms }) => {
    return (
        <div className="
           fixed w-screen h-[4rem] bg-gray-400
           flex flex-row justify-between items-center"
        >
            <div>
                <p>Logo</p>
            </div>
            <div className="
                flex flex-row items-center justify-between gap-3
                w-[6rem]"
            >
                <button onClick={setShowForms}>Enter!</button>
                <p>Acc Img</p>
            </div>
        </div>
    )
}

export default NavBar