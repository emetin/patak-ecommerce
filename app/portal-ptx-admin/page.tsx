"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function PortalAdminLoginPage() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [csrfToken, setCsrfToken] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingCsrf, setIsLoadingCsrf] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadCsrf() {
      try {
        const response = await fetch("/api/admin-auth/csrf", {
          method: "GET",
          credentials: "include",
          cache: "no-store",
        });

        const data = (await response.json()) as {
          ok?: boolean;
          csrfToken?: string;
        };

        if (!response.ok || !data?.ok || !data?.csrfToken) {
          throw new Error("CSRF alınamadı.");
        }

        if (isMounted) {
          setCsrfToken(data.csrfToken);
        }
      } catch {
        if (isMounted) {
          setError("Güvenlik doğrulaması alınamadı. Sayfayı yenileyin.");
        }
      } finally {
        if (isMounted) {
          setIsLoadingCsrf(false);
        }
      }
    }

    loadCsrf();

    return () => {
      isMounted = false;
    };
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!csrfToken) {
      setError("Güvenlik doğrulaması hazır değil.");
      return;
    }

    setError("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/admin-auth/login", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "x-csrf-token": csrfToken,
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });

      const data = (await response.json()) as {
        ok?: boolean;
        error?: string;
      };

      if (!response.ok || !data?.ok) {
        setError(data?.error || "Giriş başarısız.");
        return;
      }

      router.replace("/admin/products");
      router.refresh();
    } catch {
      setError("Bağlantı sırasında bir hata oluştu.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        padding: "32px 16px",
        background:
          "linear-gradient(180deg, #0f172a 0%, #111827 50%, #0b1220 100%)",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 460,
          background: "rgba(255,255,255,0.96)",
          borderRadius: 20,
          padding: 32,
          boxShadow: "0 24px 80px rgba(0,0,0,0.28)",
        }}
      >
        <div style={{ marginBottom: 24 }}>
          <div
            style={{
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "#6b7280",
              marginBottom: 10,
            }}
          >
            Admin Access
          </div>

          <h1
            style={{
              fontSize: 30,
              lineHeight: 1.15,
              margin: 0,
              color: "#111827",
            }}
          >
            Patak Textile Admin Login
          </h1>

          <p
            style={{
              marginTop: 12,
              marginBottom: 0,
              fontSize: 15,
              lineHeight: 1.7,
              color: "#4b5563",
            }}
          >
            Ürün, koleksiyon ve blog yönetimi için güvenli giriş yapın.
          </p>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <label
            htmlFor="username"
            style={{
              display: "block",
              fontSize: 14,
              fontWeight: 600,
              color: "#111827",
              marginBottom: 8,
            }}
          >
            Kullanıcı Adı
          </label>

          <input
            id="username"
            name="username"
            type="text"
            autoComplete="username"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            placeholder="admin"
            style={{
              width: "100%",
              height: 48,
              borderRadius: 12,
              border: "1px solid #d1d5db",
              padding: "0 14px",
              fontSize: 15,
              marginBottom: 16,
              outline: "none",
            }}
          />

          <label
            htmlFor="password"
            style={{
              display: "block",
              fontSize: 14,
              fontWeight: 600,
              color: "#111827",
              marginBottom: 8,
            }}
          >
            Şifre
          </label>

          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="••••••••"
            style={{
              width: "100%",
              height: 48,
              borderRadius: 12,
              border: "1px solid #d1d5db",
              padding: "0 14px",
              fontSize: 15,
              marginBottom: 16,
              outline: "none",
            }}
          />

          {error ? (
            <div
              style={{
                marginBottom: 16,
                borderRadius: 12,
                padding: "12px 14px",
                background: "#fef2f2",
                color: "#b91c1c",
                fontSize: 14,
                lineHeight: 1.6,
                border: "1px solid #fecaca",
              }}
            >
              {error}
            </div>
          ) : null}

          <button
            type="submit"
            disabled={isSubmitting || isLoadingCsrf}
            style={{
              width: "100%",
              height: 50,
              border: "none",
              borderRadius: 12,
              background: "#111827",
              color: "#ffffff",
              fontSize: 15,
              fontWeight: 700,
              cursor:
                isSubmitting || isLoadingCsrf ? "not-allowed" : "pointer",
              opacity: isSubmitting || isLoadingCsrf ? 0.7 : 1,
            }}
          >
            {isLoadingCsrf
              ? "Güvenlik hazırlanıyor..."
              : isSubmitting
              ? "Giriş yapılıyor..."
              : "Giriş Yap"}
          </button>
        </form>
      </div>
    </main>
  );
}