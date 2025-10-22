"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import { Navbar, NavbarLeft, NavbarRight } from "@/components/ui/navbar";
import Navigation from "@/components/ui/navigation";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";

export function PageHeader() {
  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <Navbar>
          <NavbarLeft>
            <Link href="/" className="flex items-center gap-1.5 md:gap-2 text-base md:text-xl font-bold">
              <Image
                src="/logo.png"
                alt="ChainPilot"
                width={24}
                height={24}
                className="object-contain md:w-8 md:h-8"
              />
              <span className="text-sm md:text-xl">ChainPilot</span>
            </Link>
            <Navigation />
          </NavbarLeft>
          <NavbarRight>
            <Link
              href="/docs"
              className="hidden text-sm md:block hover:text-primary transition-colors"
            >
              Documentation
            </Link>
            <Button asChild variant="outline" size="sm" className="hidden md:flex text-xs md:text-sm px-2 md:px-4">
              <Link href="/chat">
                <span className="hidden lg:inline">Launch Terminal</span>
                <span className="lg:hidden">Launch</span>
                <ArrowLeft className="ml-1 md:ml-2 h-3 w-3 md:h-4 md:w-4 rotate-180" />
              </Link>
            </Button>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="shrink-0 md:hidden">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle navigation menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <nav className="grid gap-6 text-lg font-medium">
                  <Link href="/" className="flex items-center gap-2 text-xl font-bold">
                    <span>ChainPilot</span>
                  </Link>
                  <Link href="/about" className="text-muted-foreground hover:text-foreground">
                    About
                  </Link>
                  <Link href="/docs" className="text-muted-foreground hover:text-foreground">
                    Documentation
                  </Link>
                  <Link href="/roadmap" className="text-muted-foreground hover:text-foreground">
                    Roadmap
                  </Link>
                  <Link href="/chat" className="text-primary font-semibold hover:text-primary/80">
                    Launch Terminal →
                  </Link>
                </nav>
              </SheetContent>
            </Sheet>
          </NavbarRight>
        </Navbar>
      </div>
    </header>
  );
}