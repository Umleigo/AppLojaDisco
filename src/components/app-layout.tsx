"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Disc3, Menu } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

export function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const menuItems = [
    { href: '/', label: 'Início' },
    { href: '/genres', label: 'Gêneros' },
    { href: '/records', label: 'Discos' },
    { href: '/authors', label: 'Autores' },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-card border-b sticky top-0 z-10">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2">
              <Disc3 className="w-6 w-6 text-primary" />
              <span className="font-headline text-lg font-semibold">Loja de Disco</span>
            </Link>
            
            <nav className="hidden md:flex items-center space-x-6">
              {menuItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'text-sm font-medium transition-colors hover:text-primary',
                    pathname === item.href ? 'text-primary' : 'text-muted-foreground'
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="md:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Menu className="h-6 w-6" />
                    <span className="sr-only">Abrir menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="p-0">
                  <div className="p-6 border-b">
                    <Link href="/" className="flex items-center gap-2">
                      <Disc3 className="w-6 w-6 text-primary" />
                      <span className="font-headline text-lg font-semibold">Loja de Disco</span>
                    </Link>
                  </div>
                  <nav className="grid gap-4 p-6">
                    {menuItems.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                          'text-lg font-medium text-muted-foreground hover:text-foreground',
                          pathname === item.href && 'text-foreground'
                        )}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </nav>
                </SheetContent>
              </Sheet>
            </div>

          </div>
        </div>
      </header>
      <main className="flex-1 container mx-auto px-4 py-6">
        {children}
      </main>
    </div>
  );
}
