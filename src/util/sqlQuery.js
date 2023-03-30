import { connectDB } from "./connectDB.js";

export async function sqlQuery(storeName, reqBody){
    const sqlCMD = `EXEC ${storeName} '${reqBody.api_name}','${reqBody.token}','${reqBody.personnel_code}','${reqBody.target}','${reqBody.cvar1}','${reqBody.cvar2}','${reqBody.cvar3}','${reqBody.cvar4}','${reqBody.cvar5}','${reqBody.cvar6}','${reqBody.cvar7}','${reqBody.cvar8}','${reqBody.cvar9}','${reqBody.cvar10}','${reqBody.cvar11}','${reqBody.cvar12}','${reqBody.cvar13}','${reqBody.cvar14}','${reqBody.cvar15}','${reqBody.cvar16}','${reqBody.cvar17}','${reqBody.cvar18}','${reqBody.cvar19}','${reqBody.cvar20}','${reqBody.cvar21}','${reqBody.cvar22}','${reqBody.cvar23}','${reqBody.cvar24}','${reqBody.cvar25}','${reqBody.cvar26}','${reqBody.cvar27}','${reqBody.cvar28}','${reqBody.cvar29}','${reqBody.cvar30}'`;
    console.log(sqlCMD);
    const sqlQuery = connectDB(sqlCMD);
    const sqlResult = await sqlQuery.then((res) => {
        return res;
    });
    return sqlResult;
}

export async function sqlQueryStore(reqBody) {
    const apiName = `EXEC S_API_List '${reqBody.api_name}'`;
    const getStoreName = connectDB(apiName);
    const storeName = await getStoreName.then((res) => {
        return res;
    });
    const sqlCMD = `EXEC ${storeName[0].Store_name} '${reqBody.api_name}','${reqBody.token}','${reqBody.personnel_code}','${reqBody.target}','${reqBody.cvar1}','${reqBody.cvar2}','${reqBody.cvar3}','${reqBody.cvar4}','${reqBody.cvar5}','${reqBody.cvar6}','${reqBody.cvar7}','${reqBody.cvar8}','${reqBody.cvar9}','${reqBody.cvar10}','${reqBody.cvar11}','${reqBody.cvar12}','${reqBody.cvar13}','${reqBody.cvar14}','${reqBody.cvar15}','${reqBody.cvar16}','${reqBody.cvar17}','${reqBody.cvar18}','${reqBody.cvar19}','${reqBody.cvar20}','${reqBody.cvar21}','${reqBody.cvar22}','${reqBody.cvar23}','${reqBody.cvar24}','${reqBody.cvar25}','${reqBody.cvar26}','${reqBody.cvar27}','${reqBody.cvar28}','${reqBody.cvar29}','${reqBody.cvar30}'`;
    console.log(sqlCMD);
    const sqlQuery = connectDB(sqlCMD);
    const sqlResult = await sqlQuery.then((res) => {
        return res;
    });
    return sqlResult;
}

export async function sqlQueryView(reqBody) {

    const apiName = `EXEC S_API_List '${reqBody.api_name}'`;
    console.log(apiName);
    const getStoreName = connectDB(apiName);
    const storeName = await getStoreName.then((res) => {
        return res;
    });

    const sqlCMD = `SELECT * FROM ${storeName[0].Store_name}`;
    console.log(sqlCMD);
    const sqlQuery = connectDB(sqlCMD);
    const sqlResult = await sqlQuery.then((res) => {
        return res;
    });
    return sqlResult;
}