import db from "../db.js";

export const getProducts = async () => {
    try {
        const query = "select * from pasteleria_";
        const row = await db.query(query);
        return row;  
    } catch (error) {
        error.message = error.code;
        return error;
    }
};

export const getProduct = async (id) => {
    try {
        const query = "select * from pasteleria_ where id =?";
        const rows = await db.query(query, [id]);
        return rows; 
    } catch (error) {
        error.message = error.code;
        return error;
    }
};

export const addProduct = async (data) => {
    try {
        console.log("que onda wachoooo");
        const query = "insert into pasteleria_ set ?";
        const row = await db.query(query, [data]);
        return row;
    } catch (error) {
        error.message = error.code;
        return error;
    }
};

export const deleteProduct = async (id) => {
    try {
        const query = "delete from pasteleria_ where id = ?";
        const row = await db.query(query, [id]);
        return row;
    } catch (error) {
        error.message = error.code;
        return error;
    }
};

export const modifyProduct = async (data, id) => {
    try {
        const query = "update pasteleria_ set ? where id = ?";
        const row = await db.query(query, [data, id]);
        return row;
    } catch (error) {
        error.message = error.code;
        return error;
    }
};
