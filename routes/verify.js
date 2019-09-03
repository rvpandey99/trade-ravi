const jwt = require('jsonwebtoken');

const verify = (req,res,next) => {
    const token = req.header('authToken');
    if (!token) return res.status(401).send('Access Denied. Please log in.');

    try {
        const verified = jwt.verify(token, process.env.SECRET);
        req.user = verified;
        next();
    } catch(err) {
        return res.status(400).send('Invalid token.');
   }
}

module.exports = verify;
