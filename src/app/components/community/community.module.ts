import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShowPostsComponent } from './show-posts/show-posts.component';
import { EditPostComponent } from './edit-post/edit-post.component';
import { CreatePostComponent } from './create-post/create-post.component';
import { GetPostComponent } from './get-post/get-post.component';
import { FavoritesPostsComponent } from './favorites-posts/favorites-posts.component';
import { FavouritesPostsComponent } from './favourites-posts/favourites-posts.component';



@NgModule({
  declarations: [ShowPostsComponent, EditPostComponent, CreatePostComponent, GetPostComponent, FavoritesPostsComponent, FavouritesPostsComponent],
  imports: [
    CommonModule
  ]
})
export class CommunityModule { }
