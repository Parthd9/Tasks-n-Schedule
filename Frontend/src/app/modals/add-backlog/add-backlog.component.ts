import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormGroup, NgForm } from '@angular/forms';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
  selector: 'app-add-backlog',
  templateUrl: './add-backlog.component.html',
  styleUrls: ['./add-backlog.component.css']
})
export class AddBacklogComponent implements OnInit {

  @ViewChild('f') addBackLogForm: NgForm;
  maxChars = 128;
  constructor(
    public dialogRef: MatDialogRef<AddBacklogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {}

    ngOnInit(){
    }

  onNoClick(): void {
    this.dialogRef.close({event:'cancel'});
  }
  onAddBacklog() {
    console.log(this.addBackLogForm.value);
    this.dialogRef.close({event:'save',data:this.addBackLogForm.value});
  }
}
