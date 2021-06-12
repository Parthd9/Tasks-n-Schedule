import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import jwtDecode from "jwt-decode";
import { BehaviorSubject } from "rxjs";
import {tap } from "rxjs/operators";
import { environment } from "src/environments/environment";
import { User } from "./user.model";

const BACKEND_URL = environment.apiUrl + "/auth";

@Injectable()
export class AuthService {
    constructor(private http: HttpClient, private router: Router) {}

    user = new BehaviorSubject<User>(null);
    private tokenExpirationTimer: any;

    registerUser(userData) {
        return this.http.post(BACKEND_URL+ '/signup',userData);
    }

    loginUser(loginData) {
      return this.http.post<{token: string}>(BACKEND_URL+ '/login', loginData, {observe: 'response'}).pipe(tap(tokenData => {
        // console.log('tokendata:',tokenData);
        this.handleAuthentication(tokenData['body']);
      }));
    }

    logout() {
        this.user.next(null);
        localStorage.removeItem('userData');
        if(this.tokenExpirationTimer) {
            clearTimeout(this.tokenExpirationTimer);
        }
        this.tokenExpirationTimer = null;
        this.router.navigate(['/login']);
    }

    autoLogin() {
        const userData: {
            _token: string,
            _tokenExpirationDate:string,
            role: string
        } = JSON.parse(localStorage.getItem('userData')); // convert it to json bcz we stored string in local storage
        if(!userData) {
            return;
        }

        const loadedUser = new User(userData._token,new Date(userData._tokenExpirationDate),userData.role);

        if(loadedUser.token) {
            this.user.next(loadedUser);
            const expirationDuration = new Date(userData._tokenExpirationDate).getTime() - new Date().getTime();
            // console.log('expirationDuration:',expirationDuration);
            this.autoLogout(expirationDuration);
        }

    }

    autoLogout(expirationTime: number) {
        this.tokenExpirationTimer = setTimeout(()=> {
            this.logout();
        }, expirationTime)
    }

    private handleAuthentication(tokenData) {
        const decoded:any = jwtDecode(tokenData.token);
        const email = decoded.email;
        const role = decoded.role;
        // console.log(decoded);
        const expirationDate = new Date(new Date().getTime() + (decoded.exp - decoded.iat)*1000);
        const user = new User(tokenData.token, expirationDate, role);
        this.user.next(user);
        localStorage.setItem('userData',JSON.stringify(user));
        this.autoLogout((decoded.exp - decoded.iat)*1000);
    }
}
