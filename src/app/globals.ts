'use strict';


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
export const ipRegex: RegExp =new RegExp(/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/);