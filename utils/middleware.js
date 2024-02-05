const jwt = require('jsonwebtoken')
const { SECRET_KEY } = require('./config')

const tokenParser = (request, response, next) => {
    const authorization = request.get('authorization')
    if (authorization && authorization.startsWith('Bearer ')) {
        request.token = authorization.replace('Bearer ', '')
    } 

    next()
}

const userExtractor = (request, response, next) => {
    request.user = jwt.verify(request.token, SECRET_KEY)

    next()
}

const errorHandler = (error, request, response, next) => {
    console.log(error.name)
    if (error.name === 'ValidationError') {
        response.status(400).json({ error: 'Validation Error' })
    } else if (error.name === 'CastError') {
        response.status(404).json({ error: 'Not Found'})
    } else if (error.name === 'JsonWebTokenError') {
        response.status(403).json({ error: 'invalid token' })
    } else if (error.name === 'TokenExpiredError') {
        response.status(403).json({ error: 'token expired' })
    }
    
    next()
}

const unknownEndpoint = (request, response) => {
    response.status(404).json({ error: 'Unknown Endpoint' })
}

module.exports = { errorHandler, unknownEndpoint, tokenParser, userExtractor }