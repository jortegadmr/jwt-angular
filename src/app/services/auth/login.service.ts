import { Injectable, inject } from '@angular/core';
import { LoginRequest } from './login-request';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { throwError, Observable, catchError, BehaviorSubject, tap, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private http = inject( HttpClient);

  currentUserLoginOn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  currentUserData: BehaviorSubject<String> = new BehaviorSubject<String>("");

  constructor() {
    this.currentUserLoginOn=new BehaviorSubject<boolean>(sessionStorage.getItem("token")!=null);
    this.currentUserData=new BehaviorSubject<String>(sessionStorage.getItem("token") || "");
   }

  login(credentials: LoginRequest): Observable<any> {
    return this.http.post<any>('http://localhost:8008/auth/login', credentials).pipe(  // Cambiado el endpoint a /auth/login
      tap((userData) => {
        sessionStorage.setItem("token",userData.token);
        this.currentUserData.next(userData.token);
        this.currentUserLoginOn.next(true);

      }),
      // Emplear la función de manejo de errores de RxJS
      map((userData)=> userData.token),
      catchError(this.handleError)
    )
  }

  logout():void{
    sessionStorage.removeItem("token");
    this.currentUserLoginOn.next(false);

  }

  private handleError(error: HttpErrorResponse) {
    if (error.status === 0) {
      // Error de lado del lado del cliente.
      console.error('Se ha producido un error:', error.error);
    } else {
      // El backend devolvio un error
      console.error('Backend retorno el codigo de estado:', error.error);
    }
    // Definir una respuesta apropiada
    return throwError(() => new Error('Usuario o Contraseña incorrectos; por favor, inténtelo de nuevo.'));
  }

  get userData(): Observable<String> {
    return this.currentUserData.asObservable();
  }
    
  get userLoginOn(): Observable<boolean> {
    return this.currentUserLoginOn.asObservable();
  }

  get userToken():String{
    return this.currentUserData.value;
  }

}
