import { IngredientsModule } from './ingredients/ingredients.module';
import { RecipesModule } from './recipes/recipes.module';
import { HomeModule } from './home/home.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReturnedListComponent } from './returned-list/returned-list.component';




@NgModule({
  declarations: [ReturnedListComponent],
  imports: [
    CommonModule,
    HomeModule,
    RecipesModule,
    IngredientsModule

  ]
})
export class KitchenModule { }
