export interface CommentDTO {
  product_id: number;
  user_id: number;
  content: string;
}


export interface Comment {
  id: number;
  user: string;
  updateAt: Date;
  product: string;
  content: string;
}

export interface CommentRequest{
  content: string; 
  userId: number; 
  productId: number;
}