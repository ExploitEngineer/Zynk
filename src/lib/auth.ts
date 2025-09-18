import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "@/lib/prisma";
import { nextCookies } from "better-auth/next-js";
import { sendResetPasswordEmail } from "./email";
import { stripe } from "@better-auth/stripe";
import Stripe from "stripe";

const stripeClient = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-08-27.basil",
});

export const auth = betterAuth({
  socialProviders: {
    google: {
      prompt: "select_account",
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
    github: {
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    },
  },
  emailAndPassword: {
    enabled: true,
    sendResetPassword: async ({ user, url }) => {
      await sendResetPasswordEmail({
        username: user.name ?? "User",
        userEmail: user.email,
        resetUrl: url,
      });
    },
    onPasswordReset: async ({ user }) => {
      console.log(`Password for ${user.email} has been reset`);
    },
  },
  database: prismaAdapter(prisma, {
    provider: "mongodb",
  }),
  plugins: [
    stripe({
      stripeClient,
      stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET!,
      createCustomerOnSignUp: false,
      subscription: {
        enabled: true,
        plans: [
          {
            name: "pro",
            priceId: "price_1S8Vdp398xbKDWRhJqjp2h4y",
            limits: { tokens: 200000 },
          },
          {
            name: "startup",
            priceId: "price_1S8VbJ398xbKDWRhFP0odpsw",
            limits: { tokens: 500000 },
          },
        ],
      },
    }),
    nextCookies(),
  ],
});
