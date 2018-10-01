'use strict';

//export const cgiRoot: string = "http://203.69.170.41:8088/";
//export const cgiRoot: string = "http://172.16.10.183:8088/";
//export const cgiRoot: string = "http://192.168.1.20:8088/";
//export const cgiRoot: string = "http://fis.isapsolution.com:8088/";
//export const cgiRoot: string = "http://172.16.10.31:8088/";
export const cgiRoot: string = "http://localhost:6060/";
export const wsRoot: string = "ws://localhost:6060/";
export const webRoot: string = "http://localhost:4200/";
//export const cgiRoot: string = document.location.protocol+'//'+location.hostname+(location.port ? ':'+location.port: '') + '/';
//export const webRoot: string = document.location.protocol+'//'+location.hostname+(location.port ? ':'+location.port: '') + '/';



/*
 * string literals
 * */
export const rememberMe: string = "IsapVisitorManagementServiceRememberMe";
export const currentUserToken: string = "IsapVisitorManagementServiceCurrentUserToken";
export const languageKey: string = "IsapVisitorManagementServiceLanguage";

/*
 * constants
 */
export const emailRegex: RegExp = new RegExp(/^$|^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
export const numberRegex: RegExp = new RegExp(/^\d+$/);
export const multiPhoneRegex: RegExp = new RegExp(/^[0-9\-\ \,\+\(\)]+$/);
export const singlePhoneRegex: RegExp = new RegExp(/^[0-9\-\ \+\(\)]+$/);
