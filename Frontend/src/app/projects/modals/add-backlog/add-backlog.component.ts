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
  devList = [];
  isEdit=false;
  maxChars = 128;
  header;
  constructor(public dialogRef: MatDialogRef<AddBacklogComponent>,@Inject(MAT_DIALOG_DATA) public data: any,
            private taskService: TaskService) {
      this.header = data.header;
      this.isEdit = data.isEdit;
      if(!data.isEdit) {
        this.devlopersList = data['developers'];
        this.filteredList = [...this.devlopersList];
      } else {
        this.preservedData = data;
      }

      this.addBacklogForm = new FormGroup({
        'description': new FormControl('', [Validators.required, Validators.minLength(10), Validators.maxLength(128)]),
        'developers': new FormControl('', Validators.required),
        'backlogType': new FormControl('', Validators.required),
        'estimatedTime': new FormControl('', [Validators.required, Validators.min(1),Validators.pattern('[0-9]+')])
      });
    }

    ngOnInit(){
      if(this.preservedData) {
        this.devList = this.preservedData['selectedList'];
        if(this.devList.length > 0) {
              this.filteredList = [...this.devList];

              this.devlopersList = this.preservedData['developers'];
              const arr3 = [].concat(
                this.devlopersList.filter(obj1 => this.devList.every(obj2 => obj1.email !== obj2.email))
                // this.devlist.filter(obj2 => this.developersList.every(obj1 => obj2.email !== obj1.email))
            );
            // console.log(arr3);
            this.filteredList = [...this.filteredList, ...arr3];
        } else {
          this.devList = [...this.preservedData['developers']];
          this.filteredList = [...this.devList];
        }
        this.addBacklogForm.patchValue({
          description: this.preservedData['taskDetail']['description'],
          developers: this.preservedData['selectedList'].length !== 0 ? this.devList : '',
          backlogType: this.preservedData['taskDetail']['backlogType'],
          estimatedTime: this.preservedData['taskDetail']['estimatedTime'],
        });

      }
    }

  onNoClick(): void {
    this.dialogRef.close({event:'cancel'});
  }
  onAddBacklog() {
    // this.addBacklogForm.get('list').value.length;
    let obs;
    if(this.isEdit) {
      let data = {...this.addBacklogForm.value, status: this.preservedData['taskDetail']['status'], id: this.preservedData['taskDetail']['_id']};
      obs = this.taskService.editBacklog(data)
    } else {
      obs = this.taskService.addBacklog(this.addBacklogForm.value)
    }
    obs.subscribe(result => {
      if(result['status'] === 201 || result['status'] === 202) {
        
        // console.log(result['body']['backlog']);
        if(this.isEdit) {
          this.dialogRef.close({event:'success', status: this.preservedData['taskDetail']['status'], value: this.addBacklogForm.value});
        } else {
          this.dialogRef.close({event:'success',value:result['body']['backlog']});
        }
      }
    })
  }
}
