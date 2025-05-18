const jwt = require("jsonwebtoken");

const tokenSign = async(user, time) => {
    return jwt.sign(user, process.env.JWT_SECRET, { expiresIn: time })
};

const tokenVerify = async(token) => {
    try {
        return jwt.verify(token, process.env.JWT_SECRET)
    } catch (error) {
        return error
    }
};

module.exports = { tokenSign, tokenVerify };