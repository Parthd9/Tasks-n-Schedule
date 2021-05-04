import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { AddProjectDialogComponent } from '../modals/add-project-dialog/add-project-dialog.component';

@Component({
  selector: 'app-version',
  templateUrl: './version.component.html',
  styleUrls: ['./version.component.css']
})
export class VersionComponent implements OnInit {

  versions = [
    {
    title : "Version-1.0.0",
    desc: "With supporting text below as a natural lead-in to additional content."
    },
    {
      title : "Version-2.0.0",
      desc: "With supporting text below as a natural lead-in to additional content."
    },
    {
      title : "Version-3.0.0",
      desc: "With supporting text below as a natural lead-in to additional content."
    },
    {
      title : "Version-4.0.0",
      desc: "With supporting text below as a natural lead-in to additional content."
    },
    {
      title : "Version-5.0.0",
      desc: "With supporting text below as a natural lead-in to additional content."
    }];

  constructor(private dialog: MatDialog) { }

  ngOnInit(): void {
  }

  openDialog() {
    const dialogConfig = new MatDialogConfig();
    // dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      id: 1,
      header: 'Add New Version',
      name: 'Version Name',
      description: 'Version Description'
    };
    dialogConfig.width = '30%';
    dialogConfig.minWidth = '300px';
    const dialogRef = this.dialog.open(AddProjectDialogComponent,dialogConfig);
  
    dialogRef.afterClosed().subscribe(data => {
      console.log('Dialog result:', data);
      if(data.event === 'save') {
        this.versions.push({title: data.value.title, desc:data.value.desc});
      }
    });
  }

}