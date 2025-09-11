"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Shield, Users } from "lucide-react";
import Image from "next/image";
import { useTheme } from "next-themes";

export default function FeaturesSection() {
  const { theme } = useTheme();

  return (
    <section
      id="features"
      className="bg-gray-50 py-16 md:py-32 dark:bg-muted/30"
    >
      <div className="mx-auto max-w-5xl px-6">
        <div className="relative">
          <div className="relative z-10 grid grid-cols-6 gap-3">
            <Card className="relative col-span-full flex overflow-hidden lg:col-span-2">
              <CardContent className="relative m-auto size-fit pt-6">
                <div className="relative flex h-24 w-56 items-center">
                  <Image
                    src={`/assets/images/${theme === "dark" ? "100-white.svg" : "100.svg"}`}
                    className="text-muted absolute inset-0 size-full"
                    width={50}
                    height={50}
                    alt="100% Customizable"
                  />
                  <span className="mx-auto block w-fit text-5xl font-semibold">
                    100%
                  </span>
                </div>
                <h2 className="mt-6 text-center text-3xl font-semibold">
                  Fully Customizable
                </h2>
              </CardContent>
            </Card>
            <Card className="relative col-span-full overflow-hidden sm:col-span-3 lg:col-span-2">
              <CardContent className="pt-6">
                <div className="relative mx-auto flex aspect-square size-32 rounded-full border before:absolute before:-inset-2 before:rounded-full before:border dark:border-white/10 dark:before:border-white/5">
                  <Image
                    src={`/assets/images/${theme === "dark" ? "finger-white.svg" : "finger.svg"}`}
                    className="m-auto h-fit w-24"
                    width={50}
                    height={50}
                    alt="scanning finger"
                  />
                </div>
                <div className="relative z-10 mt-6 space-y-2 text-center">
                  <h2 className="group-hover:text-secondary-950 text-lg font-medium transition dark:text-white">
                    Enterprise-Grade Security
                  </h2>
                  <p className="text-foreground">
                    End-to-end encryption and secure authentication keep your
                    chats and data protected by default.
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card className="relative col-span-full overflow-hidden sm:col-span-3 lg:col-span-2">
              <CardContent className="pt-6">
                <div className="pt-6 lg:px-6">
                  <Image
                    src={`/assets/images/${theme === "dark" ? "light-white.svg" : "light.svg"}`}
                    className="dark:text-muted-foreground w-full"
                    width={50}
                    height={50}
                    alt="lightning speed"
                  />
                </div>
                <div className="relative z-10 mt-14 space-y-2 text-center">
                  <h2 className="text-lg font-medium transition">
                    Blazing Fast Responses
                  </h2>
                  <p className="text-foreground">
                    Zynk delivers AI-powered answers in milliseconds with
                    optimized request handling and caching.
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card className="card variant-outlined relative col-span-full overflow-hidden lg:col-span-3">
              <CardContent className="grid pt-6 sm:grid-cols-2">
                <div className="relative z-10 flex flex-col justify-between space-y-12 lg:space-y-6">
                  <div className="relative flex aspect-square size-12 rounded-full border before:absolute before:-inset-2 before:rounded-full before:border dark:border-white/10 dark:before:border-white/5">
                    <Shield className="m-auto size-5" strokeWidth={1} />
                  </div>
                  <div className="space-y-2">
                    <h2 className="group-hover:text-secondary-950 text-lg font-medium text-zinc-800 transition dark:text-white">
                      AI-Powered Insights
                    </h2>
                    <p className="text-foreground">
                      Get detailed analytics and chat summaries powered by
                      Zynk’s advanced AI models.
                    </p>
                  </div>
                </div>
                <div className="rounded-tl-(--radius) relative -mb-6 -mr-6 mt-6 h-fit border-l border-t p-6 py-6 sm:ml-6">
                  <div className="absolute left-3 top-2 flex gap-1">
                    <span className="block size-2 rounded-full border dark:border-white/10 dark:bg-white/10"></span>
                    <span className="block size-2 rounded-full border dark:border-white/10 dark:bg-white/10"></span>
                    <span className="block size-2 rounded-full border dark:border-white/10 dark:bg-white/10"></span>
                  </div>
                  <Image
                    src={`/assets/images/${theme === "dark" ? "graph-white.svg" : "graph.svg"}`}
                    className="w-full sm:w-[150%]"
                    width={50}
                    height={50}
                    alt="graph view"
                  />
                </div>
              </CardContent>
            </Card>
            <Card className="card variant-outlined relative col-span-full overflow-hidden lg:col-span-3">
              <CardContent className="grid h-full pt-6 sm:grid-cols-2">
                <div className="relative z-10 flex flex-col justify-between space-y-12 lg:space-y-6">
                  <div className="relative flex aspect-square size-12 rounded-full border before:absolute before:-inset-2 before:rounded-full before:border dark:border-white/10 dark:before:border-white/5">
                    <Users className="m-auto size-6" strokeWidth={1} />
                  </div>
                  <div className="space-y-2">
                    <h2 className="text-lg font-medium transition">
                      Real-Time Collaboration
                    </h2>
                    <p className="text-foreground">
                      Work together with teammates, share chats, and collaborate
                      with AI in real time.
                    </p>
                  </div>
                </div>
                <div className="before:bg-(--color-border) relative mt-6 before:absolute before:inset-0 before:mx-auto before:w-px sm:-my-6 sm:-mr-6">
                  <div className="relative flex h-full flex-col justify-center space-y-6 py-6">
                    <div className="relative flex w-[calc(50%+0.875rem)] items-center justify-end gap-2">
                      <span className="block h-fit rounded border px-2 py-1 text-xs shadow-sm">
                        Likeur
                      </span>
                      <div className="relative ring-background size-7 ring-4">
                        <Image
                          className="size-full rounded-full"
                          fill
                          src="/assets/images/person3.jpeg"
                          alt="person image"
                        />
                      </div>
                    </div>
                    <div className="relative ml-[calc(50%-1rem)] flex items-center gap-2">
                      <div className="relative ring-background size-8 ring-4">
                        <Image
                          className="size-full rounded-full"
                          fill
                          src="/assets/images/person2.jpeg"
                          alt="person image"
                        />
                      </div>
                      <span className="block h-fit rounded border px-2 py-1 text-xs shadow-sm">
                        M. Irung
                      </span>
                    </div>
                    <div className="relative flex w-[calc(50%+0.875rem)] items-center justify-end gap-2">
                      <span className="block h-fit rounded border px-2 py-1 text-xs shadow-sm">
                        B. Ng
                      </span>
                      <div className="relative ring-background size-7 ring-4">
                        <Image
                          className="size-full rounded-full"
                          fill
                          src="/assets/images/person1.jpeg"
                          alt="person image"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
