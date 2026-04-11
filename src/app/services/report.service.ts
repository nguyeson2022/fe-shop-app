import { Injectable } from "@angular/core";
import { environment } from "../environments/environment";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { UpdateCategoryDTO } from "../dtos/category/update.category.dto";
import { InsertCategoryDTO } from "../dtos/category/insert.category.dto";
import { Article, InsertArticle, UpdateArticle } from "../models/article";

@Injectable({
  providedIn: 'root'
})
export class ReportService {
    private apiBaseUrl = environment.apiBaseUrl;
    constructor(private http: HttpClient) { }

  generateExcel(): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/octet-stream'
    });
    return this.http.get(`${this.apiBaseUrl}/report/excel`, {
      headers: headers,
      responseType: 'blob' 
    });
  }
}