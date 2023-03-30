import dotenv from 'dotenv';
dotenv.config()

const pos = {
    user:process.env.USER,
    password:process.env.PASSWORD,
    server:process.env.SERVER,
    database:process.env.DATABASE
}

export default pos;