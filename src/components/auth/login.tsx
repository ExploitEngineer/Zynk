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
import { loginSchema, LoginForm } from "@/schemas/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { login } from "@/server/users";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { signInWithGoogle, signInWithGithub } from "@/lib/auth-client";

export default function LoginComponent() {
  const router = useRouter();

  const form = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (values: LoginForm) => {
    try {
      const result = await login(values);
      if (result.status === "error") {
        toast.error(result.message!);
      } else {
        toast.success("Logged in successfully!");
        router.push("/chat");
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
            <div>
              <h1 className="mt-4 mb-1 text-xl font-semibold">
                Login In to Zynk
              </h1>
              <p className="text-sm">Welcome back! Login in to continue</p>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <Button
                type="button"
                onClick={signInWithGoogle}
                variant="outline"
                className="cursor-pointer"
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
                type="button"
                onClick={signInWithGithub}
                variant="outline"
                className="cursor-pointer"
              >
                <Image
                  src="/assets/images/github-white.svg"
                  width={18}
                  height={17.5}
                  alt="github image"
                />
                <span>Github</span>
              </Button>
            </div>

            <hr className="my-4 border-dashed" />

            <div className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="you@example.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center justify-between">
                      <FormLabel>Password</FormLabel>
                      <Button asChild variant="link" size="sm">
                        <Link
                          href="/forgot-password"
                          className="link intent-info variant-ghost text-sm"
                        >
                          Forgot your Password ?
                        </Link>
                      </Button>
                    </div>
                    <FormControl>
                      <Input type="password" {...field} />
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
                  "Login"
                )}
              </Button>
            </div>
          </div>

          <div className="bg-muted rounded-(--radius) border p-3">
            <p className="text-accent-foreground text-center text-sm">
              Don&apos;t have an account ?
              <Button asChild variant="link" className="px-2">
                <Link href="/signup">Create account</Link>
              </Button>
            </p>
          </div>
        </form>
      </Form>
    </section>
  );
}
