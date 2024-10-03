import { useState, useRef, useEffect } from 'react'
import entriesService from '../services/entries'
import usersService from '../services/users'

const EntryForm = ({ handleShowEntryForm, entries, setEntries, user, setUser }) => {
    const [content, setContent] = useState('')
    const [title, setTitle] = useState('')
    const [error, setError] = useState(null)

    const titleRef = useRef(null)
    const contentRef = useRef(null)

    useEffect(() => {
        if (titleRef.current && contentRef.current) {
            titleRef.current.style.height = 'auto';
            titleRef.current.style.height = `${titleRef.current.scrollHeight}px`;
            
            contentRef.current.style.height = 'auto';
            contentRef.current.style.height = `${contentRef.current.scrollHeight}px`;
        }
    } ,[])

    const showError = (message) => {
        setError(message)
        setTimeout(() => {
            setError(null)
        }, 5000)
    }

    const handleContentInput = (event) => {
        if (event.target.value.length <= 1000) {
            setContent(event.target.value.replace(/\n/g, ''))
            event.target.style.height = 'auto'
            event.target.style.height = `${event.target.scrollHeight}px`
        }
    }

    const handleTitleInput = (event) => {
        if (event.target.value.length <= 75) {
            setTitle(event.target.value.replace(/\n/g, ''))
            event.target.style.height = 'auto'
            event.target.style.height = `${event.target.scrollHeight}px`
        }
    }

    const handleFormSubmit = async (event) => {
        event.preventDefault()
        
        if (/^\s+$/g.test(title) || /^\s+$/g.test(content) || title == '' || content == '') {
            return showError('One or more fields are missing.')
        }

        const newEntry = {
          title,
          content
        }

        console.log('newEntry (EntryForm.jsx)', newEntry)
    
        try {
            const returnedEntry = await entriesService.createOne(newEntry)
            console.log(returnedEntry)
            const postedUser = await usersService.getCurrentUser()

            handleShowEntryForm()
            console.log({ ...returnedEntry, user: { id: postedUser.id } })
            setEntries(entries.concat({ ...returnedEntry, user: { username: postedUser.username, id: postedUser.id } }))
            setUser({ ...user, entries: user.entries.concat(returnedEntry)})
        } catch (error) {
            setError(error.response)
            setTimeout(() => {
                setError(null)
            }, 5000)
        }
    }
    
    console.log(content.length)

    
    return (
        <div className="entry-form-container pop">
            <h1>Post an Entry</h1>
            <form className="entry-form" id="entry-form" onSubmit={handleFormSubmit}>
                <textarea ref={titleRef} type="text" className="entry-form-title-input resizeable" placeholder="Title" onChange={handleTitleInput} value={title} style={{}}/>
                <hr></hr>
                <textarea ref={contentRef} type="text" className="entry-form-content-input resizeable" placeholder="body text" onChange={handleContentInput} value={content}/>
            </form>
            {error && <p className="no-margin red">{error}</p>}
            <p className="entry-form-content-counter">Characters: {content.length}/1450</p>
            <button className="entry-form-cancel-button" onClick={handleShowEntryForm}>Cancel</button>
            <button className="entry-form-submit-button" type="submit" form="entry-form">Post</button>
        </div>
    )
}

export default EntryForm