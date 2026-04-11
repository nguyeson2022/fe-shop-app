import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { Product } from "../models/product";
import {UpdateProductDTO} from "../dtos/product/update.product.dto";
import {InsertProductDTO} from "../dtos/product/insert.product.dto";
import { ApiResponse } from '../responses/api.response';
import {ProductImage} from "../models/product.image";
@Injectable({
  providedIn: 'root'
})
export class ProductImageService {
  private apiBaseUrl = environment.apiBaseUrl;
  private apiGetProductImages  = `${environment.apiBaseUrl}/product_images`;

  constructor(private http: HttpClient) { }


  getProductImages( productId:number,
              page: number, limit: number
  ): Observable<ProductImage[]> {
    const params = new HttpParams()
      .set('productId', productId)
      .set('page', page.toString())
      .set('limit', limit.toString());
    return this.http.get<ProductImage[]>(`${this.apiBaseUrl}/product_images`, { params });
  }

  uploadImages(productId: number, files: File[]): Observable<any> {
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append('files', files[i]);
    }
    // Upload images for the specified product id
    return this.http.post(`${this.apiBaseUrl}/products/uploads/${productId}`, formData);
  }
  deleteProductImage(id: number): Observable<any> {
    
    return this.http.delete<string>(`${this.apiBaseUrl}/product_images/${id}`);
  }


}
