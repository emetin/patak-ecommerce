"use client";

import type { FormEvent } from "react";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { SITE_SETTINGS } from "../../lib/site-settings";

type CaptchaChallenge = {
  question: string;
  answer: number;
};

function createCaptchaChallenge(): CaptchaChallenge {
  const first = Math.floor(Math.random() * 8) + 2;
  const second = Math.floor(Math.random() * 8) + 2;

  return {
    question: `${first} + ${second}`,
    answer: first + second,
  };
}

export default function PortalAdminLoginPage() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [csrfToken, setCsrfToken] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingCsrf, setIsLoadingCsrf] = useState(true);

  const [failedAttempts, setFailedAttempts] = useState(0);
  const [captchaInput, setCaptchaInput] = useState("");
  const [captchaChallenge, setCaptchaChallenge] = useState<CaptchaChallenge>(
    () => createCaptchaChallenge()
  );

  const shouldShowCaptcha = failedAttempts >= 3;

  useEffect(() => {
    document.body.classList.add("ptx-login-mode");

    return () => {
      document.body.classList.remove("ptx-login-mode");
    };
  }, []);

  useEffect(() => {
    const storedAttempts = window.localStorage.getItem(
      "ptx_admin_failed_attempts"
    );

    if (storedAttempts) {
      const parsedAttempts = Number(storedAttempts);

      if (Number.isFinite(parsedAttempts) && parsedAttempts > 0) {
        setFailedAttempts(parsedAttempts);
      }
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(
      "ptx_admin_failed_attempts",
      String(failedAttempts)
    );
  }, [failedAttempts]);

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
          throw new Error("CSRF token could not be loaded.");
        }

        if (isMounted) {
          setCsrfToken(data.csrfToken);
        }
      } catch {
        if (isMounted) {
          setError("Security verification could not be loaded. Please refresh the page.");
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

  const submitButtonText = useMemo(() => {
    if (isLoadingCsrf) return "Preparing security...";
    if (isSubmitting) return "Signing in...";
    return "Sign In";
  }, [isLoadingCsrf, isSubmitting]);

  function refreshCaptcha() {
    setCaptchaInput("");
    setCaptchaChallenge(createCaptchaChallenge());
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!csrfToken) {
      setError("Security verification is not ready.");
      return;
    }

    if (shouldShowCaptcha) {
      const captchaAnswer = Number(captchaInput.trim());

      if (
        !captchaInput.trim() ||
        !Number.isFinite(captchaAnswer) ||
        captchaAnswer !== captchaChallenge.answer
      ) {
        setError("Security challenge is incorrect. Please try again.");
        refreshCaptcha();
        return;
      }
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
        setFailedAttempts((current) => current + 1);
        setError(data?.error || "Login failed.");
        refreshCaptcha();
        return;
      }

      window.localStorage.removeItem("ptx_admin_failed_attempts");
      setFailedAttempts(0);

      router.replace("/admin");
      router.refresh();
    } catch {
      setFailedAttempts((current) => current + 1);
      setError("A connection error occurred.");
      refreshCaptcha();
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <style jsx global>{`
        body.ptx-login-mode header,
        body.ptx-login-mode footer,
        body.ptx-login-mode [role="banner"],
        body.ptx-login-mode [role="contentinfo"],
        body.ptx-login-mode .site-header,
        body.ptx-login-mode .site-footer,
        body.ptx-login-mode .site-topbar,
        body.ptx-login-mode .header,
        body.ptx-login-mode .footer,
        body.ptx-login-mode .main-header,
        body.ptx-login-mode .main-footer,
        body.ptx-login-mode .navbar,
        body.ptx-login-mode .mobile-header,
        body.ptx-login-mode .mobile-menu,
        body.ptx-login-mode .menu-toggle,
        body.ptx-login-mode [class*="site-header"],
        body.ptx-login-mode [class*="site-footer"],
        body.ptx-login-mode [class*="main-header"],
        body.ptx-login-mode [class*="main-footer"] {
          display: none !important;
          visibility: hidden !important;
          height: 0 !important;
          min-height: 0 !important;
          overflow: hidden !important;
        }

        body.ptx-login-mode {
          margin: 0 !important;
          padding: 0 !important;
          background: #f5f2ec !important;
        }

        body.ptx-login-mode .site-main,
        body.ptx-login-mode main:not(.ptx-login-page) {
          padding: 0 !important;
          margin: 0 !important;
        }
      `}</style>

      <main
        className="ptx-login-page"
        style={{
          minHeight: "100vh",
          display: "grid",
          placeItems: "center",
          padding: "32px 18px",
          background:
            "linear-gradient(135deg, #f7f3ec 0%, #ffffff 42%, #eaf1ed 100%)",
        }}
      >
        <section
          style={{
            width: "100%",
            maxWidth: 980,
            display: "grid",
            gridTemplateColumns: "0.95fr 1.05fr",
            background: "#ffffff",
            borderRadius: 30,
            overflow: "hidden",
            border: "1px solid #e4ded4",
            boxShadow: "0 24px 80px rgba(17, 24, 39, 0.12)",
          }}
        >
          <div
            style={{
              padding: 46,
              background: "#101827",
              color: "#ffffff",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              gap: 48,
            }}
          >
            <div>
              <img
  src={SITE_SETTINGS.logo.header}
  alt={SITE_SETTINGS.siteName}
  style={{
    width: 210,
    height: "auto",
    display: "block",
    marginBottom: 34,
  }}
/>

              <div
                style={{
                  fontSize: 13,
                  fontWeight: 800,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: "rgba(255,255,255,0.58)",
                  marginBottom: 12,
                }}
              >
                Internal Content Management
              </div>

              <h1
                style={{
                  margin: 0,
                  fontSize: 46,
                  lineHeight: 1.05,
                  fontWeight: 900,
                  letterSpacing: "-0.04em",
                }}
              >
                Admin CMS
              </h1>

              <p
                style={{
                  marginTop: 18,
                  marginBottom: 0,
                  fontSize: 16,
                  lineHeight: 1.75,
                  color: "rgba(255,255,255,0.68)",
                  maxWidth: 420,
                }}
              >
                Manage products, collections, blog content, forms and media
                library from a protected internal panel.
              </p>
            </div>

            <div
              style={{
                padding: 20,
                borderRadius: 20,
                background: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(255,255,255,0.12)",
              }}
            >
              <div
                style={{
                  fontSize: 15,
                  fontWeight: 850,
                  marginBottom: 8,
                }}
              >
                Protected Access
              </div>

              <p
                style={{
                  margin: 0,
                  fontSize: 14,
                  lineHeight: 1.7,
                  color: "rgba(255,255,255,0.62)",
                }}
              >
                Authorized users only. Admin routes are protected by signed
                session validation.
              </p>
            </div>
          </div>

          <div
            style={{
              padding: 46,
              display: "grid",
              alignItems: "center",
              background: "#ffffff",
            }}
          >
            <div style={{ width: "100%", maxWidth: 430, margin: "0 auto" }}>
              <div style={{ marginBottom: 28 }}>
                <div
                  style={{
                    fontSize: 12,
                    fontWeight: 850,
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    color: "#2f7d62",
                    marginBottom: 10,
                  }}
                >
                  Admin Access
                </div>

                <h2
                  style={{
                    margin: 0,
                    color: "#111827",
                    fontSize: 32,
                    lineHeight: 1.15,
                    fontWeight: 900,
                    letterSpacing: "-0.03em",
                  }}
                >
                  {SITE_SETTINGS.siteName} Login
                </h2>

                <p
                  style={{
                    marginTop: 12,
                    marginBottom: 0,
                    fontSize: 15,
                    lineHeight: 1.7,
                    color: "#5b6472",
                  }}
                >
                  Sign in securely to access the management panel.
                </p>
              </div>

              <form onSubmit={handleSubmit} noValidate>
                <label htmlFor="username" style={labelStyle}>
                  Username
                </label>

                <input
                  id="username"
                  name="username"
                  type="text"
                  autoComplete="username"
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                  placeholder="admin"
                  style={inputStyle}
                />

                <label htmlFor="password" style={labelStyle}>
                  Password
                </label>

                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="••••••••"
                  style={inputStyle}
                />

                {shouldShowCaptcha ? (
                  <div
                    style={{
                      marginBottom: 16,
                      borderRadius: 16,
                      padding: 16,
                      background: "#f8fafc",
                      border: "1px solid #e5e7eb",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        gap: 12,
                        marginBottom: 12,
                      }}
                    >
                      <div>
                        <div
                          style={{
                            fontSize: 12,
                            fontWeight: 850,
                            color: "#64748b",
                            textTransform: "uppercase",
                            letterSpacing: "0.08em",
                            marginBottom: 4,
                          }}
                        >
                          Security Challenge
                        </div>

                        <div
                          style={{
                            fontSize: 22,
                            fontWeight: 900,
                            color: "#111827",
                          }}
                        >
                          {captchaChallenge.question} = ?
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={refreshCaptcha}
                        style={{
                          minHeight: 38,
                          border: "1px solid #d1d5db",
                          background: "#ffffff",
                          color: "#111827",
                          borderRadius: 12,
                          padding: "0 12px",
                          fontWeight: 800,
                          cursor: "pointer",
                        }}
                      >
                        Refresh
                      </button>
                    </div>

                    <input
                      type="number"
                      value={captchaInput}
                      onChange={(event) => setCaptchaInput(event.target.value)}
                      placeholder="Enter the answer"
                      style={{
                        ...inputStyle,
                        marginBottom: 0,
                      }}
                    />
                  </div>
                ) : null}

                {error ? <div style={errorStyle}>{error}</div> : null}

                <button
                  type="submit"
                  disabled={isSubmitting || isLoadingCsrf}
                  style={{
                    width: "100%",
                    height: 54,
                    border: "none",
                    borderRadius: 15,
                    background: "#111827",
                    color: "#ffffff",
                    fontSize: 15,
                    fontWeight: 850,
                    opacity: isSubmitting || isLoadingCsrf ? 0.7 : 1,
                    cursor:
                      isSubmitting || isLoadingCsrf ? "not-allowed" : "pointer",
                  }}
                >
                  {submitButtonText}
                </button>

                {failedAttempts > 0 ? (
                  <p
                    style={{
                      marginTop: 14,
                      marginBottom: 0,
                      fontSize: 13,
                      color: "#6b7280",
                      lineHeight: 1.6,
                    }}
                  >
                    Failed login attempts: {failedAttempts}
                    {shouldShowCaptcha
                      ? " - Security challenge is active."
                      : " - Security challenge activates after 3 failed attempts."}
                  </p>
                ) : null}
              </form>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: 14,
  fontWeight: 800,
  color: "#111827",
  marginBottom: 8,
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  height: 52,
  borderRadius: 14,
  border: "1px solid #d1d5db",
  padding: "0 15px",
  fontSize: 15,
  outline: "none",
  background: "#ffffff",
  marginBottom: 16,
};

const errorStyle: React.CSSProperties = {
  marginBottom: 16,
  borderRadius: 14,
  padding: "12px 14px",
  background: "#fef2f2",
  color: "#b91c1c",
  fontSize: 14,
  lineHeight: 1.6,
  border: "1px solid #fecaca",
};