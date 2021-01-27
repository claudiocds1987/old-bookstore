import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditFormBookComponent } from './edit-form-book.component';

describe('EditFormBookComponent', () => {
  let component: EditFormBookComponent;
  let fixture: ComponentFixture<EditFormBookComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditFormBookComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditFormBookComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
