import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormGroup, NgForm } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-add-project-dialog',
  templateUrl: './add-project-dialog.component.html',
  styleUrls: ['./add-project-dialog.component.css']
})
export class AddProjectDialogComponent implements OnInit {

  @ViewChild('addProjectForm',{static: true}) projectForm: NgForm;
  header:string;
  name:string;
  description: string
  maxChars = 100;

  constructor(private dialogRef: MatDialogRef<AddProjectDialogComponent>,  @Inject(MAT_DIALOG_DATA) data) { 
    this.header = data.header;
    this.name = data.name;
    this.description = data.description;
  }

  ngOnInit(): void {
  }

  onSubmit() {
    this.dialogRef.close({event:'save',value:this.projectForm.value});
}

  close() {
    this.dialogRef.close({event: 'close'});
}

}
