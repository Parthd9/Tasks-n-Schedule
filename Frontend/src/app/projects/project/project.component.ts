import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Data, Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { ShowMessageComponent } from 'src/app/shared/show-message/show-message.component';
import { AddProjectDialogComponent } from '../modals/add-project-dialog/add-project-dialog.component';
import { ProjectsService } from '../projects.service';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.css']
})
export class ProjectComponent implements OnInit {

  constructor(private dialog: MatDialog, private router: Router, private route: ActivatedRoute,
    private authService: AuthService, private projectService: ProjectsService, private _snackBar: MatSnackBar) { }
  projects = [] ;
  userRole = '';
  developers;
  durationInSeconds = 5;

  ngOnInit(): void {
    this.route.data.subscribe((data: Data) => {
      console.log(data['responses']['A']['developers']);
      console.log(data['responses']['B']['projects']);
      // this.developers = data['developers']['developers'];
      // console.log('dev:',this.developers);
      this.developers = data['responses']['A']['developers'];
      this.projects = data['responses']['B']['projects']
    })

    // this.projectService.getProjects().subscribe(result => {
    //   console.log(result);
    //   this.projects = result['projects'];
    // })

  this.authService.user.subscribe(user => {
    this.userRole = user['role'];
  })
}

openDialog() {
  const dialogConfig = new MatDialogConfig();
  dialogConfig.disableClose = true;
  dialogConfig.autoFocus = true;
  dialogConfig.data = {
    developers: this.developers,
    header: 'Add Project',
    isEdit: false
  };
  dialogConfig.width = '30%';
  dialogConfig.minWidth = '300px';
  const dialogRef = this.dialog.open(AddProjectDialogComponent,dialogConfig);

  dialogRef.afterClosed().subscribe(data => {
    console.log('Dialog result:', data);
    if(data.event === 'success') {
      this.projects.push(data.value);
      this._snackBar.openFromComponent(ShowMessageComponent, {
        duration: this.durationInSeconds * 1000,
        horizontalPosition: 'right',
        verticalPosition: 'top',
        panelClass: ['success'],
        data: {type: 'success', msg: 'Project added successfully.'}
      });
    }
  });
}

onEditProject(project) {
  const dialogConfig = new MatDialogConfig();
  dialogConfig.disableClose = true;
  dialogConfig.autoFocus = true;
  dialogConfig.data = {
    developers: this.developers,
    header: 'Edit Project',
    isEdit: true,
    projectData: project
  };
  dialogConfig.width = '30%';
  dialogConfig.minWidth = '300px';
  const dialogRef = this.dialog.open(AddProjectDialogComponent,dialogConfig);

    dialogRef.afterClosed().subscribe(data => {
      console.log('Dialog result:', data);
      if(data.event === 'success') {
        const index = this.projects.findIndex(p=> {
          return p._id === project._id;
        })
        this.projects[index] = data.value;
        this._snackBar.openFromComponent(ShowMessageComponent, {
          duration: this.durationInSeconds * 1000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
          panelClass: ['success'],
          data: {type: 'success', msg: 'Project updated successfully.'}
        });
      }
    });
  }

}
