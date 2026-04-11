

export class InsertProductImageDTO {

  images: File[] = [];

  product_id: number;

  constructor(data: any) {
    this.images = data.images;
    this.product_id = data.product_id;
  }
}
