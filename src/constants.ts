// Static constants and themes for NOTG Launcher

export const LOGO_LINES = [
  "███╗   ██╗ ██████╗ ████████╗ ██████╗",
  "████╗  ██║██╔═══██╗╚══██╔══╝██╔════╝",
  "██╔██╗ ██║██║   ██║   ██║   ██║  ███╗",
  "██║╚██╗██║██║   ██║   ██║   ██║   ██║",
  "██║ ╚████║╚██████╔╝   ██║   ╚██████╔╝",
  "╚═╝  ╚═══╝ ╚═════╝    ╚═╝    ╚═════╝",
  "",
  "██╗      █████╗ ██╗   ██╗███╗   ██╗ ██████╗██╗  ██╗███████╗██████╗",
  "██║     ██╔══██╗██║   ██║████╗  ██║██╔════╝██║  ██║██╔════╝██╔══██╗",
  "██║     ███████║██║   ██║██╔██╗ ██║██║     ███████║█████╗  ██████╔╝",
  "██║     ██╔══██║██║   ██║██║╚██╗██║██║     ██╔══██║██╔══╝  ██╔══██╗",
  "███████╗██║  ██║╚██████╔╝██║ ╚████║╚██████╗██║  ██║███████╗██║  ██║",
  "╚══════╝╚═╝  ╚═╝ ╚═════╝ ╚═╝  ╚═══╝ ╚═════╝╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝"
];

export const DESCRIPTION_TEXT = "This is a simple custom Minecraft launcher which makes your game setup easier and has many non essential features for no reason. Enjoy :]";

export type ThemeKey = "cosmic" | "matrix" | "sunset" | "ender" | "ocean";

export interface ThemePreset {
  bgColor: string;
  bgGradient: string;
  bgGradientStyle: string;
  textColor: string;
  accentText: string;
  accentBg: string;
  accentBorder: string;
  shadowGlow: string;
  waveColor: string;
}

export const THEMES: Record<ThemeKey, ThemePreset> = {
  cosmic: {
    bgColor: "bg-[#03050d]",
    bgGradient: "from-[#03050d] via-[#060917] to-[#0a0d22]",
    bgGradientStyle: "linear-gradient(180deg, #03050d 0%, #060917 50%, #0a0d22 100%)",
    textColor: "text-slate-100",
    accentText: "text-indigo-400",
    accentBg: "bg-indigo-500/10",
    accentBorder: "border-indigo-500/30",
    shadowGlow: "shadow-[0_0_50px_rgba(99,102,241,0.15)]",
    waveColor: "rgba(129, 140, 248, 0.45)"
  },
  matrix: {
    bgColor: "bg-[#010402]",
    bgGradient: "from-[#010402] via-[#030905] to-[#06140b]",
    bgGradientStyle: "linear-gradient(180deg, #010402 0%, #030905 50%, #06140b 100%)",
    textColor: "text-emerald-100",
    accentText: "text-emerald-400",
    accentBg: "bg-emerald-500/10",
    accentBorder: "border-emerald-500/30",
    shadowGlow: "shadow-[0_0_50px_rgba(16,185,129,0.15)]",
    waveColor: "rgba(52, 211, 153, 0.45)"
  },
  sunset: {
    bgColor: "bg-[#080301]",
    bgGradient: "from-[#080301] via-[#120703] to-[#240e06]",
    bgGradientStyle: "linear-gradient(180deg, #080301 0%, #120703 50%, #240e06 100%)",
    textColor: "text-amber-100",
    accentText: "text-amber-400",
    accentBg: "bg-amber-500/10",
    accentBorder: "border-amber-500/30",
    shadowGlow: "shadow-[0_0_50px_rgba(245,158,11,0.15)]",
    waveColor: "rgba(251, 191, 36, 0.45)"
  },
  ender: {
    bgColor: "bg-[#040108]",
    bgGradient: "from-[#040108] via-[#090312] to-[#140624]",
    bgGradientStyle: "linear-gradient(180deg, #040108 0%, #090312 50%, #140624 100%)",
    textColor: "text-fuchsia-100",
    accentText: "text-fuchsia-400",
    accentBg: "bg-fuchsia-500/10",
    accentBorder: "border-fuchsia-500/30",
    shadowGlow: "shadow-[0_0_50px_rgba(217,70,239,0.15)]",
    waveColor: "rgba(232, 121, 249, 0.45)"
  },
  ocean: {
    bgColor: "bg-[#010508]",
    bgGradient: "from-[#010508] via-[#030c14] to-[#061828]",
    bgGradientStyle: "linear-gradient(180deg, #010508 0%, #030c14 50%, #061828 100%)",
    textColor: "text-cyan-100",
    accentText: "text-cyan-400",
    accentBg: "bg-cyan-500/10",
    accentBorder: "border-cyan-500/30",
    shadowGlow: "shadow-[0_0_50px_rgba(6,182,212,0.15)]",
    waveColor: "rgba(34, 211, 238, 0.45)"
  }
};

import {
  Palette,
  Users,
  UserCheck,
  Share2,
  Copy,
  Clock,
  SlidersHorizontal,
  Terminal
} from "lucide-react";

export const EXTRA_FEATURES = [
  {
    title: "Launcher Theme Color",
    desc: "Personalize and change the launcher theme color palette to perfectly fit your aesthetics.",
    icon: Palette,
  },
  {
    title: "Multiple Accounts",
    desc: "Log in and manage multiple official Minecraft accounts and swap profiles with one simple click.",
    icon: Users,
  },
  {
    title: "Offline Skins",
    desc: "Upload and use custom offline skins and capes locally without resetting credentials.",
    icon: UserCheck,
  },
  {
    title: "Launcher Importer",
    desc: "Seamlessly copy and sync modpacks, instances, or saves directly from other launchers.",
    icon: Share2,
  },
  {
    title: "Instance Copier",
    desc: "Duplicate specific folders, profiles, or save files from one instance to another instantly.",
    icon: Copy,
  },
  {
    title: "Playtime Tracker",
    desc: "View the total amount of time played, custom session statistics, and game history.",
    icon: Clock,
  },
  {
    title: "RAM Allocator",
    desc: "Easily adjust the minimum and maximum JVM memory constraints for each profile.",
    icon: SlidersHorizontal,
  },
  {
    title: "Custom JVM Args",
    desc: "Add, optimize, and customize JVM launch parameters with our clean inline terminal editor.",
    icon: Terminal,
  }
];
