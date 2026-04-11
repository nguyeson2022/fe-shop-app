import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../environments/environment';
import { Product } from "../models/product";
import { UpdateProductDTO } from "../dtos/product/update.product.dto";
import { InsertProductDTO } from "../dtos/product/insert.product.dto";
import { ApiResponse } from '../responses/api.response';
@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiBaseUrl = environment.apiBaseUrl;
  private apiGetProducts  = `${environment.apiBaseUrl}/products`;

  constructor(private http: HttpClient) { }


  getProducts(keyword: string, categoryId: number | string, page: number, limit: number): Observable<{products: Product[], totalPages: number}> {
    // Ensure categoryId is a number if it's a string that can be converted to a number
    const categoryIdParam = typeof categoryId === 'string' && !isNaN(Number(categoryId)) 
      ? Number(categoryId) 
      : categoryId;

    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());

    // Only add keyword if it's not empty
    if (keyword) {
      params = params.set('keyword', keyword);
    }

    // Only add category_id if it's not 0 (which means 'All Categories')
    if (categoryIdParam !== 0 && categoryIdParam !== '0') {
      params = params.set('category_id', categoryIdParam.toString());
    }
    
    console.log('Fetching products with params:', params.toString());
    
    return this.http.get<any>(`${this.apiBaseUrl}/products`, { params }).pipe(
      map(response => {
        console.log('API Response:', response);
        // Return both products and totalPages
        let products: Product[] = Array.isArray(response) ? response : (response.products || []);
        products = products.map(p => {
          const productFromApi = p as any;
          if (productFromApi.hasOwnProperty('productImages')) {
            productFromApi.product_images = productFromApi.productImages;
            delete productFromApi.productImages; // Optional: clean up
          }
          return productFromApi as Product;
        });
        return {
          products: products,
          totalPages: response.totalPages || 1
        };
      }),
      catchError(error => {
        console.error('Error fetching products:', error);
        return of({ products: [], totalPages: 1 });
      })
    );
  }





  getDetailProduct(productId: number):Observable<Product>{
    return this.http.get<Product>(`${environment.apiBaseUrl}/products/${productId}`).pipe(
      map(p => {
        const productFromApi = p as any;
        if (productFromApi.hasOwnProperty('productImages')) {
          productFromApi.product_images = productFromApi.productImages;
          delete productFromApi.productImages; // Optional: clean up
        }
        return productFromApi as Product;
      })
    );
  }
  getProductsByIds(productIds: number[]): Observable<Product[]> {
    const params = new HttpParams().set('ids', productIds.join(','));
    return this.http.get<Product[]>(`${this.apiBaseUrl}/products/by-ids`, { params }).pipe(
      map(productsArray => productsArray.map(p => {
        const productFromApi = p as any;
        if (productFromApi.hasOwnProperty('productImages')) {
          productFromApi.product_images = productFromApi.productImages;
          delete productFromApi.productImages; // Optional: clean up
        }
        return productFromApi as Product;
      }))
    );
  }
  deleteProduct(productId: number): Observable<string> {
    return this.http.delete<string>(`${this.apiBaseUrl}/products/${productId}`);
  }
  updateProduct(productId: number, updatedProduct: UpdateProductDTO): Observable<UpdateProductDTO> {
    return this.http.put<Product>(`${this.apiBaseUrl}/products/${productId}`, updatedProduct);
  }
  insertProduct(insertProductDTO: InsertProductDTO): Observable<any> {
    // Add a new product
    return this.http.post(`${this.apiBaseUrl}/products`, insertProductDTO);
  }
  uploadImages(productId: number, files: File[]): Observable<any> {
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append('files', files[i]);
    }
    return this.http.post(`${this.apiBaseUrl}/products/uploads/${productId}`, formData);
  }
  deleteProductImage(id: number): Observable<any> {
    return this.http.delete<string>(`${this.apiBaseUrl}/product_images/${id}`);
  }

  getNewestProducts(limit: number = 5): Observable<{products: Product[], totalPages: number}> {
    return this.http.get<{products: Product[], totalPages: number}>(`${this.apiBaseUrl}/products/newest?limit=${limit}`).pipe(
      map(response => {
        let products: Product[] = response.products || [];
        products = products.map(p => {
          const productFromApi = p as any;
          if (productFromApi.hasOwnProperty('productImages')) {
            productFromApi.product_images = productFromApi.productImages;
            delete productFromApi.productImages; // Optional: clean up
          }
          return productFromApi as Product;
        });
        return {
          products: products,
          totalPages: response.totalPages || 1
        };
      }),
      catchError(error => {
        console.error('Error fetching newest products:', error);
        return of({ products: [], totalPages: 1 });
      })
    );
  }

}
