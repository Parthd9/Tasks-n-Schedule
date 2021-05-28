import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-confirm',
  templateUrl: './confirm.component.html',
  styleUrls: ['./confirm.component.css']
})
export class ConfirmComponent implements OnInit {


  maxChars = 128;
  constructor(
    public dialogRef: MatDialogRef<ConfirmComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {}

    ngOnInit(){
    }

  onNoClick(): void {
    this.dialogRef.close({event:'no'});
  }
  onClick() {
    this.dialogRef.close({event:'yes'});
  }

}
