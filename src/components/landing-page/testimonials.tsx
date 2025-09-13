import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image from "next/image";

export default function TestimonialsSection() {
  return (
    <section id="testimonials" className="py-16 md:py-32">
      <div className="mx-auto max-w-6xl space-y-8 px-6 md:space-y-16">
        <div className="relative z-10 mx-auto max-w-xl space-y-6 text-center md:space-y-12">
          <h2 className="text-4xl font-medium lg:text-5xl">
            Trusted by Developers & Teams Worldwide
          </h2>
          <p>
            Zynk AI empowers thousands of developers and businesses to build
            smarter applications, deliver faster results, and scale AI-driven
            conversations seamlessly.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-rows-2">
          {/* Testimonial 1 */}
          <Card className="grid grid-rows-[auto_1fr] gap-8 sm:col-span-2 sm:p-6 lg:row-span-2">
            <CardHeader>
              <Image
                className="h-6 w-fit dark:invert"
                src="/assets/images/microsoft.svg"
                width={24}
                height={24}
                alt="Microsoft Logo"
              />
            </CardHeader>
            <CardContent>
              <blockquote className="grid h-full grid-rows-[1fr_auto] gap-6">
                <p className="text-xl font-medium">
                  "Zynk AI has transformed the way we build intelligent chat
                  experiences. Integration was seamless, and within hours we had
                  a fully functional, scalable solution powering real-time
                  conversations. Its performance, flexibility, and
                  developer-friendly tools make it an absolute game-changer for
                  modern AI-driven applications."
                </p>

                <div className="grid grid-cols-[auto_1fr] items-center gap-3">
                  <Avatar className="size-12">
                    <AvatarImage
                      src="https://tailus.io/images/reviews/shekinah.webp"
                      alt="Shekinah Tshiokufila"
                      height="400"
                      width="400"
                      loading="lazy"
                    />
                    <AvatarFallback>SJ</AvatarFallback>
                  </Avatar>

                  <div>
                    <cite className="text-sm font-medium">Sarah Johnson</cite>
                    <span className="text-muted-foreground block text-sm">
                      Senior Engineer @ Microsoft
                    </span>
                  </div>
                </div>
              </blockquote>
            </CardContent>
          </Card>

          {/* Testimonial 2 */}
          <Card className="md:col-span-2">
            <CardContent className="h-full pt-6">
              <blockquote className="grid h-full grid-rows-[1fr_auto] gap-6">
                <p className="text-xl font-medium">
                  "Integrating Zynk was seamless. Our response times improved
                  instantly, and the developer experience is outstanding."
                </p>

                <div className="grid grid-cols-[auto_1fr] items-center gap-3">
                  <Avatar className="size-12">
                    <AvatarImage
                      src="https://tailus.io/images/reviews/jonathan.webp"
                      alt="Jonathan Yombo"
                      height="400"
                      width="400"
                      loading="lazy"
                    />
                    <AvatarFallback>DK</AvatarFallback>
                  </Avatar>
                  <div>
                    <cite className="text-sm font-medium">David Kim</cite>
                    <span className="text-muted-foreground block text-sm">
                      CTO @ CloudForge
                    </span>
                  </div>
                </div>
              </blockquote>
            </CardContent>
          </Card>

          {/* Testimonial 3 */}
          <Card className="md:col-span-2 lg:col-span-1">
            <CardContent className="h-full pt-6">
              <blockquote className="grid h-full grid-rows-[1fr_auto] gap-6">
                <p>
                  "From setup to scaling, Zynk delivers. Our team relies on it
                  for powering next-gen AI applications."
                </p>

                <div className="grid [grid-template-columns:auto_1fr] items-center gap-3">
                  <Avatar className="size-12">
                    <AvatarImage
                      src="https://tailus.io/images/reviews/yucel.webp"
                      alt="Yucel Faruksahan"
                      height="400"
                      width="400"
                      loading="lazy"
                    />
                    <AvatarFallback>AM</AvatarFallback>
                  </Avatar>
                  <div>
                    <cite className="text-sm font-medium">Ava Martinez</cite>
                    <span className="text-muted-foreground block text-sm">
                      Product Manager @ Driftly
                    </span>
                  </div>
                </div>
              </blockquote>
            </CardContent>
          </Card>

          {/* Testimonial 4 */}
          <Card className="card variant-mixed md:col-span-2 lg:col-span-1">
            <CardContent className="h-full pt-6">
              <blockquote className="grid h-full grid-rows-[1fr_auto] gap-6">
                <p>
                  "Zynk made it effortless to launch our AI-powered assistant.
                  Simple, fast, and incredibly effective."
                </p>

                <div className="grid grid-cols-[auto_1fr] gap-3">
                  <Avatar className="size-12">
                    <AvatarImage
                      src="https://tailus.io/images/reviews/rodrigo.webp"
                      alt="Rodrigo Aguilar"
                      height="400"
                      width="400"
                      loading="lazy"
                    />
                    <AvatarFallback>LP</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">Lucas Pereira</p>
                    <span className="text-muted-foreground block text-sm">
                      AI Lead @ InnovateX
                    </span>
                  </div>
                </div>
              </blockquote>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
