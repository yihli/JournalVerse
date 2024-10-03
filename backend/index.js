const app = require('./app')
const config = require('./utils/config')

console.log('Starting app')

app.listen(config.PORT, () => {
    console.log(`Listening to PORT ${config.PORT}`)
})


