/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { Dog, Sighting } from "../types";
import { elapsedStr, fmtDate, genId, generateFlyer } from "../utils";
import { ADMIN_PHONE, DONATION_LINK } from "../constants";
import { useT, Card, Btn, Icons, Badge } from "./UI";

interface DetailViewProps {
  dog: Dog;
  isAdmin: boolean;
  isOwner: boolean;
  onDelete: (id: string) => void;
  onEdit: (dog: Dog) => void;
  onMarkLost: (id: string, loc: string) => void;
  onMarkFound: (id: string) => void;
  onAddSighting: (id: string, sighting: Sighting) => void;
}

export function DetailView({ dog, isAdmin, isOwner, onDelete, onEdit, onMarkLost, onMarkFound, onAddSighting }: DetailViewProps) {
  const T = useT();
  const [el, setEl] = useState(() => elapsedStr(dog.lostSince));
  const [sightText, setSightText] = useState("");
  const [sightLoc, setSightLoc] = useState("");
  const [showSightForm, setShowSightForm] = useState(false);
  const [showFlyer, setShowFlyer] = useState(false);
  const flyerRef = React.useRef<HTMLDivElement>(null);

  const lost = !!dog.lostSince;
  const stray = dog.type === "stray";

  useEffect(() => {
    if (showFlyer && flyerRef.current) {
      generateFlyer(dog, lost ? "lost" : "adopt", flyerRef.current);
    }
  }, [showFlyer, dog, lost]);

  useEffect(() => {
    if (!dog.lostSince) return;
    setEl(elapsedStr(dog.lostSince));
    const iv = setInterval(() => setEl(elapsedStr(dog.lostSince)), 30000);
    return () => clearInterval(iv);
  }, [dog.lostSince]);

  const shareMsg = lost
    ? `🚨 *PERRO PERDIDO* 🚨\n\n🐕 *${dog.name}*\n📋 ${[dog.breed, dog.color, dog.size].filter(Boolean).join(" · ")}\n📍 Última ubicación: ${dog.lastSeenLocation || dog.neighborhood || "No especificada"}\n${dog.notes ? `📝 ${dog.notes}\n` : ""}\n👤 Dueño: ${dog.ownerName}\n📱 Contacto: ${dog.ownerPhone}\n⏱ Perdido hace ${el}\n\n¡Si lo ves, avisá! 🙏`
    : stray ? `🐕 *PERRO EN BUSCA DE HOGAR* 🏠\n\n🐾 *${dog.name}*\n📋 ${[dog.breed, dog.color, dog.size].filter(Boolean).join(" · ")}\n${(dog.adoptionStatus === "shelter" || dog.adoptionStatus === "transit") ? `🏷️ Estado: ${dog.adoptionStatus === "shelter" ? "🏥 En el refugio" : "🏡 En hogar de tránsito"}\n` : ""}📍 Ubicación: ${dog.neighborhood || "No especificada"}\n${dog.notes ? `📝 ${dog.notes}\n` : ""}\n¿Podés darle un hogar? 🙏` : null;

  const handleAddSighting = () => {
    if (!sightText) return;
    onAddSighting(dog.id, { id: genId(), text: sightText, location: sightLoc, date: new Date().toISOString() });
    setSightText("");
    setSightLoc("");
    setShowSightForm(false);
  };

  return (
    <div className="anim">
      <Card style={{ overflow: "hidden", border: lost ? `2px solid ${T.danger}` : stray ? `2px solid ${T.purple}` : undefined }}>
        {lost && (
          <div style={{ background: T.danger, color: "#fff", padding: "10px 16px", fontSize: 13, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span>🚨 PERDIDO</span>
            <span style={{ fontWeight: 600, fontSize: 14 }}>⏱ hace {el}</span>
          </div>
        )}
        {stray && (
          <div style={{ background: dog.adoptionStatus === "urgent" ? T.danger : T.purple, color: "#fff", padding: "10px 16px", fontSize: 13, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span>{dog.adoptionStatus === "urgent" ? "🚨 URGENTE — NECESITA HOGAR" : "💜 EN ADOPCIÓN"}</span>
            <span style={{ fontSize: 12, opacity: .9 }}>{dog.adoptionStatus === "transit" ? "🏠 En tránsito" : dog.adoptionStatus === "shelter" ? "🏥 En refugio" : ""}</span>
          </div>
        )}
        {dog.adoptionStatus === "shelter" && (
          <div style={{ background: "linear-gradient(135deg, #f5e6c8, #e8d5a8)", padding: "8px 16px", fontSize: 13, fontWeight: 700, color: "#8a6d3b", display: "flex", alignItems: "center", gap: 6 }}>
            ✅ Verificado — Refugio CASA
          </div>
        )}
        {dog.photo && <img src={dog.photo} alt={dog.name} style={{ width: "100%", height: 220, objectFit: "cover", ...(lost ? { filter: "saturate(.5)" } : {}) }} />}

        <div style={{ padding: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: 16 }}>
            <div>
              <h2 style={{ fontSize: 24, fontWeight: 900, letterSpacing: "-0.5px", color: lost ? T.danger : T.txt }}>{dog.name}</h2>
              <p style={{ fontSize: 14, color: T.muted, marginTop: 2 }}>{[dog.breed, dog.color, dog.size, dog.sex, dog.neutered === "Sí" ? "Castrado/a" : dog.neutered === "No" ? "Sin castrar" : null].filter(Boolean).join(" · ")}</p>
            </div>
            {(isAdmin || isOwner) && (
              <div style={{ display: "flex", gap: 8 }}>
                {isOwner && <Btn v="secondary" sz="sm" onClick={() => onEdit(dog)}>✏️ Editar</Btn>}
                <Btn v="danger" sz="sm" onClick={() => onDelete(dog.id)} icon={Icons.Trash()}>Eliminar</Btn>
              </div>
            )}
          </div>

          {lost && dog.lastSeenLocation && (
            <div style={{ background: T.dangerLt, borderRadius: "10px", padding: 12, marginBottom: 12, display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: T.danger, fontWeight: 600 }}>
              {Icons.MapPin()} Última ubicación: {dog.lastSeenLocation}
            </div>
          )}

          {!stray && (
            <div style={{ background: T.accentLt, borderRadius: "10px", padding: 14, marginBottom: 12 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: T.accent, marginBottom: 8, textTransform: "uppercase", letterSpacing: ".5px" }}>Dueño/a</div>
              <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 6 }}>{dog.ownerName}</div>
              {dog.ownerPhone && <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 14, color: T.muted }}>{Icons.Phone()} {dog.ownerPhone}</div>}
              {dog.neighborhood && <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 14, color: T.muted, marginTop: 4 }}>{Icons.Loc()} {dog.neighborhood}</div>}
              {dog.ownerPhone && (
                <a
                  href={`https://wa.me/${dog.ownerPhone.replace(/\D/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, marginTop: 10, padding: "8px 14px", background: "#25D366", color: "#fff", borderRadius: 8, fontWeight: 700, fontSize: 13, textDecoration: "none" }}
                >
                  💬 Contactar por WhatsApp
                </a>
              )}
            </div>
          )}
          {stray && (dog.neighborhood || dog.adoptionStatus === "shelter" || dog.adoptionStatus === "transit") && (
            <div style={{ background: T.purpleLt, borderRadius: "10px", padding: 14, marginBottom: 12 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: T.purple, marginBottom: 6, textTransform: "uppercase", letterSpacing: ".5px" }}>Ubicación / Estado</div>
              {(dog.adoptionStatus === "shelter" || dog.adoptionStatus === "transit") && (
                <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 14, fontWeight: 700, marginBottom: dog.neighborhood ? 6 : 0, color: T.purple }}>
                  {dog.adoptionStatus === "shelter" ? "🏥 En el refugio" : "🏡 En hogar de tránsito"}
                </div>
              )}
              {dog.neighborhood && (
                <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 14, fontWeight: 600 }}>{Icons.Loc()} {dog.neighborhood}</div>
              )}
            </div>
          )}

          {!stray && dog.hasCollar && (
            <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 14px", borderRadius: "10px", marginBottom: 12, background: dog.hasCollar === "Sí" ? T.blueLt : T.dangerLt, border: `1px solid ${dog.hasCollar === "Sí" ? T.blue : T.danger}22` }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: dog.hasCollar === "Sí" ? T.blue : T.danger }}>
                {dog.hasCollar === "Sí" ? `Collar: ${dog.collarColor || "sí"}` : "Collar: no tiene"}
              </div>
            </div>
          )}

          {dog.notes && <div style={{ fontSize: 14, color: T.muted, lineHeight: 1.5, padding: "4px 0", marginBottom: 12 }}><strong style={{ color: T.txt }}>Notas:</strong> {dog.notes}</div>}

          {(dog.sightings?.length > 0 || lost) && (
            <div style={{ marginBottom: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: T.muted, textTransform: "uppercase", letterSpacing: ".5px" }}>Avistamientos ({dog.sightings?.length || 0})</span>
                {lost && !showSightForm && (
                  <button
                    onClick={() => setShowSightForm(true)}
                    style={{ background: T.blue, color: "#fff", border: "none", fontSize: 12, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: 5, padding: "6px 14px", borderRadius: 20, boxShadow: `0 2px 8px ${T.blue}40`, transition: "all .2s" }}
                  >
                    {Icons.Eye()} Reportar avistamiento
                  </button>
                )}
              </div>
              {showSightForm && (
                <div className="anim" style={{ background: T.blueLt, borderRadius: "10px", padding: 12, marginBottom: 10 }}>
                  <input placeholder="¿Qué viste?" value={sightText} onChange={e => setSightText(e.target.value)} style={{ marginBottom: 8 }} />
                  <input placeholder="📍 Ubicación" value={sightLoc} onChange={e => setSightLoc(e.target.value)} style={{ marginBottom: 8 }} />
                  <div style={{ display: "flex", gap: 8 }}>
                    <Btn sz="sm" onClick={handleAddSighting} disabled={!sightText} icon={Icons.Eye()}>Reportar</Btn>
                    <Btn v="ghost" sz="sm" onClick={() => setShowSightForm(false)}>Cancelar</Btn>
                  </div>
                </div>
              )}
              {dog.sightings?.length > 0 && (
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {[...(dog.sightings || [])].reverse().map(s => (
                    <div key={s.id} style={{ background: T.bg, borderRadius: 8, padding: "10px 12px", borderLeft: `3px solid ${T.blue}` }}>
                      <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 3 }}>{s.text}</div>
                      <div style={{ display: "flex", gap: 10, fontSize: 11, color: T.muted }}>
                        {s.location && <span style={{ display: "flex", alignItems: "center", gap: 3 }}>{Icons.Loc()} {s.location}</span>}
                        <span style={{ display: "flex", alignItems: "center", gap: 3 }}>{Icons.Clock()} {fmtDate(s.date)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {lost && (
              <>
                <a
                  href={`https://wa.me/${dog.ownerPhone?.replace(/\D/g, "")}?text=${encodeURIComponent(`Hola ${dog.ownerName}! Vi a ${dog.name} que está reportado como perdido. ¿Sigue perdido?`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => {
                    setTimeout(() => {
                      window.open(`https://wa.me/${ADMIN_PHONE}?text=${encodeURIComponent(`🐾 Aviso: alguien vio a "${dog.name}" (${dog.breed || ""}, ${dog.neighborhood || ""}). Dueño: ${dog.ownerName} - ${dog.ownerPhone}`)}`, "_blank");
                    }, 600);
                  }}
                  style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, padding: "16px 20px", background: "linear-gradient(135deg,#2d8a56,#1fa855)", color: "#fff", borderRadius: "10px", fontWeight: 800, fontSize: 16, textDecoration: "none", boxShadow: "0 4px 14px rgba(45,138,86,.35)", letterSpacing: ".3px" }}
                >
                  🎉 ¡Lo encontré!
                </a>
                <p style={{ fontSize: 11, color: T.muted, textAlign: "center" }}>Se avisará al dueño y al administrador por WhatsApp</p>
                {(isAdmin || isOwner) && <Btn v="secondary" sz="sm" onClick={() => onMarkFound(dog.id)} icon={Icons.Check()} style={{ justifyContent: "center" }}>Marcar como encontrado</Btn>}
              </>
            )}
            {!lost && !stray && (
              <>
                <button
                  onClick={() => { const loc = prompt("¿Dónde lo vieron por última vez?"); if (loc !== null) onMarkLost(dog.id, loc); }}
                  style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "12px 20px", background: T.dangerLt, color: T.danger, border: `1.5px solid ${T.danger}`, borderRadius: "10px", fontWeight: 700, fontSize: 14, cursor: "pointer" }}
                >
                  {Icons.Alert()} Reportar como perdido
                </button>
                <a href={`https://wa.me/${dog.ownerPhone?.replace(/\D/g, "")}`} target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "12px 20px", background: "#25D366", color: "#fff", borderRadius: "10px", fontWeight: 700, fontSize: 14, textDecoration: "none" }}>💬 Contactar por WhatsApp</a>
              </>
            )}
            {stray && (
              <a href={`https://wa.me/${ADMIN_PHONE}?text=${encodeURIComponent(`Hola, me interesa adoptar a ${dog.name}. ¿Pueden darme más información?`)}`} target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "14px 20px", background: "linear-gradient(135deg,#7c3aed,#9b59b6)", color: "#fff", borderRadius: "10px", fontWeight: 800, fontSize: 15, textDecoration: "none", boxShadow: "0 4px 14px rgba(124,58,237,.3)" }}>{Icons.Heart()} Quiero adoptarlo</a>
            )}
            {stray && dog.adoptionStatus === "shelter" && DONATION_LINK && (
              <a href={DONATION_LINK} target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "12px 20px", background: "linear-gradient(135deg, #f5e6c8, #e8d5a8)", color: "#8a6d3b", borderRadius: "10px", fontWeight: 700, fontSize: 14, textDecoration: "none", border: "1px solid #e8d5a8" }}>☕ Invitale un plato de comida al refugio</a>
            )}
            {shareMsg && <a href={`https://wa.me/?text=${encodeURIComponent(shareMsg)}`} target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "10px 20px", background: T.bg, color: T.txt, border: `1.5px solid ${T.border}`, borderRadius: "10px", fontWeight: 700, fontSize: 13, textDecoration: "none" }}>{Icons.Share()} Compartir en grupos de WhatsApp</a>}
            {(lost || stray) && (
              <>
                <button
                  onClick={() => setShowFlyer(!showFlyer)}
                  style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "10px 20px", background: "transparent", color: T.accent, border: `1.5px solid ${T.accent}`, borderRadius: "10px", fontWeight: 700, fontSize: 13, cursor: "pointer", transition: "all .2s" }}
                >
                  {showFlyer ? "✕ Cerrar flyer" : "📋 Generar flyer para compartir"}
                </button>
                {showFlyer && (
                  <div className="anim">
                    <div ref={flyerRef} style={{ borderRadius: 12, overflow: "hidden", minHeight: 200, display: "flex", alignItems: "center", justifyContent: "center", background: T.borderLt, marginTop: 12 }}>
                      <span style={{ color: T.muted, fontSize: 14, fontWeight: 600 }}>Generando imagen...</span>
                    </div>
                    <button
                      onClick={() => generateFlyer(dog, lost ? "lost" : "adopt")}
                      style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, width: "100%", padding: "12px 20px", marginTop: 8, background: T.accent, color: "#fff", border: "none", borderRadius: "10px", fontWeight: 700, fontSize: 14, cursor: "pointer" }}
                    >
                      📲 Compartir o Descargar
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}
