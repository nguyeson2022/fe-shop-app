import {Injectable} from "@angular/core";
import {environment} from "../environments/environment";
import {HttpClient, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs";
import {Category} from "../models/category";
import {UpdateCategoryDTO} from "../dtos/category/update.category.dto";
import {InsertCategoryDTO} from "../dtos/category/insert.category.dto";

@Injectable({
  providedIn: 'root'
})
export class CategoryService{
  private apiGetCategories = `${environment.apiBaseUrl}/categories`;
  private apiBaseUrl = environment.apiBaseUrl;
  constructor(private http: HttpClient) {}

  getCategories(page: number, limit: number):Observable<Category[]>{
    const params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());
    return this.http.get<Category[]>(this.apiGetCategories, {params});
  }

  getDetailCategory(categoryId: number): Observable<Category> {
    return this.http.get<Category>(`${this.apiBaseUrl}/categories/${categoryId}`);
  }
  getTotalCategories(): Observable<number> {
    return this.http.get<number>(`${this.apiBaseUrl}/categories/total`);
  }
  deleteCategory(id: number): Observable<string> {
    
    return this.http.delete<string>(`${this.apiBaseUrl}/categories/${id}`);
  }
  updateCategory(id: number, updatedCategory: UpdateCategoryDTO): Observable<UpdateCategoryDTO> {
    return this.http.put<Category>(`${this.apiBaseUrl}/categories/${id}`, updatedCategory);
  }
  insertCategory(insertCategoryDTO: InsertCategoryDTO): Observable<any> {
    // Add a new category
    return this.http.post(`${this.apiBaseUrl}/categories`, insertCategoryDTO);
  }

  uploadThumbnail(categoryId: number, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('files', file);
    return this.http.post(`${this.apiBaseUrl}/categories/uploads/${categoryId}`, formData, { responseType: 'text' });
  }

}
