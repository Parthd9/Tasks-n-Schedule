import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private router: Router, private http: HttpClient, private authService: AuthService) { }

  @ViewChild('f') loginForm: NgForm;
  ngOnInit(): void {
  }

  onLogin() {
    if(this.loginForm.invalid) {
      return;
    }
    this.authService.loginUser(this.loginForm.value).subscribe(result => {
      console.log(result);
      this.authService.user.subscribe(user => {
        if(user['role'] === 'Admin') {
          this.router.navigate(['/admin']);
        } else {
          this.router.navigate(['/project']);
        }
        this.loginForm.reset();
      })
    })
  }
}
