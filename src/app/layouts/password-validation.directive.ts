import { AbstractControl, ValidatorFn, NG_VALIDATORS, Validator, FormControl } from '@angular/forms';

import { Directive, Input } from '@angular/core';
import { LoginService } from 'app/service/login.service';

@Directive({
    selector: '[passwordvalidator][ngModel]',
    providers: [
        {
            provide: NG_VALIDATORS,
            useExisting: PasswordValidator,
            multi: true
        }
    ]
})

export class PasswordValidator implements Validator {
    validator: ValidatorFn;
    constructor(private _loginService: LoginService) {
        this.validator = this.passwordValidator();
    }
    validate(c: FormControl) {
        return this.validator(c);
    }
    passwordValidator(): ValidatorFn {
        return (c: FormControl) => {
            var currUser = JSON.parse(sessionStorage.getItem('currentUser'));

            let isValid = c.value == currUser["password"];
            if (isValid) {
                return null;
            } else {
                return {
                    passwordvalidator: {
                        valid: false
                    }
                };
            }
        }
    }
}

// import { AbstractControl, ValidatorFn, NG_VALIDATORS, Validator, FormControl } from '@angular/forms';

// import { Directive } from '@angular/core';

// @Directive({
//     selector: '[passwordvalidator][ngModel]',
//     providers: [
//         {
//             provide: NG_VALIDATORS,
//             useExisting: PasswordValidator,
//             multi: true
//         }
//     ]
// })

// export class PasswordValidator implements Validator {
//     validator: ValidatorFn;
//     constructor() {
//         console.log('111111');
//         this.validator = this.passwordValidator();
//     }
//     validate(c: FormControl) {
//         console.log('2222');
//         return this.validator(c);
//     }
//     passwordValidator(): ValidatorFn {
//         return (c: AbstractControl) => {
//             console.log('333');
//             let isValid = false;
//             if (isValid) {
//                 console.log('44');
//                 return null;
//             } else {
//                 console.log('55');
//                 return {
//                     password: {
//                         valid: false
//                     }
//                 };
//             }
//         }
//     }
// }
