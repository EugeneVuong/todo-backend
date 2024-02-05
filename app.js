const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const morgan = require('morgan')

const middleware = require('./utils/middleware')

const todoRouter = require('./controllers/todos')
const userRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')

const { MONGODB_URI } = require('./utils/config')


const app = express()

// Setting up MongoDB
mongoose.set('strictQuery', false)
mongoose.connect(MONGODB_URI)
    .then(() => {
        console.log('MongoDB Database Connected')
    })
    .catch((error) => {
        console.log(`MongoDB Database Error: ${error}`)
    })


// Setting up Middleware and Routers
app.use(cors())
app.use(express.json())
app.use(morgan('common'))
app.use(middleware.tokenParser)
app.use('/api/todo', middleware.userExtractor, todoRouter)
app.use('/api/user', userRouter)
app.use('/api/login', loginRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)



module.exports = app