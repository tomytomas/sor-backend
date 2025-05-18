const bcrypt = require("bcrypt")
const saltRounds = 8


const encrypt = async function (passwordPlain) {
    return await bcrypt.hash(passwordPlain, saltRounds)
    
}
const compare = async(passwordPlain, hashedPassword) => {
    await console.log(passwordPlain, hashedPassword)
    return await bcrypt.compare(passwordPlain, hashedPassword)
}



module.exports = { encrypt, compare }