import { Component, Inject, OnInit } from '@angular/core';
import { MatSnackBar, MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';

@Component({
  selector: 'app-show-message',
  templateUrl: './show-message.component.html',
  styleUrls: ['./show-message.component.css']
})
export class ShowMessageComponent implements OnInit {

  msg;
  type;
  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: any) {
    console.log(data);
    this.msg = data['msg'];
    this.type = data['type'];
   }

  ngOnInit(): void {
  }

}
