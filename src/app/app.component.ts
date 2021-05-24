import { Observable } from 'rxjs';
import { Employee } from './employee';
import { EmployeeService } from './employee.service';
import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
  title = 'employeemanagerapp';

  public employees: Employee[] = [];

  public selectedEmployee: Employee =  null;

  constructor(private employeeService: EmployeeService){}

  ngOnInit(): void {
    this.getEmployees();
  }

  public getEmployees(): void {
    this.employeeService.getEmployees().subscribe(
      (response : Employee[]) => {
        this.employees = response;
      },
      (error: HttpErrorResponse) => {
        alert(error.status + " - " + error.message);
      }
    );
  }

  public onOpenModal(employee: Employee, mode: string): void {
    const container = document.getElementById('main-container');
    const button = document.createElement('button');
    button.type = 'button';
    button.style.display = 'none';
    button.setAttribute('data-toggle', 'modal');
    this.selectedEmployee = employee;

    button.setAttribute('data-target', '#' + mode + 'EmployeeModal');

    container?.appendChild(button);
    button.click();
  }

  public onAddEmployee(form: NgForm): void {
    this.handleObservable(this.employeeService.addEmployee(form.value));
    form.reset();
  }

  public onUpdateEmployee(form: NgForm): void {
    this.handleObservable(this.employeeService.updateEmployee(form.value));
  }

  public onDeleteEmployee(id: number): void {
    this.handleObservable(this.employeeService.deleteEmployee(id));
  }

  public onSearch(key: string): void {
    if (key) {
      const results: Employee[] = [];
      const searchKey = key.toLowerCase();
      for (const employee of this.employees) {
        if (employee.name.toLowerCase().indexOf(searchKey) > -1) {
          results.push(employee);
        }
      }
      this.employees = results;
    } else {
      this.getEmployees();
    }
  }

  private handleObservable(observable: Observable<any>): void {
    observable.subscribe(
      (response: any) => {
        console.log(response);
        this.getEmployees();
      },
      (error: HttpErrorResponse) => {
        console.log(error);
        alert(error.status + ' ' + error.message)
        this.getEmployees();
      }
    );
  }

}
