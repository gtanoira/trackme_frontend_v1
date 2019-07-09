import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Router } from '@angular/router';

// Services
import { AuthenticationService } from '../shared/authentication.service';
import { ErrorMessageService } from '../shared/error-message.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(
    private authenticationService: AuthenticationService,
    private errorMessageService: ErrorMessageService,
    private router: Router
  ) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request)
      .pipe(
        map(
          res => res
        ),
        catchError(
          err => {
            console.log('*** INTERCEPTOR error:', err);
            // auto logout if 401 Unauthorized or 403 Forbidden response returned from api
            if ([401].indexOf(err.status) !== -1) {
              this.authenticationService.logout();
              // Print the error message and go to LOGIN
              this.errorMessageService.changeErrorMessage(err.error.message || err.statusText);
              this.router.navigate(['/login']);
              // location.reload(true);
            }

            const error = err.error.message || err.statusText;
            return throwError(error);
          }
        )
      );
  }
}
