import bcrypt from "bcrypt";
import * as crypto from "crypto";

export function authentication(password: string, enc_password: string) {
    return new Promise((resolve, reject) => {
        bcrypt.compare(password, enc_password, function (err, result) {
            resolve(result);
        });
    });
}

export function hashPassword(password: string) {
    return new Promise<string>((resolve, reject) => {
        bcrypt.hash(password, 10, function (err, hash: string) {
            if (err) {
                reject(err);
            } else {
                resolve(hash);
            }
        });
    });
}


// 目前用不到
// export const generateRobustPassword = (length = 15) => {
//     const uppercaseChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
//     const lowercaseChars = "abcdefghijklmnopqrstuvwxyz";
//     const numberChars = "0123456789";
//     const specialChars = '!@#$%^&*()_+{}[]|:;"<>,.?/~';

//     const allChars =
//         uppercaseChars + lowercaseChars + numberChars + specialChars;

//     let password = "";

//     for (let i = 0; i < length; i++) {
//         const randomIndex = Math.floor(Math.random() * allChars.length);
//         password += allChars[randomIndex];
//     }

//     return password;
// };
