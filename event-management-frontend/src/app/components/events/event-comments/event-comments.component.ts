// src/app/components/events/event-comments/event-comments.component.ts

import { Component, Input, OnInit } from '@angular/core';
import { CommentService, Comment } from '../../../services/comment.service';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-event-comments',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, FormsModule, RouterModule],
  templateUrl: './event-comments.component.html',
  styleUrls: ['./event-comments.component.css'],
})
export class EventCommentsComponent implements OnInit {
  @Input() eventId!: number;
  comments: Comment[] = [];
  commentForm!: FormGroup;
  isLoading: boolean = false;
  successMessage: string = '';
  errorMessage: string = '';

  constructor(
    private commentService: CommentService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.loadComments();
  }

  private initializeForm(): void {
    this.commentForm = this.fb.group({
      content: ['', Validators.required],
    });
  }

  loadComments(): void {
    this.isLoading = true;
    this.commentService.getComments(this.eventId).subscribe({
      next: (data) => {
        this.comments = data;
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = 'Failed to load comments.';
        this.isLoading = false;
      },
    });
  }

  onSubmit(): void {
    if (this.commentForm.invalid) {
      this.errorMessage = 'Please enter a comment.';
      return;
    }

    this.isLoading = true;
    const content = this.commentForm.value.content;

    this.commentService.postComment(this.eventId, content).subscribe({
      next: (comment) => {
        this.comments.unshift(comment); // Add new comment to the top
        this.successMessage = 'Comment posted successfully.';
        this.errorMessage = '';
        this.commentForm.reset();
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = 'Failed to post comment.';
        this.successMessage = '';
        this.isLoading = false;
      },
    });
  }
}
