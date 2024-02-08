const User = require('../models/userModel');
const jwt = require('jsonwebtoken');

const SECRET_KEY = "sbce-auth-secret-key";
const maxAge = 3 * 24 * 60 * 60;

module.exports.test_router = (req, res) => {
    res.send("Testing route success");
}

//Handle errors
const handleErrors = (err) => {
    console.log(err.message, err.code);
    let errors = { email: '', password: ''};

    // handling incorrect email
    if(err.message === 'incorrect email'){
        errors.email = "That email is not registered";
    }

    // handling incorrect password
    if(err.message === 'incorrect password'){
        errors.password = "password entered is incorrect";
    }

    //Duplicate error code handling
    if(err.code == 11000){
        errors.email = "That email is already registered";
        return errors;
    }

    // Validation errors
    if(err.message.includes('user validation failed')){
        Object.values(err.errors).forEach(({properties}) => {
            errors[properties.path] = properties.message;
        });
    }
    return errors;
};

const createToken = (id) => {
    return jwt.sign({id}, SECRET_KEY, {
        expiresIn: maxAge
    });
};

module.exports.signup_post = async (req, res) => {
    const {email, password} = req.body;
    try{
        const user = await User.create({email, password});
        const token = createToken(user._id);
        console.log("Token:", token);
        res.cookie('accessToken', token, {httpOnly: true, maxAge: maxAge * 1000});
        res.status(201).json({"id": user._id, "email": user.email, "access-token": token});
    }catch(err){
        const errors = handleErrors(err);
        res.status(400).send({errors});
    }
}

module.exports.login_post = async (req, res) => {
    const {email, password} = req.body;
    try{
        // Calling the static login method created
        const user = await User.login(email, password);
        const token = createToken(user._id);
        res.cookie("accessToken", token, {httpOnly: true, maxAge: maxAge * 1000});
        res.status(200).json({"id": user._id, "email": user.email, "access-token": token});
    }catch(err){
        const errors = handleErrors(err);
        res.status(400).json(errors);
    }
}

// Protected route
module.exports.home_route = (req, res) => {
    res.status(200).json({"msg": "reached home route"});
};