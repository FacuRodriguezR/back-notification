import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NotificacionsPage } from './notificacions.page';

describe('NotificacionsPage', () => {
  let component: NotificacionsPage;
  let fixture: ComponentFixture<NotificacionsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(NotificacionsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
