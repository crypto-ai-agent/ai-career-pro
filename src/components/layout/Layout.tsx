import React from "react";
import { useState, useEffect, useRef } from "react";
import { Outlet, useLocation } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';

export function Layout() {
  const { pathname } = useLocation();
  const mainRef = useRef<HTMLElement>(null);

  useEffect(() => {
    // Scroll to top on route change
    mainRef.current?.scrollTo(0, 0);
  }, [pathname]);
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main ref={mainRef} className="flex-grow pt-16">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}