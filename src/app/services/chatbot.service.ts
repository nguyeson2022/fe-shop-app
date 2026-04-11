import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../environments/environment';
import { ChatRequest } from '../models/chat-request';
import { ChatResponse } from '../models/chat-response';
import { ApiResponse } from '../responses/api.response';

@Injectable({
  providedIn: 'root'
})
export class ChatBotService {
  private apiUrl = `${environment.apiBaseUrl}/chatbot`;

  constructor(private http: HttpClient) { }

  /**
   * Gửi tin nhắn đến chatbot và nhận phản hồi
   * @param message Tin nhắn từ user
   * @returns Observable<ChatResponse>
   */
  sendMessage(message: string): Observable<ChatResponse> {
    const chatRequest: ChatRequest = {
      request: message,
      requestTime: new Date()
    };

    return this.http.post<ApiResponse>(`${this.apiUrl}/analyze`, chatRequest)
      .pipe(
        map(response => response.data as ChatResponse)
      );
  }
}