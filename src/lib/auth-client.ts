import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: "http://localhost:3000",
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
