/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Sighting {
  id: string;
  text: string;
  location: string;
  date: string;
}

export interface Dog {
  id: string;
  name: string;
  breed: string;
  color: string;
  size: string;
  sex: string;
  neutered: string;
  ownerName: string;
  ownerPhone: string;
  neighborhood: string;
  notes: string;
  photo: string | null;
  type: "owned" | "stray" | "deleted";
  adoptionStatus?: "transit" | "shelter" | "urgent" | "";
  lostSince?: string | null;
  lastSeenLocation?: string | null;
  sightings: Sighting[];
  createdAt: string;
  userId?: string;
  hasCollar?: string;
  collarColor?: string;
  _score?: number;
  _checks?: number;
  confidence?: "alta" | "media" | "baja";
  reason?: string;
}

export interface User {
  id: string;
  ownerName: string;
  ownerPhone: string;
}

export interface Theme {
  bg: string;
  card: string;
  accent: string;
  accentLt: string;
  accentDk: string;
  txt: string;
  muted: string;
  border: string;
  borderLt: string;
  ok: string;
  okLt: string;
  danger: string;
  dangerLt: string;
  blue: string;
  blueLt: string;
  blueDk: string;
  purple: string;
  purpleLt: string;
  navy: string;
  navyLt: string;
  shadow: string;
  shadowLg: string;
  headerBg: string;
  inputBg: string;
  inputBorder: string;
}
