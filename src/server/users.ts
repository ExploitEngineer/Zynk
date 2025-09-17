"use server";

import { auth } from "@/lib/auth";

interface UserCredentials {
  name: string;
  email: string;
  password: string;
}

export const signUp = async ({ name, email, password }: UserCredentials) => {
  try {
    await auth.api.signUpEmail({
      body: {
        name,
        email,
        password,
      },
    });

    return {
      status: "succes",
    };
  } catch (err) {
    return {
      status: "error",
      message: (err as Error)?.message || "Unknown error",
    };
  }
};

export const login = async ({
  email,
  password,
}: Omit<UserCredentials, "name">) => {
  try {
    await auth.api.signInEmail({
      body: { email, password },
    });

    return { status: "success" };
  } catch (err) {
    return { status: "error", message: "Invalid email or password" };
  }
};

export async function resetPassword(values: {
  password: string;
  token: string;
}) {
  try {
    await auth.api.resetPassword({
      body: {
        newPassword: values.password,
        token: values.token,
      },
    });

    return { status: "success" };
  } catch (error: any) {
    return { status: "error", message: error.message };
  }
}
