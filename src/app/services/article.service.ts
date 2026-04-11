import { Injectable } from "@angular/core";
import { environment } from "../environments/environment";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { UpdateCategoryDTO } from "../dtos/category/update.category.dto";
import { InsertCategoryDTO } from "../dtos/category/insert.category.dto";
import { Article, InsertArticle, UpdateArticle } from "../models/article";

@Injectable({
  providedIn: 'root'
})
export class ArticleService {
  private apiGetArticles = `${environment.apiBaseUrl}/articles`;
  private apiBaseUrl = environment.apiBaseUrl;
  uploadImages: any;
  constructor(private http: HttpClient) { }

  getArticles(page: number, limit: number): Observable<Article[]> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());
    return this.http.get<Article[]>(this.apiGetArticles, { params });
  }

  getDetailArticle(articleId: number): Observable<Article> {
    return this.http.get<Article>(`${this.apiBaseUrl}/articles/${articleId}`);
  }
  deleteArticle(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiBaseUrl}/articles/${id}`);
  }
  updateArticle(id: number, updateArticle: UpdateArticle): Observable<UpdateArticle> {
    return this.http.put<UpdateArticle>(`${this.apiBaseUrl}/articles/${id}`, updateArticle);
  }
  insertArticle(insertArticle: InsertArticle): Observable<any> {
    return this.http.post(`${this.apiBaseUrl}/articles`, insertArticle);
  }

  uploadThumbnail(articleId: number, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('files', file);
    return this.http.post(`${this.apiBaseUrl}/articles/uploads/${articleId}`, formData, { responseType: 'text' });
  }

}
