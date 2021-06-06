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
  preservedData;
  isEdit=false;
  maxChars = 128;
  constructor(public dialogRef: MatDialogRef<AddBacklogComponent>,@Inject(MAT_DIALOG_DATA) public data: any,
            private taskService: TaskService) {
      this.isEdit = data.isEdit;
      if(!data.isEdit) {
        console.log('data:',data['developers']);
        this.devlopersList = data['developers'];
        this.filteredList = [...this.devlopersList];
      } else {
        this.preservedData = data;
      }

      this.addBacklogForm = new FormGroup({
        'description': new FormControl('', [Validators.required, Validators.minLength(10), Validators.maxLength(128)]),
        'list': new FormControl('', Validators.required),
        'type': new FormControl('', Validators.required),
        'estTime': new FormControl('', [Validators.required, Validators.min(1),Validators.pattern('[0-9]+')])
      });
    }

    ngOnInit(){
      if(this.preservedData) {
        this.addBacklogForm.patchValue({
          description: this.preservedData['taskDetail']['description'],
          list: this.preservedData['developers'],
          type: this.preservedData['taskDetail']['backlogType'],
          estTime: this.preservedData['taskDetail']['estimatedTime'],
        });
        this.devlopersList = this.preservedData['developers'];
        this.filteredList = [...this.devlopersList];
      }
    }

  onNoClick(): void {
    this.dialogRef.close({event:'cancel'});
  }
  onAddBacklog() {
    // this.addBacklogForm.get('list').value.length;
    console.log(this.addBacklogForm.value);
    let obs;
    if(this.isEdit) {
      let data = {...this.addBacklogForm.value, status: this.preservedData['taskDetail']['status'], id: this.preservedData['taskDetail']['_id']};
      obs = this.taskService.editBacklog(data)
    } else {
      obs = this.taskService.addBacklog(this.addBacklogForm.value)
    }
    obs.subscribe(result => {
      console.log(result);
      if(result['status'] === 201 || result['status'] === 202) {
        //
        console.log(result['body']['backlog']);
        if(this.isEdit) {
          this.dialogRef.close({event:'success', status: this.preservedData['taskDetail']['status'], value: this.addBacklogForm.value});
        } else {
          this.dialogRef.close({event:'success',value:result['body']['backlog']});
        }
      }
    })
  }
}
