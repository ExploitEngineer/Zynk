"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Check } from "lucide-react";
import { checkoutPlan } from "@/lib/auth-client";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function PricingSection() {
  const router = useRouter();

  const handleCheckout = async (slug: "pro" | "startup") => {
    const result = await checkoutPlan(slug);

    if (result.status === "unauthenticated") {
      toast.success("Please login first");
      return router.push("/signup");
    }

    if (result.status === "already-on-plan") {
      toast.success("You are already on this plan");
      return;
    }

    if (result.status === "error") {
      toast.error(`${result.message || "Something went wrong"}`);
      return;
    }

    if (result.status === "success") {
      toast.success("Redirecting to checkout...");
    }
  };

  return (
    <section
      id="pricing"
      className="dark:bg-muted/30 bg-gray-50 py-16 md:py-32"
    >
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-2xl space-y-6 text-center">
          <h1 className="text-center text-4xl font-semibold lg:text-5xl">
            Pricing that Scales with You
          </h1>
          <p>
            Zynk AI helps you build smarter chat experiences without limits.
            Whether you're just starting or scaling to millions of users, our
            flexible pricing grows with you.
          </p>
        </div>

        <div className="mt-8 grid gap-6 md:mt-20 md:grid-cols-3">
          <Card className="flex flex-col">
            <CardHeader>
              <CardTitle className="font-medium">Free</CardTitle>
              <span className="my-3 block text-2xl font-semibold">$0 / mo</span>
              <CardDescription className="text-sm">
                Perfect for getting started
              </CardDescription>
            </CardHeader>

            <CardContent className="mb-8 space-y-4">
              <hr className="border-dashed" />

              <ul className="list-outside space-y-3 text-sm">
                {[
                  "Access to Zynk AI Chat API",
                  "10K AI-generated tokens per month",
                  "Community support",
                  "Basic analytics",
                ].map((item: string, index: number) => (
                  <li key={index} className="flex items-center gap-2">
                    <Check className="size-3" />
                    {item}
                  </li>
                ))}
              </ul>
            </CardContent>

            <CardFooter className="mt-auto">
              <Button
                onClick={() => router.push("/chat")}
                variant="outline"
                className="w-full cursor-pointer"
              >
                Get Started
              </Button>
            </CardFooter>
          </Card>

          <Card className="relative">
            <span className="absolute inset-x-0 -top-3 mx-auto flex h-6 w-fit items-center rounded-full bg-linear-to-br/increasing from-purple-400 to-amber-300 px-3 py-1 text-xs font-medium text-amber-950 ring-1 ring-white/20 ring-offset-1 ring-offset-gray-950/5 ring-inset">
              Popular
            </span>

            <div className="flex flex-col">
              <CardHeader>
                <CardTitle className="font-medium">Pro</CardTitle>
                <span className="my-3 block text-2xl font-semibold">
                  $19 / mo
                </span>
                <CardDescription className="text-sm">
                  Best for professionals & startups.
                </CardDescription>
              </CardHeader>

              <CardContent className="mb-8 space-y-4">
                <hr className="border-dashed" />
                <ul className="list-outside space-y-3 text-sm">
                  {[
                    "Everything in Free Plan",
                    "200K AI-generated tokens per month",
                    "Priority email & chat support",
                    "Conversation history & management",
                    "Customizable AI prompts",
                    "Access to premium AI models",
                    "Advanced analytics dashboard",
                    "Early access to new features",
                  ].map((item: string, index: number) => (
                    <li key={index} className="flex items-center gap-2">
                      <Check className="size-3" />
                      {item}
                    </li>
                  ))}
                </ul>
              </CardContent>

              <CardFooter>
                <Button
                  onClick={() => handleCheckout("pro")}
                  className="w-full cursor-pointer"
                >
                  Get Started
                </Button>
              </CardFooter>
            </div>
          </Card>

          <Card className="flex flex-col">
            <CardHeader>
              <CardTitle className="font-medium">Startup</CardTitle>
              <span className="my-3 block text-2xl font-semibold">
                $29 / mo
              </span>
              <CardDescription className="text-sm">
                For teams building production-ready AI apps.
              </CardDescription>
            </CardHeader>

            <CardContent className="mb-8 space-y-4">
              <hr className="border-dashed" />

              <ul className="list-outside space-y-3 text-sm">
                {[
                  "Everything in Pro Plan",
                  "500K AI-generated tokens per month",
                  "Fine-tuning & model customization",
                  "Dedicated Slack & Discord support",
                  "API rate-limit priority",
                ].map((item: string, index: number) => (
                  <li key={index} className="flex items-center gap-2">
                    <Check className="size-3" />
                    {item}
                  </li>
                ))}
              </ul>
            </CardContent>

            <CardFooter className="mt-auto">
              <Button
                onClick={() => handleCheckout("startup")}
                variant="outline"
                className="w-full cursor-pointer"
              >
                Get Started
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </section>
  );
}
