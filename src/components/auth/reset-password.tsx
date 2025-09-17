"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { resetPassword } from "@/server/users"; // create this server function
import { resetPasswordSchema, ResetPasswordForm } from "@/schemas/auth";

export default function ResetPassword() {
  const router = useRouter();

  const form = useForm<ResetPasswordForm>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  const onSubmit = async (values: ResetPasswordForm) => {
    const token = new URLSearchParams(window.location.search).get("token");

    if (!token) {
      toast.error("no token");
      return;
    }

    try {
      const result = await resetPassword({ password: values.password, token });

      if (result.status === "error") {
        toast.error(result.message!);
      } else {
        toast.success("Password reset successfully!");
        router.push("/login");
      }
    } catch {
      toast.error("Something went wrong!");
    }
  };

  return (
    <section className="flex min-h-screen bg-transparent px-4 py-16 md:py-32">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="bg-card m-auto h-fit w-full max-w-sm rounded-[calc(var(--radius)+.125rem)] border p-0.5 shadow-md lg:max-w-md dark:[--color-muted:var(--color-zinc-900)]"
        >
          <div className="p-8 pb-6">
            <h1 className="mt-4 mb-1 text-xl font-semibold">
              Reset Your Password
            </h1>
            <p className="text-sm">Enter a new password to continue</p>

            <div className="mt-6 space-y-6">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="New Password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Confirm Password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full cursor-pointer">
                {form.formState.isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="size-4 animate-spin" />
                    <span>Loading...</span>
                  </div>
                ) : (
                  "Reset Password"
                )}
              </Button>
            </div>
          </div>

          <div className="bg-muted rounded-(--radius) border p-3">
            <p className="text-accent-foreground text-center text-sm">
              Remember your password?
              <Button asChild variant="link" className="px-2">
                <Link href="/login">Login</Link>
              </Button>
            </p>
          </div>
        </form>
      </Form>
    </section>
  );
}
