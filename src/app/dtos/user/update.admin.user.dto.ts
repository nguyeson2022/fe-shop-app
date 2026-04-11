export class UpdateUser{

  fullname: string;
  address: string;
  date_of_birth: Date;
  email: string;
  phone_number: string;

  constructor(data: any) {
    this.fullname = data.fullname;
    this.address = data.address;
    this.date_of_birth = data.date_of_birth;
    this.email = data.email;
    this.phone_number = data.phone_number;
  }
}
