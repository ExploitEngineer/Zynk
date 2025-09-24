import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "@/lib/prisma";
import { nextCookies } from "better-auth/next-js";
import { sendResetPasswordEmail } from "./email";
import { getPlanByName, PLANS } from "./plans";
import { stripe } from "@better-auth/stripe";
import Stripe from "stripe";

const stripeClient = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-02-24.acacia" as any,
});

export const auth = betterAuth({
  socialProviders: {
    google: {
      prompt: "select_account",
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
    github: {
      prompt: "select_account",
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
        plans: PLANS,
        onSubscriptionComplete: async ({ subscription, plan }) => {
          const oldSub = await prisma.subscription.findFirst({
            where: { referenceId: subscription.referenceId, status: "active" },
          });

          let tokens = plan.limits?.tokens ?? 0;

          if (oldSub) {
            if (oldSub.plan === "free") {
              tokens += oldSub.tokenBalance ?? 0;
            } else {
              const oldPlanTokens =
                getPlanByName(oldSub.plan)?.limits?.tokens ?? 0;
              const usedTokens = oldPlanTokens - (oldSub.tokenBalance ?? 0);
              tokens = Math.max(tokens - usedTokens, 0);
            }
          }

          await prisma.subscription.update({
            where: { id: subscription.id },
            data: { tokenBalance: tokens, lastReset: new Date() },
          });
        },
        onSubscriptionUpdate: async ({ subscription, plan }: any) => {
          const now = new Date();
          const lastReset = subscription.lastReset ?? subscription.createdAt;
          const oneMonthLater = new Date(lastReset);
          oneMonthLater.setMonth(oneMonthLater.getMonth() + 1);

          if (now >= oneMonthLater) {
            await prisma.subscription.update({
              where: { id: subscription.id },
              data: { tokenBalance: plan.limits.tokens, lastReset: now },
            });
          }
        },
      },
    }),
    nextCookies(),
  ],
});
