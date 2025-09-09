"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Link from "next/link";

interface FAQItems {
  id: string;
  question: string;
  answer: string;
}

export default function FAQsSection() {
  const faqItems: FAQItems[] = [
    {
      id: "item-1",
      question: "What is Zynk AI?",
      answer:
        "Zynk AI is a powerful platform that helps you build intelligent chat applications powered by advanced AI models. It provides APIs, tools, and integrations to enhance user experiences.",
    },
    {
      id: "item-2",
      question: "Is there a free plan available?",
      answer:
        "Yes! Zynk AI offers a free plan with limited monthly tokens, perfect for trying out the platform and testing integrations before upgrading to a paid plan.",
    },
    {
      id: "item-3",
      question: "How do I integrate Zynk AI with my app?",
      answer:
        "Zynk AI provides easy-to-use APIs and SDKs for seamless integration. You can connect it with your Next.js, Node.js, or Express applications in just a few steps.",
    },
    {
      id: "item-4",
      question: "Which AI models does Zynk support?",
      answer:
        "Zynk AI supports multiple models, including GPT-based conversational models and custom fine-tuned ones. You can choose the best model based on your application's needs.",
    },
    {
      id: "item-5",
      question: "Can I upgrade or downgrade my plan anytime?",
      answer:
        "Absolutely! You can switch between plans at any time directly from your dashboard. Your usage, tokens, and data remain intact when upgrading or downgrading.",
    },
  ];

  return (
    <section id="faqs" className="py-16 md:py-24">
      <div className="mx-auto max-w-5xl px-4 md:px-6">
        <div className="mx-auto max-w-xl text-center">
          <h2 className="text-balance text-3xl font-bold md:text-4xl lg:text-5xl">
            Frequently Asked Questions
          </h2>
          <p className="text-muted-foreground mt-4 text-balance">
            Discover quick and comprehensive answers to common questions about
            our platform, services, and features.
          </p>
        </div>

        <div className="mx-auto mt-12 max-w-xl">
          <Accordion
            type="single"
            collapsible
            className="bg-card ring-muted w-full rounded-2xl border px-8 py-3 shadow-sm ring-4 dark:ring-0"
          >
            {faqItems.map((item: FAQItems) => (
              <AccordionItem
                key={item.id}
                value={item.id}
                className="border-dashed"
              >
                <AccordionTrigger className="cursor-pointer text-base hover:no-underline">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent>
                  <p className="text-base">{item.answer}</p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <p className="text-muted-foreground mt-6 px-8">
            Can't find what you're looking for? Contact our{" "}
            <Link href="#" className="text-primary font-medium hover:underline">
              customer support team
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
