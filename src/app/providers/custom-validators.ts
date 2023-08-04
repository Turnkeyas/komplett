import { AbstractControl, FormGroup } from '@angular/forms';

export function strongPassword(control: AbstractControl): { [key: string]: boolean } | null {
    const passwordRegEx = new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})');
    if (!passwordRegEx.test(control.value)) {
        return { 'strongPassword': true };
    }
    return null;
}

export function emailId(control: AbstractControl): { [key: string]: boolean } | null {
    const emailRegEx = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
    if (!emailRegEx.test(control.value)) {
        return { 'emailId': true };
    }
    return null;
}

export function confirmPassword(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
        const control = formGroup.controls[controlName];
        const matchingControl = formGroup.controls[matchingControlName];

        if (control.value !== matchingControl.value) {
            matchingControl.setErrors({ isMatch: true });
        }
    };
}