import { environment } from 'src/environments/environment';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Employee } from './employee';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SecurityService } from "./security.service";

@Injectable({
  providedIn: 'root'
})

export class EmployeeService {
  private apiServerUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient, private security: SecurityService) { }

  public getEmployees(): Observable<Employee[]> {
    return this.security.get(`${this.apiServerUrl}/employee/all`);
  }

  public addEmployee(employee: Employee): Observable<Employee> {
    return this.security.post<Employee>(`${this.apiServerUrl}/employee/add`, employee);
  }

  public updateEmployee(employee: Employee): Observable<Employee> {
    return this.security.put<Employee>(`${this.apiServerUrl}/employee/update`, employee);
  }

  public deleteEmployee(id: number): Observable<void> {
    return this.security.delete<void>(`${this.apiServerUrl}/employee/delete/${id}`);
  }
}
