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
}
