import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ProjectsService } from '../../projects.service';
import { AddProjectDialogComponent } from '../add-project-dialog/add-project-dialog.component';

@Component({
  selector: 'app-email',
  templateUrl: './email.component.html',
  styleUrls: ['./email.component.css']
})
export class EmailComponent implements OnInit {

  @ViewChild('emailForm') emailForm: NgForm;
  devlopersList: any[] = [];
  filteredToList = [];
  filteredCCList = [];
  sprintId;
  showMsg = false;

  constructor(private dialogRef: MatDialogRef<AddProjectDialogComponent>,  @Inject(MAT_DIALOG_DATA) data, private projectService: ProjectsService) {
    this.devlopersList = data['list'];
    this.sprintId = data['id'];
    this.filteredToList = this.devlopersList.slice();
    this.filteredCCList = this.devlopersList.slice();
  }

  ngOnInit(): void {
  }

  onSend() {
    this.projectService.sendReportMail(this.sprintId, this.emailForm.value).subscribe(result => {
      if(result['status'] === 200) {
        this.dialogRef.close({event:'save'});
      }
    }, err => {
      console.log('err:',err);
      this.showMsg = true;
      setTimeout(() => {
        this.showMsg = false;
      }, 4000)
  })
  }
  close() {
    this.dialogRef.close({event: 'close'});
}
}
