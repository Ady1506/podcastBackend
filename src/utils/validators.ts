import e from "express";

const emailRegex: RegExp =/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const phoneRegex: RegExp = /^\+\d{2}\d{10}$/;
const passwordRegex: RegExp =/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,255}$/;
const usernameRegex: RegExp =/^[a-zA-Z0-9_]{5,255}$/;

function validateEmail(email: string): boolean {
    return emailRegex.test(email);
}
function validatePhone(phone: string): boolean {
    return phoneRegex.test(phone);
}
function validatePassword(password: string): boolean {
    return passwordRegex.test(password);
}
function validateUsername(username: string): boolean {
    return usernameRegex.test(username);
}

export {validateEmail, validatePhone, validatePassword, validateUsername};

