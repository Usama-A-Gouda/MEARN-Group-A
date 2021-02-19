import { Component, OnInit } from '@angular/core';
import { CommunityService } from 'app/services/community.service';
import { Comment } from './../models/comments';

@Component({
  selector: 'app-comment-table',
  templateUrl: './comment-table.component.html',
  styleUrls: ['./comment-table.component.css']
})
export class CommentTableComponent implements OnInit {

  comments: Comment[] = [];
  isResponsDone = false;
  constructor(private _communityService: CommunityService) { }

  ngOnInit() {
    // get all comments
    this._communityService.getAll('post/get-comments').subscribe(
      response => {
        this.isResponsDone = true;
        this.comments = response["Data"]

        console.log(this.comments);

      })

  }
  stringAsDate(dateStr: string) {
    return new Date(dateStr);
  }
  //delete comment
  deleteComment(commentID, comment, index) {
    let isConfirmed = confirm(`Are u sure that u want to delete ${comment} ?`);
    if (isConfirmed) {
      this._communityService.delete(`post/delete-comment/${commentID}`)
        .subscribe(response => {
          console.log(response);
          this.comments.splice(index, 1)

        }, error => {
          console.log(error)
        }

        )
    }
  }

}
