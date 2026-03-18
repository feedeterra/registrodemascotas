import React, { useState } from "react";
import { Dog } from "../types";
import { Card, Icons, useT } from "./UI";

export function AdoptionCarousel({ dogs, onSelect }: { dogs: Dog[], onSelect: (d: Dog) => void }) {
  const T = useT();
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // Filter for urgent or shelter dogs, prioritize urgent
  const featuredDogs = dogs
    .filter(d => d.type === "stray" && (d.adoptionStatus === "urgent" || d.adoptionStatus === "shelter"))
    .sort((a, b) => {
      if (a.adoptionStatus === "urgent" && b.adoptionStatus !== "urgent") return -1;
      if (a.adoptionStatus !== "urgent" && b.adoptionStatus === "urgent") return 1;
      return 0;
    });

  if (featuredDogs.length === 0) return null;

  const currentDog = featuredDogs[currentIndex % featuredDogs.length];

  const handleNext = () => {
    setCurrentIndex(prev => prev + 1);
  };

  return (
    <div className="anim d1" style={{ marginBottom: 24 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
        <span style={{ fontSize: 14, fontWeight: 800, color: T.txt }}>🚨 Casos Urgentes y Refugio</span>
        <span style={{ fontSize: 12, color: T.muted, fontWeight: 600 }}>{currentIndex % featuredDogs.length + 1} de {featuredDogs.length}</span>
      </div>
      
      <Card style={{ overflow: "hidden", borderRadius: "20px", border: `2px solid ${currentDog.adoptionStatus === "urgent" ? T.danger : T.purple}`, boxShadow: "0 10px 30px rgba(0,0,0,0.1)" }}>
        <div style={{ position: "relative" }}>
          {currentDog.photo ? (
            <img src={currentDog.photo} alt={currentDog.name} style={{ width: "100%", height: 320, objectFit: "cover", display: "block" }} />
          ) : (
            <div style={{ width: "100%", height: 320, background: T.purpleLt, display: "flex", alignItems: "center", justifyContent: "center", color: T.purple }}>
              {Icons.Dog(80)}
            </div>
          )}
          
          <div style={{ position: "absolute", top: 16, left: 16, background: currentDog.adoptionStatus === "urgent" ? T.danger : T.purple, color: "#fff", padding: "6px 14px", borderRadius: "20px", fontSize: 12, fontWeight: 800, boxShadow: "0 4px 12px rgba(0,0,0,0.2)", letterSpacing: "0.5px" }}>
            {currentDog.adoptionStatus === "urgent" ? "🚨 URGENTE" : "🏥 REFUGIO"}
          </div>
          
          {/* Gradient overlay for text readability */}
          <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.4) 60%, rgba(0,0,0,0) 100%)", padding: "60px 20px 20px", color: "#fff" }}>
            <h3 style={{ fontSize: 32, fontWeight: 900, letterSpacing: "-1px", margin: 0, textShadow: "0 2px 4px rgba(0,0,0,0.3)" }}>{currentDog.name}</h3>
            <p style={{ fontSize: 15, opacity: 0.95, margin: "6px 0 0", fontWeight: 500, textShadow: "0 1px 2px rgba(0,0,0,0.3)" }}>
              {[currentDog.breed, currentDog.sex, currentDog.size].filter(Boolean).join(" · ")}
            </p>
          </div>
        </div>
        
        <div style={{ padding: "16px", display: "flex", gap: 12, background: T.bg }}>
          <button 
            onClick={handleNext}
            style={{ flex: 1, padding: "16px", borderRadius: "14px", border: `2px solid ${T.border}`, background: "transparent", color: T.muted, fontSize: 16, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, transition: "all 0.2s", whiteSpace: "nowrap" }}
          >
            ✕ Pasar
          </button>
          <button 
            onClick={() => onSelect(currentDog)}
            style={{ flex: 1, padding: "16px", borderRadius: "14px", border: "none", background: "linear-gradient(135deg, #7c3aed, #9b59b6)", color: "#fff", fontSize: 16, fontWeight: 800, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, boxShadow: "0 6px 16px rgba(124,58,237,0.3)", whiteSpace: "nowrap" }}
          >
            {Icons.Heart()} Me interesa
          </button>
        </div>
      </Card>
    </div>
  );
}
