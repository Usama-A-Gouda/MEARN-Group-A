import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http'
import { environment } from '../../environments/environment';
import {UserService} from './user.service'

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private _httpClient:HttpClient,private _userService:UserService) { }
    get(url:string)
    {
      //return this._httpClient.get(`${environment.apiURL}/${url}`,{headers:{'token':this._userService.getToken()}});
      return this._httpClient.get(`${environment.apiURL}/${url}`);
    }

    post(url:string,body:any)
    {
      return this._httpClient.post(`${environment.apiURL}/${url}`,body);
    }
    
    // PUT(url:string,body:any)
    // {
    //   return this._httpClient.put(`${environment.apiURL}/${url}`,body);
    // }
    
    // delete(url:string)
    // {
    //   return this._httpClient.delete(`${environment.apiURL}/${url}`);
    // }

}
