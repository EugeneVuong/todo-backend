const User = require('../models/user')
const userRouter = require('express').Router()
const bcrypt = require('bcrypt')

// Get Users
userRouter.get('/', async (request, response) => {
    const users = await User.find({ })
    response.status(200).json(users)
})

// Get User By ID
userRouter.get('/:id', async (request, response, next) => {

    const id = request.params.id
    
    try {
        const user = await User.findById(id)
        response.status(200).json(user)
    } 
    catch (error) {
        next(error)
    }

})

userRouter.post('/', async (request, response, next) => {

    const body = request.body

    const saltOrRound = 10
    const hashedPassword = await bcrypt.hash(body.password, saltOrRound)

    try {
        const newUser = new User({ name: body.name, username: body.username, hashedPassword })
        const user = await newUser.save()
        response.status(201).json(user)
    }
    catch (error){
        next(error)
    }

})


module.exports = userRouter