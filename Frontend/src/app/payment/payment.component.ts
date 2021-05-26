import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonDataService } from '../common-data-service';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit {

  userData;
  date;
  showMessage = false;
  constructor(private dataService: CommonDataService, private http: HttpClient,private router: Router) { }

  ngOnInit(): void {
    this.dataService.userData.subscribe(result => {
      this.userData = result;
    });

    this.date = new Date();
    var year = this.date.getFullYear();
    var month = this.date.getMonth();
    var day = this.date.getDate();
    this.date = new Date(year + 1, month, day);
  }

  onPay() {

    this.http.post('/tns/auth/signup',this.userData).subscribe(result => {
        console.log(result);
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
