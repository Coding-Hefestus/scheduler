import { Component, OnInit } from '@angular/core';
import { RxStompService } from '@stomp/ng2-stompjs';
import { Message } from '@stomp/stompjs';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css']
})
export class TestComponent implements OnInit {

  constructor(private rxStompService: RxStompService) { }

  ngOnInit(): void {
    this.rxStompService.watch('/ericsson/reload').subscribe((message: Message) => {
      console.log("iz /ericsson/reload: " + message.body);
    });
  }

}
