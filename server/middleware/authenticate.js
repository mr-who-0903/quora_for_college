const jwt = require('jsonwebtoken');
const {User, Question} = require('../model/userSchema');

const authenticate = async (req, res, next) =>{

    try{ 
        const getToken = req.cookies.jwtoken;
        const verifyToken = jwt.verify(getToken, process.env.SECRET_KEY);

        const rootUser = await User.findOne({_id:verifyToken._id, "tokens.token":getToken});

        if(!rootUser) {throw new Error( 'User not found' )}

        req.token = getToken;
        req.rootUser = rootUser;
        req.userID = rootUser._id;

        next();

    }
    catch(err){
        res.status(401).send('Unauthorized: No token provided');
        console.log(err);
    }
}

module.exports = authenticate;