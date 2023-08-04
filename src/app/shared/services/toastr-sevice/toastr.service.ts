import { Injectable } from '@angular/core';
import * as toastr from 'toastr';

@Injectable({ providedIn: 'root' })
export class ToastrService {

    constructor() {
        toastr.options = {
            closeButton: false,
            debug: false,
            newestOnTop: true,
            progressBar: true,
            positionClass: 'toast-top-right',
            preventDuplicates: true,
            onclick: null,
            showDuration: '300',
            hideDuration: '1000',
            timeOut: '3000',
            extendedTimeOut: '1000',
            showEasing: 'swing',
            hideEasing: 'linear',
            showMethod: 'fadeIn',
            hideMethod: 'fadeOut'
        };
    }

    success(message: string, title?: string, options?: any) {
        toastr.success(message, title, options);
    }

    info(message: string, title?: string, options?: any) {
        toastr.info(message, title, options);
    }

    warning(message: string, title?: string, options?: any) {
        toastr.warning(message, title, options);
    }

    error(message: string, title?: string, options?: any) {
        toastr.error(message, title, options);
    }
}
