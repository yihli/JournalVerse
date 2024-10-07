require('dotenv').config()

// only allow printing in the test environment
const info = (details) => {
    if (process.env.NODE_ENV !== 'test') {
        console.log(details)    
    }
}

module.exports = {
    info
}