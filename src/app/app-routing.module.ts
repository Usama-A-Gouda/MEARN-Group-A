import { FavouritesPostsComponent } from './components/community/favourites-posts/favourites-posts.component';
import { CreatePostComponent } from './components/community/create-post/create-post.component';
import { GetPostComponent } from './components/community/get-post/get-post.component';
import { ShowPostsComponent } from './components/community/show-posts/show-posts.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {path: "show", component: ShowPostsComponent},
  {path: "get", component: GetPostComponent},
  {path: "create", component: CreatePostComponent},
  {path: "favourite", component: FavouritesPostsComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
