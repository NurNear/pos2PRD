export function convertDate(oDate){
    let nDate
    if(oDate === null){
        nDate = "";
    }else{
        nDate = oDate.toISOString().substring(0, 10);
    }

    return nDate;
}