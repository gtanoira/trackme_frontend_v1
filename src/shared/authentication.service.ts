/*
   Este servicio ofrece los métodos necesarios para autenticar a los usuarios contra una Active Directory (AD) de
   Microsoft via el protocolo LDAP, contra un backend en Django on Python
   Este servicio llama se conecta via una API al Django quien es el que luego realiza la autenticación del usuario
   a través del LDAP.
*/
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Router } from '@angular/router';

// Models
import { User } from '../models/user';

// Environment
import { environment } from '../environments/environment';

// Services
import { ErrorMessageService } from './error-message.service'

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;

  constructor(
    private errorMessageService: ErrorMessageService,
    private http: HttpClient,
    private router: Router
  ) {
    this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  // GETTERS
  // Get the user info store on the browser LocalStorage
  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }

  // LOGIN y AUTENTICACION del usuario que se quiere loguear
  login(username: string, password: string): Observable<any> {
    // Headers
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json;charset=utf-8'
      })
    };
    // Body
    const loginData = {
      auth: {
        email: username,
        password: password
      }
    };
    return this.http.post<any>(`${environment.envData.loginServer}/user_token`, loginData, httpOptions)
      .pipe(
        map(
          data => {
            // login successful, get the user data
            if (data) {
              // Read the user data and store them in the localStorage
              try {
                const user: User = {
                  id:             data.id,
                  email:          data.email,
                  firstName:      data.first_name,
                  lastName:       data.last_name,
                  fullName:       `${data.first_name} ${data.last_name}`,
                  authorizations: (data.authorizations) ? {} : JSON.parse(data.authorizations)
                }

                // store user details in local storage to keep user logged in between page refreshes
                localStorage.setItem('currentUser', JSON.stringify(user));
                this.currentUserSubject.next(user);

              } catch (e) {
                this.errorMessageService.changeErrorMessage('TRK-0008(E): the user data received from the backend is incorrect');
                return null;
              }
            }
            return data;
          }
        ),
        catchError(
          err => {
            if (err.statusText === 'Unknown Error') {
              return throwError(`API-0011(E): no se pudo acceder la api ${err.url}`);
            } else {
              return throwError(err.error.message);
            }
          }
        )

    );
  }

  logout() {
    // Remover los datos del usuario del LocalStorage
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
    // Cerrar la sesion en el Login Central
    this.http.get<any>(`${environment.envData.loginServer}/api2/logout`)
      .subscribe();
    // Ir al Login
    this.router.navigate(['/login']);
  }
}
