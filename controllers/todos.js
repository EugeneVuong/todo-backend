const todoRouter = require('express').Router()
const Todo = require('../models/todo')
const User = require('../models/user')

// Gets all the Todos
todoRouter.get('/', async (request, response) => {
    const userData = request.user
    try {
        // Get the User
        const user = await User.findById(userData.id)

        const todos = await Todo.find({ user: user._id }).populate('user', { username: 1, id: 1, name: 1 })
        response.status(200).json(todos)
    }
    catch (error) {
        next(error)
    }
})

// Get One Todo by ID
todoRouter.get('/:id', async (request, response, next) => {
    const id = request.params.id
    const userData = request.user
    try {        
        const todo = await Todo.findById(id).populate('user', { username: 1, id: 1, name: 1 })
        if (!(todo.user._id.toString() === userData.id)) {
            return response.status(403).json({ error: 'Forbidden' })
        }

        response.status(200).json(todo)
    }
    catch (error) {
        next(error)
    }
})

// Finds the ID and Deletes it From the Query
todoRouter.delete('/:id', async (request, response, next) => {
    const id = request.params.id
    const userData = request.user

    
    try {

        const todo = await Todo.findById(id).populate('user', { username: 1, id: 1, name: 1 })
        if (!(todo.user._id.toString() === userData.id)) {
            return response.status(403).json({ error: 'Forbidden' })
        }

        await Todo.findByIdAndDelete(id)
        response.status(204).end()
    }
    catch (error) {
        next(error)
    }
})

// Creates a Todo
todoRouter.post('/', async (request, response, next) => {
    // ^ Middleware Checks if JSONWebToken is Valid
    const userData = request.user
    const body = request.body
    try {
        // Gets the User
        const user = await User.findById(userData.id)
    
        // Creates a New Todo
        const newTodo = new Todo({
            title: body.title,
            content: body.content,
            completed: body.completed || false,
            user: user._id // Adds the User 
        })


        // Saves the Todo in MongoDB
        const savedTodo = await newTodo.save()

        // Add Todo to User Data
        user.todos.push(savedTodo._id)
        await user.save()


        response.status(201).json(savedTodo)
    }
    catch (error) {
        next(error)

    }
    


    
})

// Find ID and Update
todoRouter.put('/:id', async (request, response, next) => {
    const id = request.params.id
    const body = request.body
    const userData = request.user
    const updatedTodo = {title: body.title, content: body.content, completed: body.completed}
    try {

        const todo = await Todo.findById(id).populate('user', { username: 1, id: 1, name: 1 })
        if (!(todo.user._id.toString() === userData.id)) {
            return response.status(403).json({ error: 'Forbidden' })
        }

        const newTodo = await Todo.findByIdAndUpdate(id, updatedTodo, { new: true , runValidators: true })
        console.log(newTodo)
        response.status(201).json(newTodo)
    }
    catch (error) {
        next(error)
    }
})

module.exports = todoRouter