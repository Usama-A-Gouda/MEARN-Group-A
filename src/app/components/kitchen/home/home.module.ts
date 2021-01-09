import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchComponent } from './search/search.component';
import { PlanComponent } from './plan/plan.component';
import { JoinUsComponent } from './join-us/join-us.component';
import { PouplarRecipesComponent } from './pouplar-recipes/pouplar-recipes.component';
import { ReturnedListComponent } from './returned-list/returned-list.component';



@NgModule({
  declarations: [SearchComponent, PlanComponent, JoinUsComponent, PouplarRecipesComponent, ReturnedListComponent],
  imports: [
    CommonModule
  ]
})
export class HomeModule { }
