const jwt = require('jsonwebtoken');
const SECRET_KEY = "sbce-auth-secret-key";

const requireAuth = (req, res, next) => {
    // To obtain token from cookies
    const token = req.cookies.accessToken;
    console.log("Token", token);

    // To obtain token from the headers
    const headerToken = req.header('x-auth-token');
    console.log("Header token: ", headerToken);

    // check jsonwebtoken exists & is verified
    if(headerToken){
        jwt.verify(headerToken, SECRET_KEY, (err, decodedToken) => {
            if(err){
                console.log(err.message);
                res.status(401).json({"error": "user unauthorized"});
            }else{
                console.log(decodedToken);
                next();
            }
        });
    }else{
        res.status(401).json({"error": "user unauthorized"});
    }
};

module.exports = { requireAuth };