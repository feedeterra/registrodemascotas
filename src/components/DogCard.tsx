/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { Dog } from "../types";
import { elapsedStr } from "../utils";
import { useT, Card, Icons } from "./UI";

interface DogCardProps {
  dog: Dog;
  onClick: (dog: Dog) => void;
  delay?: number;
}

export function DogCard({ dog, onClick, delay = 0 }: DogCardProps) {
  const T = useT();
  const [el, setEl] = useState(() => elapsedStr(dog.lostSince));

  useEffect(() => {
    if (!dog.lostSince) return;
    setEl(elapsedStr(dog.lostSince));
    const iv = setInterval(() => setEl(elapsedStr(dog.lostSince)), 30000);
    return () => clearInterval(iv);
  }, [dog.lostSince]);

  const lost = !!dog.lostSince;
  const stray = dog.type === "stray";

  return (
    <Card
      className={`anim d${delay}`}
      style={{
        cursor: "pointer",
        overflow: "hidden",
        transition: "transform .2s,box-shadow .2s",
        border: lost ? `2px solid ${T.danger}` : stray ? `2px solid ${T.purple}` : undefined,
        animation: lost ? "lostPulse 2s ease-in-out infinite" : undefined
      }}
    >
      {lost && (
        <div style={{ background: T.danger, color: "#fff", padding: "6px 14px", fontSize: 12, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span>🚨 PERDIDO</span>
          <span>⏱ hace {el}</span>
        </div>
      )}
      {stray && (
        <div style={{ background: dog.adoptionStatus === "urgent" ? T.danger : T.purple, color: "#fff", padding: "6px 14px", fontSize: 12, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span>{dog.adoptionStatus === "urgent" ? "🚨 URGENTE" : "💜 EN ADOPCIÓN"}</span>
          <span style={{ fontSize: 11, opacity: .9 }}>
            {dog.adoptionStatus === "transit" ? "🏠 En tránsito" : dog.adoptionStatus === "shelter" ? "🏥 En refugio" : dog.adoptionStatus === "urgent" ? "Necesita hogar ya" : ""}
          </span>
        </div>
      )}
      {dog.adoptionStatus === "shelter" && (
        <div style={{ background: "linear-gradient(135deg, #f5e6c8, #e8d5a8)", padding: "4px 14px", fontSize: 11, fontWeight: 700, color: "#8a6d3b", display: "flex", alignItems: "center", gap: 5 }}>
          ✅ Verificado — Refugio CASA
        </div>
      )}
      <div
        onClick={() => onClick(dog)}
        onMouseEnter={e => {
          e.currentTarget.parentElement!.style.transform = "translateY(-2px)";
          e.currentTarget.parentElement!.style.boxShadow = T.shadowLg;
        }}
        onMouseLeave={e => {
          e.currentTarget.parentElement!.style.transform = "translateY(0)";
          e.currentTarget.parentElement!.style.boxShadow = T.shadow;
        }}
      >
        <div style={{ display: "flex", gap: 14, padding: 14 }}>
          {dog.photo ? (
            <img
              src={dog.photo}
              alt={dog.name}
              style={{
                width: 72,
                height: 72,
                objectFit: "cover",
                borderRadius: 10,
                flexShrink: 0,
                ...(lost ? { filter: "saturate(.6)", border: `2px solid ${T.danger}` } : {})
              }}
            />
          ) : (
            <div style={{
              width: 72,
              height: 72,
              borderRadius: 10,
              flexShrink: 0,
              background: lost ? T.dangerLt : stray ? T.purpleLt : T.accentLt,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: lost ? T.danger : stray ? T.purple : T.accent
            }}>
              {Icons.Dog()}
            </div>
          )}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginBottom: 2 }}>
              <span style={{ fontWeight: 700, fontSize: 16, color: lost ? T.danger : T.txt }}>{dog.name}</span>
              {!stray && <span style={{ fontSize: 12, color: lost ? T.muted : T.txt, fontWeight: lost ? 400 : 700 }}>de {dog.ownerName}</span>}
            </div>
            <div style={{ fontSize: 13, color: T.muted, marginBottom: 6 }}>
              {[dog.breed, dog.color, dog.size, dog.neutered === "Sí" ? "Castrado/a" : dog.neutered === "No" ? "Sin castrar" : null].filter(Boolean).join(" · ")}
            </div>
            <div style={{ display: "flex", gap: 10, fontSize: 12, color: T.muted, flexWrap: "wrap" }}>
              {dog.neighborhood && <span style={{ display: "flex", alignItems: "center", gap: 3, ...(lost ? { color: T.accent, fontWeight: 700 } : {}) }}>{Icons.Loc()} {dog.neighborhood}</span>}
              {dog.hasCollar === "Sí" && <span style={lost ? { color: T.ok, fontWeight: 700 } : {}}>Collar: {dog.collarColor || "sí"}</span>}
              {dog.hasCollar === "No" && <span style={{ color: T.danger, fontWeight: lost ? 700 : 400 }}>Collar: no tiene</span>}
              {lost && dog.sightings?.length > 0 && <span>Lo vieron hace: {elapsedStr(dog.sightings[dog.sightings.length - 1]?.date)}</span>}
              {stray && dog.createdAt && <span style={{ color: T.purple }}>En adopción hace {elapsedStr(dog.createdAt)}</span>}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
