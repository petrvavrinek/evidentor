import type { InvoiceQueueDataType } from "@evidentor/queues";

export const ExampleInvoice: InvoiceQueueDataType["data"] = {
  currency: "czk",
  id: "INV-2025-0842",
  items: [
    {
      amount: 2,
      name: "Laptop Lenovo ThinkPad X1",
      price: 32500
    },
    {
      amount: 5,
      name: "Wireless Mouse Logitech MX",
      price: 1200
    },
    {
      amount: 1,
      name: "Office Chair Ergonomic Pro",
      price: 7500
    }
  ],
  language: "cs",
  payment: {
    amount: 83900,
    iban: "CZ65 0800 0000 1920 0014 5399",
    swift: "GIBACZPX",
    variableSymbol: 20250819
  },
  subscriber: {
    address: {
      city: "Brno",
      country: "Czech Republic",
      houseNumber: "42",
      street: "Masarykova",
      zip: "60200"
    },
    cin: "12345678",
    name: "ABC Software s.r.o.",
    vatId: "CZ12345678"
  },
  supplier: {
    address: {
      city: "Praha",
      country: "Czech Republic",
      houseNumber: "15",
      street: "Václavské náměstí",
      zip: "11000"
    },
    cin: "87654321",
    name: "Tech Supplies a.s.",
    vatId: "CZ87654321"
  }
};