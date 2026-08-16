const jwt = require("jsonwebtoken");

function generateToken(user) {
    return jwt.sign(
        {
            id: user.id,
            email: user.email,
            rol: user.rol
        },
        process.env.JWT_SECRET,
        {
            expiresIn: process.env.JWT_EXPIRES_IN
        }
    );
}

function verifyToken(token) {
    return jwt.verify(token, process.env.JWT_SECRET);
}

module.exports = {
    generateToken,
    verifyToken
};