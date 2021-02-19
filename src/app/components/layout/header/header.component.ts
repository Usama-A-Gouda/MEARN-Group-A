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
  isLogged: boolean = false;
  userID = this._userService.getUserID();

  constructor(private _userService: UserService) {}

  ngOnInit(): void {
    this.isLogged = this._userService.isLogged();
    this._userService.getLoggedStatus().subscribe((status) => {
      this.isLogged = status;
      console.log(this.isLogged);
    });
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

  ngDoCheck() {
    const cb = document.querySelector('.checkbox-input') as HTMLInputElement;
    if (localStorage.getItem('Theme') == 'Dark') {
      cb.checked = true;
    } else {
      cb.checked = false;
    }
  }

  setTheme(isChecked) {
    if (isChecked) {
      localStorage.setItem('Theme', 'Dark');
    } else {
      localStorage.setItem('Theme', 'Light');
    }
  }
}
