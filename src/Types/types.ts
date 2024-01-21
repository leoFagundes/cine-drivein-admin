export type UserLogin = {
  username: string;
  password: string;
};

export type User = {
  _id?: string;
  username: string;
  password: string;
  email: string;
  isAdmin: boolean;
  profileImage?: string;
};

export type Schedule = {
  _id?: string;
  isOpen: boolean;
  closingTime: string;
  openingTime: string;
};

export type AdditionalItem = {
  _id?: string;
  name: string;
  description: string;
  photo: string;
};

export type Item = {
  _id?: string;
  cod_item: string;
  name: string;
  type: string;
  description: string;
  value: number;
  quantity: number;
  photo: string;
  isVisible: boolean;
  additionals?: { additionalItem: string }[];
  additionals_sauces?: { additionalItem: string }[];
  additionals_drinks?: { additionalItem: string }[];
  additionals_sweets?: { additionalItem: string }[];
};

export type Order = {
  _id?: string;
  username: string;
  phone: string;
  spot: number;
  credit_payment: number;
  debit_payment: number;
  service_fee: number;
  total_value: number;
  items: Item[];
};
