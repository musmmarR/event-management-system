import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainEventDialogComponent } from './main-event-dialog.component';

describe('MainEventDialogComponent', () => {
  let component: MainEventDialogComponent;
  let fixture: ComponentFixture<MainEventDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MainEventDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MainEventDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
