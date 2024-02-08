const mongoose = require('mongoose');
const { isEmail } = require('validator');
const bcrypt = require('bcrypt');

const userScheme = new mongoose.Schema({
    email: {
        type: String,
        required: [true, "Please enter an email"],
        unique: true,
        lowercase: true,
        validate: [isEmail, "Please enter a valid email"]
    },
    password: {
        type: String,
        required: [true, "Please enter a password"],
        minlength: [6, "Minimum password length is 6 characters"]
    },
    role: {
        type: String,
        default: "student",
    }
});

// Mongoose hooks similar to Triggers
// Fire a function after a new user saved to the db
userScheme.post('save', (doc, next) => {
    console.log("new user created & saved: ", doc);
    next();
});

// Fire a function before doc is saved to db
userScheme.pre('save', async function (next) {
    console.log("User about to be created & saved: ", this);
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// static method to login user
userScheme.statics.login = async function (email, password) {
    const user = await this.findOne({email});
    if(user){
        const auth = await bcrypt.compare(password, user.password);
        if(auth){
            return user;
        }
        throw Error("incorrect password");
    }
    throw Error("incorrect email");
};

const User = mongoose.model('user', userScheme);

module.exports = User;