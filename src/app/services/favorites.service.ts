import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root',
})
export class FavoritesService {
  constructor(
    private _httpClient: HttpClient,
    private _userService: UserService
  ) {}
  addToFavorite(url: string) {
    console.log(url);
    return this._httpClient.post(
      `${environment.communityURL}/${url}`,
      {},
      {
        headers: { authorization: this._userService.getToken() },
      }
    );
  }
  removeFromFavorite(url: string) {
    console.log(url);
    return this._httpClient.put(
      `${environment.communityURL}/${url}`,
      {},
      {
        headers: { authorization: this._userService.getToken() },
      }
    );
  }
}
