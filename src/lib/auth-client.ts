import { createAuthClient } from "better-auth/react";
import { stripeClient } from "@better-auth/stripe/client";

export const authClient = createAuthClient({
  plugins: [stripeClient({ subscription: true })],
  baseURL: process.env.BETTER_AUTH_URL,
});

export const signInWithGoogle = async () => {
  try {
    await authClient.signIn.social({
      provider: "google",
      callbackURL: "/chat",
    });
  } catch (err) {
    console.error("Google sign-in failed:", err);
    return { status: "error", message: (err as Error).message };
  }
};

export const signInWithGithub = async () => {
  try {
    await authClient.signIn.social({
      provider: "github",
      callbackURL: "/chat",
    });
  } catch (err) {
    console.error("GitHub sign-in failed:", err);
    return { status: "error", message: (err as Error).message };
  }
};

export const logout = async () => {
  try {
    await authClient.signOut();
    return { status: "success" };
  } catch (err) {
    console.error("Logout failed:", err);
    return { status: "error", message: (err as Error).message };
  }
};

export const checkoutPlan = async (slug: "pro" | "startup") => {
  try {
    const session = await authClient.getSession();
    if (!session.data) {
      return { status: "unauthenticated" };
    }

    const { data: subs, error: subsError } =
      await authClient.subscription.list();
    if (subsError) {
      throw new Error(subsError.message);
    }

    const activeSub = subs?.find((s) => s.status === "active");

    if (activeSub?.plan === slug) {
      return { status: "already-on-plan" };
    }

    const upgradeResult = await authClient.subscription.upgrade({
      plan: slug,
      subscriptionId: activeSub?.id,
      successUrl: "/chat",
      cancelUrl: "/#pricing",
      disableRedirect: false,
    });

    if (upgradeResult.error) {
      return { status: "error", message: upgradeResult.error.message };
    }
    const { data: updatedSubs } = await authClient.subscription.list();
    const newActive = updatedSubs?.find((s) => s.status === "active");

    return { status: "success", activePlan: newActive?.plan };
  } catch (err) {
    console.error(`Checkout failed for ${slug}:`, err);
    return { status: "error", message: (err as Error).message };
  }
};
