import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SecretFriendSortComponent } from './secret-friend-sort.component';

describe('SecretFriendSortComponent', () => {
  let component: SecretFriendSortComponent;
  let fixture: ComponentFixture<SecretFriendSortComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SecretFriendSortComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SecretFriendSortComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
