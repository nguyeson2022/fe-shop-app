import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import {RegisterDTO} from "../dtos/user/register.dto";
import {LoginDTO} from "../dtos/user/login.dto";
import {environment} from "../environments/environment";
import { HttpUtilService } from './http.util.service';
import {UserResponse} from "../responses/user/user.response";
import {LocalStorageService} from 'ngx-webstorage';
import {UpdateUserDTO} from "../dtos/user/update.user.dto";
import {ApiResponse} from "../responses/api.response";
import {User} from "../models/user";
import {UpdateUser} from "../dtos/user/update.admin.user.dto";
import {Product} from "../models/product";
@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiRegister = `${environment.apiBaseUrl}/users/register`;
  private apiLogin = `${environment.apiBaseUrl}/users/login`;
  private apiUserDetail = `${environment.apiBaseUrl}/users/details`;

  localStorage?: LocalStorageService;

  private apiConfig = {
    headers: this.httpUtilService.createHeaders(),
  }

  constructor(
    private http: HttpClient,
    private httpUtilService: HttpUtilService
  ) {}
  /*private createHeaders(): HttpHeaders{
    return new HttpHeaders({
      'Content-Type': 'application/json' ,
      'Accept-Language' : 'vi'

    });
  }*/
  register(registerDTO: RegisterDTO):Observable<any> {
    return this.http.post(this.apiRegister, registerDTO, this.apiConfig);
  }

  login(loginDTO: LoginDTO): Observable<any> {
    return this.http.post(this.apiLogin, loginDTO, this.apiConfig);
  }
  getUserDetail(token: string) {
    return this.http.post(this.apiUserDetail, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      })
    })
  }
  getUserId(userId: number):Observable<User>{
    return this.http.get<User>(`${environment.apiBaseUrl}/users/${userId}`, this.apiConfig);
  }
  updateUserDetail(token: string, updateUser: UpdateUser) {
    
    let userResponse = this.getUserResponseFromLocalStorage();
    return this.http.put(`${this.apiUserDetail}/${userResponse?.id}`,updateUser,{
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      })
    })
  }

  updateUser( userId: number, token: string, updateUser: UpdateUser) {
    
    let userResponse = this.getUserResponseFromLocalStorage();
    return this.http.put(`${this.apiUserDetail}/${userId}`,updateUser,{
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      })
    })
  }
  saveUserResponseToLocalStorage(userResponse?: UserResponse) {
    try {
      
      if(userResponse == null || !userResponse) {
        return;
      }
      // Convert the userResponse object to a JSON string
      const userResponseJSON = JSON.stringify(userResponse);
      // Save the JSON string to local storage with a key (e.g., "userResponse")
      localStorage.setItem('user', userResponseJSON);
      console.log('User response saved to local storage.');
    } catch (error) {
      console.error('Error saving user response to local storage:', error);
    }
  }
  getUserResponseFromLocalStorage():UserResponse | null {
    try {
      // Retrieve the JSON string from local storage using the key
      const userResponseJSON = localStorage.getItem('user');
      if(userResponseJSON == null || userResponseJSON == undefined) {
        return null;
      }
      // Parse the JSON string back to an object
      const userResponse = JSON.parse(userResponseJSON!);
      console.log('User response retrieved from local storage.');
      return userResponse;
    } catch (error) {
      console.error('Error retrieving user response from local storage:', error);
      return null; // Return null or handle the error as needed
    }
  }
  removeUserFromLocalStorage():void {
    try {
      // Remove the user data from local storage using the key
      localStorage.removeItem('user');
      console.log('User data removed from local storage.');
    } catch (error) {
      console.error('Error removing user data from local storage:', error);
      // Handle the error as needed
    }
  }

  getUsers(params: { page: number, limit: number, keyword: string }): Observable<User[]> {
    const url = `${environment.apiBaseUrl}/users`;
    return this.http.get<User[]>(url, { params: params });
  }

  resetPassword(userId: number): Observable<any> {
    const url = `${environment.apiBaseUrl}/users/reset-password/${userId}`;
    return this.http.put<any>(url, null, this.apiConfig);
  }

  toggleUserStatus(params: { userId: number, enable: boolean }): Observable<any> {
    const url = `${environment.apiBaseUrl}/users/block/${params.userId}/${params.enable ? '1' : '0'}`;
    return this.http.put<any>(url, null, this.apiConfig);
  }

}
