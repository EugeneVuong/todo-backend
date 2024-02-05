const app = require('./app')
const { PORT } = require('./utils/config')

app.listen(PORT, () => {
    console.log(`To-Do Application is Running on ${PORT}`)
})

