const User = require('../models/user')
const loginRouter = require('express').Router()
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const { SECRET_KEY } = require('../utils/config')


loginRouter.post('/', async (request, response, next) => {
    const { username, password } = request.body

    try {
        // Find User
        const user = await User.findOne({ username })


        const passwordCorrect =
            user === null ? false : await bcrypt.compare(password, user.hashedPassword) // Output True/False

        if (!(user && passwordCorrect)) {
            return response.status(401)
                .json({ error: 'incorrect username or password' })
        }


        // Need to Learn this More
        const userForToken = {
            username: user.username,
            id: user._id
        }

        const token = jwt.sign(userForToken, SECRET_KEY, { expiresIn: 60*60 })

        

        response.status(200)
            .json({ name: user.name, username: user.username, token })
    }
    catch (error) {
        next(error)
    }
})

module.exports = loginRouter