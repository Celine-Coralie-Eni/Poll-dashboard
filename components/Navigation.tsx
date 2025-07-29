"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { useTheme } from "./ThemeProvider";
import { useState, memo, useCallback } from "react";
import { useTranslations, languages, Language } from "@/lib/tolgee-optimized";

export const Navigation = memo(function Navigation() {
  const { data: session } = useSession();
  const { theme, toggleTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const { t, i18n } = useTranslations();

  const handleSignOut = useCallback(() => {
    signOut({ callbackUrl: "/" });
  }, []);

  const handleMenuToggle = useCallback(() => {
    setIsMenuOpen(!isMenuOpen);
  }, [isMenuOpen]);

  const handleLangMenuToggle = useCallback(() => {
    setIsLangMenuOpen(!isLangMenuOpen);
  }, [isLangMenuOpen]);

  const handleLanguageChange = useCallback(
    (code: string) => {
      i18n.changeLanguage(code as Language);
      setIsLangMenuOpen(false);
    },
    [i18n]
  );

  return (
    <div className="navbar bg-base-100 shadow-lg">
      <div className="navbar-start">
        <div className="dropdown">
          <div
            tabIndex={0}
            role="button"
            className="btn btn-ghost lg:hidden"
            onClick={handleMenuToggle}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h8m-8 6h16"
              />
            </svg>
          </div>
          {isMenuOpen && (
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
            >
              <li>
                <Link href="/" onClick={() => setIsMenuOpen(false)}>
                  {t("home", "Home")}
                </Link>
              </li>
              <li>
                <Link href="/polls" onClick={() => setIsMenuOpen(false)}>
                  {t("polls", "Polls")}
                </Link>
              </li>
              {session?.user?.role === "ADMIN" && (
                <li>
                  <Link href="/admin" onClick={() => setIsMenuOpen(false)}>
                    {t("admin", "Admin")}
                  </Link>
                </li>
              )}
            </ul>
          )}
        </div>
        <Link href="/" className="btn btn-ghost text-xl">
          📊 {t("poll_dashboard", "Poll Dashboard")}
        </Link>
      </div>

      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">
          <li>
            <Link href="/">{t("home", "Home")}</Link>
          </li>
          <li>
            <Link href="/polls">{t("polls", "Polls")}</Link>
          </li>
          {session?.user?.role === "ADMIN" && (
            <li>
              <Link href="/admin">{t("admin", "Admin")}</Link>
            </li>
          )}
        </ul>
      </div>

      <div className="navbar-end">
        <div className="flex items-center gap-2">
          {/* Language Switcher */}
          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle"
              aria-label="Change language"
              onClick={handleLangMenuToggle}
            >
              <span className="text-xl text-blue-500">🌐</span>
            </div>
            {isLangMenuOpen && (
              <ul
                tabIndex={0}
                className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-40"
                onBlur={() => setIsLangMenuOpen(false)}
              >
                {Object.entries(languages).map(([code, name]) => (
                  <li key={code}>
                    <button
                      onClick={() => handleLanguageChange(code)}
                      className={`text-sm ${
                        i18n.language === code
                          ? "bg-primary text-primary-content"
                          : ""
                      }`}
                    >
                      {name as string}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="btn btn-ghost btn-circle"
            aria-label="Toggle theme"
          >
            {theme === "light" ? (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
                  clipRule="evenodd"
                />
              </svg>
            )}
          </button>

          {/* User Menu */}
          {session ? (
            <div className="dropdown dropdown-end">
              <div
                tabIndex={0}
                role="button"
                className="btn btn-ghost btn-circle avatar"
              >
                <div className="w-10 rounded-full">
                  <div className="bg-primary text-primary-content rounded-full w-10 h-10 flex items-center justify-center">
                    {session.user?.name?.[0] || session.user?.email?.[0] || "U"}
                  </div>
                </div>
              </div>
              <ul
                tabIndex={0}
                className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
              >
                <li>
                  <div className="text-sm opacity-75">
                    {session.user?.name || session.user?.email}
                  </div>
                </li>
                <li>
                  <Link href="/profile">{t("profile", "Profile")}</Link>
                </li>
                <li>
                  <button onClick={handleSignOut}>{t("logout", "Logout")}</button>
                </li>
              </ul>
            </div>
          ) : (
            <div className="flex gap-2">
              <Link href="/auth/login" className="btn btn-ghost">
                {t("login", "Login")}
              </Link>
              <Link href="/auth/register" className="btn btn-primary">
                {t("register", "Register")}
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
});
