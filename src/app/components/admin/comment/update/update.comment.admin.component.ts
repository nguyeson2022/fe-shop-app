import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Comment, CommentRequest } from '../../../../models/comment';
import { CommentService } from '../../../../services/comment.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-update-comment-admin',
  templateUrl: './update.comment.admin.component.html',
  styleUrls: ['./update.comment.admin.component.css']
})
export class UpdateCommentAdminComponent implements OnInit {
  @Input() commentId: number;
  @Input() comment: CommentRequest | null = null;
  @Input() comments: Comment | null = null;
  updateCommentForm: FormGroup;
  userId: number;
  productId: number = 0;
  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private commentService: CommentService,
    private toastr: ToastrService,
    private router: Router,
  ) {
    this.commentId = 0;
    this.updateCommentForm = this.formBuilder.group({
      content: ['', Validators.required]
    });
    this.userId = 0;
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.commentId = Number(params.get('id'));
      this.getCommentById(this.commentId);
    });

    const userData = localStorage.getItem('user');
    if (userData) {
      const user = JSON.parse(userData);
      this.userId = user.id;
    }
  }

  getCommentById(commentId: number): void {
    this.commentService.getCommentById(commentId).subscribe(comment => {
      this.comments = comment;
      this.updateCommentForm.patchValue({
        content: comment.content
      });
    });
  }

  onSubmit(): void {
    if (this.updateCommentForm.valid) {
      const updatedComment: CommentRequest = {
        content: this.updateCommentForm.value.content,
        userId: this.userId,
        productId: this.comment ? this.comment.productId : 0
      };

      this.commentService.updateComment(this.commentId, updatedComment)
        .subscribe(
          response => {
            this.toastr.success("Cập nhật đánh giá thành công", "Thành công", {
              timeOut: 2000
            });
            this.router.navigate(['/admin/comments']);
          },
          error => {
            this.toastr.error("Cập nhật đánh giá thất bại", "Thất bại", {
              timeOut: 2000
            });
          }
        );
    }
  }
}
