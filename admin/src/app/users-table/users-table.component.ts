import { Component, OnInit } from '@angular/core';
import { User } from 'app/models/user';
import { CommunityService } from 'app/services/community.service';

@Component({
  selector: 'app-users-table',
  templateUrl: './users-table.component.html',
  styleUrls: ['./users-table.component.css']
})
export class UsersTableComponent implements OnInit {
  users: User[] = [];
  beforSearch: User[] = [];
  isResponsDone = false;
  constructor(private _communityService: CommunityService) { }

  ngOnInit() {
    this._communityService.getAll('user/show').subscribe(
      response => {
        this.isResponsDone = true;
        this.users = response["Data"]
        this.beforSearch = response["Data"];
        console.log(this.users);

      })

  }
  stringAsDate(dateStr: string) {
    return new Date(dateStr);
  }
  deleteUser(userID, username, index) {
    let isConfirmed = confirm(`Are u sure that u want to delete ${username} ?`);
    if (isConfirmed) {
      this._communityService.delete(`user/delete-user/${userID}`)
        .subscribe(response => {
          console.log(response);

          this.users.splice(index, 1)
          this.beforSearch = this.users;
        }, error => {
          console.log(error)
        }

        )
    }
  }
  search(event) {

    if (event.target.value.length == 0) {
      return this.users = this.beforSearch;

    }
    else {
      this.users = this.users.filter((user, index) => {
        if ((user.username.includes(event.target.value)) || (user.email.includes(event.target.value))) {
          return this.users[index];
        }

      })
    }


  }

}
