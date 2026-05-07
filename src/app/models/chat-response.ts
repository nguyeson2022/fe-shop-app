import { Product } from './product';

export interface ChatResponse {
  response: string;
  responseTime: Date;
  products?: Product[];
}
