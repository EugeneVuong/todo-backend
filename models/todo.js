const mongoose = require('mongoose')

const todoSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: String,
    completed: Boolean, 
    user: {
        type: mongoose.Types.ObjectId,
        ref: 'User'
    }
})

todoSchema.set('toJSON', {
    transform: (document, returnedDocument) => {
        returnedDocument.id = returnedDocument._id.toString();
        delete returnedDocument._id;
        delete returnedDocument.__v
    }
})

const Todo = mongoose.model('Todo', todoSchema)

module.exports = Todo