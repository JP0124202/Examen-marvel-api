const jwtUtil = require("../utils/jwt");
const bcrypt = require("bcrypt");
const authModel = require("../models/auth.model");

async function register(data) {

    const { nombre, email, password, rol } = data;

    const existingUser = await authModel.findByEmail(email);

    if (existingUser) {
        throw new Error("El correo electrónico ya está registrado.");
    }

    if (password.length < 8) {
        throw new Error("La contraseña debe tener mínimo 8 caracteres.");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await authModel.create({
        nombre,
        email,
        password: hashedPassword,
        rol
    });

    return {
        success: true,
        message: "Usuario registrado correctamente.",
        data: user
    };

}

async function login(data) {

    const { email, password } = data;

    const user = await authModel.findByEmail(email);

    if (!user) {
        throw new Error("Credenciales inválidas");
    }

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
        throw new Error("Credenciales inválidas");
    }

    const token = jwtUtil.generateToken(user);

    return {
        success: true,
        message: "Login exitoso",
        token
    };

}

module.exports = {
    register,
    login
};