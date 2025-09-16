"use server";

import { auth } from "@/lib/auth";

interface UserSignUp {
  name: string;
  email: string;
  password: string;
}

export const signUp = async ({ name, email, password }: UserSignUp) => {
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
