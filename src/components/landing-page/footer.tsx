import Link from "next/link";
import Image from "next/image";

interface LINKS {
  title: string;
  href: string;
}

const links: LINKS[] = [
  {
    title: "Features",
    href: "#",
  },
  {
    title: "Solution",
    href: "#",
  },
  {
    title: "Customers",
    href: "#",
  },
  {
    title: "Pricing",
    href: "#",
  },
  {
    title: "Help",
    href: "#",
  },
  {
    title: "About",
    href: "#",
  },
];

export default function FooterSection() {
  return (
    <footer className="bg-gray-50 py-16 md:py-32 dark:bg-transparent">
      {" "}
      <div className="mx-auto max-w-5xl px-6">
        <div className="my-8 flex flex-wrap justify-center gap-6 text-sm">
          {links.map((link: LINKS, index: number) => (
            <Link
              key={index}
              href={link.href}
              className="text-muted-foreground hover:text-primary block duration-150"
            >
              <span>{link.title}</span>
            </Link>
          ))}
        </div>
        <div className="my-8 flex flex-wrap justify-center gap-6 text-sm">
          <Link
            href="#"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="X/Twitter"
            className="text-muted-foreground hover:text-primary block"
          >
            <Image src="/assets/images/x.svg" width={18} height={18} alt="x" />
          </Link>
          <Link
            href="#"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            className="text-muted-foreground hover:text-primary block"
          >
            <Image
              src="/assets/images/linkedin.svg"
              width={18}
              height={18}
              alt="linkedin"
            />
          </Link>
          <Link
            href="#"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Facebook"
            className="text-muted-foreground hover:text-primary block"
          >
            <Image
              src="/assets/images/facebook.svg"
              width={18}
              height={18}
              alt="linkedin"
            />
          </Link>
          <Link
            href="#"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            className="text-muted-foreground hover:text-primary block"
          >
            <Image
              src="/assets/images/instagram.svg"
              width={18}
              height={18}
              alt="linkedin"
            />
          </Link>
          <Link
            href="#"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="TikTok"
            className="text-muted-foreground hover:text-primary block"
          >
            <Image
              src="/assets/images/tiktok.svg"
              width={18}
              height={18}
              alt="linkedin"
            />
          </Link>
        </div>
        <span className="text-muted-foreground block text-center text-sm">
          {" "}
          © {new Date().getFullYear()} Zynk, All rights reserved
        </span>
      </div>
    </footer>
  );
}
