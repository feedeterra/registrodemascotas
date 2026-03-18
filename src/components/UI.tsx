/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useContext, createContext } from "react";
import { Theme } from "../types";
import { compressImage } from "../utils";

export const ThemeCtx = createContext<Theme | null>(null);

export const themes: { light: Theme; dark: Theme } = {
  light: {
    bg: "#faf7f2", card: "#ffffff", accent: "#d35400", accentLt: "#fef0e5", accentDk: "#b84700",
    txt: "#2c2417", muted: "#8a7d6e", border: "#e6ddd2", borderLt: "#f0ebe3",
    ok: "#1a8c5b", okLt: "#e6f5ed", danger: "#c0392b", dangerLt: "#fbeae8",
    blue: "#2e86ab", blueLt: "#e8f4f8", blueDk: "#1b6d8a",
    purple: "#7c3aed", purpleLt: "#f3f0ff",
    navy: "#2d6a4f", navyLt: "#ecf5f0",
    shadow: "0 1px 3px rgba(44,36,23,0.05),0 4px 12px rgba(44,36,23,0.04)",
    shadowLg: "0 4px 12px rgba(44,36,23,0.08),0 12px 32px rgba(44,36,23,0.05)",
    headerBg: "linear-gradient(135deg,#1b4332,#2d6a4f)",
    inputBg: "#ffffff", inputBorder: "#e6ddd2",
  },
  dark: {
    bg: "#1a1814", card: "#262220", accent: "#e8873a", accentLt: "#302218", accentDk: "#f5a352",
    txt: "#ede8e0", muted: "#968e83", border: "#3a3430", borderLt: "#2e2a26",
    ok: "#4ade80", okLt: "#1a2e1e", danger: "#f87171", dangerLt: "#2e1a1a",
    blue: "#5cc8e8", blueLt: "#1a2830", blueDk: "#7dd8f0",
    purple: "#c4b5fd", purpleLt: "#24202e",
    navy: "#e8873a", navyLt: "#302218",
    shadow: "0 1px 3px rgba(0,0,0,0.25),0 4px 12px rgba(0,0,0,0.2)",
    shadowLg: "0 4px 12px rgba(0,0,0,0.35),0 12px 32px rgba(0,0,0,0.25)",
    headerBg: "linear-gradient(135deg,#c26a1a,#9a5210)",
    inputBg: "#262220", inputBorder: "#3a3430",
  },
};

export function useT() {
  const t = useContext(ThemeCtx);
  if (!t) throw new Error("useT must be used within ThemeProvider");
  return t;
}

const R = "14px";
const RS = "10px";

interface BtnProps {
  children: React.ReactNode;
  onClick?: (e: React.MouseEvent) => void;
  v?: "primary" | "secondary" | "danger" | "ghost" | "success";
  sz?: "sm" | "md" | "lg";
  disabled?: boolean;
  style?: React.CSSProperties;
  icon?: React.ReactNode;
}

export function Btn({ children, onClick, v = "primary", sz = "md", disabled, style, icon }: BtnProps) {
  const T = useT();
  const vs = {
    primary: { bg: T.accent, c: "#fff", b: "none", h: T.accentDk },
    secondary: { bg: "transparent", c: T.txt, b: `1.5px solid ${T.border}`, h: T.borderLt },
    danger: { bg: "transparent", c: T.danger, b: `1.5px solid ${T.dangerLt}`, h: T.dangerLt },
    ghost: { bg: "transparent", c: T.muted, b: "none", h: T.borderLt },
    success: { bg: T.ok, c: "#fff", b: "none", h: "#24704a" }
  };
  const szs = {
    sm: { p: "6px 12px", f: "13px" },
    md: { p: "10px 20px", f: "14px" },
    lg: { p: "14px 28px", f: "15px" }
  };
  const vv = vs[v], ss = szs[sz];
  
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        padding: ss.p,
        fontSize: ss.f,
        background: disabled ? T.border : vv.bg,
        color: disabled ? T.muted : vv.c,
        border: vv.b,
        borderRadius: RS,
        fontWeight: 600,
        cursor: disabled ? "not-allowed" : "pointer",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "6px",
        transition: "all .2s",
        ...style
      }}
      onMouseEnter={e => { if (!disabled) (e.currentTarget as HTMLElement).style.background = vv.h; }}
      onMouseLeave={e => { if (!disabled) (e.currentTarget as HTMLElement).style.background = disabled ? T.border : vv.bg; }}
    >
      {icon}
      {children}
    </button>
  );
}

export function Card({ children, style, className, onClick }: { children: React.ReactNode, style?: React.CSSProperties, className?: string, onClick?: () => void }) {
  const T = useT();
  return (
    <div
      className={className}
      onClick={onClick}
      style={{
        background: T.card,
        borderRadius: R,
        border: `1px solid ${T.borderLt}`,
        boxShadow: T.shadow,
        ...style
      }}
    >
      {children}
    </div>
  );
}

export function PhotoUp({ value, onChange, size = 120 }: { value: string | null, onChange: (v: string) => void, size?: number }) {
  const T = useT();
  const hf = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) onChange(await compressImage(f));
  };
  return (
    <label style={{
      width: size,
      height: size,
      borderRadius: R,
      border: `2px dashed ${value ? "transparent" : T.border}`,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      cursor: "pointer",
      overflow: "hidden",
      background: value ? "transparent" : T.accentLt,
      color: T.accent,
      flexShrink: 0
    }}>
      {value ? (
        <img src={value} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      ) : (
        <>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/></svg>
          <span style={{ fontSize: 11, fontWeight: 600, marginTop: 4 }}>Subir foto</span>
        </>
      )}
      <input type="file" accept="image/*" onChange={hf} style={{ display: "none" }} />
    </label>
  );
}

export function Badge({ children, bg, color }: { children: React.ReactNode, bg: string, color: string }) {
  return (
    <span style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 4,
      padding: "3px 10px",
      borderRadius: 20,
      fontSize: 11,
      fontWeight: 700,
      background: bg,
      color,
      letterSpacing: ".3px"
    }}>
      {children}
    </span>
  );
}

export function StatCard({ icon, label, value, bg, color, delay = 0 }: { icon: React.ReactNode, label: string, value: string | number, bg: string, color: string, delay?: number }) {
  const T = useT();
  return (
    <div className={`anim d${delay}`} style={{ flex: 1, background: bg, borderRadius: RS, padding: "14px 8px", textAlign: "center" }}>
      <div style={{ marginBottom: 4, color }}>{icon}</div>
      <div style={{ fontSize: 22, fontWeight: 800, color, lineHeight: 1 }}>{value}</div>
      <div style={{ fontSize: 10, fontWeight: 600, color: T.muted, marginTop: 4 }}>{label}</div>
    </div>
  );
}

export const Icons = {
  Paw: (s = 20) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><ellipse cx="8" cy="6" rx="2.5" ry="3"/><ellipse cx="16" cy="6" rx="2.5" ry="3"/><ellipse cx="5" cy="13" rx="2" ry="2.5"/><ellipse cx="19" cy="13" rx="2" ry="2.5"/><path d="M12 22c-3 0-5-2.5-5-5 0-2 1.5-4 5-4s5 2 5 4c0 2.5-2 5-5 5z"/></svg>,
  Search: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>,
  Plus: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14"/></svg>,
  Cam: (s = 28) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/></svg>,
  Dog: (s = 48) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 5.172C10 3.782 8.423 2.679 6.5 3c-2.823.47-4.113 6.006-4 7 .08.703 1.725 1.722 3.656 1 1.261-.472 1.96-1.45 2.344-2.5M14 5.172c0-1.39 1.577-2.493 3.5-2.172 2.823.47 4.113 6.006 4 7-.08.703-1.725 1.722-3.656 1-1.261-.472-1.855-1.45-2.344-2.5"/><path d="M8 14v.5M16 14v.5"/><path d="M11.25 16.25h1.5L12 17l-.75-.75z"/><path d="M4.42 11.247A13.152 13.152 0 0 0 4 14.556C4 18.728 7.582 21 12 21s8-2.272 8-6.444a11.702 11.702 0 0 0-.493-3.309"/></svg>,
  Back: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>,
  Trash: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/></svg>,
  Phone: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>,
  Loc: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>,
  Shield: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  Alert: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
  Check: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
  Share: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>,
  Eye: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>,
  Heart: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>,
  MapPin: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>,
  Clock: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  Instagram: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>,
  X: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
};
