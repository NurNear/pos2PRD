import https from 'https';
import fs from 'fs';
import dotenv from 'dotenv';
dotenv.config()
import express from 'express';
import { connectDB } from './src/util/connectDB.js';
import bodyParser from 'body-parser';
import { handle } from './src/worker/apiHandle.js';
import Jwt from 'jsonwebtoken';
import { Decryptor, Encryptor } from 'secure-micro';

const app = express();
const PORT = process.env.PORT;

const key = 'aa3914197c677e1624e2ceee90651af8';
const encryptor = new Encryptor({ key });
const decryptor = new Decryptor({ key });

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

app.get('/', async (req, res) => {
    const rsQuery = connectDB('SELECT top(1) * FROM API_List');

    rsQuery.then((rs) => {
        // console.log(rs);
    });
    res.send('Test Connect Server');
});

app.post('/', async (req, res) => {
    try {
        const jsonDecrypt = decryptor.decrypt(req.body.data);
        const jsonData = JSON.parse(jsonDecrypt);
        let result;
        if (jsonData.api_name == "API003") {
            result = await handle(jsonData);
            const encryptRs = encryptor.encrypt(JSON.stringify(result));
            res.send(encryptRs);
        } else {
            let jwtSecretKey = process.env.JWT_SECRET_KEY;
            const jwtToken = req.headers.authorization;

            if (!jwtToken) {
                res.status(200).json({ status: false, message: "Error! Token was not provided." });
            }
            else {
                try {
                    const token = req.headers.authorization.split(' ')[1];
                    const decodedToken = Jwt.verify(token, jwtSecretKey);
                    result = await handle(jsonData);
                    const encryptRs = encryptor.encrypt(JSON.stringify(result));
                    res.send(encryptRs);
                } catch (error) {
                    res.send(error);
                }
            }
        }
    } catch (error) {
        console.log(error);
    }
});

app.post('/dev', async (req, res) => {
    const result = await handle(req.body);
    res.send(result);
});

app.post('/testJWT', async (req, res) => {
    let jwtSecretKey = process.env.JWT_SECRET_KEY;
    const jwtToken = req.headers.authorization;
    if (!jwtToken) {
        res.status(200).json({ status: false, message: "Error! Token was not provided." });
    }
    else {
        try {
            const token = req.headers.authorization.split(' ')[1];
            const decodedToken = Jwt.verify(token, jwtSecretKey);
        } catch (error) {

        }
    }
});

app.post('/decrypytJson', (req, res) => {
    console.log(req.body);
    try {
        const jsonDecrypt = decryptor.decrypt(req.body.data);
        const jsonData = JSON.parse(jsonDecrypt);
        res.send(jsonDecrypt);
    } catch (error) {
        console.log(error)
    }
});

app.post('/encrypytJson', (req, res) => {
    console.log(req.body);
    try {
        const jsonEncrypt = encryptor.encrypt(req.body.data);
        res.send(jsonEncrypt);
    } catch (error) {
        console.log(error)
    }
});

app.get('/upload', async (req, res) => {
    const file = req.body.data;
    const filePath = "path1/path2/";
    const fileName = "test";
    const fileType = "jpg";
    const rs = await uploadFile(file, filePath, fileName, fileType);
});

var options = {
  pfx: fs.readFileSync("./microleasing2023.pfx"),
  passphrase: "Micro1234",
};

https.createServer(options, app).listen(PORT, function (req, res) {
  console.log(`Server start Port: ${PORT}`);
});

// app.listen(PORT, () => console.log(`Server start Port: ${PORT}`));