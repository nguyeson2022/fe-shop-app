export class UpdateUserDTO {
  fullname: string;
  address: string;
  password: string;
  retype_password: string;
  date_of_birth: Date;
  email: string;
  phone_number: string;

  constructor(data: any) {
    this.fullname = data.fullname;
    this.address = data.address;
    this.password = data.password;
    this.retype_password = data.retype_password;
    this.date_of_birth = data.date_of_birth;
    this.email = data.email;
    this.phone_number = data.phone_number;
  }
}
