import { sqlQuery, sqlQueryStore, sqlQueryView } from "../util/sqlQuery.js";
import pos from "../models/pos.model.js"
import axios from 'axios';
import { connectDB } from "../util/connectDB.js";
import { encodeBase64, encodeBase64URL, uploadFile } from "../util/convertFile.js";
import { getDate } from "../util/getDate.js";
import { convertDate } from "../util/convertDate.js";

export async function handle(reqBody) {
    let posSchema = { ...pos.posSchema };
    let rs, file, filePath, fileName, fileType, rsUpload;
    const date = getDate();
    switch (reqBody.api_name) {
        case 'API001':
            rs = await sqlQueryStore(reqBody);
            if (rs.length === 0) {
                posSchema.status = 404;
                posSchema.message = "not found";
                break;
            }
            posSchema.status = 200;
            posSchema.cvar1 = rs;
            break;

        case 'API002':
            rs = await sqlQueryStore(reqBody);
            if (rs.length === 0) {
                posSchema.status = 404;
                posSchema.message = "not found";
                break;
            }
            posSchema.status = 200;
            posSchema.cvar1 = rs;
            break;

        case 'API003':
            let posSchemaLogin = { ...pos.posSchemaLogin };

            const params = {
                username: reqBody.cvar1,
                password: reqBody.cvar2
            }
            const result = await axios.post('http://192.168.90.131:7101/login', params);
            if (result.data.status === 404) {
                posSchemaLogin.status = 401,
                    posSchemaLogin.message = "User หรือ Password ไม่ถูกต้อง"
            } else {
                const personnel_code = result.data.data[0].personnel_code;
                rs = await connectDB(`EXEC S_Privilege '${personnel_code}'`);
                posSchemaLogin.status = 200;
                posSchemaLogin.jwtToken = result.data.token
                posSchemaLogin.message = "Loing สำเร็จ"
                posSchemaLogin.cvar1 = rs;
            }
            return posSchemaLogin;
            break;

        case 'API004':
            rs = await sqlQueryStore(reqBody);

            if(rs === undefined){
                console.log("No Data");
            }

            //if (rs.length === 0) {
            if (rs === undefined || rs.length === 0) {
                posSchema.status = 404;
                posSchema.message = "ไม่พบข้อมูลรายการใบคำขอ";
                break;
            }
            posSchema.status = 200;
            posSchema.cvar1 = rs;
            break;

        case 'API005':
            rs = await sqlQueryStore(reqBody);
            if (rs.length === 0) {
                posSchema.status = 404;
                posSchema.message = "ไม่พบข้อมูล Notification";
                break;
            }
            posSchema.status = 200;
            posSchema.cvar1 = rs;
            break;

        case 'API006':
            rs = await sqlQueryStore(reqBody);
            posSchema.status = 200;
            posSchema.message = "ออกจากระบบ";
            break;

        case 'API007':
            rs = await sqlQueryStore(reqBody);
            if (rs.length === 0) {
                posSchema.status = 404;
                posSchema.message = "ไม่พบข้อมูลข้อมูลลูกค้า";
                break;
            }
            posSchema.status = 200;
            posSchema.cvar1 = rs;
            break;

        case 'API008':
            rs = await sqlQueryStore(reqBody);
            if (rs.length === 0) {
                posSchema.status = 404;
                posSchema.message = "ไม่พบข้อมูลรายละเอียดลูกค้า";
                break;
            }
            posSchema.status = 200;
            posSchema.cvar1 = rs;
            break;

        case 'API009':
            rs = await sqlQueryStore(reqBody);
            if (rs.length === 0) {
                posSchema.status = 404;
                posSchema.message = "not found";
                break;
            }
            posSchema.status = 200;
            posSchema.cvar1 = rs;
            break;

        case 'API010':
            rs = await sqlQueryStore(reqBody);

            posSchema.status = 200;
            posSchema.message = "Clear Notification Success";
            break;

        case 'API011':
            posSchema.status = 200;
            posSchema.cvar1 = "ยินยอมตามข้อตกลงของบริษัท ไมโครลิสซิ่ง จำกัด (มหาชน) บริษัทไมโครลิสซิ่ง (มหาชน) จำกัด (“บริษัท”) ขอแนะนำให้ท่าน (“ลูกค้าหรือคู่ค้า”) ทำความเข้าใจนโยบายส่วนบุคคล (privacy policy) นี้ เนื่องจากนโยบายนี้อธิบายถึงวิธีการที่บริษัทปฏิบัติต่อข้อมูลส่วนบุคคลของท่าน เช่น การเก็บรวบรวม  การจัดเก็บรักษา การใช้ การเปิดเผย รวมถึงสิทธิต่างๆ ของท่าน เป็นต้น เพื่อให้ท่านได้รับทราบถึงนโยบายในการคุ้มครองข้อมูลส่วนบุคคลของบริษัท บริษัท จึงประกาศนโยบายส่วนบุคคลดังต่อไปนี้ ข้อมูลส่วนบุคคล “ข้อมูลส่วนบุคคล” หมายถึง ข้อมูลที่สามารถระบุตัวตนของท่าน หรืออาจจะระบุตัวตนของท่านได้ ไม่ว่าทางตรงหรือทางอ้อม การเก็บรวบรวมข้อมูลส่วนบุคคลอย่างจำกัด การจัดเก็บรวบรวมข้อมูลส่วนบุคคลจะกระทำโดยมีวัตถุประสงค์ ขอบเขต และใช้วิธีการที่ชอบด้วยกฎหมายและเป็นธรรมในการเก็บรวบรวมและจัดเก็บข้อมูล ตลอดจนเก็บรวบรวม และจัดเก็บข้อมูลส่วนบุคคลอย่างจำกัดเพียงเท่าที่จำเป็นแก่การเสนอขายสินค้าและให้บริการ หรือเสนอขายและให้บริการด้วยวิธีการทางอิเล็กทรอนิกส์อื่นใดภายใต้วัตถุประสงค์ของบริษัทเท่านั้น ทั้งนี้ บริษัทจะดำเนินการให้เจ้าของข้อมูลรับรู้ ให้ความยินยอมทางอิเล็กทรอนิกส์ ข้อความสั้น (Short Message Service) หรือตามแบบวิธีของบริษัท บริษัทอาจจัดเก็บข้อมูลส่วนบุคคลของท่านซึ่งเกี่ยวกับการบริการที่ท่านใช้ ซึ่งอาจประกอบด้วยเรื่อง เชื้อชาติ ศาสนา หรือปรัชญา ข้อมูลสุขภาพของท่าน ข้อมูลชีวภาพ ทุพพลภาพ ความพิการ อัตลักษณ์ หรือข้อมูลอื่นใดที่จะเป็นประโยชน์ในการให้บริการ ทั้งนี้ การดำเนินการดังกล่าวข้างต้น บริษัทจะขอความยินยอมจากท่านก่อนทำการเก็บรวบรวม เว้นแต่ 2.1 เป็นการปฏิบัติตามกฎหมาย เช่น พระราชบัญญัติคุ้มครองข้อมูลส่วนบุคคล";
            break;

        case 'API012':
            rs = await sqlQueryStore(reqBody);
            if (rs.length === 0) {
                posSchema.status = 404;
                posSchema.message = "not found";
                break;
            }
            posSchema.status = 200;
            posSchema.cvar1 = rs[0].cvar1;
            posSchema.cvar2 = rs[0].cvar2;
            posSchema.cvar3 = rs[0].cvar3;
            posSchema.cvar4 = rs[0].cvar4;
            posSchema.cvar5 = rs[0].cvar5;
            break;

        case 'API013':
            // date = getDate();
            file = reqBody.cvar3;
            filePath = reqBody.cvar4 + "/CIF/";
            fileName = "CP1" + reqBody.cvar4 + date
            fileType = "png";
            rsUpload = await uploadFile(file, filePath, fileName, fileType);
            reqBody.cvar3 = rsUpload;
            rs = await sqlQueryStore(reqBody);
            posSchema.status = 201;
            posSchema.message = "บันทึกข้อมูลลูกค้าเรียบร้อยแล้ว";
            break;

        case 'API014':
            rs = await sqlQueryStore(reqBody);
            posSchema.status = 201;
            posSchema.message = "บันทึกข้อมูลที่อยู่เรียบร้อยแล้ว";
            break;

        case 'API015':
            rs = await sqlQueryStore(reqBody);
            posSchema.status = 201;
            posSchema.message = "บันทึกข้อมูลแผนที่เรียบร้อยแล้ว";
            break;

        case 'API016':
            rs = await sqlQueryStore(reqBody);
            posSchema.status = 201;
            posSchema.message = "บันทึกข้อมูลอาชีพเรียบร้อยแล้ว";
            break;

        case 'API017':
            rs = await sqlQueryStore(reqBody);
            posSchema.status = 201;
            posSchema.message = "บันทึกข้อมูลคู่สมรสเรียบร้อยแล้ว";
            break;

        case 'API018':
            // date = getDate();
            file = reqBody.cvar6;
            filePath = reqBody.cvar1 + "/CIF/";
            fileName = "CS1" + reqBody.cvar1 + date
            fileType = "png";
            rsUpload = await uploadFile(file, filePath, fileName, fileType);
            reqBody.cvar6 = rsUpload;

            file = reqBody.cvar7;
            filePath = reqBody.cvar1 + "/CIF/";
            fileName = "CS2" + reqBody.cvar1 + date
            fileType = "png";
            rsUpload = await uploadFile(file, filePath, fileName, fileType);
            reqBody.cvar7 = rsUpload;
            rs = await sqlQueryStore(reqBody);
            posSchema.status = 201;
            posSchema.message = "บันทึกข้อมูลยินยอม พรบ. เรียบร้อยแล้ว";
            break;

        case 'API019':
            // date = getDate();
            file = reqBody.cvar2;
            filePath = reqBody.cvar1 + "/CIF/";
            fileName = "CS1" + reqBody.cvar1 + date
            fileType = "png";
            rsUpload = await uploadFile(file, filePath, fileName, fileType);
            reqBody.cvar2 = rsUpload;

            file = reqBody.cvar3;
            filePath = reqBody.cvar1 + "/CIF/";
            fileName = "CS2" + reqBody.cvar1 + date
            fileType = "png";
            rsUpload = await uploadFile(file, filePath, fileName, fileType);
            reqBody.cvar3 = rsUpload;
            rs = await sqlQueryStore(reqBody);
            posSchema.status = 201;
            posSchema.message = "บันทึกข้อมูลรูปถ่ายลูกค้าเรียบร้อยแล้ว";
            break;

        case 'API020':
            rs = await sqlQueryStore(reqBody);
            posSchema.status = 200;
            posSchema.message = "เคลียร์รายการรูปเรียบร้อย";
            break;

        case 'API021':
            rs = await sqlQueryStore(reqBody);
            posSchema.status = 201;
            posSchema.message = "บันทึกข้อมูลผู้ค้ำประกันเรียบร้อยแล้ว";
            break;

        case 'API022':
            const appIdno = await sqlQuery('APPLICATION_App_Idno', reqBody);
            // console.log(appIdno);
            // return;
            const idno = appIdno[0].idno;

            // date = getDate();
            file = reqBody.cvar23;
            filePath = idno + "/" + reqBody.cvar1 + "/img_car/";
            fileName = "F" + reqBody.cvar1 + date
            fileType = "png";
            rsUpload = await uploadFile(file, filePath, fileName, fileType);
            reqBody.cvar23 = rsUpload;

            file = reqBody.cvar24;
            filePath = idno + "/" + reqBody.cvar1 + "/img_car/";
            fileName = "B" + reqBody.cvar1 + date
            fileType = "png";
            rsUpload = await uploadFile(file, filePath, fileName, fileType);
            reqBody.cvar24 = rsUpload;

            file = reqBody.cvar25;
            filePath = idno + "/" + reqBody.cvar1 + "/img_car/";
            fileName = "L" + reqBody.cvar1 + date
            fileType = "png";
            rsUpload = await uploadFile(file, filePath, fileName, fileType);
            reqBody.cvar25 = rsUpload;

            file = reqBody.cvar26;
            filePath = idno + "/" + reqBody.cvar1 + "/img_car/";
            fileName = "R" + reqBody.cvar1 + date
            fileType = "png";
            rsUpload = await uploadFile(file, filePath, fileName, fileType);
            reqBody.cvar26 = rsUpload;

            rs = await sqlQueryStore(reqBody);
            posSchema.status = 201;
            posSchema.message = "บันทึกข้อมูลสินค้าเรียบร้อยแล้ว";
            break;

        case 'API023':
            rs = await sqlQueryStore(reqBody);
            posSchema.status = 201;
            posSchema.message = "บันทึกข้อมูลการผ่อนเรียบร้อยแล้ว";
            break;

        case 'API024':
            rs = await sqlQueryStore(reqBody);
            posSchema.status = 201;
            posSchema.message = "บันทึกข้อมูลตัวแทนจำหน่ายเรียบร้อยแล้ว";
            break;

        case 'API025':
            const appIdno025 = await sqlQuery('APPLICATION_App_Idno', reqBody);
            const garunSeq = await sqlQuery('APPLICATION_App_Garuntor_seq', reqBody);
            // const date = getDate();
            if (appIdno025.length === 0) {
                posSchema.status = 406;
                posSchema.message = "ไม่สามารถบันทึกข้อมูลรูปภาพ เนื่องจากยังไม่ได้ทำรายการส่ง NCB";
                break;
            }

            if (garunSeq.length === 0) {
                file = reqBody.cvar4;
                filePath = appIdno025[0].idno + "/" + reqBody.cvar1 + "/";
                fileName = "A" + reqBody.cvar3 + reqBody.cvar1 + date
                fileType = reqBody.cvar5;
                rsUpload = await uploadFile(file, filePath, fileName, fileType);
                reqBody.cvar4 = rsUpload;
            } else {
                file = reqBody.cvar4;
                filePath = appIdno025[0].idno + "/" + reqBody.cvar1 + "/" + garunSeq[0].seq + "/";
                fileName = "A" + reqBody.cvar3 + reqBody.cvar1 + date
                fileType = reqBody.cvar5;
                rsUpload = await uploadFile(file, filePath, fileName, fileType);
                reqBody.cvar4 = rsUpload;
            }
            rs = await sqlQueryStore(reqBody);
            posSchema.status = 201;
            posSchema.message = "บันทึกข้อมูลรูปภาพเรียบร้อยแล้ว";
            break;

        case 'API026':
            // date = getDate();
            file = reqBody.cvar2;
            filePath = reqBody.cvar3 + "/" + reqBody.cvar1 + "/";
            fileName = "SIG" + reqBody.cvar1 + date
            fileType = "png";
            rsUpload = await uploadFile(file, filePath, fileName, fileType);
            reqBody.cvar2 = rsUpload;
            rs = await sqlQueryStore(reqBody);
            posSchema.status = 201;
            posSchema.message = "บันทึกข้อมูลลายเซ็นเรียบร้อยแล้ว";
            break;

        case 'API027':
            const dateAPI027 = getDate();

            const file1 = reqBody.cvar3;
            const file2 = reqBody.cvar4;
            const file3 = reqBody.cvar5;
            const file4 = reqBody.cvar6;

            filePath = reqBody.cvar2 + "/" + reqBody.cvar1 + "/NCB/";

            const fileName1 = "1_doc" + reqBody.cvar2 + dateAPI027;
            const fileName2 = "2_doc" + reqBody.cvar2 + dateAPI027;
            const fileName3 = "3_doc" + reqBody.cvar2 + dateAPI027;
            const fileName4 = "4_doc" + reqBody.cvar2 + dateAPI027;

            const fileType1 = reqBody.cvar7;
            const fileType2 = reqBody.cvar8;
            const fileType3 = reqBody.cvar9;
            const fileType4 = reqBody.cvar10;

            const rsUpload1 = await uploadFile(file1, filePath, fileName1, fileType1);
            const rsUpload2 = await uploadFile(file2, filePath, fileName2, fileType2);
            const rsUpload3 = await uploadFile(file3, filePath, fileName3, fileType3);
            const rsUpload4 = await uploadFile(file4, filePath, fileName4, fileType4);

            reqBody.cvar3 = rsUpload1;
            reqBody.cvar4 = rsUpload2;
            reqBody.cvar5 = rsUpload3;
            reqBody.cvar6 = rsUpload4;
            reqBody.cvar7 = '';

            rs = await sqlQueryStore(reqBody);
            posSchema.status = 201;
            posSchema.message = "ส่งอนุมัติตรวจสอบ NCB เรียบร้อยแล้ว";
            break;

        case 'API028':
            rs = await sqlQueryStore(reqBody);
            if (rs.length === 0) {
                posSchema.status = 404;
                posSchema.message = "ไม่พบข้อมูลเกณฑ์คะแนน NCB";
                break;
            }
            posSchema.status = 200;
            posSchema.cvar1 = rs;
            break;

        case 'API029':
            rs = await sqlQueryStore(reqBody);
            if (rs.length === 0) {
                posSchema.status = 404;
                posSchema.message = "ไม่พบข้อมูลหมายเลขถัง";
                break;
            }
            posSchema.status = 200;
            posSchema.cvar1 = rs;
            break;

        case 'API030':
            const appId = await sqlQuery('Search_App_id', reqBody);
            const appImg = await sqlQuery('APPLICATION_IMG_CARPRICE', reqBody);
            console.log(appId);
            let car = [];
            let element0 = {};
            let element1 = {};
            let element2 = {};
            let element3 = {};

            element0.path = await encodeBase64URL(appImg[0].path);
            car.push(element0);
            element1.path = await encodeBase64URL(appImg[1].path);
            car.push(element1);
            element2.path = await encodeBase64URL(appImg[2].path);
            car.push(element2);
            element3.path = await encodeBase64URL(appImg[3].path);
            car.push(element3);

            if (appId.length === 0) {
                posSchema.status = 404;
                posSchema.message = "not found";
                break;
            }
            posSchema.status = 200;
            posSchema.cvar1 = appId;
            posSchema.cvar2 = car;

            break;

        case 'API031':
            rs = await sqlQueryStore(reqBody);
            posSchema.status = 201;
            posSchema.message = "บันทึกข้อมูลประกันภัยเรียบร้อยแล้ว";
            break;

        case 'API032':
            rs = await sqlQueryStore(reqBody);
            posSchema.status = 201;
            posSchema.message = "บันทึกข้อมูลประกันชีวิตเรียบร้อยแล้ว";
            break;

        case 'API033':
            rs = await sqlQueryStore(reqBody);
            posSchema.status = 201;
            posSchema.message = "บันทึกข้อมูลอื่นๆเรียบร้อยแล้ว";
            break;

        case 'API034':
            rs = await sqlQueryStore(reqBody);
            if (rs.length === 0) {
                posSchema.status = 404;
                posSchema.message = "not found";
                break;
            }
            posSchema.status = 200;
            posSchema.cvar1 = rs;
            break;

        case 'API035':
            rs = await sqlQueryStore(reqBody);
            if (rs.length === 0) {
                posSchema.status = 404;
                posSchema.message = "ไม่พบข้อมูลรายการอนุมัติ";
                break;
            }
            posSchema.status = 200;
            posSchema.cvar1 = rs;
            break;

        case 'API036':
            rs = await sqlQueryStore(reqBody);
            if (rs.length === 0) {
                posSchema.status = 404;
                posSchema.message = "ไม่พบข้อมูลรายละเอียดใบคำขอ";
                break;
            }
            posSchema.status = 200;
            posSchema.cvar1 = rs;
            break;

        case 'API037':
            rs = await sqlQueryStore(reqBody);
            posSchema.status = 201;
            posSchema.message = "ดำเนินการใบคำขอเรียบร้อยแล้ว";
            break;

        case 'API038':
            rs = await sqlQueryStore(reqBody);
            if (rs.length === 0) {
                posSchema.status = 404;
                posSchema.message = "ไม่พบข้อมูลรายละเอียดลูกค้า";
                break;
            }

            let cus_img = "";
            if (rs[0].cus_img != "") {
                cus_img = await encodeBase64('../pos-2/' + rs[0].cus_img);
            }

            rs[0].birdte = convertDate(rs[0].birdte);
            rs[0].issdte = convertDate(rs[0].issdte);
            rs[0].expdte = convertDate(rs[0].expdte);
            rs[0].cus_img_path = rs[0].cus_img;
            rs[0].cus_img = cus_img;
            posSchema.status = 200;
            posSchema.cvar1 = rs;
            break;

        case 'API039':
            rs = await sqlQueryStore(reqBody);
            if (rs.length === 0) {
                posSchema.status = 404;
                posSchema.message = "ไม่พบข้อมูลที่อยู่";
                break;
            }
            posSchema.status = 200;
            posSchema.cvar1 = rs;
            break;

        case 'API040':
            rs = await sqlQueryStore(reqBody);
            if (rs.length === 0) {
                posSchema.status = 404;
                posSchema.message = "ไม่พบข้อมูลแผนที่";
                break;
            }
            posSchema.status = 200;
            posSchema.cvar1 = rs;
            break;

        case 'API041':
            rs = await sqlQueryStore(reqBody);
            if (rs.length === 0) {
                posSchema.status = 404;
                posSchema.message = "ไม่พบข้อมูลอาชีพ";
                break;
            }
            posSchema.status = 200;
            posSchema.cvar1 = rs;
            break;

        case 'API042':
            rs = await sqlQueryStore(reqBody);
            if (rs.length === 0) {
                posSchema.status = 404;
                posSchema.message = "ไม่พบข้อมูลคู่สมรส";
                break;
            }
            posSchema.status = 200;
            posSchema.cvar1 = rs;
            break;

        case 'API043':
            rs = await sqlQueryStore(reqBody);
            if (rs.length === 0) {
                posSchema.status = 404;
                posSchema.message = "ไม่พบข้อมูล พรบ.";
                break;
            }

            const img043_1 = await encodeBase64('../pos-2/' + rs[0].sign_cus);
            const img043_2 = await encodeBase64('../pos-2/' + rs[0].sign_staff);

            rs[0].sign_cus_path = rs[0].sign_cus;
            rs[0].sign_staff_path = rs[0].sign_staff;
            rs[0].sign_cus = img043_1;
            rs[0].sign_staff = img043_2;
            posSchema.status = 200;
            posSchema.cvar1 = rs;
            break;

        case 'API044':
            rs = await sqlQueryStore(reqBody);
            if (rs.length === 0) {
                posSchema.status = 404;
                posSchema.message = "ไม่พบข้อมูลรูปภาพยืนยัน";
                break;
            }

            const img044_1 = await encodeBase64('../pos-2/' + rs[0].idno_img);
            const img044_2 = await encodeBase64('../pos-2/' + rs[0].ver_img);

            rs[0].idno_img_path = rs[0].idno_img;
            rs[0].ver_img_path = rs[0].ver_img;

            rs[0].idno_img = img044_1;
            rs[0].ver_img = img044_2;

            posSchema.status = 200;
            posSchema.cvar1 = rs;
            break;

        case 'API045':
            rs = await sqlQueryStore(reqBody);
            if (rs.length === 0) {
                posSchema.status = 404;
                posSchema.message = "ไม่พบข้อมูลสัญญา";
                break;
            }
            posSchema.status = 200;
            posSchema.cvar1 = rs;
            break;

        case 'API046':
            rs = await sqlQueryStore(reqBody);
            if (rs.length === 0) {
                posSchema.status = 404;
                posSchema.message = "ไม่พบข้อมูลประวัติใบคำขอ";
                break;
            }
            posSchema.status = 200;
            posSchema.cvar1 = rs;
            break;

        case 'API047':
            rs = await sqlQueryStore(reqBody);
            if (rs.length === 0) {
                posSchema.status = 404;
                posSchema.message = "ไม่พบข้อมูลผู้ค้ำประกัน";
                break;
            }
            posSchema.status = 200;
            posSchema.cvar1 = rs;
            break;

        case 'API048':
            rs = await sqlQueryStore(reqBody);
            if (rs.length === 0) {
                posSchema.status = 404;
                posSchema.message = "ไม่พบข้อมูลสินค้า";
                break;
            }
            const img048_1 = await encodeBase64(rs[0].imageF);
            const img048_2 = await encodeBase64(rs[0].imageB);
            const img048_3 = await encodeBase64(rs[0].imageL);
            const img048_4 = await encodeBase64(rs[0].imageR);
            rs[0].imageF_path = rs[0].imageF;
            rs[0].imageB_path = rs[0].imageB;
            rs[0].imageL_path = rs[0].imageL;
            rs[0].imageR_path = rs[0].imageR;
            rs[0].imageF = img048_1;
            rs[0].imageB = img048_2;
            rs[0].imageL = img048_3;
            rs[0].imageR = img048_4;
            rs[0].licdte = convertDate(rs[0].licdte);
            rs[0].expdte = convertDate(rs[0].expdte);
            rs[0].regdte = convertDate(rs[0].regdte);

            posSchema.status = 200;
            posSchema.cvar1 = rs;
            break;

        case 'API049':
            rs = await sqlQueryStore(reqBody);
            if (rs.length === 0) {
                posSchema.status = 404;
                posSchema.message = "ไม่พบข้อมูลการผ่อน";
                break;
            }

            rs[0].aprvdte = convertDate(rs[0].aprvdte);
            rs[0].firstdte = convertDate(rs[0].firstdte);
            rs[0].chqdte = convertDate(rs[0].chqdte);
            rs[0].trandte = convertDate(rs[0].trandte);

            posSchema.status = 200;
            posSchema.cvar1 = rs;
            break;

        case 'API050':
            rs = await sqlQueryStore(reqBody);
            if (rs.length === 0) {
                posSchema.status = 404;
                posSchema.message = "ไม่พบข้อมูลตัวแทนจำหน่าย";
                break;
            }
            posSchema.status = 200;
            posSchema.cvar1 = rs;
            break;

        case 'API051':
            rs = await sqlQueryStore(reqBody);
            if (rs.length === 0) {
                posSchema.status = 404;
                posSchema.message = "ไม่พบข้อมูลรูปภาพ NCB";
                break;
            }

            let rsReturn = {};
            const getCusimg = rs[0].cus_img.split('.');
            const getConimg = rs[0].consent_img.split('.');
            const getImg1 = rs[0].img1.split('.');
            const getImg2 = rs[0].img2.split('.');

            const cusImg = await encodeBase64(rs[0].cus_img);
            // console.log(cusImg);
            // return;
            rsReturn.file1 = cusImg;
            rsReturn.file1_path = rs[0].cus_img;
            rsReturn.file1_type = getCusimg[getCusimg.length - 1];

            const consentImg = await encodeBase64(rs[0].consent_img);
            rsReturn.file2 = consentImg;
            rsReturn.file2_path = rs[0].consent_img;
            rsReturn.file2_type = getConimg[getConimg.length - 1];

            const img1 = await encodeBase64(rs[0].img1);
            rsReturn.file3 = img1;
            rsReturn.file3_path = rs[0].img1;
            rsReturn.file3_type = getImg1[getImg1.length - 1];

            const img2 = await encodeBase64(rs[0].img2);
            rsReturn.file4 = img2;
            rsReturn.file4_path = rs[0].img2;
            rsReturn.file4_type = getImg2[getImg2.length - 1];

            const btnSts = await sqlQuery('APPLICATION_Transaction_status', reqBody);

            if (btnSts.length === 0) {
                rsReturn.btn_submit = 'disable';
            } else {
                rsReturn.btn_submit = 'enable';
            }
            posSchema.status = 200;
            posSchema.cvar1 = rsReturn;
            break;

        case 'API052':
            rs = await sqlQueryStore(reqBody);
            if (rs.length === 0) {
                posSchema.status = 404;
                posSchema.message = "ไม่พบข้อมูลประกันภัย";
                break;
            }
            rs[0].efftdte = convertDate(rs[0].efftdte);
            rs[0].expdte = convertDate(rs[0].expdte);
            posSchema.status = 200;
            posSchema.cvar1 = rs;
            break;

        case 'API053':
            rs = await sqlQueryStore(reqBody);
            if (rs.length === 0) {
                posSchema.status = 404;
                posSchema.message = "ไม่พบข้อมูลประกันชีวิต";
                break;
            }
            rs[0].efftdte = convertDate(rs[0].efftdte);
            rs[0].expdte = convertDate(rs[0].expdte);
            posSchema.status = 200;
            posSchema.cvar1 = rs;
            break;

        case 'API054':
            rs = await sqlQueryStore(reqBody);
            if (rs.length === 0) {
                posSchema.status = 404;
                posSchema.message = "ไม่พบข้อมูลค่าอื่นๆ";
                break;
            }
            posSchema.status = 200;
            posSchema.cvar1 = rs;
            break;

        case 'API055':
        case 'API139':
            const App_Idno = await sqlQuery('APPLICATION_App_Idno', reqBody);
            const rs_garun = await sqlQuery('APPLICATION_APP_Garuntor_get', reqBody);
            const rs_img = await sqlQuery('APPLICATION_APP_Image_get', reqBody);
            if (rs_img.length === 0) {
                posSchema.status = 404;
                posSchema.message = "ไม่พบข้อมูลรูปภาพ";
                break;
            }
            const mergeArray = App_Idno.concat(rs_garun);
            const data = await Promise.all(mergeArray.map(async item => {
                let lv1 = {};
                lv1.idno = item.idno;
                lv1.name = item.name;

                reqBody.cvar2 = item.idno;
                const getCate = await sqlQuery('APPLICATION_APP_Image_get_cate', reqBody);
                lv1.cate = getCate;
                await Promise.all(getCate.map(async (itemCate) => {
                    reqBody.cvar2 = itemCate.idno;
                    reqBody.cvar3 = itemCate.image_type;

                    const getCateImg = await sqlQuery('APPLICATION_APP_Image_get_cate_img', reqBody);
                    let setImg = [];
                    getCateImg.map(async (itemImg) => {
                        let imgDetail = {};
                        const imageBase64 = await encodeBase64('../pos-2/' + itemImg.image);

                        imgDetail.image = imageBase64;
                        imgDetail.image_path = itemImg.image;
                        imgDetail.type_image = itemImg.type_image;
                        setImg.push(imgDetail);
                    });

                    itemCate.image = setImg;
                }));
                return lv1;
            }));
            posSchema.status = 200;
            posSchema.cvar1 = data;
            break;

        case 'API056':
            rs = await sqlQueryStore(reqBody);
            if (rs.length === 0) {
                posSchema.status = 404;
                posSchema.message = "ไม่พบข้อมูลลายเซ็นลูกค้า";
                break;
            }
            const img056_1 = await encodeBase64('../pos-2/' + rs[0].sigapp);
            rs[0].sigapp_path = rs[0].sigapp;
            rs[0].sigapp = img056_1;

            posSchema.status = 200;
            posSchema.cvar1 = rs;
            break;

        case 'API057':
            rs = await sqlQueryStore(reqBody);
            if (rs.length === 0) {
                posSchema.status = 404;
                posSchema.message = "ไม่พบข้อมูลเอกสารรายงาน";
                break;
            }
            posSchema.status = 200;
            posSchema.cvar1 = rs;
            break;

        case 'API058':
            rs = await sqlQueryStore(reqBody);
            if (rs.length === 0) {
                posSchema.status = 404;
                posSchema.message = "ไม่พบข้อมูลข้อความ พรบ.";
                break;
            }
            posSchema.status = 200;
            posSchema.cvar1 = rs;
            break;

        case 'API059':
            rs = await sqlQueryStore(reqBody);
            posSchema.status = 201;
            posSchema.message = "ดำเนินการใบคำขอเรียบร้อยแล้ว";
            break;

        case 'API060':
            rs = await sqlQueryStore(reqBody);
            if (rs.length === 0) {
                posSchema.status = 404;
                posSchema.message = "ไม่พบข้อมูลรายละเอียดลูกค้า";
                break;
            }
            posSchema.status = 200;
            posSchema.cvar1 = rs;
            break;

        case 'API061':
            rs = await sqlQueryStore(reqBody);
            if (rs.length === 0) {
                posSchema.status = 404;
                posSchema.message = "ไม่พบข้อมูลที่อยู่";
                break;
            }
            posSchema.status = 200;
            posSchema.cvar1 = rs;
            break;

        case 'API062':
            rs = await sqlQueryStore(reqBody);
            if (rs.length === 0) {
                posSchema.status = 404;
                posSchema.message = "ไม่พบข้อมูลอาชีพ";
                break;
            }
            posSchema.status = 200;
            posSchema.cvar1 = rs;
            break;

        case 'API063':
            rs = await sqlQueryStore(reqBody);
            if (rs.length === 0) {
                posSchema.status = 404;
                posSchema.message = "ไม่พบข้อมูลคู่สมรส";
                break;
            }
            posSchema.status = 200;
            posSchema.cvar1 = rs;
            break;

        case 'API064':
            rs = await sqlQueryStore(reqBody);
            if (rs.length === 0) {
                posSchema.status = 404;
                posSchema.message = "ไม่พบข้อมูลสินค้า";
                break;
            }
            posSchema.status = 200;
            posSchema.cvar1 = rs;
            break;

        case 'API065':
            rs = await sqlQueryStore(reqBody);
            if (rs.length === 0) {
                posSchema.status = 404;
                posSchema.message = "ไม่พบข้อมูลการผ่อน";
                break;
            }
            posSchema.status = 200;
            posSchema.cvar1 = rs;
            break;

        case 'API066':
            rs = await sqlQueryStore(reqBody);
            if (rs.length === 0) {
                posSchema.status = 404;
                posSchema.message = "ไม่พบข้อมูลตัวแทนจำหน่าย";
                break;
            }
            posSchema.status = 200;
            posSchema.cvar1 = rs;
            break;

        case 'API067':
            rs = await sqlQueryStore(reqBody);
            if (rs.length === 0) {
                posSchema.status = 404;
                posSchema.message = "ไม่พบข้อมูลประกันภัย";
                break;
            }
            posSchema.status = 200;
            posSchema.cvar1 = rs;
            break;

        case 'API068':
            rs = await sqlQueryStore(reqBody);
            if (rs.length === 0) {
                posSchema.status = 404;
                posSchema.message = "ไม่พบข้อมูลประกันชีวิต";
                break;
            }
            posSchema.status = 200;
            posSchema.cvar1 = rs;
            break;

        case 'API069':
            rs = await sqlQueryStore(reqBody);
            if (rs.length === 0) {
                posSchema.status = 404;
                posSchema.message = "ไม่พบข้อมูลค่าอื่นๆ";
                break;
            }
            posSchema.status = 200;
            posSchema.cvar1 = rs;
            break;

        case 'API070':
        case 'API071':
        case 'API072':
        case 'API073':
        case 'API074':
        case 'API075':
        case 'API076':
        case 'API077':
        case 'API078':
        case 'API079':
        case 'API080':
        case 'API081':
        case 'API082':
        case 'API083':
        case 'API084':
        case 'API085':
        case 'API086':
        case 'API087':
        case 'API088':
        case 'API089':
        case 'API090':
        case 'API091':
        case 'API092':
        case 'API093':
        case 'API094':
        case 'API096':
        case 'API097':
        case 'API099':
        case 'API101':
        case 'API102':
        case 'API103':
        case 'API105':
        case 'API108':
        case 'API109':
        case 'API110':
        case 'API111':
        case 'API115':
        case 'API116':
        case 'API117':
        case 'API118':
        case 'API119':
        case 'API120':
        case 'API122':
        case 'API123':
        case 'API124':
        case 'API125':
        case 'API126':
        case 'API127':
        case 'API128':
        case 'API142':
        case 'API148':
        case 'API149':
        case 'API150':
        case 'API151':
        case 'API152':
        case 'API153':
            posSchema.status = 200;
            posSchema.cvar1 = await sqlQueryView(reqBody);
            break;

        case 'API121':
            rs = await sqlQueryStore(reqBody);
            if (rs.length === 0) {
                posSchema.status = 404;
                posSchema.message = "ไม่พบข้อมูลรายละเอียดรายงาน";
                break;
            }
            const img121_1 = await encodeBase64('../pos-2/' + rs[0].cus_img);
            rs[0].cus_img_path = rs[0].cus_img;
            rs[0].cus_img = img121_1;

            posSchema.status = 200;
            posSchema.cvar1 = rs;
            break;

        case 'API129':
            rs = await sqlQueryStore(reqBody);
            if (rs.length === 0) {
                posSchema.status = 404;
                posSchema.message = "ไม่พบข้อมูล";
                break;
            }
            posSchema.status = 200;
            posSchema.cvar1 = rs;
            break;

        case 'API130':
            rs = await sqlQueryStore(reqBody);
            if (rs.length === 0) {
                posSchema.status = 404;
                posSchema.message = "ไม่พบข้อมูล";
                break;
            }
            posSchema.status = 200;
            posSchema.cvar1 = rs;
            break;

        case 'API131':
            rs = await sqlQueryStore(reqBody);
            if (rs.length === 0) {
                posSchema.status = 404;
                posSchema.message = "ไม่พบข้อมูล";
                break;
            }
            posSchema.status = 200;
            posSchema.cvar1 = rs;
            break;

        case 'API132':
            rs = await sqlQueryStore(reqBody);
            if (rs.length === 0) {
                posSchema.status = 404;
                posSchema.message = "ไม่พบข้อมูล";
                break;
            }
            posSchema.status = 200;
            posSchema.cvar1 = rs;
            break;

        case 'API133':
            rs = await sqlQueryStore(reqBody);
            if (rs.length === 0) {
                posSchema.status = 404;
                posSchema.message = "ไม่พบข้อมูล";
                break;
            }
            posSchema.status = 200;
            posSchema.cvar1 = rs;
            break;

        case 'API134':
            rs = await sqlQueryStore(reqBody);
            posSchema.status = 201;
            posSchema.message = "บันทึกข้อมูลเรียบร้อยแล้ว";
            break;

        case 'API135':
            rs = await sqlQueryStore(reqBody);
            if (rs.length === 0) {
                posSchema.status = 404;
                posSchema.message = "ไม่พบข้อมูล";
                break;
            }
            posSchema.status = 200;
            posSchema.cvar1 = rs;
            break;

        case 'API136':
            rs = await sqlQueryStore(reqBody);
            if (rs.length === 0) {
                posSchema.status = 404;
                posSchema.message = "ไม่พบข้อมูล";
                break;
            }
            posSchema.status = 200;
            posSchema.cvar1 = rs;
            break;

        case 'API137':
            rs = await sqlQueryStore(reqBody);
            if (rs.length === 0) {
                posSchema.status = 404;
                posSchema.message = "ไม่พบข้อมูล";
                break;
            }
            posSchema.status = 200;
            posSchema.cvar1 = rs;
            break;

        case 'API138':
            rs = await sqlQueryStore(reqBody);
            posSchema.status = 201;
            posSchema.message = "บันทึกข้อมูลประกันภัยเรียบร้อยแล้ว";
            break;

        case 'API140':
            rs = await sqlQueryStore(reqBody);
            posSchema.status = 201;
            posSchema.message = "ลบรูปภาพเรียบร้อยแล้ว";
            break;

        case 'API141':
            rs = await sqlQueryStore(reqBody);
            if (rs.length === 0) {
                posSchema.status = 404;
                posSchema.message = "ไม่พบข้อมูลรถ";
                break;
            }
            posSchema.status = 200;
            posSchema.cvar1 = rs;
            break;

        case 'API143':
            rs = await sqlQueryStore(reqBody);
            if (rs.length === 0) {
                posSchema.status = 404;
                posSchema.message = "ไม่พบข้อมูล";
                break;
            }
            posSchema.status = 200;
            posSchema.cvar1 = rs;
            break;

        case 'API144':
            rs = await sqlQueryStore(reqBody);
            posSchema.status = 201;
            posSchema.message = "บันทึกข้อมูลผู้ค้ำประกันเรียบร้อยแล้ว";
            break;

        case 'API145':
            rs = await sqlQueryStore(reqBody);
            posSchema.status = 201;
            posSchema.message = "ลบข้อมูลผู้ค้ำประกันเรียบร้อยแล้ว";
            break;

        case 'API146':
            rs = await sqlQueryStore(reqBody);
            if (rs.length === 0) {
                posSchema.status = 404;
                posSchema.message = "ไม่พบข้อมูล";
                break;
            }
            posSchema.status = 200;
            posSchema.cvar1 = rs;
            break;

        case 'API154':
            rs = await sqlQueryStore(reqBody);
            if (rs.length === 0) {
                posSchema.status = 404;
                posSchema.message = "ไม่พบข้อมูล";
                break;
            }
            posSchema.status = 200;
            posSchema.cvar1 = rs;
            break;

        case 'API155':
            rs = await sqlQueryStore(reqBody);
            if (rs.length === 0) {
                posSchema.status = 404;
                posSchema.message = "ไม่พบข้อมูล";
                break;
            }
            posSchema.status = 200;
            posSchema.cvar1 = rs;
            break;

        case 'API147':
            rs = await sqlQueryStore(reqBody);
            posSchema.status = rs[0].CODE;
            posSchema.message = rs[0].MSG;

            break;

        default:
            posSchema.status = 404;
            posSchema.message = "Find not found API!"
            break;
    }
    // console.log(posSchema);
    return posSchema;
}