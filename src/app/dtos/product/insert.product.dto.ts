import {
  IsString,
  IsNotEmpty,
  IsPhoneNumber,
} from 'class-validator';

export class InsertProductDTO {
  @IsPhoneNumber()
  name: string;

  price: number;

  stock: number;

  @IsString()
  @IsNotEmpty()
  description: string;

  thumbnail: string;

  category_id: number | string;

  importPrice: number;

  images: File[] = [];

  constructor(data: any) {
    this.name = data.name;
    this.price = data.price;
    this.description = data.description;
    this.thumbnail = data.thumbnail;
    this.category_id = data.category_id;
    this.images = data.images;
    this.stock = data.stock;
    this.importPrice = data.importPrice;
  }
}
