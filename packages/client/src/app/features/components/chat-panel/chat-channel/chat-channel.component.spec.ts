import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatChannelComponent } from './chat-channel.component';

describe('ChatChannelComponent', () => {
  let component: ChatChannelComponent;
  let fixture: ComponentFixture<ChatChannelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ChatChannelComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChatChannelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
