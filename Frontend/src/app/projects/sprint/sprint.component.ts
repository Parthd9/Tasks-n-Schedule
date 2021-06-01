import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { AddProjectDialogComponent } from '../modals/add-project-dialog/add-project-dialog.component';

@Component({
  selector: 'app-sprint',
  templateUrl: './sprint.component.html',
  styleUrls: ['./sprint.component.css']
})
export class SprintComponent implements OnInit {

  userRole = '';
  sprints = [
    {
    title : "Sprint-1",
    desc: "With supporting text below as a natural lead-in to additional content."
    },
    {
      title : "Sprint-2",
      desc: "With supporting text below as a natural lead-in to additional content."
    },
    {
      title : "Sprint-3",
      desc: "With supporting text below as a natural lead-in to additional content."
    },
    {
      title : "Sprint-4",
      desc: "With supporting text below as a natural lead-in to additional content."
    },
    {
      title : "Sprint-5",
      desc: "With supporting text below as a natural lead-in to additional content."
    }];

  constructor(private dialog: MatDialog, private currentRoute: ActivatedRoute, private router: Router, private authService: AuthService) { }

  ngOnInit(): void {
    console.log("sprint:",this.currentRoute.snapshot.queryParams);
    this.authService.user.subscribe(user => {
      this.userRole = user['role'];
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
      devoptEnabled: 'No'
    };
    dialogConfig.width = '30%';
    dialogConfig.minWidth = '300px';
    const dialogRef = this.dialog.open(AddProjectDialogComponent,dialogConfig);

    dialogRef.afterClosed().subscribe(data => {
      console.log('Dialog result:', data);
      if(data.event === 'save') {
        this.sprints.push({title: data.value.title, desc:data.value.desc});
      }
    });
  }

  onViewBacklog(index) {
    console.log("onViewBacklog called");
    this.router.navigate(['backlog'],{relativeTo:this.currentRoute, queryParams: {sprintId: index}, queryParamsHandling: "merge"});
  }

}
