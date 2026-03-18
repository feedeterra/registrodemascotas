/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Dog } from "./types";

export function compressImage(file: File, maxW = 800, quality = 0.7): Promise<string> {
  return new Promise((res) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const c = document.createElement("canvas");
        let w = img.width, h = img.height;
        if (w > maxW) { h = (h * maxW) / w; w = maxW; }
        c.width = w; c.height = h;
        const ctx = c.getContext("2d");
        if (ctx) {
          ctx.drawImage(img, 0, 0, w, h);
          res(c.toDataURL("image/jpeg", quality));
        }
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  });
}

export const genId = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 8);

export function elapsedStr(iso: string | null | undefined) {
  if (!iso) return "";
  const d = Date.now() - new Date(iso).getTime();
  const m = Math.floor(d / 60000), h = Math.floor(m / 60), dy = Math.floor(h / 24);
  if (dy > 0) return `${dy}d ${h % 24}h`;
  if (h > 0) return `${h}h ${m % 60}m`;
  return `${m}m`;
}

export function fmtDate(iso: string | null | undefined) {
  if (!iso) return "";
  const d = new Date(iso);
  return d.toLocaleDateString("es-AR", { day: "numeric", month: "short" }) + " " + d.toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" });
}

export function levenshtein(a: string, b: string) {
  if (!a || !b) return 99;
  a = a.toLowerCase(); b = b.toLowerCase();
  if (a.includes(b) || b.includes(a)) return 0;
  const m = a.length, n = b.length;
  const dp = Array.from({ length: m + 1 }, (_, i) => { const r = new Array(n + 1); r[0] = i; return r; });
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++)
    for (let j = 1; j <= n; j++)
      dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + (a[i - 1] !== b[j - 1] ? 1 : 0));
  return dp[m][n];
}

export function fuzzyMatch(query: string, text: string, threshold = 2) {
  if (!query || !text) return false;
  if (text.toLowerCase().includes(query.toLowerCase())) return true;
  const words = text.toLowerCase().split(/\s+/);
  return words.some(w => levenshtein(query.toLowerCase(), w) <= threshold);
}

export function cleanWhatsApp(num: string) {
  let clean = num.replace(/[^0-9]/g, "");
  if (clean.startsWith("0")) clean = clean.slice(1);
  if (clean.startsWith("15") && clean.length <= 10) clean = clean.slice(2);
  if (clean.startsWith("54")) {
    if (!clean.startsWith("549")) clean = "549" + clean.slice(2);
    return clean.length >= 12 ? clean : null;
  }
  if (clean.length === 10) return "549" + clean;
  if (clean.length < 10) return null;
  return clean;
}

export function isValidWhatsApp(num: string) { return cleanWhatsApp(num) !== null; }

export function formatWhatsApp(num: string) {
  const clean = cleanWhatsApp(num);
  if (!clean) return num;
  return "+" + clean;
}

export function lsLoad<T>(key: string, fallback: T): T {
  try {
    const v = localStorage.getItem(key);
    return v ? JSON.parse(v) : fallback;
  } catch {
    return fallback;
  }
}

export function lsSave<T>(key: string, val: T) {
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch (e) {
    console.warn("localStorage full:", e);
  }
}

export function generateFlyer(dog: Dog, type: "lost" | "adopt" = "lost", previewContainer: HTMLElement | null = null): Promise<HTMLCanvasElement | void> {
  return new Promise((resolve) => {
    const W = 1080, H = 1920;
    const c = document.createElement("canvas");
    c.width = W; c.height = H;
    const ctx = c.getContext("2d");
    if (!ctx) return resolve();

    const isLost = type === "lost";
    const RED = "#D42B2B", PURPLE = "#7c3aed", BLACK = "#1a1a1a", WHITE = "#FFFFFF";
    const accent = isLost ? RED : PURPLE;

    ctx.fillStyle = WHITE;
    ctx.fillRect(0, 0, W, H);

    ctx.fillStyle = accent;
    ctx.fillRect(0, 0, W, 240);
    ctx.fillStyle = WHITE;
    ctx.font = "900 86px Arial, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(isLost ? "MASCOTA PERDIDA" : "EN ADOPCIÓN", W / 2, 110);
    ctx.font = "bold 34px Arial, sans-serif";
    ctx.fillText(isLost ? "AYUDANOS A ENCONTRARLA" : "NECESITA UN HOGAR", W / 2, 190);

    const drawContent = () => {
      let nameFontSize = 90;
      ctx.font = `900 ${nameFontSize}px Arial, sans-serif`;
      let nameText = (dog.name || "SIN NOMBRE").toUpperCase();
      while (ctx.measureText(nameText).width > W - 80 && nameFontSize > 40) {
        nameFontSize -= 4;
        ctx.font = `900 ${nameFontSize}px Arial, sans-serif`;
      }
      ctx.fillStyle = BLACK;
      ctx.textAlign = "center";
      ctx.fillText(nameText, W / 2, 990);

      const gridTop = 1030, cellW = 470, cellH = 100, gap = 20, padL = 60;
      const items: [string, string][] = [];
      if (dog.breed) items.push(["RAZA", dog.breed.toUpperCase()]);
      if (dog.color) items.push(["COLOR", dog.color.toUpperCase()]);
      if (dog.size) items.push(["TAMAÑO", dog.size.toUpperCase()]);
      if (dog.sex) items.push(["SEXO", dog.sex.toUpperCase()]);
      if (dog.neutered) items.push(["CASTRADO/A", dog.neutered.toUpperCase()]);
      
      if (!isLost) {
        let statusText = "EN ADOPCIÓN";
        if (dog.adoptionStatus === "shelter") statusText = "REFUGIO";
        else if (dog.adoptionStatus === "transit") statusText = "TRÁNSITO";
        else if (dog.adoptionStatus === "urgent") statusText = "URGENTE";
        items.push(["ESTADO", statusText]);
      } else {
        if (dog.hasCollar) items.push(["COLLAR", dog.hasCollar === "Sí" ? (dog.collarColor?.toUpperCase() || "SÍ") : "NO TIENE"]);
      }
      
      const displayItems = items.slice(0, 6);

      displayItems.forEach((item, i) => {
        const col = i % 2, row = Math.floor(i / 2);
        const x = padL + col * (cellW + gap);
        const y = gridTop + row * (cellH + gap);
        ctx.fillStyle = "#f5f5f5";
        ctx.beginPath();
        // @ts-ignore
        if (ctx.roundRect) {
          // @ts-ignore
          ctx.roundRect(x, y, cellW, cellH, 14);
        } else {
          ctx.rect(x, y, cellW, cellH);
        }
        ctx.fill();
        ctx.fillStyle = "#999";
        ctx.font = "bold 22px Arial, sans-serif";
        ctx.textAlign = "left";
        ctx.fillText(item[0], x + 20, y + 36);
        
        ctx.fillStyle = BLACK;
        let itemFontSize = 36;
        ctx.font = `900 ${itemFontSize}px Arial, sans-serif`;
        while (ctx.measureText(item[1]).width > cellW - 40 && itemFontSize > 16) {
          itemFontSize -= 2;
          ctx.font = `900 ${itemFontSize}px Arial, sans-serif`;
        }
        ctx.fillText(item[1], x + 20, y + 78);
      });

      const rowsUsed = Math.ceil(displayItems.length / 2);
      let nextY = gridTop + rowsUsed * (cellH + gap) + 10;
      const contactY = H - 320;

      if (isLost) {
        const locText = dog.lastSeenLocation || dog.neighborhood || "";
        if (locText) {
          ctx.fillStyle = accent;
          let locFontSize = 34;
          ctx.font = `bold ${locFontSize}px Arial, sans-serif`;
          let fullLocText = "📍 VISTO EN " + locText.toUpperCase();
          while (ctx.measureText(fullLocText).width > W - 80 && locFontSize > 20) {
            locFontSize -= 2;
            ctx.font = `bold ${locFontSize}px Arial, sans-serif`;
          }
          ctx.textAlign = "center";
          ctx.fillText(fullLocText, W / 2, nextY + 40);
          nextY += 80;
        }
      }
      
      if (dog.notes) {
        const notesPad = 24;
        const notesW = W - padL * 2;
        const maxNotesH = contactY - nextY - 20;
        
        if (maxNotesH > 80) {
          ctx.font = "28px Arial, sans-serif";
          const words = dog.notes.split(' ');
          let line = '';
          const lines: string[] = [];
          
          for (let n = 0; n < words.length; n++) {
            const testLine = line + words[n] + ' ';
            const metrics = ctx.measureText(testLine);
            if (metrics.width > notesW - notesPad * 2 && n > 0) {
              lines.push(line);
              line = words[n] + ' ';
            } else {
              line = testLine;
            }
          }
          lines.push(line);

          const lineHeight = 36;
          const maxLines = Math.max(1, Math.floor((maxNotesH - notesPad * 2) / lineHeight));
          const displayLines = lines.slice(0, maxLines);
          if (lines.length > maxLines && displayLines.length > 0) {
              displayLines[displayLines.length - 1] = displayLines[displayLines.length - 1].replace(/\s+\S*$/, '...');
          }

          const actualBoxH = Math.max(100, displayLines.length * lineHeight + notesPad * 2 - 10);

          ctx.fillStyle = isLost ? "#fee2e2" : "#f3e8ff";
          ctx.beginPath();
          // @ts-ignore
          if (ctx.roundRect) ctx.roundRect(padL, nextY, notesW, actualBoxH, 14);
          else ctx.rect(padL, nextY, notesW, actualBoxH);
          ctx.fill();

          ctx.fillStyle = BLACK;
          ctx.textAlign = "left";
          ctx.font = "28px Arial, sans-serif";
          
          displayLines.forEach((l, idx) => {
              ctx.fillText(l, padL + notesPad, nextY + notesPad + 26 + idx * lineHeight);
          });
        }
      }
      ctx.fillStyle = accent;
      ctx.fillRect(0, contactY, W, 60);
      ctx.fillStyle = WHITE;
      ctx.font = "bold 30px Arial, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(isLost ? "SI LO VES, AVISÁ" : "CONTACTO PARA ADOPCIÓN", W / 2, contactY + 42);
      ctx.fillStyle = BLACK;
      ctx.fillRect(0, contactY + 60, W, 170);
      ctx.fillStyle = WHITE;
      
      let phoneFontSize = 100;
      ctx.font = `900 ${phoneFontSize}px Arial, sans-serif`;
      let phoneText = dog.ownerPhone || "SIN TELÉFONO";
      while (ctx.measureText(phoneText).width > W - 80 && phoneFontSize > 40) {
        phoneFontSize -= 5;
        ctx.font = `900 ${phoneFontSize}px Arial, sans-serif`;
      }
      ctx.fillText(phoneText, W / 2, contactY + 165);
      
      if (dog.ownerName && dog.ownerName !== "—") {
        ctx.font = "bold 30px Arial, sans-serif";
        ctx.fillStyle = "#aaa";
        ctx.fillText("Dueño/a: " + dog.ownerName, W / 2, contactY + 210);
      }
      ctx.fillStyle = accent;
      ctx.fillRect(0, H - 80, W, 80);
      ctx.fillStyle = WHITE;
      ctx.font = "bold 26px Arial, sans-serif";
      ctx.fillText("REGISTRO DE MASCOTAS — CAPILLA DEL SEÑOR", W / 2, H - 30);

      if (previewContainer) {
        previewContainer.innerHTML = "";
        c.style.width = "100%"; c.style.borderRadius = "12px";
        previewContainer.appendChild(c);
        resolve(c);
      } else {
        c.toBlob(async (blob) => {
          if (blob) {
            const filename = `${isLost ? "perdido" : "adopcion"}-${(dog.name || "mascota").toLowerCase().replace(/\s+/g, "-")}.jpg`;
            const file = new File([blob], filename, { type: "image/jpeg" });
            
            if (navigator.canShare && navigator.canShare({ files: [file] })) {
              try {
                await navigator.share({
                  title: isLost ? 'Mascota Perdida' : 'En Adopción',
                  text: isLost ? `¡Ayudanos a encontrar a ${dog.name || 'esta mascota'}!` : `¡${dog.name || 'Esta mascota'} busca un hogar!`,
                  files: [file]
                });
                return resolve();
              } catch (e) {
                console.log("Share canceled or failed", e);
              }
            }
            
            // Fallback to download
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = filename;
            a.click();
            URL.revokeObjectURL(url);
          }
          resolve();
        }, "image/jpeg", 0.95);
      }
    };

    const photoTop = 240, photoH = 660;
    if (dog.photo) {
      const img = new Image();
      if (dog.photo.startsWith("http")) {
        img.crossOrigin = "anonymous";
      }
      img.onload = () => {
        const imgR = img.width / img.height;
        let dw = W, dh = W / imgR;
        if (dh < photoH) { dh = photoH; dw = photoH * imgR; }
        const ox = (W - dw) / 2, oy = photoTop + (photoH - dh) / 2;
        ctx.save();
        ctx.beginPath();
        ctx.rect(0, photoTop, W, photoH);
        ctx.clip();
        ctx.drawImage(img, ox, oy, dw, dh);
        ctx.restore();
        drawContent();
      };
      img.onerror = (err) => { 
        console.error("Error loading image for flyer:", err);
        drawNoPhoto(); 
        drawContent(); 
      };
      img.src = dog.photo;
    } else { drawNoPhoto(); drawContent(); }

    function drawNoPhoto() {
      if (!ctx) return;
      ctx.fillStyle = "#f0f0f0";
      ctx.fillRect(0, photoTop, W, photoH);
      ctx.fillStyle = "#ccc";
      ctx.font = "160px Arial";
      ctx.textAlign = "center";
      ctx.fillText("🐾", W / 2, photoTop + photoH / 2 + 50);
    }
  });
}
