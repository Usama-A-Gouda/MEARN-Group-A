import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PouplarRecipesComponent } from './pouplar-recipes.component';

describe('PouplarRecipesComponent', () => {
  let component: PouplarRecipesComponent;
  let fixture: ComponentFixture<PouplarRecipesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PouplarRecipesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PouplarRecipesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
