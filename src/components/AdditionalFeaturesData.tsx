import React from "react";
import { motion } from "motion/react";
import {
  Music,
  Disc,
  ListMusic,
  DownloadCloud,
  Boxes,
  Compass,
  Play,
  Heart,
  Search,
  CheckCircle2,
  Sparkles,
  User,
  Settings,
  ChevronRight
} from "lucide-react";

import musicPlayerImg from "../Music Player.png";
import modBrowserImg from "../Mod Beowser.png";
import modpackMenuImg from "../Modpack Menu.png";
import discordRichPresenceImg from "../Discord Rich Presence.png";

export interface AdditionalFeatureItem {
  title: string;
  subtitle: string;
  desc: string;
  img: string;
  icon: React.ComponentType<any>;
  fallback: React.ReactNode;
}

export const getAdditionalFeatures = (): AdditionalFeatureItem[] => [
  {
    title: "Music Player",
    subtitle: "Built-In Media",
    desc: "The launcher includes a built-in music player that can play music both while you are playing Minecraft and while the launcher is idle. You can add local music files, play YouTube music directly using its link, and even import entire YouTube playlists. You can also create multiple playlists and customize each playlist with its own icon.",
    img: musicPlayerImg,
    icon: Music,
    fallback: (
      <div className="w-full bg-[#0a0c14]/90 backdrop-blur-md rounded-2xl border border-white/10 p-6 shadow-2xl relative overflow-hidden font-sans text-left">
        {/* Glowing ambient background circle */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full bg-amber-500/5 filter blur-3xl pointer-events-none" />

        {/* Player Header */}
        <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-5 relative z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Music className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-white tracking-wide">Media Center</div>
              <div className="text-[10px] text-slate-400 font-mono">Ambient Audio</div>
            </div>
          </div>
          <div className="flex items-center gap-1.5 bg-white/5 rounded-full px-2.5 py-1 border border-white/5">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            <span className="text-[10px] font-semibold text-amber-300">Active</span>
          </div>
        </div>

        {/* Player Content Body */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 relative z-10">
          {/* Sidebar Playlists */}
          <div className="sm:col-span-4 flex flex-col gap-1.5 border-r border-white/5 pr-4">
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">Playlists</span>
            <div className="flex items-center gap-2 p-2 bg-amber-500/10 border border-amber-500/20 rounded-xl text-xs text-amber-300">
              <ListMusic className="w-3.5 h-3.5 text-amber-400" />
              <span className="font-semibold truncate">Lofi Survival</span>
            </div>
            <div className="flex items-center gap-2 p-2 hover:bg-white/5 rounded-xl text-xs text-slate-400 transition-colors">
              <Disc className="w-3.5 h-3.5 text-slate-500" />
              <span className="truncate">Nether Beats</span>
            </div>
            <div className="flex items-center gap-2 p-2 hover:bg-white/5 rounded-xl text-xs text-slate-400 transition-colors">
              <Music className="w-3.5 h-3.5 text-slate-500" />
              <span className="truncate">Saved Tracks</span>
            </div>
          </div>

          {/* Playing Status & Main Controls */}
          <div className="sm:col-span-8 flex flex-col gap-4">
            <div className="bg-white/[0.02] rounded-xl p-3 border border-white/5 flex items-center gap-3">
              <div className="relative w-12 h-12 bg-slate-800 rounded-xl flex items-center justify-center border border-white/10 overflow-hidden shadow-md">
                <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/20 to-indigo-500/20" />
                <Disc className="w-6 h-6 text-amber-400 animate-spin" style={{ animationDuration: "8s" }} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-bold text-white truncate">Sweden (Lofi Remix)</div>
                <div className="text-[10px] text-slate-400 truncate">Minecraft Atmospheric</div>
              </div>
              <button className="text-amber-400 hover:text-amber-300">
                <Heart className="w-4 h-4 fill-amber-400/25" />
              </button>
            </div>

            {/* Custom Interactive Waveforms / Progress */}
            <div className="flex flex-col gap-2">
              <div className="h-6 flex items-end gap-0.5 justify-center opacity-70">
                {[12, 18, 14, 24, 8, 16, 20, 10, 22, 14, 18, 10, 15, 24, 12, 19, 9, 14, 21, 13, 8, 17, 12].map((h, i) => (
                  <motion.div
                    key={i}
                    className="w-1.5 bg-amber-400/70 rounded-t-full"
                    animate={{ height: [h, h * 0.4, h * 1.2, h] }}
                    transition={{ duration: 1.5 + (i % 3) * 0.2, repeat: Infinity, ease: "easeInOut" }}
                  />
                ))}
              </div>
              <div className="relative w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div className="absolute top-0 left-0 w-2/3 h-full bg-amber-400 rounded-full" />
              </div>
              <div className="flex items-center justify-between text-[10px] text-slate-400 font-medium">
                <span>02:14</span>
                <span>03:45</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  },
  {
    title: "Mods & Resource Packs",
    subtitle: "Mod Browser",
    desc: "Browse Modrinth mods and resource packs directly from within the launcher. Mods and resource packs can be installed without leaving the launcher, and all required dependencies are automatically downloaded and installed as well.",
    img: modBrowserImg,
    icon: Boxes,
    fallback: (
      <div className="w-full bg-[#0a0c14]/90 backdrop-blur-md rounded-2xl border border-white/10 p-6 shadow-2xl font-sans text-left relative overflow-hidden">
        {/* Discover Header */}
        <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-5 relative z-10">
          <div>
            <div className="text-xs font-bold text-white tracking-wide">Mod Repository</div>
            <div className="text-[10px] text-slate-400 font-mono mt-0.5">Explore 45,000+ Mods & Shaders</div>
          </div>
          <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full text-[10px] font-semibold flex items-center gap-1">
            <span className="w-1 h-1 bg-emerald-400 rounded-full" />
            <span>Ready</span>
          </div>
        </div>

        {/* Search Input Mock */}
        <div className="flex items-center gap-2.5 bg-white/[0.02] border border-white/10 rounded-xl px-3.5 py-2.5 mb-5 relative z-10">
          <Search className="text-slate-400 w-4 h-4" />
          <span className="text-xs text-white">Sodium</span>
        </div>

        {/* Mod Items list */}
        <div className="flex flex-col gap-3 relative z-10">
          <div className="p-3 bg-white/[0.02] border border-white/5 rounded-xl flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 bg-emerald-500/10 border border-emerald-500/20 rounded-lg flex items-center justify-center font-black text-emerald-400 text-xs">
                Na
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-white">Sodium</span>
                  <span className="text-[9px] bg-white/5 text-slate-400 px-1.5 py-0.5 rounded font-mono">v0.5.8</span>
                </div>
                <p className="text-[11px] text-slate-400 truncate">Slightly improves rendering engine frame rates and eliminates visual stutters.</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-semibold bg-emerald-500/5 px-2.5 py-1 rounded-lg border border-emerald-500/10">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Installed</span>
            </div>
          </div>

          <div className="p-3 bg-white/[0.02] border border-white/5 rounded-xl flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 bg-cyan-500/10 border border-cyan-500/20 rounded-lg flex items-center justify-center font-black text-cyan-400 text-xs">
                Ir
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-white">Iris Shaders</span>
                  <span className="text-[9px] bg-white/5 text-slate-400 px-1.5 py-0.5 rounded font-mono">v1.7.0</span>
                </div>
                <p className="text-[11px] text-slate-400 truncate">Adds beautiful shaders support that easily integrates with Sodium rendering.</p>
              </div>
            </div>
            <button className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-black font-semibold text-xs rounded-lg transition-colors">
              Install Mod
            </button>
          </div>
        </div>
      </div>
    )
  },
  {
    title: "Modpacks",
    subtitle: "Modpack Browser",
    desc: "Browse and install complete Modrinth modpacks directly from the launcher. The launcher automatically downloads, extracts, and creates a fully configured Minecraft instance for the selected modpack, similar to how Prism Launcher handles modpack installations.",
    img: modpackMenuImg,
    icon: DownloadCloud,
    fallback: (
      <div className="w-full bg-[#0a0c14]/90 backdrop-blur-md rounded-2xl border border-white/10 p-6 shadow-2xl font-sans text-left relative overflow-hidden">
        {/* Banner Card */}
        <div className="relative rounded-xl border border-white/10 overflow-hidden mb-5 aspect-[21/9] flex flex-col justify-end p-4">
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10" />
          <div className="absolute inset-0 bg-amber-500/10" />
          <div className="relative z-20 flex flex-col gap-1">
            <span className="text-[9px] bg-amber-500 text-black font-extrabold px-2 py-0.5 rounded self-start tracking-wide uppercase">Featured pack</span>
            <h4 className="text-base font-black text-white tracking-tight">Fabulously Optimized</h4>
            <p className="text-[11px] text-slate-300">Clean Minecraft optimization, smooth graphics, and subtle QoL improvements.</p>
          </div>
        </div>

        {/* List of custom packs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-3 bg-white/[0.02] border border-white/5 rounded-xl flex flex-col gap-2.5">
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wide">Available instances</span>
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between text-xs p-2 hover:bg-white/5 rounded-lg border border-white/5 transition-colors">
                <span className="font-semibold text-slate-200">Better MC 1.20</span>
                <span className="text-[10px] text-slate-400">152 Mods</span>
              </div>
              <div className="flex items-center justify-between text-xs p-2 hover:bg-white/5 rounded-lg border border-white/5 transition-colors">
                <span className="font-semibold text-slate-200">Cobblemon Legacy</span>
                <span className="text-[10px] text-slate-400">74 Mods</span>
              </div>
            </div>
          </div>

          <div className="p-3 bg-amber-500/[0.02] border border-amber-500/10 rounded-xl flex flex-col justify-between">
            <div>
              <span className="text-[9px] font-bold text-amber-400 uppercase tracking-wide">Dynamic Launcher</span>
              <div className="text-xs font-bold text-white mt-1">Sandbox Profile Creation</div>
              <p className="text-[10px] text-slate-400 mt-1 leading-normal">Maps independent instances, downloading only required mods securely.</p>
            </div>
            <button className="w-full mt-3 bg-amber-500 hover:bg-amber-600 text-black font-bold text-xs py-2 rounded-lg shadow transition-colors">
              Discover packs
            </button>
          </div>
        </div>
      </div>
    )
  },
  {
    title: "Discord Rich Presence",
    subtitle: "Just show",
    desc: "The launcher includes its own Discord Rich Presence integration. You can customize what appears on the first and second lines of your Discord status, allow the launcher to automatically display your current Minecraft activity, or disable Rich Presence entirely.",
    img: discordRichPresenceImg,
    icon: Compass,
    fallback: (
      <div className="w-full bg-[#0e0f17]/95 rounded-2xl border border-white/10 p-6 shadow-2xl font-sans text-left relative overflow-hidden">
        <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-5">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Discord Status Preview</span>
          <span className="text-[10px] bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2.5 py-0.5 rounded-full font-semibold">Active Integration</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-12 gap-5">
          {/* Left Panel Discord Card Mock */}
          <div className="sm:col-span-6 bg-[#11121d] rounded-2xl border border-white/10 p-4 relative flex flex-col gap-3">
            <div className="absolute top-0 inset-x-0 h-10 bg-gradient-to-r from-amber-500 to-indigo-500 rounded-t-2xl opacity-80" />
            
            {/* Avatar block */}
            <div className="relative w-12 h-12 rounded-full bg-slate-700 border-4 border-[#11121d] overflow-hidden flex items-center justify-center mt-3 shadow-lg">
              <User className="w-6 h-6 text-slate-300" />
            </div>
            
            <div>
              <div className="text-sm font-extrabold text-white leading-none">Steve</div>
              <div className="text-[10px] text-slate-400 mt-0.5">steve#0001</div>
            </div>

            <hr className="border-white/5" />

            <div className="flex flex-col gap-1.5">
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Playing a Game</span>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center border border-white/10 relative overflow-hidden">
                  <div className="absolute inset-0 bg-amber-500/10" />
                  <Sparkles className="w-5 h-5 text-amber-400 animate-pulse" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-white truncate">Minecraft</div>
                  <div className="text-[10px] text-slate-300 truncate">Exploring the Nether</div>
                  <div className="text-[9px] text-slate-500 font-mono mt-0.5">01:42:05 elapsed</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel Customization form (Simplified and Clean, no terminal style) */}
          <div className="sm:col-span-6 flex flex-col gap-3 justify-center">
            <div className="flex flex-col gap-3">
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wide">Status Settings</span>
              
              <div className="flex flex-col gap-1">
                <label className="text-[9px] text-slate-400 font-medium">Activity Text</label>
                <div className="bg-white/[0.02] border border-white/10 rounded-xl px-3 py-2 text-xs text-white">
                  Exploring the Nether
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[9px] text-slate-400 font-medium">Instance Info</label>
                <div className="bg-white/[0.02] border border-white/10 rounded-xl px-3 py-2 text-xs text-white">
                  Instance: Nether Beats
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
];
