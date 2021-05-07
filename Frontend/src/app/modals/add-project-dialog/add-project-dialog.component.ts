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
  devOptEnabled;

  filterDevs = '';
  devlopersList: any[] = [
    {devloper: 'Parth Devmurari', id: 1},
    {devloper: 'Mitul Patel', id: 12},
    {devloper: 'Aakash Ramavat', id: 11},
    {devloper: 'Kush Soni', id: 13},
    {devloper: 'Urvil Patel', id: 5},
    {devloper: 'Jaimin Vyas', id: 2},
    {devloper: 'Preet Maniyar', id: 4}
  ];

  filteredList = this.devlopersList.slice();

  constructor(private dialogRef: MatDialogRef<AddProjectDialogComponent>,  @Inject(MAT_DIALOG_DATA) data) {
    this.header = data.header;
    this.name = data.name;
    this.description = data.description;
    this.devOptEnabled = data.devoptEnabled;
    console.log(this.devOptEnabled);
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
