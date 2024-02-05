const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    hashedPassword: {
        type: String,
        required: true
    },
    todos: {
        type: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Todo'
        }] 
    }
})

userSchema.plugin(uniqueValidator)

userSchema.set('toJSON', {
    transform: (document, returnedDocument) => {
        returnedDocument.id = returnedDocument._id.toString()
        delete returnedDocument.hashedPassword;
        delete returnedDocument._id;
        delete returnedDocument.__v;
    }
})


const User = mongoose.model('User', userSchema)

module.exports = User