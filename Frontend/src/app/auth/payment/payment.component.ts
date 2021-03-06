import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonDataService } from '../../services/common-data-service';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit {

  userData;
  date;
  showMessage = false;
  constructor(private dataService: CommonDataService, private http: HttpClient,private router: Router,
    private authService: AuthService) { }

  ngOnInit(): void {
    this.dataService.userData.subscribe(result => {
      this.userData = result;
      // console.log(this.userData);
    });

    this.date = new Date();
    var year = this.date.getFullYear();
    var month = this.date.getMonth();
    var day = this.date.getDate();
    this.date = new Date(year + 1, month, day);
  }

  onPay() {
   this.authService.registerUser(this.userData).subscribe(result => {
    this.showMessage=true;
    setTimeout(() => {
      this.router.navigate(['/login']);
      this.dataService.setData(null);
    }, 4000)
});
  }
  onBack() {
    this.router.navigate(['/register']);
  }
}
