import { Link, useNavigate } from "@tanstack/react-router";
import { Menu, Search, ShoppingBag, User, X } from "lucide-react";
import { useState } from "react";
import { useCart } from "../../context/CartContext";
import { useInternetIdentity } from "../../hooks/useInternetIdentity";
import { useIsAdmin } from "../../hooks/useQueries";

export default function Header() {
  const { totalItems } = useCart();
  const { data: isAdmin } = useIsAdmin();
  const { login, clear, loginStatus, identity } = useInternetIdentity();
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  const navLinks = [
    { label: "NEW ARRIVALS", href: "/catalog" },
    { label: "WOMEN", href: "/catalog?gender=women" },
    { label: "MEN", href: "/catalog?gender=men" },
    { label: "KIDS", href: "/catalog?gender=kids" },
    { label: "BRANDS", href: "/catalog?view=brands" },
    { label: "SALE", href: "/catalog?sale=true" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-card border-b border-border">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 h-16 flex items-center justify-between">
        {/* Brand */}
        <Link
          to="/"
          className="font-serif text-2xl tracking-[0.18em] font-bold text-foreground"
          data-ocid="nav.link"
        >
          AURA
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-7">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={(e) => {
                e.preventDefault();
                const url = new URL(link.href, window.location.origin);
                const params: Record<string, string> = {};
                url.searchParams.forEach((v, k) => {
                  params[k] = v;
                });
                navigate({
                  to: url.pathname,
                  search: params as Record<string, string>,
                });
              }}
              className="text-[11px] font-medium tracking-widest text-muted-foreground hover:text-foreground transition-colors duration-200"
              data-ocid="nav.link"
            >
              {link.label}
            </a>
          ))}
          {isAdmin && (
            <Link
              to="/admin"
              className="text-[11px] font-medium tracking-widest text-muted-foreground hover:text-foreground transition-colors duration-200"
              data-ocid="nav.link"
            >
              ADMIN
            </Link>
          )}
        </nav>

        {/* Icons */}
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() =>
              navigate({
                to: "/catalog",
                search: {
                  gender: undefined,
                  type: undefined,
                  brand: undefined,
                  sale: undefined,
                  view: undefined,
                },
              })
            }
            className="text-foreground hover:opacity-60 transition-opacity"
            aria-label="Search"
            data-ocid="nav.link"
          >
            <Search size={18} />
          </button>

          <button
            type="button"
            onClick={() => (identity ? clear() : login())}
            className="text-foreground hover:opacity-60 transition-opacity"
            aria-label="Account"
            data-ocid="nav.link"
            title={
              identity
                ? `${identity.getPrincipal().toString().slice(0, 8)}…`
                : "Sign in"
            }
          >
            <User
              size={18}
              className={
                loginStatus === "success" ? "opacity-100" : "opacity-50"
              }
            />
          </button>

          <Link
            to="/cart"
            className="relative text-foreground hover:opacity-60 transition-opacity"
            data-ocid="cart.link"
          >
            <ShoppingBag size={18} />
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-foreground text-primary-foreground text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </Link>

          {/* Mobile menu toggle */}
          <button
            type="button"
            className="md:hidden text-foreground"
            onClick={() => setMobileOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {mobileOpen && (
        <div className="md:hidden bg-card border-t border-border px-6 py-4 flex flex-col gap-4">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={(e) => {
                e.preventDefault();
                setMobileOpen(false);
                const url = new URL(link.href, window.location.origin);
                const params: Record<string, string> = {};
                url.searchParams.forEach((v, k) => {
                  params[k] = v;
                });
                navigate({
                  to: url.pathname,
                  search: params as Record<string, string>,
                });
              }}
              className="text-sm tracking-widest text-muted-foreground"
            >
              {link.label}
            </a>
          ))}
          {isAdmin && (
            <Link
              to="/admin"
              onClick={() => setMobileOpen(false)}
              className="text-sm tracking-widest text-muted-foreground"
            >
              ADMIN
            </Link>
          )}
        </div>
      )}
    </header>
  );
}
