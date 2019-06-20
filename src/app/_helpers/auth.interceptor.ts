/*
  Esta rutina intercepta todos los HTTP REQUESTS, realizando lo siguiente:
  1) agrega un "Authorization Bearer ...." con el id de sesión enviada por el backend
*/
import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';

// Services
import { AuthenticationService } from '../../shared/authentication.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(
    private authenticationService: AuthenticationService
   ) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    // Agregar en header "Authorization Bearer ..."
    if (this.authenticationService.currentUserValue && req.url.includes('/api')) {
      const userData = JSON.parse(localStorage.getItem('currentUser'));
      const sessionKey = userData.sessionKey;

      if (sessionKey) {
        const newReq = req.clone({
          headers: req.headers.set('Authorization', `Bearer ${sessionKey}`)
        });
        return next.handle(newReq);
      }
    }    return next.handle(req);
  }
}
