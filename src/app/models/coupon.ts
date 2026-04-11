
export interface CouponList{
  id: number;
  code: string;
  active: boolean;
}

export interface InsertCoupon{
  code: string;
  active: boolean;
}

export interface Coupon {
  id: number;
  attribute: string;
  operator: string;
  value: string;
  discountAmount: number;
  couponCode: string;
  couponActive: boolean;
  code: string;
}

export interface CouponCondition {
  id: number;
  attribute: string;
  operator: string;
  value: string;
  discountAmount: number;
}

export interface UpdateCouponCondition {
  attribute: string;
  operator: string;
  value: string;
  discountAmount: number;
}

export interface InsertCouponCondition {
  coupon: Coupon;
  attribute: string;
  operator: string;
  value: string;
  discountAmount: number;
}