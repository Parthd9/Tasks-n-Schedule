import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from "@angular/router";
import { forkJoin } from "rxjs";
import { map } from "rxjs/operators";
import { AdminService } from "./admin.service";

@Injectable({providedIn: 'root'})
export class AdminResolverService implements Resolve<any> {

    constructor(private adminService: AdminService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
       let projectData =  this.adminService.getProjectsData();
       let  usersCount = this.adminService.getAllUsersCount();
       let techDataCount = this.adminService.getTechDataCount();
       let yearWiseData = this.adminService.getYearWiseCount();
      console.log('calling methods');
       let join = forkJoin(projectData,usersCount,techDataCount,yearWiseData).pipe(map((allResponses) => {
        return {
          A: allResponses[0],
          B: allResponses[1],
          C: allResponses[2],
          D: allResponses[3]
        };
      }))
      return join;
    }
}
