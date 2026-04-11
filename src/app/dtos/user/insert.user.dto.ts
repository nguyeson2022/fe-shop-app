export class InsertUserDto{
  fullname: string;
  address: string;
  password: string;
  phone_number: string;
  retype_password: string;
  date_of_birth: Date;
  is_Active= 1;
  facebook_account_id: number = 0;
  role_id: number = 1;
  constructor(data: any) {
    this.fullname = data.fullname;
    this.address = data.address;
    this.password = data.password;
    this.phone_number = data.phone_number;
    this.retype_password = data.retype_password;
    this.date_of_birth = data.date_of_birth;
    this.is_Active = data.is_Active;
    this.facebook_account_id = data.facebook_account_id;
    this.role_id = data.role_id;
  }
}
