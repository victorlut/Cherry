import { Component, OnInit } from '@angular/core';
import { ChatService } from '../../shared/services/chat.service';
import { ContactsService } from '../../shared/services/contacts.service';
import { config } from '../../shared/modules/config.model';

@Component({
  selector: 'app-waitinglist',
  templateUrl: './waitinglist.component.html',
  styleUrls: ['./waitinglist.component.scss']
})
export class WaitinglistComponent implements OnInit {
  waitingList = [];
  constructor(
    private chatService: ChatService,
    private contactsService: ContactsService
  ) { }

  ngOnInit() {
    var me = this;
    this.chatService.messages.subscribe(msg => {
      if (msg.text.type === 'requestchat') {
        var userId = msg.text.userId;
        var isExist = false;
        me.waitingList.map(waitItem => {
          if (userId === waitItem.userId) {
            isExist = true;
          }
        });
        
        if (isExist) {
          return;
        }

        me.contactsService.getUserProfile(userId).subscribe(user => {
          if (user['error'] === 0 && user['data'].length > 0) {
            // contact['profile_image'] = user['data'][0]['image'];
            if (user['data'][0]['image'] === '' || user['data'][0]['image'] === '/upload/profile-placeholder.png') {
              user['data'][0]['image'] = config.baseURL + 'avartar.png';
            }
            me.waitingList.push({
              userId: userId,
              image: user['data'][0]['image'],
              name: user['data'][0]['first_name'] + ' ' + user['data'][0]['last_name']
            });
          }
        });
        
      }
    });
  }

}