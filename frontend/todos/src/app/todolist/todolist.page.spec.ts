import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TodolistPage } from './todolist.page';

describe('TodolistPage', () => {
  let component: TodolistPage;
  let fixture: ComponentFixture<TodolistPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(TodolistPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
