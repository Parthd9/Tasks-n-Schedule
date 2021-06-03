import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from "@angular/router";
import { forkJoin } from "rxjs";
import { map } from "rxjs/operators";
import { ProjectsService } from "./projects.service";

@Injectable({providedIn: 'root'})
export class ProjectResolverService implements Resolve<any> {

    constructor(private projectService: ProjectsService) {}
    
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
       let developers =  this.projectService.getDevelopers();
       let projects = this.projectService.getProjects();

       let join = forkJoin(developers,projects).pipe(map((allResponses) => {
        return {
          A: allResponses[0],
          B: allResponses[1]
        };
      }))
      return join;
    }
}