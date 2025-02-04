import db from "../db.js";

export const getUser = async (mail) => {
  try{
  const query = `SELECT * FROM users WHERE mail = '${mail}'`;
  const row = await db.query(query);
  return row;
  }catch (error){
    error.message = error.code
    return error
  }
};

