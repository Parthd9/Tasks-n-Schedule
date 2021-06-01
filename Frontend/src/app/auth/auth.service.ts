import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import jwtDecode from "jwt-decode";
import { BehaviorSubject } from "rxjs";
import { tap } from "rxjs/operators";
import { User } from "./user.model";
@Injectable()
export class AuthService {
    constructor(private http: HttpClient, private router: Router) {}

    user = new BehaviorSubject<User>(null);
    private tokenExpirationTimer: any;

    registerUser(userData) {
        return this.http.post('/tns/auth/signup',userData);
    }

    loginUser(loginData) {
        return this.http.post<{token: string}>('/tns/auth/login', loginData).pipe(tap(tokenData => {
            console.log('tokendata:',tokenData);
            this.handleAuthentication(tokenData);
        }));
    }

    logout() {
        this.user.next(null);
        localStorage.removeItem('userData');

        if(this.tokenExpirationTimer) {
            console.log(this.tokenExpirationTimer);
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

        console.log(userData);
        const loadedUser = new User(userData._token,new Date(userData._tokenExpirationDate),userData.role);
        console.log(loadedUser);

        if(loadedUser.token) {
            this.user.next(loadedUser);
            const expirationDuration = new Date(userData._tokenExpirationDate).getTime() - new Date().getTime();
            console.log('expirationDuration:',expirationDuration);
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
        console.log("email:",email+" ,role:",role);
        const expirationDate = new Date(new Date().getTime() + (decoded.exp - decoded.iat)*1000);
        const user = new User(tokenData.token, expirationDate, role);
        console.log('exp date:',expirationDate);
        this.user.next(user);
        localStorage.setItem('userData',JSON.stringify(user));
        this.autoLogout((decoded.exp - decoded.iat)*1000);
    }
}
