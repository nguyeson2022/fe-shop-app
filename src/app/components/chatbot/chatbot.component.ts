import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { Router } from '@angular/router';
import { ChatBotService } from '../../services/chatbot.service';
import { ChatResponse } from '../../models/chat-response';
import { Product } from '../../models/product';
import { environment } from '../../environments/environment';
import { ToastrService } from 'ngx-toastr';

interface ChatMessage {
  content: string;
  isUser: boolean;
  timestamp: Date;
  isLoading?: boolean;
  products?: Product[];
}

@Component({
  selector: 'app-chatbot',
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.css']
})
export class ChatBotComponent implements OnInit, OnDestroy, AfterViewChecked {
  @ViewChild('messagesContainer') private messagesContainer!: ElementRef;
  @ViewChild('messageInput') private messageInput!: ElementRef;

  // UI State
  isOpen = false;
  isMinimized = false;
  currentMessage = '';
  isLoading = false;

  // Chat data
  messages: ChatMessage[] = [];
  
  // Welcome messages
  welcomeMessages = [
    'Xin chào! Tôi là trợ lý AI của cửa hàng gia dụng Sonnguyen. Tôi có thể giúp bạn',
    '🔍 Tìm kiếm sản phẩm phù hợp',
    '💡 Tư vấn lựa chọn sản phẩm',
    '❓ Trả lời câu hỏi về sản phẩm',
    '',
    'Hãy cho tôi biết bạn đang tìm kiếm gì nhé!'
  ];

  constructor(
    private chatBotService: ChatBotService,
    private toastr: ToastrService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.initWelcomeMessage();
  }

  ngOnDestroy(): void {
    // Clean up any subscriptions if needed (currently none)
  }

  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }

  private initWelcomeMessage(): void {
    this.welcomeMessages.forEach((msg, index) => {
      setTimeout(() => {
        this.messages.push({
          content: msg,
          isUser: false,
          timestamp: new Date()
        });
      }, index * 300);
    });
  }

  toggleChat(): void {
    this.isOpen = !this.isOpen;
    if (this.isOpen && this.isMinimized) {
      this.isMinimized = false;
    }
    
    // Focus input when opening
    if (this.isOpen) {
      setTimeout(() => {
        this.messageInput?.nativeElement?.focus();
      }, 100);
    }
  }

  minimizeChat(): void {
    this.isMinimized = !this.isMinimized;
  }

  closeChat(): void {
    this.isOpen = false;
    this.isMinimized = false;
  }

  sendMessage(): void {
    if (!this.currentMessage.trim() || this.isLoading) return;

    const userMessage = this.currentMessage.trim();
    
    // Add user message
    this.messages.push({
      content: userMessage,
      isUser: true,
      timestamp: new Date()
    });

    // Add loading message
    const loadingMessage: ChatMessage = {
      content: 'Đang suy nghĩ...',
      isUser: false,
      timestamp: new Date(),
      isLoading: true
    };
    this.messages.push(loadingMessage);

    // Clear input
    this.currentMessage = '';
    this.isLoading = true;

    // Send to API
    this.chatBotService.sendMessage(userMessage).subscribe({
      next: (response: ChatResponse) => {
        // Remove loading message
        this.messages = this.messages.filter(msg => !msg.isLoading);

        // Add bot response
        this.messages.push({
          content: response.response,
          isUser: false,
          timestamp: new Date(response.responseTime),
          products: this.normalizeProducts(response.products)
        });

        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error sending message:', error);
        
        // Remove loading message
        this.messages = this.messages.filter(msg => !msg.isLoading);
        
        // Add error message
        this.messages.push({
          content: 'Xin lỗi, tôi không thể trả lời câu hỏi này. Vui lòng thử lại sau.',
          isUser: false,
          timestamp: new Date()
        });
        
        this.isLoading = false;
        this.toastr.error('Không thể kết nối với trợ lý AI', 'Lỗi');
      }
    });
  }

  onKeyPress(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }

  clearChat(): void {
    this.messages = [];
    this.initWelcomeMessage();
    this.toastr.success('Đã làm mới cuộc trò chuyện', 'Thành công');
  }

  private scrollToBottom(): void {
    try {
      if (this.messagesContainer) {
        this.messagesContainer.nativeElement.scrollTop = 
          this.messagesContainer.nativeElement.scrollHeight;
      }
    } catch(err) {
      console.log('Error scrolling to bottom:', err);
    }
  }

  formatTime(timestamp: Date): string {
    return new Date(timestamp).toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  // Quick suggestion buttons
  sendQuickMessage(message: string): void {
    this.currentMessage = message;
    this.sendMessage();
  }

  getQuickSuggestions(): string[] {
    return [
      'Dụng cụ nhà bếp tốt nhất',
      'Tư vấn các sản phẩm cho gia đình',
      'Tư vấn dụng cụ dọn dẹp nhà cửa',
      'Các sản phẩm có giá dưới 500k',
    ];
  }

  private normalizeProducts(products?: Product[]): Product[] {
    if (!products || products.length === 0) return [];
    return products.map(p => ({
      ...p,
      displayImageUrl: this.resolveImageUrl(p)
    }));
  }

  private resolveImageUrl(product: Product): string {
    const base = `${environment.apiBaseUrl}/products/images`;
    if (product.product_images && product.product_images.length > 0 && product.product_images[0].image_url) {
      return `${base}/${product.product_images[0].image_url}`;
    }
    if (product.thumbnail) {
      return `${base}/${product.thumbnail}`;
    }
    return `${base}/default-product-image.png`;
  }

  goToProduct(product: Product): void {
    if (!product?.id) return;
    this.router.navigate(['/products', product.id]);
    this.closeChat();
  }

  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.src = `${environment.apiBaseUrl}/products/images/default-product-image.png`;
  }
}