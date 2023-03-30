import fs from 'fs';
import axios from 'axios';

export async function uploadFile(file, filePath, fileName, fileType) {

    let path;
    let pathDB;
    let buffer;
    if (file == "") {
        path = "";
    } else {
        const dir = "../pos-2/Upload/" + filePath;
        const dirDB = "Upload/" + filePath;
        if (!fs.existsSync(dir)) {
            await fs.mkdirSync(dir, { recursive: true });
        }
        
        if (fileType == "pdf") {
            buffer = Buffer.from(file, "base64");
        } else {
            // const getSource = file.split('base64,')[1];
            buffer = Buffer.from(file, "base64");
        }
        path = dir + fileName + "." + fileType;
        pathDB = dirDB + fileName + "." + fileType; //
        await fs.writeFileSync(path, buffer);
    }

    return pathDB;
}

export async function encodeBase64(filePath) {
    if(filePath == "" || !fs.existsSync(filePath)){
        return "";
    }
    const base64 = await fs.readFileSync(filePath, "base64")

    return base64;
}

export async function encodeBase64URL(path) {
    let imgBase64;
    if (path == "") {
        imgBase64 = "";
    } else {
        let img = await axios.get(path, { responseType: 'arraybuffer' });
        imgBase64 = await Buffer.from(img.data).toString('base64');
    }

    return imgBase64;
}