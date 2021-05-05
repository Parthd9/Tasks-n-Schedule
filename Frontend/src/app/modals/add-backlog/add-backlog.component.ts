import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, NgForm } from '@angular/forms';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
  selector: 'app-add-backlog',
  templateUrl: './add-backlog.component.html',
  styleUrls: ['./add-backlog.component.css']
})
export class AddBacklogComponent implements OnInit {

  filterDevs = '';
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
