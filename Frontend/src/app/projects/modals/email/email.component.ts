import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AddProjectDialogComponent } from '../add-project-dialog/add-project-dialog.component';

@Component({
  selector: 'app-email',
  templateUrl: './email.component.html',
  styleUrls: ['./email.component.css']
})
export class EmailComponent implements OnInit {

  constructor(private dialogRef: MatDialogRef<AddProjectDialogComponent>,  @Inject(MAT_DIALOG_DATA) data) { }

  @ViewChild('emailForm') emailForm: NgForm;
  devlopersList: any[] = [
    {devloper: 'developer 123 123 123 123 1223 123 123 123333333', id: 1},
    {devloper: 'developer 12', id: 12},
    {devloper: 'developer 11', id: 11},
    {devloper: 'developer 13', id: 13},
    {devloper: 'developer 5', id: 5},
    {devloper: 'developer 2', id: 2},
    {devloper: 'developer 4', id: 4}
  ];
  filteredList = this.devlopersList.slice();
  ngOnInit(): void {
  }

  onSend() {
    this.dialogRef.close({event:'save',value:this.emailForm.value});
  }
  close() {
    this.dialogRef.close({event: 'close'});
}
}
