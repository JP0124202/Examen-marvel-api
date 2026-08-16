const authService = require("../services/auth.service");

async function register(req, res) {

    try {

        const result = await authService.register(req.body);

        return res.status(201).json(result);

    } catch (error) {

        return res.status(400).json({
            success: false,
            message: error.message
        });

    }

}

async function login(req, res) {

    try {

        const result = await authService.login(req.body);

        return res.json(result);

    } catch (error) {

        return res.status(401).json({
            success: false,
            message: error.message
        });

    }

}

function me(req, res) {

    return res.json({
        success: true,
        data: req.user
    });

}

module.exports = {
    register,
    login,
    me
};
