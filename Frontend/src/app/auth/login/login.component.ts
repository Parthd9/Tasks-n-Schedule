import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { ShowMessageComponent } from 'src/app/shared/show-message/show-message.component';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private router: Router, private http: HttpClient, private authService: AuthService, private _snackBar: MatSnackBar) { }

  @ViewChild('f') loginForm: NgForm;
  durationInSeconds = 4;
  ngOnInit(): void {
  }

  onLogin() {
    if(this.loginForm.invalid) {
      return;
    }
    this.authService.loginUser(this.loginForm.value).subscribe(result => {
      this.authService.user.subscribe(user => {
        if(user['role'] === 'Admin') {
          this.router.navigate(['/admin']);
        } else {
          this.router.navigate(['/project']);
        }
        setTimeout(() => {
          this.loginForm.reset();
        },2000);
      })
    }, err => {
      this._snackBar.openFromComponent(ShowMessageComponent, {
        duration: this.durationInSeconds * 1000,
        horizontalPosition: 'right',
        verticalPosition: 'top',
        panelClass: ['failure'],
        data: {type: 'error', msg: err['error']['message']}
      });
    })
  }
}
