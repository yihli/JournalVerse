import entriesService from '../services/entries'
import usersService from '../services/users'

import { deleteEntry } from '../reducers/entryReducer'
import { setUser } from '../reducers/userReducer'

import { useDispatch, useSelector } from 'react-redux'
import { useState, useEffect } from 'react'


const Entry = ({ entry, postedMessage, showPostToolbar, showRedHeart, showDeleteButton }) => {
    const dispatch = useDispatch()
    const [totalLikes, setTotalLikes] = useState(entry.likes)
    const [likeDisabled, setLikeDisabled] = useState(false)

    const handleDelete = async (event, entryId) => {
        event.target.disabled = true

        if (!confirm('Are you sure you want to delete this post?')) {
            event.target.disabled = false
            return
        }

        try {
            await entriesService.deleteOne(entryId)
            dispatch(deleteEntry({ id: entryId }))
        } catch (error) {
            console.log(error)
        }
    }

    const handleLike = async (entryId) => {
        setLikeDisabled(true)

        const entry = await entriesService.getOne(entryId) 
        const user = await usersService.getCurrentUser()

        let entryLikedByArr = entry.likedBy
        let userLikedArr = user.likes
        let likesIncrement = 0

        if (entryLikedByArr.includes(user.id)) {
            entryLikedByArr = entryLikedByArr.filter(id => id !== user.id)
            likesIncrement = -1
        } else {
            entryLikedByArr = entryLikedByArr.concat(user.id)
            likesIncrement = 1
        }

        if (userLikedArr.includes(entryId)) {
            userLikedArr = userLikedArr.filter(id => id !== entryId)
        } else {
            userLikedArr = userLikedArr.concat(entryId)
        }

        let updatedUserDetails = {
            likes: userLikedArr
        }

        const updatedEntryDetails = {
            likedBy: entryLikedByArr,
            likes: totalLikes + likesIncrement
        }

        try {
            await usersService.updateOne(updatedUserDetails)
            await entriesService.updateOne(entryId, updatedEntryDetails)
            setTotalLikes(likesIncrement + totalLikes)
            dispatch(setUser({ ...user, likes: userLikedArr }))

            setTimeout(() => {
                setLikeDisabled(false)
            }, 500)
        } catch (error) {
            console.log(error)
        }
    }


    return (
        <div className='
            outline-1 outline-black rounded
            my-[0.25rem]
            px-[0.5rem]
            ' 
            key={entry.id}
        >
            <h2 className="
                font-bold 
                text-lg
                leading-tight
                py-[0.25rem]">
                {entry.title} 
            </h2> 
            <p className="font-normal text-xs">
                    • Posted {postedMessage} • Author: {entry.user.username}
            </p>
            <hr className="mt-[0.5rem]"></hr>
            <p className="text-sm py-[0.25rem]">
                {entry.content}
            </p>
{/* 
            {
                showPostToolbar &&  */}
                <div className="
                    flex flex-row justify-content"
                >
                    <button className="
                        flex flex-row items-center
                       " onClick={likeDisabled ? undefined : () => handleLike(entry.id)}>
                        {/* heart */}
                        <svg className="
                            w-auto h-[1rem] 
                            mr-[0.1rem] mt-[0.1rem]
                            outline-1 outline-black rounded" 
                            xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={showRedHeart ? "red" : "none"} stroke="black" >
                            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/> 
                        </svg>
                        <p>{totalLikes}</p>
                    </button>
                    

                    {showDeleteButton && <button onClick={(event) => handleDelete(event, entry.id)}>
                        <svg className="
                            w-auto h-[1rem] 
                            ml-[0.75rem] mt-[0.1rem]" 
                            xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                            <path d="M3 6h18M6 6v12a3 3 0 003 3h6a3 3 0 003-3V6M9 6V4a2 2 0 012-2h6a2 2 0 012 2v2M10 11v5M14 11v5" fill="none" stroke="black"/>
                        </svg>
                    </button>}   
                </div>
            {/* } */}
        </div>
    )
}

const EntriesDisplay = ({ nowDisplaying }) => {
    const user = useSelector(state => state.user)
    const entries = useSelector(state => state.entries)

    const timeSincePost = (timePosted) => {
        const timeCurrent = new Date().getTime()

        const secondsElapsed = (timeCurrent - timePosted) / 1000

        console.log('Seconds elapsed:', secondsElapsed)
        let message = ''
        if (secondsElapsed < 60) {
            message = 'just now'
        } else if (secondsElapsed < 3600) {
            message = `${parseInt(secondsElapsed / 60)} minutes ago`
        } else if (secondsElapsed < 86400) {
            message = `${parseInt(secondsElapsed / 3600)} hour(s) ago`
        } else {
            message = `${parseInt(secondsElapsed / 86400)} day(s) ago`
        }

        return message
    }

    let displayedEntries = [];

    if (nowDisplaying == 'All entries') {
        displayedEntries = entries
    } else if (nowDisplaying == 'Liked entries') {
        displayedEntries = entries.filter(e => user.likes.includes(e.id))
    } else if (nowDisplaying == 'Your entries') {
        displayedEntries = entries.filter(e => user.entries.some(p => p.id === e.id))
    }

    return (
        <div>
            <h1 className="half-margin">{nowDisplaying}</h1>
            
             <div className="
                w-screen
                flex flex-col justify-content
                mt-[1rem]
                px-[0.5rem]">
                {
                [...displayedEntries].reverse().map(entry => (
                    <Entry 
                        key={entry.id} entry={entry} postedMessage={timeSincePost(entry.date)} showPostToolbar={Object.keys(user).length !== 0} showRedHeart={user?.likes?.includes(entry.id)} showDeleteButton={user?.entries?.some(e => e.id === entry.id)} />
                ))    
                }       
                </div>
      </div>
       
    )
}

export default EntriesDisplay