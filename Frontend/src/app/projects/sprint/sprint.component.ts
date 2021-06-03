import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { ShowMessageComponent } from 'src/app/shared/show-message/show-message.component';
import { AddVersionComponent } from '../modals/add-version/add-version.component';
import { ProjectsService } from '../projects.service';

@Component({
  selector: 'app-sprint',
  templateUrl: './sprint.component.html',
  styleUrls: ['./sprint.component.css']
})
export class SprintComponent implements OnInit {

  userRole = '';
  sprints = [];
  durationInSeconds = 4;

  constructor(private dialog: MatDialog, private currentRoute: ActivatedRoute, private router: Router,
    private authService: AuthService, private projectService: ProjectsService, private _snackBar: MatSnackBar) { }

  ngOnInit(): void {
    console.log("sprint:",this.currentRoute.snapshot.queryParams);
    this.authService.user.subscribe(user => {
      this.userRole = user['role'];
    });
    this.projectService.getSprints().subscribe(sprintDoc => {
      if(sprintDoc['status'] === 200) {
        this.sprints = sprintDoc['body']['sprints'];
      }
    });
  }

  openDialog() {
    const dialogConfig = new MatDialogConfig();
    // dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      id: 1,
      header: 'Add New Sprint',
      name: 'Sprint Number',
      description: 'Sprint Description',
      fromVersion: false
    };
    dialogConfig.width = '30%';
    dialogConfig.minWidth = '300px';
    const dialogRef = this.dialog.open(AddVersionComponent,dialogConfig);

    dialogRef.afterClosed().subscribe(data => {
      console.log('Dialog result:', data);
      if(data.event === 'success') {
        this.sprints.push(data.value);
        this._snackBar.openFromComponent(ShowMessageComponent, {
          duration: this.durationInSeconds * 1000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
          panelClass: ['success'],
          data: {type: 'success', msg: 'Sprint added successfully.'}
        });
      }
    });
  }

  onViewBacklog(index) {
    console.log("onViewBacklog called");
    this.router.navigate(['backlog'],{relativeTo:this.currentRoute, queryParams: {sprintId: index}, queryParamsHandling: "merge"});
  }

}
