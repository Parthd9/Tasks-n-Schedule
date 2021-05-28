import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private router: Router, private http: HttpClient) { }

  @ViewChild('f') loginForm: NgForm;
  ngOnInit(): void {
  }

  onLogin() {
    if(this.loginForm.invalid) {
      return;
    }
    this.http.post('/tns/auth/login', this.loginForm.value).subscribe(result => {
      console.log('login result:',result);
    });
    console.log(this.loginForm.value);
    this.loginForm.reset();
    this.router.navigate(['/project']);
  }

}
