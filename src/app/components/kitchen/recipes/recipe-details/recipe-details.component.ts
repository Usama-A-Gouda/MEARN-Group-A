import { FavoritesService } from './../../../../services/favorites.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Location } from '@angular/common';
import { UserService } from 'src/app/services/user.service';
import { CommunityService } from 'src/app/services/community.service';
import { User } from 'src/app/models/user';
import { MustMatch } from './MustMatch';

@Component({
  selector: 'app-recipe-details',
  templateUrl: './recipe-details.component.html',
  styleUrls: ['./recipe-details.component.scss'],
})
export class RecipeDetailsComponent implements OnInit {
  recipeDetails: any;
  recipeDetailsName: string;
  moreRecipes: any;
  recipeID;
  isCreateClicked = false;
  userID = this._userService.getUserID();
  flag2 = true;
  flag3 = false;
  flag4 = false;
  flag5 = false;
  flagFav = false;
  currentURL = '';
  user: User;
  userr = new User();
  showFooter = false;
  isSignIn: Boolean = false;
  favoriteButtonFlag = false;
  shareToCommunityFlag = false;
  constructor(
    private _apiServices: ApiService,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private _location: Location,
    private _favoritesServices: FavoritesService,
    private _userService: UserService,
    private _communityService: CommunityService
  ) {
    this.currentURL = window.location.href;
  }

  ngOnInit() {
    this.spinner.show();
    this.route.params.subscribe((params: Params) => {
      const prodId = params['id'];
      this.recipeID = params['id'];
      console.log(prodId);
      this._apiServices
        .get(`recipes/${prodId}/information?amount=1&`)
        .subscribe(
          (responseInfo) => {
            this.spinner.hide();
            this.showFooter = true;
            this.recipeDetails = responseInfo;
            console.log(this.recipeDetails);
            if (this.userID != null) {
              this.getUser(this.userID);
              this.isSignIn = true;
            }
          },
          (err) => {
            console.log(err);
          }
        );
    });
  }

  slectedFile: File = null;
  onFileChanged(event: any) {
    if (event.target.files.length > 0) {
      this.slectedFile = <File>event.target.files[0];
      console.log(this.slectedFile);
    }
  }

  singUp(username, email, password, confirmedPassword) {
    // this.user.username = username;
    // this.user.email = email;
    // this.user.password = password;
    // this.user.confirmedPassword = confirmedPassword;
    const formData = new FormData();
    if (this.slectedFile != null) {
      formData.append('image', this.slectedFile, this.slectedFile.name);
    }

    formData.append('username', username);
    formData.append('email', email);
    formData.append('password', password);
    formData.append('confirmedPassword', confirmedPassword);
    this._communityService.CreateUser('user/register', formData).subscribe(
      (response) => {
        console.log(response);
        this.buttonClicked();
        let successMessage = response['Message'];
        console.log(successMessage);
      },
      (error) => {
        console.log(error);
      }
    );
  }
  login(Inputemail, Inputpassword) {
    console.log(Inputemail, Inputpassword);
    this.userr.email = Inputemail;
    this.userr.password = Inputpassword;

    this._communityService.LoginUser('user/login', this.userr).subscribe(
      (response) => {
        this.isSignIn = true;
        this.favoriteButtonFlag = false;
        this.shareToCommunityFlag = false;

        this._userService.login(
          response['Data'].token,
          response['Data'].userID
        );
        this.userID = this._userService.getUserID();
      },
      (error) => {
        console.log(error);
      }
    );
  }
  // close() {
  //   const pop = document.querySelector('.main-container') as HTMLInputElement;
  //   pop.classList.toggle('target');
  // }
  flag = false;
  buttonClicked() {
    this.flag = !this.flag;
  }
  ingActive() {
    this.flag2 = true;
    this.flag3 = false;
    this.flag4 = false;
  }
  instActive() {
    this.flag3 = true;
    this.flag2 = false;
    this.flag4 = false;
  }
  summActive() {
    this.flag4 = true;
    this.flag2 = false;
    this.flag3 = false;
  }
  back() {
    this._location.back();
  }
  favoriteRecipes;
  addToFavorites() {
    console.log(this.recipeID);
    this._favoritesServices
      .addToFavorite(`favorites/add-recipe-to-favorite/${this.recipeID}`)
      .subscribe(
        (response) => {
          this.spinner.hide();
          // console.log('This Posts from 86 :', this.postContent);
          this.favoriteRecipes = response['Data'];
          console.log(this.favoriteRecipes);
        },
        (error) => {
          console.log(error);
        }
      );
  }
  removeFromFavorites() {
    console.log(this.recipeID);
    this._favoritesServices
      .removeFromFavorite(
        `favorites/remove-recipe-from-favorite/${this.recipeID}`
      )
      .subscribe(
        (response) => {
          this.spinner.hide();
          // console.log('This Posts from 86 :', this.postContent);
          this.favoriteRecipes = response['Data'];
          console.log(this.favoriteRecipes);
        },
        (error) => {
          console.log(error);
        }
      );
  }
  getUser(userID) {
    this.spinner.show();

    this._communityService.getUser(`user/get-user/${userID}`).subscribe(
      (response) => {
        this.spinner.hide();
        // console.log('This Posts from 86 :', this.postContent);
        this.user = response['Data'];
        this.isSignIn = true;
        console.log('user:', this.user);
        // console.log('The fav', this.user.favoritePosts.includes(this.posts[0]));
        if (this.user.favoriteRecipes.includes(this.recipeID)) {
          this.flagFav = true;
        }
        console.log(this.flagFav);
      },
      (error) => { }
    );
  }
  createPost(title: string, content: string) {
    // this.postContent.title = title;
    // this.postContent.content = content;
    // this.postContent.imageURL = imageURL;
    const image = `https://spoonacular.com/recipeImages/${this.recipeDetails.id}-636x393.jpg`;
    console.log(image);
    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    formData.append('imageURL', image);
    // this.postContent.imageURL = formData;
    // console.log(this.postContent.imageURL);
    this._communityService.createPost('post/create', formData).subscribe(
      (response) => {
        console.log('posts', response['Data']);

        this.user.posts.push(response['Data']);
        let successMessage = response['Message'];
        console.log(successMessage);
        this.shareToCommunityFlag = false;
      },
      (error) => {
        let errorMessage = error['error'].Error;
        console.log(errorMessage);
      }
    );
  }
  btnClicked() {
    this.shareToCommunityFlag = true;

    // if (this.userID != null) {

    //   this.isSignIn = true;
    // } else {
    //   this.isSignIn = false;
    // }
  }
  stopSubmitting() {
    return false;
  }
  btnClickedFav() {
    this.favoriteButtonFlag = true;
    if (this.userID != null) {
      console.log('isclicked', this.isSignIn);
      this.getUser(this.userID);
      this.isSignIn = true;
      if (this.flagFav == true) {
        this.removeFromFavorites();
        this.flagFav = false;
        console.log(this.flagFav);
      } else {
        this.addToFavorites();
        this.flagFav = true;
        console.log(this.flagFav);
      }
    } else {
      this.isSignIn = false;
      console.log(this.userID);
    }
  }
  isDark = false;
  ngDoCheck() {
    let theme = localStorage.getItem('Theme');
    console.log(theme);
    console.log(this.isDark);
    if (theme == 'Dark') {
      this.isDark = true;
      console.log(this.isDark);
    } else {
      this.isDark = false;
    }
  }
}
