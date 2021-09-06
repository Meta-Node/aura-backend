const axios = require("axios");
const SHA256 = require("crypto-js/sha256");
const Base64 = require("crypto-js/enc-base64");
const AES = require("crypto-js/aes");
const Utf8 = require("crypto-js/enc-utf8");

/**
 * Pulls main bright id object from network
 * @param loginData
 * @returns {Object} encrypted user data with images
 */
async function pullFromNetwork(loginData) {
    let x;
    await axios.get(
        `https://explorer.brightid.org/api/v5/users/${loginData}`
    ).then(
        res => x = res
    ).catch(error => {
        console.log(error);
    });
    return x['data']
}

async function pullDecryptedUserData(key, password) {
    return decryptUserData(await pullEncryptedUserData(key), password);
}

async function pullEncryptedUserData(key) {
    return await axios.get(`https://recovery.brightid.org/backups/${key}/data`);
}

async function decryptUserData(encryptedUserData, password) {
    return JSON.parse(AES.decrypt(encryptedUserData.data, password).toString(Utf8));
}

async function pullProfilePhoto(key, brightId, password) {
    let encryptedUserPicture = await axios.get(`https://recovery.brightid.org/backups/${key}/${brightId}`)
    return AES.decrypt(encryptedUserPicture.data, password).toString(Utf8);
}

function generateKey(brightId, password) {
    return hash(brightId + password);
}

const alts = {
    "/": "_",
    "+": "-",
    "=": "",
};

const hash = (data) => b64ToUrlSafeB64(SHA256(data).toString(Base64));

const b64ToUrlSafeB64 = s => s.replace(/[/+=]/g, (c) => alts[c]);

module.exports = {pullFromNetwork, pullDecryptedUserData, generateKey, pullProfilePhoto}