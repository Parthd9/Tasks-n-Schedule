import { HttpClient, HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable()
export class ProjectsService {
    constructor(private http: HttpClient) {}

    addProject(data) {
        console.log('project data:',data);
        return this.http.post('/tns/api/projects/add-project',data, { observe: 'response'});
    }

    getDevelopers() {
        return this.http.get('/tns/api/projects/getDevelopers');
    }

    getProjects() {
        return this.http.get('/tns/api/projects/getProjects');
    }
}