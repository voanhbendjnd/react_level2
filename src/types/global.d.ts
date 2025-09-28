import type { UploadFile } from "antd";

export {};
declare global {
  interface IBackendRes<T> {
    error?: string | string[];
    message: string;
    statusCode: number | string;
    data?: T;
  }
  interface IModelPaginate<T> {
    meta: {
      page: number;
      pageSize: number;
      pages: number;
      total: number;
    };
    result: T[];
  }
  interface ILogin {
    access_token: string;
    user: {
      id: string;
      name: string;
      email: string;
      name: string;
      role: string;
      avatar: string;
    };
  }
  interface IRegister {
    name: string;
    email: string;
    phone: string;
    address: string;
    role: string;
    createdAt: string;
    createdBy: string;
  }
  interface IUser {
    id: string;
    name: string;
    email: string;
    name: string;
    role: string;
    avatar: String;
    gender: string;
    phone: string;
    address: string;
  }
  interface IFetchAccount {
    user: IUser;
  }

  interface IUsersTable {
    id: string;
    name: string;
    email: string;
    address: string;
    phone: string;
    gender: string;
    avatar: string;
    createdAt: string;
    createdBy: string;
    updatedAt: string;
    updatedBy: string;
    role: string;
  }
  interface IBooksTable {
    id: number;
    title: string;
    author: string;
    price: number;
    updatedAt: string;
    createdAt: string;
    coverImage: string;
    imgs: string[];
    categories: string[];
    publisher: string;
    isbn: string;
    description: string;
    language: string;
    stockQuantity: number;
    numberOfPages: number;
    publicationDate: string;
    sold: number;
    totalPreview: number;
  }
  interface ICart {
    id: number | undefined;
    quantity: number;
    detail: IBooksTable | null;
  }

  // Payload gửi API khi đặt hàng
  interface ICheckoutItemPayload {
    productId: number;
    quantity: number;
    price: number; // unit price at checkout time
  }

  interface ICheckoutPayload {
    addressMode: "manual" | "account";
    receiverName?: string;
    receiverPhone?: string;
    receiverAddress?: string;
    paymentMethod: "vnpay" | "napas" | "gpay" | "cod";
    items: ICheckoutItemPayload[];
    subtotal: number;
    shippingFee: number;
    total: number;
  }

  // Payload khớp với backend Java RequestOrder
  interface IRequestOrderDetail {
    bookId: number;
    quantity: number;
    bookName: string;
  }

  interface IRequestOrder {
    name: string;
    address: string;
    phone: string;
    totalAmount: number;
    type: string; // PaymentMethodEnum on backend
    details: IRequestOrderDetail[];
  }

  // Order History types matching backend Java OrderHistory
  interface IOrderHistoryDetail {
    bookName: string;
    quantity: number;
    id: number;
  }

  interface IOrderHistory {
    id: number;
    name: string;
    type: string; // PaymentMethodEnum
    email: string;
    phone: string;
    userId: number;
    totalAmount: number;
    createdAt: string;
    updatedAt: string;
    details: IOrderHistoryDetail[];
  }
}
