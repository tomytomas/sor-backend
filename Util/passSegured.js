import bcrypt from "bcrypt";

const saltRounds = 8;

export const encrypt = async (passwordPlain) => {
    return await bcrypt.hash(passwordPlain, saltRounds);
};

export const compare = async (passwordPlain, hashedPassword) => {
    console.log(passwordPlain, hashedPassword);
    return await bcrypt.compare(passwordPlain, hashedPassword);
};
