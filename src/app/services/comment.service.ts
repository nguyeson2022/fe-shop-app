import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { CommentDTO, CommentRequest } from '../models/comment';
import { environment } from '../environments/environment';
import { Comment } from '../models/comment';

@Injectable({
  providedIn: 'root'
})
export class CommentService {
    private apiBaseUrl = environment.apiBaseUrl;
  
    constructor(private http: HttpClient) { }
  
    getComments(productId: number, page: number, limit: number): Observable<Comment[]>{
      const params = new HttpParams()
      .set('product_id', productId)
      .set('page', page.toString())
      .set('limit', limit.toString());
    return this.http.get<Comment[]>(`${this.apiBaseUrl}/comments/search`, { params });
    }

    updateComment(id: number, updatedComment: CommentRequest): Observable<CommentRequest> {
      return this.http.put<CommentRequest>(`${this.apiBaseUrl}/comments/${id}`, updatedComment);
    }

    deleteComment(id: number): Observable<void> {
      return this.http.delete<void>(`${this.apiBaseUrl}/comments/${id}`);
    }

    getCommentById(commentId: number): Observable<Comment> {
      const url = `${this.apiBaseUrl}/comments/${commentId}`;
      return this.http.get<Comment>(url);
    }

    insertComment(commentDTO: CommentDTO): Observable<any> {
        return this.http.post<any>(`${this.apiBaseUrl}/comments`, commentDTO)
          .pipe(
            catchError(this.handleError)
          );
      }
    
      private handleError(error: any) {
        console.error('An error occurred', error);
        return throwError(error);
      }
}