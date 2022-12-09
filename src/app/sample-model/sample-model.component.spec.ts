import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SampleModelComponent } from './sample-model.component';

describe('SampleModelComponent', () => {
  let component: SampleModelComponent;
  let fixture: ComponentFixture<SampleModelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SampleModelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SampleModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
