"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const navigation = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about-us" },
  { label: "Collections", href: "/collections" },
  { label: "Products", href: "/products" },
  { label: "Contact Us", href: "/contact-us" },
];

type SearchProduct = {
  title: string;
  slug: string;
  image?: string;
};

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();

  const [menuOpen, setMenuOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [suggestions, setSuggestions] = useState<SearchProduct[]>([]);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);

  const searchWrapperRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const query = searchValue.trim();

    if (query.length < 2) {
      setSuggestions([]);
      setSearchOpen(false);
      return;
    }

    const timeout = window.setTimeout(async () => {
      try {
        setSearchLoading(true);

        const response = await fetch(
          `/api/products/product-search?q=${encodeURIComponent(query)}`
        );

        const data = await response.json();

        setSuggestions(Array.isArray(data.products) ? data.products : []);
        setSearchOpen(true);
      } catch {
        setSuggestions([]);
        setSearchOpen(false);
      } finally {
        setSearchLoading(false);
      }
    }, 250);

    return () => window.clearTimeout(timeout);
  }, [searchValue]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        searchWrapperRef.current &&
        !searchWrapperRef.current.contains(event.target as Node)
      ) {
        setSearchOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleSearchSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const query = searchValue.trim();

    if (!query) {
      return;
    }

    setMenuOpen(false);
    setSearchOpen(false);
    router.push(`/products?search=${encodeURIComponent(query)}`);
  }

  function handleSuggestionClick(product: SearchProduct) {
    setMenuOpen(false);
    setSearchOpen(false);
    setSearchValue("");
    router.push(`/products/${product.slug}`);
  }

  function renderSearchBox(isMobile = false) {
    return (
      <div
        ref={isMobile ? null : searchWrapperRef}
        className={isMobile ? "header-mobile-search-wrap" : "header-search-wrap"}
        style={{
          position: "relative",
          width: "100%",
        }}
      >
        <form
          onSubmit={handleSearchSubmit}
          className={isMobile ? "header-mobile-search" : "header-desktop-search"}
          style={{
            width: isMobile ? "100%" : 230,
            minHeight: 46,
            borderRadius: 14,
            border: "1px solid #ebe2d5",
            background: "#f8f5ef",
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "0 12px",
            flexShrink: 0,
          }}
        >
          <span
            style={{
              color: "#2f7d62",
              fontSize: 15,
              fontWeight: 900,
              lineHeight: 1,
            }}
          >
            ⌕
          </span>

          <input
            type="search"
            placeholder={isMobile ? "Search products..." : "Search..."}
            value={searchValue}
            onFocus={() => {
              if (suggestions.length > 0 || searchValue.trim().length >= 2) {
                setSearchOpen(true);
              }
            }}
            onChange={(e) => setSearchValue(e.target.value)}
            style={{
              width: "100%",
              minWidth: 0,
              border: 0,
              outline: "none",
              background: "transparent",
              color: "#171717",
              fontSize: 14,
              fontWeight: 700,
            }}
          />
        </form>

        {searchOpen && searchValue.trim().length >= 2 ? (
          <div
            className="header-search-dropdown"
            style={{
              position: isMobile ? "relative" : "absolute",
              top: isMobile ? "auto" : "calc(100% + 10px)",
              right: isMobile ? "auto" : 0,
              left: isMobile ? 0 : "auto",
              width: isMobile ? "100%" : 320,
              maxWidth: "100%",
              background: "#ffffff",
              border: "1px solid #ebe2d5",
              borderRadius: 18,
              boxShadow: "0 18px 44px rgba(17,17,17,0.12)",
              padding: 8,
              zIndex: 200,
              marginTop: isMobile ? 10 : 0,
            }}
          >
            {searchLoading ? (
              <div
                style={{
                  padding: "12px 14px",
                  color: "#6f6559",
                  fontSize: 13,
                  fontWeight: 700,
                }}
              >
                Searching...
              </div>
            ) : suggestions.length > 0 ? (
              <>
                {suggestions.map((product) => (
                  <button
                    key={`${product.slug}-${product.title}`}
                    type="button"
                    onClick={() => handleSuggestionClick(product)}
                    style={{
                      width: "100%",
                      border: 0,
                      background: "transparent",
                      padding: 8,
                      display: "grid",
                      gridTemplateColumns: "46px 1fr",
                      alignItems: "center",
                      gap: 10,
                      borderRadius: 12,
                      cursor: "pointer",
                      textAlign: "left",
                    }}
                  >
                    <div
                      style={{
                        width: 46,
                        height: 46,
                        borderRadius: 10,
                        overflow: "hidden",
                        background: "#f3eee6",
                        border: "1px solid #eee3d5",
                      }}
                    >
                      {product.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={product.image}
                          alt={product.title}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                      ) : null}
                    </div>

                    <div
                      style={{
                        minWidth: 0,
                      }}
                    >
                      <div
                        style={{
                          color: "#171717",
                          fontSize: 14,
                          fontWeight: 800,
                          lineHeight: 1.3,
                        }}
                      >
                        {product.title}
                      </div>
                      <div
                        style={{
                          marginTop: 3,
                          color: "#7a7064",
                          fontSize: 12,
                          fontWeight: 700,
                        }}
                      >
                        View product
                      </div>
                    </div>
                  </button>
                ))}

                <button
                  type="button"
                  onClick={() => {
                    const query = searchValue.trim();
                    setMenuOpen(false);
                    setSearchOpen(false);
                    router.push(`/products?search=${encodeURIComponent(query)}`);
                  }}
                  style={{
                    width: "100%",
                    minHeight: 42,
                    marginTop: 6,
                    border: 0,
                    borderRadius: 12,
                    background: "#2f7d62",
                    color: "#ffffff",
                    fontSize: 13,
                    fontWeight: 900,
                    cursor: "pointer",
                  }}
                >
                  View all results
                </button>
              </>
            ) : (
              <div
                style={{
                  padding: "12px 14px",
                  color: "#6f6559",
                  fontSize: 13,
                  fontWeight: 700,
                }}
              >
                No products found.
              </div>
            )}
          </div>
        ) : null}
      </div>
    );
  }

  return (
    <header
      className="header-root"
      style={{
        position: "sticky",
        top: 0,
        zIndex: 100,
        width: "100%",
        background: "rgba(255,255,255,0.92)",
        backdropFilter: "blur(14px)",
        boxShadow: "0 8px 24px rgba(0,0,0,0.04)",
      }}
    >
      <div
        className="header-container"
        style={{
          width: "100%",
          maxWidth: 1320,
          margin: "0 auto",
          padding: "0 20px",
        }}
      >
        <div
          className="header-inner"
          style={{
            minHeight: 82,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 20,
            position: "relative",
          }}
        >
          <Link
            href="/"
            onClick={() => setMenuOpen(false)}
            className="header-logo-link"
            style={{
              textDecoration: "none",
              color: "#171717",
              display: "inline-flex",
              alignItems: "center",
              gap: 12,
              flexShrink: 0,
              minWidth: 0,
            }}
          >
            <div
              className="header-logo-mark"
              style={{
                width: 42,
                height: 42,
                borderRadius: 12,
                background:
                  "linear-gradient(135deg, #17352d 0%, #2f7d62 75%, #49a487 100%)",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                fontWeight: 900,
                fontSize: 16,
                letterSpacing: "0.04em",
                flexShrink: 0,
              }}
            >
              PT
            </div>

            <div
              className="header-logo-text"
              style={{
                display: "grid",
                gap: 2,
                minWidth: 0,
              }}
            >
              <span
                className="header-logo-title"
                style={{
                  fontSize: 18,
                  fontWeight: 800,
                  letterSpacing: "-0.02em",
                  lineHeight: 1.1,
                  whiteSpace: "nowrap",
                }}
              >
                Patak Textile
              </span>

              <span
                className="header-logo-subtitle"
                style={{
                  fontSize: 11,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  color: "#7a7064",
                  fontWeight: 800,
                  whiteSpace: "nowrap",
                }}
              >
                Corporate Textile Catalog
              </span>
            </div>
          </Link>

          <button
            type="button"
            className="header-mobile-menu-button"
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((current) => !current)}
            style={{
              display: "none",
              width: 44,
              height: 44,
              borderRadius: 999,
              border: "1px solid #ebe2d5",
              background: "#ffffff",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
              gap: 5,
              cursor: "pointer",
              flexShrink: 0,
            }}
          >
            <span
              style={{
                width: 18,
                height: 2,
                borderRadius: 99,
                background: "#171717",
                display: "block",
              }}
            />
            <span
              style={{
                width: 18,
                height: 2,
                borderRadius: 99,
                background: "#171717",
                display: "block",
              }}
            />
            <span
              style={{
                width: 18,
                height: 2,
                borderRadius: 99,
                background: "#171717",
                display: "block",
              }}
            />
          </button>

          <nav
            className={menuOpen ? "header-nav header-nav-open" : "header-nav"}
            aria-label="Main navigation"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              flexWrap: "wrap",
              minWidth: 0,
            }}
          >
            {navigation.map((item) => {
              const active = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  style={{
                    textDecoration: "none",
                    minHeight: 42,
                    padding: "0 16px",
                    borderRadius: 999,
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 14,
                    fontWeight: 800,
                    letterSpacing: "0.01em",
                    color: active ? "#fff" : "#2f2a24",
                    background: active ? "#2f7d62" : "transparent",
                    border: active
                      ? "1px solid #2f7d62"
                      : "1px solid transparent",
                    transition: "all 0.2s ease",
                    whiteSpace: "nowrap",
                  }}
                >
                  {item.label}
                </Link>
              );
            })}

            <div
              className="header-mobile-search-holder"
              style={{
                display: "none",
                width: "100%",
                marginTop: 8,
              }}
            >
              {renderSearchBox(true)}
            </div>
          </nav>

          <div
            className="header-desktop-search-holder"
            style={{
              width: 230,
              flexShrink: 0,
            }}
          >
            {renderSearchBox(false)}
          </div>
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 1180px) {
          .header-desktop-search-holder {
            width: 190px !important;
          }
        }

        @media (max-width: 1024px) {
          .header-inner {
            min-height: 76px !important;
          }

          .header-mobile-menu-button {
            display: inline-flex !important;
          }

          .header-desktop-search-holder {
            display: none !important;
          }

          .header-nav {
            display: none !important;
            position: absolute !important;
            top: 100% !important;
            left: 0 !important;
            right: 0 !important;
            width: 100% !important;
            max-width: 100% !important;
            background: #ffffff !important;
            border: 1px solid #ebe2d5 !important;
            border-top: 0 !important;
            padding: 14px !important;
            box-shadow: 0 18px 38px rgba(17, 17, 17, 0.08) !important;
            z-index: 120 !important;
            overflow: hidden !important;
          }

          .header-nav-open {
            display: grid !important;
            gap: 8px !important;
          }

          .header-nav a {
            width: 100% !important;
            min-height: 40px !important;
            justify-content: flex-start !important;
            padding: 0 14px !important;
          }

          .header-mobile-search-holder {
            display: block !important;
          }
        }

        @media (max-width: 640px) {
          .header-container {
            padding: 0 14px !important;
          }

          .header-inner {
            min-height: 70px !important;
            gap: 10px !important;
          }

          .header-logo-link {
            gap: 9px !important;
            max-width: calc(100vw - 88px) !important;
            overflow: hidden !important;
          }

          .header-logo-mark {
            width: 40px !important;
            height: 40px !important;
            border-radius: 10px !important;
            font-size: 13px !important;
          }

          .header-logo-title {
            font-size: 17px !important;
          }

          .header-logo-subtitle {
            font-size: 8px !important;
            letter-spacing: 0.055em !important;
          }

          .header-mobile-menu-button {
            width: 40px !important;
            height: 40px !important;
          }
        }
      `}</style>
    </header>
  );
}