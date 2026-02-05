export type Order = {
  id: string;
  orderNumber: string;
  items: OrderItem[];
  totalAmount: string;
  status: "pending" | "processing" | "completed" | "cancelled";
  createdAt: string;
  completedAt?: string;
  paymentMethod: "card" | "cash" | "bank_transfer" | "online";
  paymentStatus: "paid" | "pending" | "failed";
  paymentDate?: string;
};

export type OrderItem = {
  id: string;
  productName: string;
  quantity: number;
  price: string;
  image?: string;
};

export const mockOrders: Order[] = [
  {
    id: "1",
    orderNumber: "ORD-2024-001",
    items: [
      {
        id: "1",
        productName: "Премиум пакет услуг",
        quantity: 1,
        price: "1,500,000 сум",
      },
      {
        id: "2",
        productName: "Консультация специалиста",
        quantity: 2,
        price: "500,000 сум",
      },
    ],
    totalAmount: "2,500,000 сум",
    status: "completed",
    createdAt: "2024-10-15T10:30:00",
    completedAt: "2024-10-15T14:20:00",
    paymentMethod: "card",
    paymentStatus: "paid",
    paymentDate: "2024-10-15T10:35:00",
  },
  {
    id: "2",
    orderNumber: "ORD-2024-002",
    items: [
      {
        id: "3",
        productName: "Базовый пакет",
        quantity: 1,
        price: "800,000 сум",
      },
    ],
    totalAmount: "800,000 сум",
    status: "completed",
    createdAt: "2024-09-28T09:15:00",
    completedAt: "2024-09-28T11:45:00",
    paymentMethod: "online",
    paymentStatus: "paid",
    paymentDate: "2024-09-28T09:20:00",
  },
  {
    id: "3",
    orderNumber: "ORD-2024-003",
    items: [
      {
        id: "4",
        productName: "Расширенный пакет",
        quantity: 1,
        price: "1,200,000 сум",
      },
      {
        id: "5",
        productName: "Дополнительная услуга",
        quantity: 1,
        price: "300,000 сум",
      },
    ],
    totalAmount: "1,500,000 сум",
    status: "processing",
    createdAt: "2024-11-20T16:00:00",
    paymentMethod: "bank_transfer",
    paymentStatus: "pending",
  },
  {
    id: "4",
    orderNumber: "ORD-2024-004",
    items: [
      {
        id: "6",
        productName: "VIP пакет",
        quantity: 1,
        price: "2,000,000 сум",
      },
    ],
    totalAmount: "2,000,000 сум",
    status: "completed",
    createdAt: "2024-08-10T12:00:00",
    completedAt: "2024-08-10T15:30:00",
    paymentMethod: "cash",
    paymentStatus: "paid",
    paymentDate: "2024-08-10T12:05:00",
  },
];
