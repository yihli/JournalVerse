require('dotenv').config()

const info = (details) => {
    if (process.env.NODE_ENV !== 'test') {
        console.log(details)    
    }
}

module.exports = {
    info
}