import type { StripePlan } from "@better-auth/stripe";

export const PLANS: StripePlan[] = [
  {
    name: "free",
    priceId: process.env.STRIPE_FREE_PRICE_ID!,
    limits: { tokens: 10_000 },
  },
  {
    name: "pro",
    priceId: process.env.STRIPE_PRO_PRICE_ID!,
    limits: { tokens: 200_000 },
  },
  {
    name: "startup",
    priceId: process.env.STRIPE_STARTUP_PRICE_ID!,
    limits: { tokens: 500_000 },
  },
];

export function getPlanByName(name: string) {
  return PLANS.find((p) => p.name === name);
}
