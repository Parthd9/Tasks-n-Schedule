import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { AddProjectDialogComponent } from '../modals/add-project-dialog/add-project-dialog.component';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.css']
})
export class ProjectComponent implements OnInit {

  constructor(private dialog: MatDialog, private router: Router, private route: ActivatedRoute) { }
  projects = [];

  ngOnInit(): void {
    this.projects = [
      {
      title : "Project-1",
      desc: "With supporting text below as a natural lead-in to additional content."
      },
      {
        title : "Project-2",
        desc: "With supporting text below as a natural lead-in to additional content."
      },
      {
        title : "Project-3",
        desc: "With supporting text below as a natural lead-in to additional content."
      },
      {
        title : "Project-4",
        desc: "With supporting text below as a natural lead-in to additional content."
      },
      {
        title : "Project-5",
        desc: "With supporting text below as a natural lead-in to additional content."
      },
      {
        title : "Project-6",
        desc: "With supporting text below as a natural lead-in to additional content."
      },
      {
        title : "Project-7",
        desc: "With supporting text below as a natural lead-in to additional content."
      },
      {
        title : "Project-8",
        desc: "With supporting text below as a natural lead-in to additional content."
      },
  ];
}

openDialog() {
  const dialogConfig = new MatDialogConfig();
  // dialogConfig.disableClose = true;
  dialogConfig.autoFocus = true;
  dialogConfig.data = {
    id: 1,
    header: 'Add New Project',
    name: 'Project Name',
    description: 'Project Description'
  };
  dialogConfig.width = '30%';
  dialogConfig.minWidth = '300px';
  const dialogRef = this.dialog.open(AddProjectDialogComponent,dialogConfig);

  dialogRef.afterClosed().subscribe(data => {
    console.log('Dialog result:', data);
    if(data.event === 'save') {
      this.projects.push({title: data.value.title, desc:data.value.desc});
    }
  });
}

// onViewVersion(index) {
//   console.log(index);
//   this.router.navigate([index], {relativeTo: this.route});
// }

}
