import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { TaskService } from '../../task.service';

@Component({
  selector: 'app-add-backlog',
  templateUrl: './add-backlog.component.html',
  styleUrls: ['./add-backlog.component.css']
})
export class AddBacklogComponent implements OnInit {

  filterDevs = '';
  devlopersList: any[] = [];
  backlogTypes: any[] = [
    'Bug',
    'User Story'
  ]

  filteredList = [];
  addBacklogForm: FormGroup;
  maxChars = 128;
  constructor(public dialogRef: MatDialogRef<AddBacklogComponent>,@Inject(MAT_DIALOG_DATA) public data: any, 
            private taskService: TaskService) {
      console.log('data:',data['developers']);
      this.devlopersList = data['developers'];
      this.filteredList = [...this.devlopersList];
      
      this.addBacklogForm = new FormGroup({
        'description': new FormControl('', [Validators.required, Validators.minLength(10), Validators.maxLength(128)]),
        'list': new FormControl('', Validators.required),
        'type': new FormControl('', Validators.required),
        'estTime': new FormControl('', [Validators.required, Validators.min(1),Validators.pattern('[0-9]+')])
      });
    }

    ngOnInit(){
    }

  onNoClick(): void {
    this.dialogRef.close({event:'cancel'});
  }
  onAddBacklog() {
    // this.addBacklogForm.get('list').value.length;
    console.log(this.addBacklogForm.value);
    this.taskService.addBacklog(this.addBacklogForm.value).subscribe(result => {
      console.log(result);
      if(result['status'] === 201) {
        // 
        console.log(result['body']['backlog']);
        this.dialogRef.close({event:'success',value:result['body']['backlog']});
      }
    })
  }
}
