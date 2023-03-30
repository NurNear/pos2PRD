import dotenv from 'dotenv';
dotenv.config()
import sql from 'mssql'
import pos from '../config/pos.config.js'

const options = {
    encrypt: false,
    trustServerCertificate: true,
    dateStrings: false
}
const config = { ...pos, options }

export async function connectDB(query) {
    try {
        await sql.connect(config);
        const request = await new sql.Request();
        const rsQuery = await request.query(query);
        return rsQuery.recordset;
    } catch (error) {
        console.error();
    }
}
