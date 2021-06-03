import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ProjectsService } from '../../projects.service';

@Component({
  selector: 'app-add-version',
  templateUrl: './add-version.component.html',
  styleUrls: ['./add-version.component.css']
})
export class AddVersionComponent implements OnInit {

  @ViewChild('addVersionForm',{static: true}) versionForm: NgForm;
  header:string;
  name:string;
  description: string
  fromVersion: boolean;
  maxChars = 200;
  showMsg = false;

  constructor(private dialogRef: MatDialogRef<AddVersionComponent>,  @Inject(MAT_DIALOG_DATA) data, private projectService: ProjectsService) {
    this.header = data.header;
    this.name = data.name;
    this.description = data.description;
    this.fromVersion = data.fromVersion;
  }


  ngOnInit(): void {
  }


  onSubmit() {
    // this.dialogRef.close({event:'save',value:this.projectForm.value});
    let obsData;
    if(this.fromVersion) {
      obsData = this.projectService.addVersion(this.versionForm.value);
    } else {
      obsData = this.projectService.addSprint(this.versionForm.value);
    }
    obsData.subscribe(result => {
      if(result['status'] == 201) {
        console.log('success');
        console.log(result['body']['data']);
        this.dialogRef.close({event:'success',value:result['body']['data']});
      }
    },
    err => {
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
