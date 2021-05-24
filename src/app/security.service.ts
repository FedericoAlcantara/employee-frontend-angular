import { Injectable } from '@angular/core';
import { Observable } from "rxjs";
import { JwtHelperService } from "@auth0/angular-jwt";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "../environments/environment";
import { mergeMap } from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class SecurityService {

  private apiServerUrl = environment.apiBaseUrl;

  private KEY: string = 'token';
  private SECRET: string = "Thereis No more security that the one We've made since 2021. We will make sure of that, make no mistake";

  constructor(private http: HttpClient) { }

  /**
   * Performs a tokenized http get.
   * @param url Url to be called
   * @param options Optional options.
   */
  public get<Type>(url: string, options?: any): Observable<any> {
    return this.getUserToken()
      .pipe(mergeMap((authorization, index) => {
        return this.http.get<Type>(url, this.addAuthorizationOptions(options, authorization));
      }));
  }

  /**
   * Performs a tokenized http get.
   * @param url Url to be called
   * @param options Optional options.
   */
  public post<Type>(url: string, body?: any, options?: any): Observable<any> {
    return this.getUserToken()
      .pipe(mergeMap((authorization, index) => {
        return this.http.post<Type>(url, body, this.addAuthorizationOptions(options, authorization));
      }));
  }

  /**
   * Performs a tokenized http get.
   * @param url Url to be called
   * @param options Optional options.
   */
  public put<Type>(url: string, body?: any, options?: any): Observable<any> {
    return this.getUserToken()
      .pipe(mergeMap((authorization, index) => {
        return this.http.put<Type>(url, body, this.addAuthorizationOptions(options, authorization));
      }));
  }

  /**
   * Performs a tokenized http get.
   * @param url Url to be called
   * @param options Optional options.
   */
  public delete<Type>(url: string, options?: any): Observable<any> {
    return this.getUserToken()
      .pipe(mergeMap((authorization, index) => {
        return this.http.delete<Type>(url, this.addAuthorizationOptions(options, authorization));
      }));
  }

  /**
   * Gets the user token
   */
  private getUserToken(): Observable<Object> {
    const json = sessionStorage.getItem(this.KEY);

    if (json) {
      const authorizationJson = JSON.parse(json);
      const token = authorizationJson['token'].split(':')[1];
      const jwt = new JwtHelperService();
      const decoded = jwt.decodeToken(token);
      const currentTime = (Date.now() / 1000);
      if (decoded.exp > currentTime) {
        return new Observable(subscriber => {
          subscriber.next(authorizationJson);
          subscriber.complete();
        })
      } else {
        sessionStorage.removeItem(this.KEY);
      }
    }
    return this.http.post<string>(`${this.apiServerUrl}/user/login?user=peter&password=password`, {user:'peter', password:'password'});
  }

  private addAuthorizationOptions(options: any, authorization: any): any {
    sessionStorage.setItem(this.KEY, JSON.stringify(authorization));
    if (!options) {
      options = {};
    }
    const headers = options.headers;
    if (!headers) {
      options.headers = new HttpHeaders();
    }
    options.headers = options.headers.set('Content-type', 'application/json');
    options.headers = options.headers.set('Authorization', authorization.token);
    return options;
  }
}
