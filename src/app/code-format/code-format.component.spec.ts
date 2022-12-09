import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CodeFormatComponent } from './code-format.component';

describe('CodeFormatComponent', () => {
  let component: CodeFormatComponent;
  let fixture: ComponentFixture<CodeFormatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CodeFormatComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CodeFormatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
