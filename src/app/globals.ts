'use strict';

//export const cgiRoot: string = "http://203.69.170.41:8088/";
//export const cgiRoot: string = "http://172.16.10.183:8088/";
//export const cgiRoot: string = "http://192.168.1.20:8088/";
//export const cgiRoot: string = "http://fis.isapsolution.com:8088/";
//export const cgiRoot: string = "http://172.16.10.31:8088/";
export const cgiRoot: string = "http://172.16.10.178:6060/";
export const webRoot: string = "http://localhost:4200/";
//export const cgiRoot: string = document.location.protocol+'//'+location.hostname+(location.port ? ':'+location.port: '') + '/';
//export const webRoot: string = document.location.protocol+'//'+location.hostname+(location.port ? ':'+location.port: '') + '/';



/*
 * string literals
 * */
export const rememberMe: string = "rememberMe";
export const currentUserToken: string = "currentUserToken";


/*
 * constants
 */
export const emailRegex: string = "^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)+$";
export const numberRegex: string = "^[0-9]+$";
export const multiPhoneRegex: string = "^[0-9\-,\(\)]+$";
export const singlePhoneRegex: string = "^[0-9\-\(\)]+$";
