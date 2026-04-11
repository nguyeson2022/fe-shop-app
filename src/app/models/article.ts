export interface Article {
  id: number;
  author: string;
  title: string;
  description: string;
  thumbnail: string;
  created_at: Date;
  content: string;
  url: string;
}

export interface UpdateArticle {
  author: string;
  title: string;
  description: string;
  thumbnail: string;
  created_at: Date;
}

export interface InsertArticle {
  author: string;
  title: string;
  description: string;
  thumbnail: string;
}


