import { Component, OnInit } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { AddBacklogComponent } from '../modals/add-backlog/add-backlog.component';
import { ConfirmComponent } from '../modals/confirm/confirm.component';

@Component({
  selector: 'app-kanban',
  templateUrl: './kanban.component.html',
  styleUrls: ['./kanban.component.css']
})
export class KanbanComponent implements OnInit {
  ind;
  todo = [
    // {task: 'sample task 1', date: '03-05-2021'},
    // {task: 'sample task 2', date: '03-05-2021'},
    // {task: 'sample task 3', date: '03-05-2021'},
    // {task: 'sample task 4', date: '03-05-2021'},
    // {task: 'sample task 5', date: '03-05-2021'},
    // {task: 'sample task 6', date: '03-05-2021'},
    // {task: 'sample task 7', date: '03-05-2021'},
    // {task: 'sample task 8', date: '03-05-2021'},
    // {task: 'sample task 9', date: '03-05-2021'},
    // {task: 'sample task 10', date: '03-05-2021'},
    // {task: 'sample task 11', date: '03-05-2021'},
    // {task: 'sample task 12', date: '03-05-2021'},
    // {task: 'sample task 13', date: '03-05-2021'}
  ];

  inprogress = [
    // {task: 'sample task 1', date: '03-05-2021'},
    // {task: 'sample task 2', date: '03-05-2021'},
    // {task: 'sample task 3', date: '03-05-2021'},
    // {task: 'sample task 4', date: '03-05-2021'},
    // {task: 'sample task 5', date: '03-05-2021'},
    // {task: 'sample task 6', date: '03-05-2021'},
    // {task: 'sample task 7', date: '03-05-2021'},
    // {task: 'sample task 8', date: '03-05-2021'},
    // {task: 'sample task 9', date: '03-05-2021'},
    // {task: 'sample task 10', date: '03-05-2021'},
    // {task: 'sample task 11', date: '03-05-2021'},
    // {task: 'sample task 12', date: '03-05-2021'},
    // {task: 'sample task 13', date: '03-05-2021'}
  ];
  completed = [
    // {task: 'sample task 1', date: '03-05-2021'},
    // {task: 'sample task 2', date: '03-05-2021'},
    // {task: 'sample task 3', date: '03-05-2021'},
    // {task: 'sample task 4', date: '03-05-2021'},
    // {task: 'sample task 5', date: '03-05-2021'},
    // {task: 'sample task 6', date: '03-05-2021'},
    // {task: 'sample task 7', date: '03-05-2021'},
    // {task: 'sample task 8', date: '03-05-2021'},
    // {task: 'sample task 9', date: '03-05-2021'},
    // {task: 'sample task 10', date: '03-05-2021'},
    // {task: 'sample task 11', date: '03-05-2021'},
    // {task: 'sample task 12', date: '03-05-2021'},
    // {task: 'sample task 13', date: '03-05-2021'}
  ];

  constructor(public dialog: MatDialog) { }

  ngOnInit(): void {
  }
  openDialog() {
    const dialogRef = this.dialog.open(AddBacklogComponent, {
      width: '40%',
      minWidth: '300px',
      data: { name: 'TnS' }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('Dialog result:', result);
      if(result.event === 'save') {
        this.todo.push({task: result.data.description, date:'04-05-2021'});
      }
    });
  }
  removeBacklog(ind) {
    const dialogRef = this.dialog.open(ConfirmComponent, {
      width: '20%',
      minWidth: '300px',
      data: { message: 'Do you want to remove this backlog?' }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('Dialog result:', result);
      if(result.event === 'yes') {
        this.todo.splice(ind,1);
      }
    });
  }
}
