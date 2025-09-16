"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import toast from "react-hot-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { signUp } from "@/server/users";
import { signUpSchema, SignUpForm } from "@/schemas/auth";
import { useRouter } from "next/router";

export default function SignUpComponent() {
  const router = useRouter();

  const form = useForm<SignUpForm>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: SignUpForm) => {
    try {
      const result = await signUp(values);
      if (result.status === "error") {
        toast.error(result.message ?? "Sign up failed");
      } else {
        toast.success("Account created successfully!");
        router.push("/chat");
      }
    } catch {
      toast.error("Something went wrong");
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
            <div>
              <h1 className="mt-4 mb-1 text-xl font-semibold">
                Create a Zynk Account
              </h1>
              <p className="text-sm">
                Welcome! Create an account to get started
              </p>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <Button
                className="cursor-pointer"
                type="button"
                variant="outline"
              >
                <Image
                  src="/assets/images/google.svg"
                  width={15}
                  height={15}
                  alt="google image"
                />
                <span>Google</span>
              </Button>
              <Button
                className="cursor-pointer"
                type="button"
                variant="outline"
              >
                <Image
                  src="/assets/images/microsoft.svg"
                  width={15}
                  height={15}
                  alt="microsoft image"
                />
                <span>Microsoft</span>
              </Button>
            </div>

            <hr className="my-4 border-dashed" />

            <div className="space-y-5">
              {/* Fullname */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="name" className="block text-sm">
                      Fullname
                    </FormLabel>
                    <FormControl>
                      <Input id="name" placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Email */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="email" className="block text-sm">
                      Email
                    </FormLabel>
                    <FormControl>
                      <Input
                        id="email"
                        type="email"
                        placeholder="you@example.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Password */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="password" className="block text-sm">
                      Password
                    </FormLabel>
                    <FormControl>
                      <Input
                        id="password"
                        type="password"
                        placeholder="••••••••"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Submit */}
              <Button
                type="submit"
                className="w-full cursor-pointer"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="size-4 animate-spin" />
                    <span>Loading...</span>
                  </div>
                ) : (
                  "Continue"
                )}
              </Button>
            </div>
          </div>

          <div className="bg-muted rounded-(--radius) border p-3">
            <p className="text-accent-foreground text-center text-sm">
              Have an account ?
              <Button type="button" asChild variant="link" className="px-2">
                <Link href="/login">Login</Link>
              </Button>
            </p>
          </div>
        </form>
      </Form>
    </section>
  );
}
