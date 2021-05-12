import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormControl, NgForm, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-subtaskcompletion',
  templateUrl: './subtaskcompletion.component.html',
  styleUrls: ['./subtaskcompletion.component.css']
})
export class SubtaskcompletionComponent implements OnInit {

  constructor( public dialogRef: MatDialogRef<SubtaskcompletionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
  }

  @ViewChild('subtaskcomplete') form: NgForm;

  onSubmit() {
    this.dialogRef.close({event:'save',data:this.form.value});
  }
  onNoClick(): void {
    this.dialogRef.close({event:'cancel'});
  }
}
