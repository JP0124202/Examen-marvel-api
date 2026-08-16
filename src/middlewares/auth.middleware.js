const jwtUtil = require("../utils/jwt");

function authenticateToken(req, res, next) {

    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({
            success: false,
            message: "Token no proporcionado."
        });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).json({
            success: false,
            message: "Token inválido."
        });
    }

    try {

        const decoded = jwtUtil.verifyToken(token);

        req.user = decoded;

        next();

    } catch (error) {

        return res.status(401).json({
            success: false,
            message: "Token expirado o inválido."
        });

    }

}

module.exports = authenticateToken;