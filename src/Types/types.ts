export type UserLogin = {
  username: string;
  password: string;
};

export type UserType = {
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
  photo: string | null | FileList;
  isVisible?: boolean;
};

export type Item = {
  _id?: string;
  cod_item: string;
  name: string;
  type: string;
  description: string;
  value: number;
  quantity: number;
  photo?: string | File;
  isVisible: boolean;
  additionals?: { additionalItem: string }[];
  additionals_sauces?: { additionalItem: string }[];
  additionals_drinks?: { additionalItem: string }[];
  additionals_sweets?: { additionalItem: string }[];
};

export type Order = {
  _id?: string;
  username: string;
  order_number: number;
  phone: string;
  spot: number;
  status: "active" | "finished" | "canceled";
  money_payment: number;
  credit_payment: number;
  debit_payment: number;
  service_fee: number;
  service_fee_paid?: boolean;
  total_value: number;
  items: ItemInOrder[];
  createdAt?: string;
};

export type ItemInOrder = {
  item: Item;
  observation?: string;
  additional?: string;
  additional_sauce?: string;
  additional_drink?: string;
  additional_sweet?: string;
};

export type Statistics = {
  _id?: string;
  canceledOrders: number;
  finishedOrders: number;
  invoicing: number;
  items?: {
    itemName: string;
    quantity: number;
  }[];
  createdAt?: string;
};
