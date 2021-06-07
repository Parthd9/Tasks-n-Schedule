import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable()
export class AdminService {

  constructor(private http: HttpClient) {}
  addUser(data) {
    return this.http.post('/tns/api/admin/add-user', data,  {observe: 'response'});
  }
  getUsers() {
    return this.http.get('/tns/api/admin/get-users', {observe: 'response'});
  }
  editUser(data) {
    // console.log(data);
    return this.http.put('/tns/api/admin/edit-user', data,  {observe: 'response'});
  }
  removeUser(id) {
    return this.http.post('/tns/api/admin/remove-user', id, {observe: 'response'});
  }

  getProjectsData() {
    return this.http.get('/tns/api/admin/getProjectsData', {observe: 'response'});
  }
  
}
