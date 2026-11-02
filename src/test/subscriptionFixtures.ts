import type { Subscription, SubscriptionItem } from "../api/types";

export const defaultItems: SubscriptionItem[] = [
  {
    sku: "NW-VITD-60",
    name: "Vitamin D, 60 softgels",
    quantity: 1,
    unitPriceCents: 2995,
    imageUrl: "/product.jpg",
  },
  {
    sku: "NW-MULTI-30",
    name: "Multivitamin, 30 tablets",
    quantity: 2,
    unitPriceCents: 4495,
    imageUrl: null,
  },
];

export function createMockSubscription(overrides?: Partial<Subscription>): Subscription {
  return {
    id: "sub_8F2K41",
    status: "active",
    items: defaultItems,
    discountPercent: 15,
    intervalDays: 30,
    nextChargeAt: "2026-11-08T12:00:00.000Z",
    nextChargeTotalCents: 10187,
    pausedUntil: null,
    cancelledAt: null,
    updatedAt: "2026-11-01T12:00:00.000Z",
    ...overrides,
  };
}
