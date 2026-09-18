// import crypto from "crypto";


const generateCode = () => {
    const pattern = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ123456789";

    let shortCode = "";

    for (let i = 0; i < 6; i++) {
        shortCode += pattern.charAt(Math.floor(Math.random() * 62));
    }
    // console.log(shortCode);
    return shortCode;
}

export default generateCode;