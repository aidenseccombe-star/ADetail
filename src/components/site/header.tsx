import Link from "next/link";
import { Menu } from "lucide-react";

import { Logo } from "@/components/site/logo";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { signOut } from "@/lib/actions/auth";
import { isAdmin } from "@/lib/admin";
import { servicesCatalog } from "@/lib/site-config";
import { createClient } from "@/lib/supabase/server";

const navLinks = [
  { href: "/#gallery", label: "Gallery" },
  { href: "/#testimonials", label: "Reviews" },
];

export async function SiteHeader() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const admin = isAdmin(user?.email);

  return (
    <header className="sticky top-0 z-50 border-b border-black/5 bg-white/90 backdrop-blur supports-backdrop-filter:bg-white/70">
      <div className="mx-auto flex h-18 max-w-6xl items-center justify-between px-6 lg:px-8">
        <Link href="/" aria-label="A Detail home">
          <Logo />
        </Link>

        <nav className="hidden items-center gap-6 lg:flex">
          <NavigationMenu className="flex-none">
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger className="h-auto rounded-md bg-transparent p-0 text-sm font-medium text-ink/70 hover:bg-transparent hover:text-ink data-open:bg-transparent data-open:text-ink data-popup-open:bg-transparent data-popup-open:text-ink">
                  Services
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[280px] gap-1 p-2 sm:w-[380px] sm:grid-cols-2">
                    {servicesCatalog.map((service) => (
                      <li key={service.slug}>
                        <NavigationMenuLink
                          render={<Link href={`/services/${service.slug}`} />}
                          className="flex-col items-start gap-0.5"
                        >
                          <p className="text-sm font-medium text-ink">{service.name}</p>
                          <p className="text-xs text-ink/60">{service.shortDescription}</p>
                        </NavigationMenuLink>
                      </li>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-ink/70 transition-colors hover:text-ink"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/fleet"
            className="text-sm font-medium text-ink/70 transition-colors hover:text-ink"
          >
            Commercial & Fleet
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          {user ? (
            <>
              {admin && (
                <Button
                  variant="ghost"
                  size="lg"
                  className="hidden sm:inline-flex"
                  render={<Link href="/admin" />}
                >
                  Admin
                </Button>
              )}
              <Button
                variant="ghost"
                size="lg"
                className="hidden sm:inline-flex"
                render={<Link href="/dashboard" />}
              >
                Dashboard
              </Button>
              <form action={signOut} className="hidden sm:block">
                <Button type="submit" variant="outline" size="lg">
                  Sign out
                </Button>
              </form>
            </>
          ) : (
            <Button
              variant="ghost"
              size="lg"
              className="hidden sm:inline-flex"
              render={<Link href="/sign-in" />}
            >
              Sign in
            </Button>
          )}

          <Button variant="brand" size="lg" render={<Link href="/book" />}>
            Book Now
          </Button>

          <Sheet>
            <SheetTrigger
              render={<Button variant="ghost" size="icon" className="lg:hidden" />}
            >
              <Menu />
              <span className="sr-only">Open menu</span>
            </SheetTrigger>
            <SheetContent side="right" className="w-full sm:max-w-sm">
              <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-1 overflow-y-auto px-4 pb-6">
                <p className="px-2 text-xs font-semibold tracking-wide text-ink/40 uppercase">
                  Services
                </p>
                {servicesCatalog.map((service) => (
                  <SheetClose
                    key={service.slug}
                    render={
                      <Link
                        href={`/services/${service.slug}`}
                        className="rounded-lg px-2 py-2 text-sm font-medium text-ink/80 hover:bg-secondary"
                      />
                    }
                  >
                    {service.name}
                  </SheetClose>
                ))}

                <Separator className="my-3" />

                {navLinks.map((link) => (
                  <SheetClose
                    key={link.href}
                    render={
                      <Link
                        href={link.href}
                        className="rounded-lg px-2 py-2 text-sm font-medium text-ink/80 hover:bg-secondary"
                      />
                    }
                  >
                    {link.label}
                  </SheetClose>
                ))}
                <SheetClose
                  render={
                    <Link
                      href="/fleet"
                      className="rounded-lg px-2 py-2 text-sm font-medium text-ink/80 hover:bg-secondary"
                    />
                  }
                >
                  Commercial & Fleet
                </SheetClose>

                <Separator className="my-3" />

                {user ? (
                  <>
                    {admin && (
                      <SheetClose
                        render={
                          <Link
                            href="/admin"
                            className="rounded-lg px-2 py-2 text-sm font-medium text-ink/80 hover:bg-secondary"
                          />
                        }
                      >
                        Admin
                      </SheetClose>
                    )}
                    <SheetClose
                      render={
                        <Link
                          href="/dashboard"
                          className="rounded-lg px-2 py-2 text-sm font-medium text-ink/80 hover:bg-secondary"
                        />
                      }
                    >
                      Dashboard
                    </SheetClose>
                    <form action={signOut} className="px-2 pt-2">
                      <Button type="submit" variant="outline" size="lg" className="w-full">
                        Sign out
                      </Button>
                    </form>
                  </>
                ) : (
                  <SheetClose
                    render={
                      <Link
                        href="/sign-in"
                        className="rounded-lg px-2 py-2 text-sm font-medium text-ink/80 hover:bg-secondary"
                      />
                    }
                  >
                    Sign in
                  </SheetClose>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
