import { CommunityService } from './../../../services/community.service';
import { Component, HostListener, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
declare const window: any;
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  isScrolled = false;
  isLogged: boolean;
  userID;
  user;

  constructor(
    private _userService: UserService,
    private _communityService: CommunityService
  ) {}

  ngOnInit(): void {
    // this.isLogged = this._userService.isLogged();
  }
  navScroll(event) {
    console.log(event);
    this.isScrolled = true;
  }

  logout() {
    this._userService.logout();
  }
  @HostListener('window:scroll', [])
  onWindowScroll() {
    const header = document.querySelector('header') as HTMLInputElement;
    const number =
      window.pageYOffset ||
      document.documentElement.scrollTop ||
      document.body.scrollTop ||
      0;
    if (number > 100) {
      header.classList.add('background-header');
    } else if (number < 50) {
      header.classList.remove('background-header');
    }
  }

  menu() {
    const menu = document.querySelector('.menu-trigger') as HTMLInputElement;
    const nav = document.querySelector('.header-area .nav') as HTMLInputElement;
    console.log('clicked');
    menu.classList.toggle('active');
    nav.classList.toggle('drop');
  }
  ngAfterContentChecked() {
    if (localStorage.getItem('Token')) {
      this.isLogged = true;
      if (!this.user) {
        this.getUser();
      }
    } else {
      this.isLogged = false;
    }
  }
  ngDoCheck() {
    const cb = document.querySelector('.checkbox-input') as HTMLInputElement;
    if (localStorage.getItem('Theme') == 'Dark') {
      cb.checked = true;
    } else {
      cb.checked = false;
    }

    /* 
    subscribe((status) => {
      this.isLogged = status;
      console.log("logged?", this.isLogged);
    })
*/
  }
  isDark = false;
  setTheme(isChecked) {
    if (isChecked) {
      localStorage.setItem('Theme', 'Dark');
      this.isDark = true;
    } else {
      localStorage.setItem('Theme', 'Light');
      this.isDark = false;
    }
  }
  getUser() {
    console.log(this.userID);
    let userId = this._userService.getUserID();
    this._communityService.getUser(`user/get-user/${userId}`).subscribe(
      (response) => {
        // console.log('This Posts from 86 :', this.postContent);
        this.user = response['Data'];
        console.log('user:', this.user);
        // console.log('The fav', this.user.favoritePosts.includes(this.posts[0]));
      },
      (error) => {
        let errorMessage = error['error'].Error;
      }
    );
  }
}
