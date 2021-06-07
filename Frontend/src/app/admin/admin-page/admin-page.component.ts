import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { AdminService } from '../admin.service';

@Component({
  selector: 'app-admin-page',
  templateUrl: './admin-page.component.html',
  styleUrls: ['./admin-page.component.css']
})
export class AdminPageComponent implements OnInit,AfterViewInit {

  constructor(private adminService: AdminService) { }

  displayedColumns: string[] = ['project', 'startDate','developers','technologies'];
  dataSource;
  projectData;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  ngOnInit(): void {
    this.adminService.getProjectsData().subscribe(data => {
      if(data['status']==200) {
      console.log('data:',data);
      this.projectData = data['body']['projectData'];
      console.log('first data:',this.projectData);
      this.projectData = this.projectData.map(project => {
        let tech:string='';
        console.log('project:',project)
        for(let i = 0; i< project['technologies'].length;i++) {
          tech = tech+project['technologies'][i];
          if(i < project['technologies'].length-1) {
            tech = tech+', ';
          }
        }
        return {...project,tech:tech}
      })
        console.log('final:',this.projectData);
        this.dataSource = new MatTableDataSource(this.projectData);
        this.dataSource.paginator = this.paginator;
      }
    })
  }
} 

//   export interface PeriodicElement {
//   startDate: string;
//   endDate: string;
//   position: string;
//   version: number;
//   developers: number;
// }

// const ELEMENT_DATA: PeriodicElement[] = [
//   {position: 'Project-1', startDate: '09/05/2021', endDate: '13/09/2021', version: 1, developers: 5},
//   {position: 'Project-2', startDate: '09/05/2021', endDate: '13/09/2021', version: 3, developers: 11},
//   {position: 'Project-3', startDate: '09/05/2021', endDate: '13/09/2021', version: 2, developers: 7},
//   {position: 'Project-4', startDate: '09/05/2021', endDate: '13/09/2021', version: 2, developers: 9},
//   {position: 'Project-5', startDate: '09/05/2021', endDate: '13/09/2021', version: 4, developers: 14},
//   {position: 'Project-6', startDate: '09/05/2021', endDate: '13/09/2021', version: 2, developers: 13},
//   {position: 'Project-7', startDate: '09/05/2021', endDate: '13/09/2021', version: 5, developers: 6},
//   {position: 'Project-8', startDate: '09/05/2021', endDate: '13/09/2021', version: 1, developers: 9},
//   {position: 'Project-9', startDate: '09/05/2021', endDate: '13/09/2021', version: 1, developers: 7},
//   {position: 'Project-10', startDate: '09/05/2021', endDate: '13/09/2021', version: 3, developers: 10},
//   {position: 'Project-11', startDate: '09/05/2021', endDate: '13/09/2021', version: 2, developers: 12},
//   {position: 'Project-12', startDate: '09/05/2021', endDate: '13/09/2021', version: 5, developers: 18},
//   {position: 'Project-13', startDate: '09/05/2021', endDate: '13/09/2021', version: 6, developers: 4},
//   {position: 'Project-14', startDate: '09/05/2021', endDate: '13/09/2021', version: 2, developers: 8},
//   {position: 'Project-15', startDate: '09/05/2021', endDate: '13/09/2021', version: 4, developers: 9},
//   {position: 'Project-16', startDate: '09/05/2021', endDate: '13/09/2021', version: 3, developers: 6},
//   {position: 'Project-17', startDate: '09/05/2021', endDate: '13/09/2021', version: 1, developers: 15},
//   {position: 'Project-18', startDate: '09/05/2021', endDate: '13/09/2021', version: 1, developers: 13},
//   {position: 'Project-19', startDate: '09/05/2021', endDate: '13/09/2021', version: 2, developers: 16},
//   {position: 'Project-20', startDate: '09/05/2021', endDate: '13/09/2021', version: 4, developers: 18},
// ];