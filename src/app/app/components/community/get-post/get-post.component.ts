import { NgxSpinnerService } from 'ngx-spinner';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { PostContent } from 'src/app/models/postContent';
import { CommunityService } from 'src/app/services/community.service';
import { UserService } from 'src/app/services/user.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { FlashMessagesService } from 'angular2-flash-messages';

@Component({
  selector: 'app-get-post',
  templateUrl: './get-post.component.html',
  styleUrls: ['./get-post.component.scss'],
})
export class GetPostComponent implements OnInit {
  constructor(
    private _communityService: CommunityService,
    private _userService: UserService,
    private route: ActivatedRoute,
    private _router: Router,
    private _formBuilder: FormBuilder,
    private sanitizer: DomSanitizer,
    private _flashMessagesService: FlashMessagesService,
    private spinner: NgxSpinnerService
  ) { }
  sanitizeImageUrl(imageUrl: string): SafeUrl {
    return this.sanitizer.bypassSecurityTrustUrl(
      `http://127.0.0.1:5000/${imageUrl}`
    );
  }

  form: FormGroup;
  isEditClicked = false;
  isCreateClicked = false;
  isToggleClicked = false;
  isEditComment = false;
  postContent = new PostContent();
  comments = [];
  userID = this._userService.getUserID();
  user;
  postID;
  showFooter = false;
  ngOnInit(): void {
    this.spinner.show();
    console.log('Habibaaaaa:', this.postContent);
    this.route.params.subscribe((params: Params) => {
      this.postID = params['id'];
      console.log(this.postID);
      this._communityService
        .showPostDetails('post/show', this.postID)
        .subscribe(
          (response) => {
            this.spinner.hide();
            console.log(response);
            this.postContent = response['Data'];
            this.showFooter = true;
            let successMessage = response['Message'];

            this._flashMessagesService.show(successMessage, {
              cssClass: 'alert alert-success',
              timeout: 2000,
            });
          },
          (error) => {
            let errorMessage = error['error'].Error;
            this._flashMessagesService.show(errorMessage, {
              cssClass: 'alert alert-danger',
              timeout: 2000,
            });
          }
        );
    });
    this.createForm();
    this.getUser();
  }
  slectedFile: File = null;
  onFileChanged(event: any) {
    if (event.target.files.length > 0) {
      this.slectedFile = <File>event.target.files[0];
    }
  }

  createForm() {
    this.form = this._formBuilder.group({
      Title: [
        '',
        [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(255),
        ],
      ],
      Content: [
        '',
        [
          Validators.required,
          Validators.minLength(20),
          Validators.maxLength(1024),
        ],
      ],
    });
  }

  deletePost(postID) {
    this._communityService
      .deletePost('post/delete', postID)
      .subscribe((response) => {
        alert(response['Message']);
      });
  }
  editPost(title, content) {
    this.spinner.show();
    this.postContent.title = title;
    this.postContent.content = content;
    this._communityService
      .editPostDetails(`post/edit/${this.postID}`, this.postContent)
      .subscribe(
        (response) => {
          this.spinner.hide();
          console.log(response);
          let successMessage = response['Message'];
          this._flashMessagesService.show(successMessage, {
            cssClass: 'alert alert-success',
            timeout: 2000,
          });
        },
        (error) => {
          let errorMessage = error['error'].Error;
          this._flashMessagesService.show(errorMessage, {
            cssClass: 'alert alert-danger',
            timeout: 2000,
          });
        }
      );
  }
  addComment(comment, index) {
    if (this.isEditComment == true) {
      this.spinner.show();
      return this._communityService
        .editComment(`post/${this.postID}/edit-comment/${this.commentid}`, {
          comment,
        })
        .subscribe(
          (response) => {
            this.spinner.hide();
            this.isEditComment = false;
            // this.posts[index]["comments"].push(comment);
            // console.log("This Posts from 61 :", this.posts[index]["comments"]);
            this.postContent['comments'].filter((oldComment, i) => {
              if (oldComment['_id'] == this.commentid) {
                console.log(this.postContent['comments'][i]);
                return (this.postContent['comments'][i] = response['Data']);
              }
            });
            console.log(response);

            let successMessage = response['Message'];
            this._flashMessagesService.show(successMessage, {
              cssClass: 'alert alert-success',
              timeout: 2000,
            });
          },
          (error) => {
            let errorMessage = error['error'].Error;
            this._flashMessagesService.show(errorMessage, {
              cssClass: 'alert alert-danger',
              timeout: 2000,
            });
            this._router.navigate(['/community/show-posts']);
          }
        );
    }
    this._communityService
      .createComment(`post/${this.postID}/create-comment`, { comment })
      .subscribe(
        (response) => {
          this.spinner.hide();
          console.log('from 71', response);
          this.comments.push(response['Data']);
          // this.posts[index]["comments"][this.commentIndex].author =  ;
          let successMessage = response['Message'];
          this._flashMessagesService.show(successMessage, {
            cssClass: 'alert alert-success',
            timeout: 2000,
          });
        },
        (error) => {
          let errorMessage = error['error'].Error;
          this._flashMessagesService.show(errorMessage, {
            cssClass: 'alert alert-danger',
            timeout: 2000,
          });
          this._router.navigate(['/community/show-posts']);
        }
      );
  }
  commentIndex;
  deleteComment(postID, commentID, currentPosttIndex, currentCommentIndex) {
    this.spinner.show();
    this.commentIndex = currentCommentIndex;
    this._communityService
      .deleteComment(`post/${postID}/delete-comment/${commentID}`)
      .subscribe(
        (response) => {
          this.spinner.hide();
          console.log('This Posts from 86 :', this.postContent);
          console.log(response);
          this.postContent['comments'].splice(currentCommentIndex, 1);

          let successMessage = response['Message'];
          this._flashMessagesService.show(successMessage, {
            cssClass: 'alert alert-success',
            timeout: 2000,
          });
        },
        (error) => {
          let errorMessage = error['error'].Error;
          this._flashMessagesService.show(errorMessage, {
            cssClass: 'alert alert-danger',
            timeout: 2000,
          });
          this._router.navigate(['/community/show-posts']);
        }
      );
  }
  commentid = '';
  commentValue = '';
  getCommentValue(value) {
    this.isEditComment = true;
    this.commentValue = value.comment;
    this.commentid = value._id;
  }
  getUser() {
    this.spinner.show();
    console.log(this.userID);
    let userId = this.userID;
    this._communityService.getUser(`user/get-user/${userId}`).subscribe(
      (response) => {
        this.spinner.hide();
        // console.log('This Posts from 86 :', this.postContent);
        this.user = response['Data'];
        console.log(response);
      },
      (error) => {
        console.log(error);
      }
    );
  }
  stringAsDate(dateStr: string) {
    return new Date(dateStr);
  }
  isDark;
  ngDoCheck() {
    let theme = localStorage.getItem('Theme');
    console.log(theme);
    console.log(this.isDark);
    if (theme == 'Dark') {
      this.isDark = true;
      console.log(this.isDark);
    } else {
      this.isDark = false;
    }
  }
}
