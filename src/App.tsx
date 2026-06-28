import React, { useState, useEffect, useRef } from "react";
import {
  Download,
  HelpCircle,
  ArrowDown,
  Cpu,
  Layers,
  Zap,
  Check,
  Shield,
  Sliders,
  Sparkles,
  FolderOpen,
  ChevronRight,
  Activity,
  Palette
} from "lucide-react";
import { motion } from "motion/react";

// Import local constants and settings
import {
  LOGO_LINES,
  DESCRIPTION_TEXT,
  THEMES,
  ThemeKey,
  EXTRA_FEATURES
} from "./constants";

// Import local components and datasets
import { Typewriter } from "./components/Typewriter";
import { SafeFeatureImage } from "./components/SafeFeatureImage";
import { getAdditionalFeatures } from "./components/AdditionalFeaturesData";

// Import images
import homePageImg from "./Home Page.png";
import customizeEverythingImg from "./Customize Everything.png";
import manageEverythingImg from "./Manage Everything.png";
import manageInstanceImg from "./Manage instance.png";
import launcherLogoImg from "./NOTG-Launcher Logo.png";

export default function App() {
  // Intro animation phase: 'typing' -> 'transitioning' -> 'settled' -> 'hidden'
  const [introPhase, setIntroPhase] = useState<"typing" | "transitioning" | "settled" | "hidden">("typing");

  // Derived states from introPhase
  const isTypingLogo = introPhase === "typing";
  const isFinished = introPhase === "transitioning" || introPhase === "settled" || introPhase === "hidden";
  const isLogoSettled = introPhase === "settled" || introPhase === "hidden";

  // Typed logo lines accumulator
  const [typedLogoLines, setTypedLogoLines] = useState<string[]>([]);

  // Section Headings complete trigger states for cascading content animations
  const [coreFeaturesHeaderLoaded, setCoreFeaturesHeaderLoaded] = useState(false);
  const [additionalFeaturesHeaderLoaded, setAdditionalFeaturesHeaderLoaded] = useState(false);
  const [manyMoreFeaturesHeaderLoaded, setManyMoreFeaturesHeaderLoaded] = useState(false);
  const [performanceHeaderLoaded, setPerformanceHeaderLoaded] = useState(false);

  // Active theme based on scroll positioning
  const [currentTheme, setCurrentTheme] = useState<ThemeKey>("cosmic");
  const [scrollPercent, setScrollPercent] = useState(0);

  // Interactive Download States
  const [downloadState, setDownloadState] = useState<"idle" | "downloading" | "completed">("idle");
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [brailleIdx, setBrailleIdx] = useState(0);

  // Redesigned Additional Features selector states
  const [activeFeatureIdx, setActiveFeatureIdx] = useState(0);
  const [hoveredCardIdx, setHoveredCardIdx] = useState<number | null>(null);
  const additionalFeatures = getAdditionalFeatures();

  // References
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const additionalSectionRef = useRef<HTMLElement>(null);

  // Scroll-triggered heading animation using IntersectionObserver
  const [featuresHeadingEnabled, setFeaturesHeadingEnabled] = useState(false);
  const [additionalHeadingEnabled, setAdditionalHeadingEnabled] = useState(false);
  const [manyMoreHeadingEnabled, setManyMoreHeadingEnabled] = useState(false);
  const [performanceHeadingEnabled, setPerformanceHeadingEnabled] = useState(false);
  const headingTriggers = useRef([false, false, false, false]);

  useEffect(() => {
    if (!isFinished) return;

    const observers: IntersectionObserver[] = [];
    const sectionIds = ["features-section", "additional-features-section", "many-more-section", "performance-section"];
    const headingSetters = [setFeaturesHeadingEnabled, setAdditionalHeadingEnabled, setManyMoreHeadingEnabled, setPerformanceHeadingEnabled];

    sectionIds.forEach((id, idx) => {
      const el = document.getElementById(id);
      if (!el) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting && !headingTriggers.current[idx]) {
            headingTriggers.current[idx] = true;
            headingSetters[idx](true);
            observer.disconnect();
          }
        },
        { threshold: 0.15, rootMargin: "0px 0px -50px 0px" }
      );
      observer.observe(el);
      observers.push(observer);
    });

    return () => observers.forEach(o => o.disconnect());
  }, [isFinished]);

  // Additional features rotator - uses IntersectionObserver directly
  const [isAdditionalSectionInView, setIsAdditionalSectionInView] = useState(false);

  useEffect(() => {
    const el = additionalSectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsAdditionalSectionInView(entry.isIntersecting),
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const [showNavbar, setShowNavbar] = useState(false);

  // Refs for particle animation (no re-renders needed)
  const isFinishedRef = useRef(isFinished);
  const isTypingLogoRef = useRef(isTypingLogo);
  const currentThemeRef = useRef(currentTheme);
  const particlesRef = useRef<{ x: number; y: number; offset: number; speed: number; char: string; scale: number }[]>([]);

  useEffect(() => {
    isFinishedRef.current = isFinished;
  }, [isFinished]);

  useEffect(() => {
    isTypingLogoRef.current = isTypingLogo;
  }, [isTypingLogo]);

  useEffect(() => {
    currentThemeRef.current = currentTheme;
  }, [currentTheme]);

  // SVG path for logo scale animation — starts big, shrinks to normal
  const logoScale = isTypingLogo ? 2.2 : 1;

  // Rotator timer for additional features (pauses on exact hovered card, only works when section is in viewport)
  useEffect(() => {
    if (!isAdditionalSectionInView) return;

    const rotatorTimer = setInterval(() => {
      if (hoveredCardIdx === null) {
        setActiveFeatureIdx((prev: number) => (prev + 1) % additionalFeatures.length);
      }
    }, 5000); // rotate showcase every 5s if not hovering over a card

    return () => clearInterval(rotatorTimer);
  }, [hoveredCardIdx, isAdditionalSectionInView, additionalFeatures.length]);

  // Interval for Braille animation during downloading state
  useEffect(() => {
    if (downloadState !== "downloading") return;
    const interval = setInterval(() => {
      setBrailleIdx((prev: number) => (prev + 1) % 10);
    }, 80);
    return () => clearInterval(interval);
  }, [downloadState]);

  const brailleFrames = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"];
  const brailleChar = brailleFrames[brailleIdx];

  // Skip animation trigger
  const handleSkipAnimation = () => {
    setTypedLogoLines(LOGO_LINES);
    setIntroPhase("settled");
    setShowNavbar(true);
  };

  // Interactive Launcher Download Handler
  const triggerDownload = () => {
    if (downloadState !== "idle") return;

    // Trigger actual download of latest launcher setup executable immediately
    const link = document.createElement("a");
    link.href = "https://github.com/EPICmaster-2149/NOTG-Launcher/releases/latest/download/NOTG.Launcher.Setup.exe";
    link.setAttribute("download", "NOTG.Launcher.Setup.exe");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Set downloading state which animates Braille for exactly 3 seconds
    setDownloadState("downloading");

    setTimeout(() => {
      setDownloadState("idle");
    }, 3000);
  };

  // 1. Scroll percentage & Theme transition tracker
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? scrollY / docHeight : 0;
      setScrollPercent(progress);

      const featuresEl = document.getElementById("features-section");
      const additionalEl = document.getElementById("additional-features-section");
      const manyMoreEl = document.getElementById("many-more-section");
      const customizationEl = document.getElementById("customization-section");
      const performanceEl = document.getElementById("performance-section");

      if (featuresEl) {
        const triggerThreshold = window.innerHeight * 0.85;

        if (performanceEl && performanceEl.getBoundingClientRect().top <= triggerThreshold && manyMoreFeaturesHeaderLoaded) {
          setCurrentTheme("ocean");
        } else if (customizationEl && customizationEl.getBoundingClientRect().top <= triggerThreshold && additionalFeaturesHeaderLoaded) {
          setCurrentTheme("ender");
        } else if (manyMoreEl && manyMoreEl.getBoundingClientRect().top <= triggerThreshold && additionalFeaturesHeaderLoaded) {
          setCurrentTheme("ender");
        } else if (additionalEl && additionalEl.getBoundingClientRect().top <= triggerThreshold && coreFeaturesHeaderLoaded) {
          setCurrentTheme("sunset");
        } else if (featuresEl.getBoundingClientRect().top <= triggerThreshold) {
          setCurrentTheme("matrix");
        } else {
          setCurrentTheme("cosmic");
        }
      } else {
        if (progress < 0.2) {
          setCurrentTheme("cosmic");
        } else if (progress >= 0.2 && progress < 0.4) {
          setCurrentTheme("matrix");
        } else if (progress >= 0.4 && progress < 0.6) {
          setCurrentTheme("sunset");
        } else if (progress >= 0.6 && progress < 0.8) {
          setCurrentTheme("ender");
        } else {
          setCurrentTheme("ocean");
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [coreFeaturesHeaderLoaded, additionalFeaturesHeaderLoaded, manyMoreFeaturesHeaderLoaded]);

  // 2. High-Performance, lightweight floating particles wave
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (canvas) {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
      }
    };
    window.addEventListener("resize", handleResize);

    const chars = ["▲", "◆", "■", "░", "▒", "▓", "+", "%", "#", "<", ">", "{", "}"];
    
    if (particlesRef.current.length === 0) {
      const rowsCount = 7;
      const colsCount = 12;
      for (let r = 0; r < rowsCount; r++) {
        const rowY = (height / rowsCount) * r + Math.random() * 20;
        for (let c = 0; c < colsCount; c++) {
          particlesRef.current.push({
            x: (width / colsCount) * c + Math.random() * 30,
            y: rowY,
            offset: Math.random() * Math.PI * 2,
            speed: 0.0003 + Math.random() * 0.0004,
            char: chars[Math.floor(Math.random() * chars.length)],
            scale: 0.95 + Math.random() * 0.55
          });
        }
      }
    }

    let t = 0;
    let introIntensity = 1.0;

    const renderWaves = () => {
      if (!isFinishedRef.current) {
        introIntensity = 1.0;
      } else if (introIntensity > 0) {
        introIntensity -= 0.012;
        if (introIntensity < 0) introIntensity = 0;
      }

      const speedMultiplier = 1.0 + 3.0 * introIntensity;
      t += 1 * speedMultiplier;
      
      ctx.clearRect(0, 0, width, height);

      const activeTheme = currentThemeRef.current;
      ctx.font = "14px monospace";
      
      const particleColors: Record<string, string> = {
        cosmic: "#818cf8",
        matrix: "#34d399",
        sunset: "#fbbf24",
        ender: "#e879f9",
        ocean: "#22d3ee"
      };
      ctx.fillStyle = particleColors[activeTheme] || "#818cf8";
      ctx.shadowBlur = 0;

      particlesRef.current.forEach((p: { x: number; y: number; offset: number; speed: number; char: string; scale: number }) => {
        const particleSpeed = p.speed * 160 + 0.04;
        const driftX = t * particleSpeed;
        
        let currentX = (p.x - driftX) % (width + 120);
        if (currentX < -60) {
          currentX = (currentX + (width + 120)) % (width + 120);
        }

        const verticalDrift = Math.sin(t * p.speed + p.offset) * 20;
        const currentY = p.y + verticalDrift + Math.cos((currentX + t) * 0.005) * 8;

        const edgeAlpha = Math.min(currentX / 100, (width - currentX) / 100, currentY / 100, (height - currentY) / 100);
        const stdAlpha = Math.max(0.08, Math.min(0.24, edgeAlpha)) * p.scale * 0.45;
        const introAlpha = Math.min(0.7, edgeAlpha * 4.0) * p.scale * 0.9;
        const baseAlpha = stdAlpha * (1 - introIntensity) + introAlpha * introIntensity;
        const scaleMultiplier = 1.0 + 0.6 * introIntensity;

        ctx.save();
        ctx.translate(currentX, currentY);
        ctx.scale(p.scale * scaleMultiplier, p.scale * scaleMultiplier);
        ctx.globalAlpha = baseAlpha;
        ctx.fillText(p.char, 0, 0);
        ctx.restore();
      });

      animId = requestAnimationFrame(renderWaves);
    };

    renderWaves();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // 3. Sequential Typewriter Intro Controller
  useEffect(() => {
    if (!isTypingLogo) return;

    let lineIndex = 0;
    let charIndex = 0;
    let currentLineBuffer = "";
    
    setTypedLogoLines(LOGO_LINES.map(() => ""));

    const typeTimer = setInterval(() => {
      if (lineIndex < LOGO_LINES.length) {
        const fullLine = LOGO_LINES[lineIndex];
        const charsToType = Math.min(3, fullLine.length - charIndex);
        if (charsToType > 0) {
          currentLineBuffer += fullLine.substring(charIndex, charIndex + charsToType);
          setTypedLogoLines((prev: string[]) => {
            const copy = [...prev];
            copy[lineIndex] = currentLineBuffer;
            return copy;
          });
          charIndex += charsToType;
        } else {
          lineIndex++;
          charIndex = 0;
          currentLineBuffer = "";
        }
      } else {
        clearInterval(typeTimer);
        
        // Typing done → transition to shrink to place
        setTimeout(() => {
          setTypedLogoLines(LOGO_LINES);
          setIntroPhase("transitioning");
          
          setTimeout(() => {
            setShowNavbar(true);
          }, 700);

          setTimeout(() => {
            setIntroPhase("settled");
          }, 1500);
        }, 500);
      }
    }, 10);

    return () => clearInterval(typeTimer);
  }, [isTypingLogo]);

  // Prevent scrolling during starting intro animation
  useEffect(() => {
    if (introPhase === "typing") {
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    };
  }, [introPhase]);

  const logoProgressPercent = isFinished
    ? 100
    : Math.round((typedLogoLines.filter((line: string) => line.trim().length > 0).length / LOGO_LINES.length) * 100) || 0;

  return (
    <div
      id="root-container"
      style={{ background: THEMES[currentTheme].bgGradientStyle }}
      className={`relative min-h-screen transition-all duration-1000 ease-in-out select-none overflow-x-hidden ${THEMES[currentTheme].textColor}`}
    >
      {/* Wave Symbol Background Canvas */}
      <canvas ref={canvasRef} className="fixed inset-0 w-full h-full pointer-events-none z-0 animate-[pulse_10s_ease-in-out_infinite]" />

      {/* Cinematic Centered Intro Overlay — only visible during typing */}
      {introPhase === "typing" && (
        <div className="fixed inset-0 z-30 bg-[#03050d]/80 backdrop-blur-md">
          {/* Pulsing Ambient Glow */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
            <motion.div 
              animate={{
                scale: [0.9, 1.15, 0.9],
                opacity: [0.4, 0.65, 0.4],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="w-[85vw] h-[85vw] max-w-[600px] max-h-[600px] rounded-full bg-gradient-to-tr from-indigo-500/25 via-purple-500/20 to-pink-500/10 filter blur-[90px]"
            />
          </div>

          {/* Skip Intro Button */}
          <div className="absolute bottom-16 left-0 right-0 z-50 flex items-center justify-center py-4 px-6 pointer-events-auto">
            <motion.button
              id="fast-skip-trigger"
              onClick={handleSkipAnimation}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="text-[10px] font-display tracking-widest uppercase text-slate-300 hover:text-white transition-all bg-white/5 border border-white/10 hover:border-white/20 px-5 py-2.5 rounded-xl cursor-pointer hover:scale-105 active:scale-95 flex items-center gap-1.5 backdrop-blur-sm"
            >
              <span>Skip Intro</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </motion.button>
          </div>
        </div>
      )}

      {/* Overlay fade-out transition */}
      {introPhase === "transitioning" && (
        <div className="fixed inset-0 z-30 transition-all duration-[1500ms] ease-[cubic-bezier(0.16,1,0.3,1)] opacity-0 pointer-events-none scale-95 blur-md bg-[#03050d]/80" />
      )}

      {/* Modern Top Dropdown Header */}
      <header
        id="navbar-header"
        className={`fixed top-0 left-0 right-0 z-40 h-20 border-b border-white/10 transition-all duration-700 ease-out backdrop-blur-lg flex items-center justify-between px-4 sm:px-6 md:px-12 bg-black/60 shadow-xl shadow-black/40 ${
          showNavbar ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
        }`}
      >
        <div className="flex items-center">
          <span className="font-display font-extrabold text-xl sm:text-2xl md:text-[2.1rem] tracking-tight text-white select-none whitespace-nowrap leading-none">
            NOTG Launcher
          </span>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          <button
            id="download-btn-header"
            onClick={triggerDownload}
            disabled={downloadState !== "idle"}
            className={`px-3 py-2 sm:px-5 sm:py-2.5 rounded-xl font-display font-bold text-xs tracking-wide transition-all flex items-center gap-1.5 sm:gap-2 cursor-pointer shadow-lg active:scale-95 ${
              downloadState === "downloading"
                ? "bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 pointer-events-none"
                : "bg-white text-slate-950 hover:bg-slate-100 border border-white/25 shadow-[0_4px_20px_rgba(255,255,255,0.1)] hover:shadow-[0_4px_25px_rgba(255,255,255,0.2)]"
            }`}
          >
            {downloadState === "downloading" ? (
              <>
                <span className="font-mono text-indigo-400 text-sm">{brailleChar}</span>
                <span className="hidden xs:inline">Downloading...</span>
                <span className="xs:hidden">...</span>
              </>
            ) : (
              <>
                <Download className="w-3.5 h-3.5 text-slate-950" />
                <span className="hidden xs:inline">Download</span>
              </>
            )}
          </button>
          
          <button
            id="help-btn-header"
            onClick={() => {
              const target = document.getElementById("performance-section");
              if (target) target.scrollIntoView({ behavior: "smooth" });
            }}
            className="px-2.5 py-2 sm:px-4 sm:py-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 text-slate-300 hover:text-white font-display text-xs font-semibold tracking-wide transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
          >
            <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden sm:inline">Help</span>
          </button>
        </div>
      </header>

      {/* MAIN CONTAINER LAYER */}
      <main className={`relative ${isFinished ? "z-10" : "z-50 pointer-events-none"} w-full max-w-[1500px] mx-auto px-4 sm:px-6 md:px-12 xl:px-16 flex flex-col pt-24 sm:pt-28 md:pt-32 gap-12 md:gap-16`}>
        
        {/* HERO AREA SECTION */}
        <section
          id="hero-section"
          className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center min-h-0 lg:min-h-[85vh] py-8 w-full"
        >
          {/* Left Column: Logo & Info */}
          <div className="lg:col-span-5 flex flex-col gap-6 justify-center">
            
            {/* Logo - TWO SEPARATE elements, no layout, no sliding during typing */}
            {introPhase === "typing" ? (
              <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none overflow-hidden">
                <pre
                  style={{
                    fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
                    fontWeight: 900,
                    letterSpacing: "-0.05em",
                    lineHeight: "0.82",
                    textShadow: "0 0 0.2px currentColor",
                    transform: "scale(1.6)",
                    transformOrigin: "center center",
                  }}
                  className="text-left text-[5.5px] min-[380px]:text-[6.5px] min-[480px]:text-[8px] sm:text-[10px] md:text-xs select-none overflow-x-visible whitespace-pre text-white leading-[0.82]"
                >
                  {typedLogoLines.join("\n")}
                </pre>
              </div>
            ) : (
              <div className="relative overflow-visible min-h-[120px] sm:min-h-[160px] md:min-h-[180px] flex items-center justify-center lg:justify-start w-full max-w-full lg:mx-0">
                <motion.pre
                  initial={{ scale: 2.2, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{
                    type: "spring",
                    stiffness: 120,
                    damping: 20,
                    mass: 1,
                  }}
                  style={{
                    fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
                    fontWeight: 900,
                    letterSpacing: "-0.05em",
                    lineHeight: "0.82",
                    textShadow: "0 0 0.2px currentColor",
                    transformOrigin: "center center",
                  }}
                  className={`text-left text-[5px] min-[380px]:text-[6.5px] min-[480px]:text-[8px] sm:text-[10px] md:text-xs select-none overflow-x-auto whitespace-pre text-white w-fit mx-auto lg:mx-0 scrollbar-none ${
                    isLogoSettled ? "animate-logo-float" : ""
                  }`}
                >
                  {LOGO_LINES.join("\n")}
                </motion.pre>
              </div>
            )}

            {/* Launcher description container — fades in after logo settles */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={isFinished ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
              className="relative"
            >
              <p className="text-slate-300 font-sans leading-relaxed text-sm md:text-base border-l-2 border-white/15 pl-4 py-1 italic max-w-lg">
                {DESCRIPTION_TEXT}
              </p>
            </motion.div>

            {/* Action Indicators */}
            <div
              className={`flex flex-wrap items-center gap-4 transition-all duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] delay-[600ms] ${
                isFinished ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-8 scale-95 pointer-events-none"
              }`}
            >
              <button
                id="main-download-button"
                onClick={triggerDownload}
                disabled={downloadState !== "idle"}
                className={`px-8 py-4 rounded-2xl font-display font-bold text-sm tracking-wide transition-all shadow-xl active:scale-95 flex items-center gap-3 cursor-pointer ${
                  downloadState === "downloading"
                    ? "bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 pointer-events-none"
                    : "bg-white hover:bg-slate-100 text-slate-950 shadow-[0_10px_30px_rgba(255,255,255,0.1)] hover:shadow-[0_15px_35px_rgba(255,255,255,0.15)] transform hover:-translate-y-0.5"
                }`}
              >
                {downloadState === "downloading" ? (
                  <>
                    <span className="font-mono text-indigo-400 text-lg">{brailleChar}</span>
                    <span>Downloading...</span>
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4 text-slate-950" />
                    <span>Download NOTG Launcher</span>
                  </>
                )}
              </button>

              <button
                id="hero-scroll-btn"
                onClick={() => {
                  setCurrentTheme("matrix");
                  document.getElementById("features-section")?.scrollIntoView({ behavior: "smooth" });
                }}
                className="px-5 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 text-xs font-mono tracking-wider text-slate-300 hover:text-white flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <span>Scroll to explore</span>
                <ArrowDown className="w-3.5 h-3.5 animate-bounce" />
              </button>
            </div>
          </div>

          {/* Right Column: Actual uploaded screenshot (Home Page.png) */}
          <div className="lg:col-span-7 flex items-center justify-center w-full">
            <div
              className={`relative w-full rounded-2xl overflow-hidden border border-white/10 bg-slate-950/80 p-1.5 transition-all duration-[1500ms] ease-[cubic-bezier(0.16,1,0.3,1)] delay-[300ms] ${THEMES[currentTheme].shadowGlow} ${
                isFinished ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 translate-y-12 pointer-events-none"
              }`}
            >
              <div className="relative rounded-xl overflow-hidden aspect-video w-full flex items-stretch">
                <SafeFeatureImage
                  src={homePageImg}
                  alt="NOTG Minecraft Launcher Dashboard"
                  className="w-full h-full object-cover rounded-lg shadow-2xl hover:scale-[1.015] transition-transform duration-700"
                  fallbackUI={
                    <div className="w-full h-full bg-slate-950/90 rounded-lg p-6 flex flex-col justify-between font-mono text-xs text-slate-300 relative overflow-hidden group min-h-[220px] sm:min-h-[280px]">
                      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />
                      
                      <div className="flex items-center justify-between border-b border-white/5 pb-3">
                        <div className="flex items-center gap-1.5">
                          <div className="w-2 h-2 rounded-full bg-red-500/60" />
                          <div className="w-2 h-2 rounded-full bg-yellow-500/60" />
                          <div className="w-2 h-2 rounded-full bg-green-500/60" />
                          <span className="text-[9px] text-slate-500 ml-1.5">NOTG-LAUNCHER // v1.4</span>
                        </div>
                        <span className="text-[9px] text-slate-400">Offline Profile</span>
                      </div>

                      <div className="grid grid-cols-12 gap-3 my-3 flex-grow">
                        <div className="col-span-3 border-r border-white/5 pr-1.5 flex flex-col gap-1 text-[9px] text-slate-400">
                          <div className="p-1.5 rounded bg-white/5 text-white font-bold flex items-center gap-1.5"><Layers className="w-3 h-3" /> Profiles</div>
                          <div className="p-1.5 rounded hover:bg-white/5 flex items-center gap-1.5 transition-all"><Cpu className="w-3 h-3" /> Hardware</div>
                          <div className="p-1.5 rounded hover:bg-white/5 flex items-center gap-1.5 transition-all"><FolderOpen className="w-3 h-3" /> Directories</div>
                        </div>

                        <div className="col-span-9 flex flex-col justify-between pl-1.5">
                          <div>
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] uppercase tracking-wider text-white font-bold">Active Instance</span>
                              <span className="text-[9px] text-indigo-400 font-bold border border-indigo-400/20 bg-indigo-500/5 px-1.5 py-0.5 rounded">Fabric 1.20</span>
                            </div>
                            <div className="mt-1.5 p-2 rounded-lg bg-black/40 border border-white/5 flex items-center justify-between">
                              <div>
                                <h4 className="text-white text-[11px] font-bold font-sans">Cobblemon Pack</h4>
                                <p className="text-[9px] text-slate-500 mt-0.5">38 mods installed</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="border-t border-white/5 pt-2.5 flex items-center justify-end">
                        <button className="px-3.5 py-1.5 rounded-lg bg-indigo-500 text-white font-sans font-black text-[10px] tracking-wider flex items-center gap-1 shadow-lg">
                          <span>PLAY GAME</span>
                          <Zap className="w-3 h-3 fill-current" />
                        </button>
                      </div>
                    </div>
                  }
                />
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 2: Core Launcher Features Section */}
        <section
          id="features-section"
          className="flex flex-col justify-center py-12 sm:py-16 relative scroll-mt-24 max-w-7xl mx-auto w-full px-4 md:px-8 border-t border-white/5"
        >
          {/* Top Divider */}
          <div className="w-full flex items-center justify-center gap-4 mb-8 sm:mb-12">
            <div className="h-[1px] flex-grow bg-gradient-to-r from-transparent via-white/10 to-white/10" />
            <div className={`px-4 py-1.5 rounded-full text-[10px] font-mono tracking-widest uppercase ${coreFeaturesHeaderLoaded ? `${THEMES[currentTheme].accentBg} ${THEMES[currentTheme].accentText} border ${THEMES[currentTheme].accentBorder}` : "bg-white/5 text-slate-500 border border-white/10"} flex items-center gap-2 backdrop-blur-sm shadow-sm`}>
              <Layers className="w-3.5 h-3.5" />
              <span>01 / CORE SYSTEMS</span>
            </div>
            <div className="h-[1px] flex-grow bg-gradient-to-l from-transparent via-white/10 to-white/10" />
          </div>

          {/* Section Header */}
          <div className="flex flex-col gap-4 mb-8 sm:mb-12 text-center">
            <h2 className="font-sans font-black text-4xl sm:text-6xl text-white tracking-tight leading-none">
              <Typewriter text="Launcher features" speed={14} enabled={featuresHeadingEnabled} onComplete={() => setCoreFeaturesHeaderLoaded(true)} />
            </h2>
          </div>

          {/* Features Column Stacks */}
          {coreFeaturesHeaderLoaded && (
            <motion.div 
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.25,
                    delayChildren: 0.2
                  }
                }
              }}
              className="flex flex-col gap-20 md:gap-36"
            >
              
              {/* FEATURE 1: Manage many instances easily */}
              <motion.div 
                variants={{
                  hidden: { opacity: 0, y: 60, scale: 0.93, rotateX: 5 },
                  visible: { 
                    opacity: 1, 
                    y: 0, 
                    scale: 1, 
                    rotateX: 0,
                    transition: { 
                      type: "spring",
                      stiffness: 80,
                      damping: 15,
                      mass: 0.8
                    } 
                  }
                }}
                className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-16 items-center"
              >
                <div className="md:col-span-5 flex flex-col gap-4">
                  <span className={`text-xs font-mono font-bold uppercase tracking-wider ${THEMES[currentTheme].accentText}`}>
                    Instance Manager
                  </span>
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg ${THEMES[currentTheme].accentBg} border ${THEMES[currentTheme].accentBorder} flex items-center justify-center font-mono font-bold ${THEMES[currentTheme].accentText} text-xs`}>
                      01
                    </div>
                    <h3 className="font-sans font-black text-2xl sm:text-3xl text-white tracking-tight">
                      Manage many instances easily
                    </h3>
                  </div>
                  <div className="border-l border-white/10 pl-4 py-1 mt-2">
                    <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
                      You can create as many individual Minecraft game files as you want, and each instance has its own separate files. Every instance can be launched independently, with its own mods, settings, saves, and configurations. You never have to keep changing everything whenever you want to play on a different server or setup.
                    </p>
                  </div>
                </div>
                <div className="md:col-span-7 flex justify-center">
                  <div className="relative w-full max-w-2xl">
                    <SafeFeatureImage
                      src={manageInstanceImg}
                      alt="Manage instance screen"
                      className="w-full h-auto max-h-[440px] object-contain rounded-2xl border border-white/10 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.85)]"
                      fallbackUI={
                        <div className="w-full aspect-[16/10] flex flex-col items-center justify-center p-6 text-center bg-slate-900/40 rounded-2xl border border-white/10 shadow-2xl">
                          <Cpu className="w-12 h-12 text-slate-500 mb-2" />
                          <span className="text-sm text-slate-300 font-mono">Manage Instances</span>
                          <span className="text-xs text-slate-500 font-mono mt-1">[ Manage instance.png ]</span>
                        </div>
                      }
                    />
                  </div>
                </div>
              </motion.div>

              {/* FEATURE 2: Customize everything */}
              <motion.div 
                variants={{
                  hidden: { opacity: 0, y: 60, scale: 0.93, rotateX: 5 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    rotateX: 0,
                    transition: {
                      type: "spring",
                      stiffness: 80,
                      damping: 15,
                      mass: 0.8
                    }
                  }
                }}
                className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-16 items-center"
              >
                <div className="md:col-span-5 md:order-2 flex flex-col gap-4">
                  <span className={`text-xs font-mono font-bold uppercase tracking-wider ${THEMES[currentTheme].accentText}`}>
                    Theme Editor
                  </span>
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg ${THEMES[currentTheme].accentBg} border ${THEMES[currentTheme].accentBorder} flex items-center justify-center font-mono font-bold ${THEMES[currentTheme].accentText} text-xs`}>
                      02
                    </div>
                    <h3 className="font-sans font-black text-2xl sm:text-3xl text-white tracking-tight">
                      Customize everything
                    </h3>
                  </div>
                  <div className="border-l border-white/10 pl-4 py-1 mt-2">
                    <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
                      This is your launcher, and you can customize almost everything. Personalize the theme colours, backgrounds, icons, and many other parts of the launcher to make it look and feel exactly how you want.
                    </p>
                  </div>
                </div>
                <div className="md:col-span-7 md:order-1 flex justify-center">
                  <div className="relative w-full max-w-2xl">
                    <SafeFeatureImage
                      src={customizeEverythingImg}
                      alt="Customize everything theme editor"
                      className="w-full h-auto max-h-[440px] object-contain rounded-2xl border border-white/10 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.85)]"
                      fallbackUI={
                        <div className="w-full aspect-[16/10] flex flex-col items-center justify-center p-6 text-center bg-slate-900/40 rounded-2xl border border-white/10 shadow-2xl">
                          <Palette className="w-12 h-12 text-slate-500 mb-2" />
                          <span className="text-sm text-slate-300 font-mono">Customize Everything</span>
                          <span className="text-xs text-slate-500 font-mono mt-1">[ Customize Everything.png ]</span>
                        </div>
                      }
                    />
                  </div>
                </div>
              </motion.div>

              {/* FEATURE 3: Manage your Minecraft files */}
              <motion.div 
                variants={{
                  hidden: { opacity: 0, y: 60, scale: 0.93, rotateX: 5 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    rotateX: 0,
                    transition: {
                      type: "spring",
                      stiffness: 80,
                      damping: 15,
                      mass: 0.8
                    }
                  }
                }}
                className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-16 items-center"
              >
                <div className="md:col-span-5 flex flex-col gap-4">
                  <span className={`text-xs font-mono font-bold uppercase tracking-wider ${THEMES[currentTheme].accentText}`}>
                    Instance Edit Menu
                  </span>
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg ${THEMES[currentTheme].accentBg} border ${THEMES[currentTheme].accentBorder} flex items-center justify-center font-mono font-bold ${THEMES[currentTheme].accentText} text-xs`}>
                      03
                    </div>
                    <h3 className="font-sans font-black text-2xl sm:text-3xl text-white tracking-tight">
                      Manage your Minecraft files
                    </h3>
                  </div>
                  <div className="border-l border-white/10 pl-4 py-1 mt-2">
                    <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
                      Easily manage all of your Minecraft files from one place, including screenshots, mods, logs, versions, resource packs, shader packs, and other important game files through a clean and organized interface.
                    </p>
                  </div>
                </div>
                <div className="md:col-span-7 flex justify-center">
                  <div className="relative w-full max-w-2xl">
                    <SafeFeatureImage
                      src={manageEverythingImg}
                      alt="Manage your Minecraft files folder"
                      className="w-full h-auto max-h-[440px] object-contain rounded-2xl border border-white/10 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.85)]"
                      fallbackUI={
                        <div className="w-full aspect-[16/10] flex flex-col items-center justify-center p-6 text-center bg-slate-900/40 rounded-2xl border border-white/10 shadow-2xl">
                          <FolderOpen className="w-12 h-12 text-slate-500 mb-2" />
                          <span className="text-sm text-slate-300 font-mono">Manage Minecraft Files</span>
                          <span className="text-xs text-slate-500 font-mono mt-1">[ Manage Everything.png ]</span>
                        </div>
                      }
                    />
                  </div>
                </div>
              </motion.div>

            </motion.div>
          )}
        </section>

        {/* ADDITIONAL FEATURES SECTION */}
        <section
          id="additional-features-section"
          ref={additionalSectionRef}
          className={`flex flex-col justify-center py-12 sm:py-16 relative scroll-mt-24 max-w-7xl mx-auto w-full px-4 md:px-8 border-t border-white/5 transition-all duration-[800ms] ${
            coreFeaturesHeaderLoaded
              ? "opacity-100 visible"
              : "opacity-0 invisible pointer-events-none"
          }`}
        >
          {/* Top Divider */}
          <div className="w-full flex items-center justify-center gap-4 mb-8 sm:mb-12">
            <div className="h-[1px] flex-grow bg-gradient-to-r from-transparent via-white/10 to-white/10" />
            <div className={`px-4 py-1.5 rounded-full text-[10px] font-mono tracking-widest uppercase ${coreFeaturesHeaderLoaded ? `${THEMES[currentTheme].accentBg} ${THEMES[currentTheme].accentText} border ${THEMES[currentTheme].accentBorder}` : "bg-white/5 text-slate-500 border border-white/10"} flex items-center gap-2 backdrop-blur-sm shadow-sm`}>
              <Sparkles className="w-3.5 h-3.5" />
              <span>02 / EXTENDED SYSTEMS</span>
            </div>
            <div className="h-[1px] flex-grow bg-gradient-to-l from-transparent via-white/10 to-white/10" />
          </div>

          {/* Section Header */}
          <div className="flex flex-col gap-2 mb-6 sm:mb-8 text-center max-w-3xl mx-auto">
            <h2 className="font-sans font-black text-4xl sm:text-6xl text-white tracking-tight leading-none">
              <Typewriter text="Additional features" speed={14} enabled={additionalHeadingEnabled} onComplete={() => setAdditionalFeaturesHeaderLoaded(true)} />
            </h2>
          </div>

          {/* Unified Split-Screen Interactive Showcase Console */}
          {additionalFeaturesHeaderLoaded && (
            <motion.div 
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 items-stretch mb-12"
            >
              {/* Left Column: Selector List */}
              <div className="lg:col-span-5 flex flex-col gap-4 justify-start">
                <span className="text-[10px] font-mono text-amber-500/70 uppercase tracking-widest font-bold">Select Feature Overview</span>
                
                <div className="flex flex-col gap-3">
                  {additionalFeatures.map((feat: any, idx: number) => {
                    const isActive = idx === activeFeatureIdx;
                    const IconComponent = feat.icon;
                    return (
                      <button
                        key={idx}
                        onClick={() => {
                          setActiveFeatureIdx(idx);
                        }}
                        onMouseEnter={() => setHoveredCardIdx(idx)}
                        onMouseLeave={() => setHoveredCardIdx(null)}
                        className={`text-left p-5 rounded-2xl border transition-all duration-300 flex flex-col gap-2 cursor-pointer relative overflow-hidden ${
                          isActive
                            ? "bg-amber-500/[0.03] border-amber-500/30 shadow-[0_4px_30px_rgba(245,158,11,0.03)]"
                            : "bg-black/20 border-white/5 hover:border-white/10 hover:bg-white/[0.01]"
                        }`}
                      >
                        {isActive && (
                          <div className="absolute left-0 top-0 bottom-0 w-1 bg-amber-500" />
                        )}

                        <div className="flex items-center gap-3">
                          <span className={`font-mono text-[10px] font-bold ${isActive ? "text-amber-400" : "text-slate-600"}`}>
                            0{idx + 1}
                          </span>
                          <div className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${
                            isActive ? "bg-amber-500/20 text-amber-400" : "bg-white/5 text-slate-400"
                          }`}>
                            <IconComponent className="w-4 h-4" />
                          </div>
                          <span className={`font-sans font-bold text-sm sm:text-base tracking-tight ${
                            isActive ? "text-white" : "text-slate-400"
                          }`}>
                            {feat.title}
                          </span>
                        </div>

                        {/* Slide-out description panel inside selector */}
                        <motion.div
                          initial={false}
                          animate={{ height: isActive ? "auto" : 0, opacity: isActive ? 1 : 0 }}
                          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                          className="overflow-hidden mt-1 pl-10 border-l border-white/5"
                        >
                          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-sans pr-2">
                            {feat.desc}
                          </p>
                        </motion.div>

                        {/* Interactive progress bar */}
                        {isActive && hoveredCardIdx !== idx && (
                          <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-amber-500/10">
                            <motion.div
                              initial={{ width: "0%" }}
                              animate={{ width: "100%" }}
                              transition={{ duration: 5, ease: "linear" }}
                              className="h-full bg-amber-500"
                            />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Right Column: High-Fidelity Simplified Mockup Viewport */}
              <div className="lg:col-span-7 flex flex-col justify-center">
                <motion.div
                  key={activeFeatureIdx}
                  initial={{ opacity: 0, scale: 0.98, y: 15 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="w-full relative rounded-2xl border border-white/5 bg-black/10 shadow-2xl overflow-hidden p-3 md:p-5 flex items-center justify-center min-h-[300px] sm:min-h-[380px] md:min-h-[440px]"
                >
                  <div className="w-full relative select-none text-slate-200">
                    <SafeFeatureImage
                      src={additionalFeatures[activeFeatureIdx].img}
                      alt={additionalFeatures[activeFeatureIdx].title}
                      className="w-full h-auto max-h-[420px] object-contain rounded-xl border border-white/10 shadow-2xl"
                      fallbackUI={additionalFeatures[activeFeatureIdx].fallback}
                    />
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )}
        </section>

        {/* AND MANY MORE FEATURES SECTION */}
        <section
          id="many-more-section"
          className={`flex flex-col justify-center py-12 sm:py-16 relative scroll-mt-24 max-w-7xl mx-auto w-full px-4 md:px-8 border-t border-white/5 transition-all duration-[800ms] ${
            additionalFeaturesHeaderLoaded
              ? "opacity-100 visible"
              : "opacity-0 invisible pointer-events-none"
          }`}
        >
          {/* Top Divider */}
          <div className="w-full flex items-center justify-center gap-4 mb-8 sm:mb-12">
            <div className="h-[1px] flex-grow bg-gradient-to-r from-transparent via-white/10 to-white/10" />
            <div className={`px-4 py-1.5 rounded-full text-[10px] font-mono tracking-widest uppercase ${additionalFeaturesHeaderLoaded ? `${THEMES[currentTheme].accentBg} ${THEMES[currentTheme].accentText} border ${THEMES[currentTheme].accentBorder}` : "bg-white/5 text-slate-500 border border-white/10"} flex items-center gap-2 backdrop-blur-sm shadow-sm`}>
              <Layers className="w-3.5 h-3.5" />
              <span>03 / AUXILIARY TOOLS</span>
            </div>
            <div className="h-[1px] flex-grow bg-gradient-to-l from-transparent via-white/10 to-white/10" />
          </div>

          {/* Section Header */}
          <div className="flex flex-col gap-2 mb-6 sm:mb-8 text-center max-w-3xl mx-auto">
            <h2 className="font-sans font-black text-4xl sm:text-6xl text-white tracking-tight leading-none">
              <Typewriter text="And many more features" speed={14} enabled={manyMoreHeadingEnabled} onComplete={() => setManyMoreFeaturesHeaderLoaded(true)} />
            </h2>
          </div>

          {/* Clean, attractive and performant Bento Grid presentation */}
          {manyMoreFeaturesHeaderLoaded && (
            <motion.div 
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.04
                  }
                }
              }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16"
            >
              {EXTRA_FEATURES.map((item: any, idx: number) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={idx}
                    variants={{
                      hidden: { opacity: 0, y: 15 },
                      visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
                    }}
                    whileHover={{ y: -4 }}
                    className="p-6 rounded-2xl border border-white/5 bg-black/25 backdrop-blur-sm hover:border-fuchsia-500/20 hover:bg-fuchsia-500/[0.01] flex flex-col gap-4 shadow-xl group transition-all"
                  >
                    <div className="w-10 h-10 rounded-xl bg-fuchsia-500/10 border border-fuchsia-500/20 flex items-center justify-center text-fuchsia-400 transition-transform">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white group-hover:text-fuchsia-400 transition-colors">
                        {item.title}
                      </h4>
                      <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </section>

        {/* PERFORMANCE METRICS SECTION */}
        <section
          id="performance-section"
          className={`flex flex-col justify-center py-12 sm:py-16 relative scroll-mt-24 max-w-7xl mx-auto w-full px-4 md:px-8 border-t border-white/5 transition-all duration-[800ms] ${
            manyMoreFeaturesHeaderLoaded
              ? "opacity-100 visible"
              : "opacity-0 invisible pointer-events-none"
          }`}
        >
          {/* Top Divider */}
          <div className="w-full flex items-center justify-center gap-4 mb-8 sm:mb-12">
            <div className="h-[1px] flex-grow bg-gradient-to-r from-transparent via-white/10 to-white/10" />
            <div className={`px-4 py-1.5 rounded-full text-[10px] font-mono tracking-widest uppercase ${manyMoreFeaturesHeaderLoaded ? `${THEMES[currentTheme].accentBg} ${THEMES[currentTheme].accentText} border ${THEMES[currentTheme].accentBorder}` : "bg-white/5 text-slate-500 border border-white/10"} flex items-center gap-2 backdrop-blur-sm shadow-sm`}>
              <Cpu className="w-3.5 h-3.5" />
              <span>04 / PERFORMANCE STATISTICS</span>
            </div>
            <div className="h-[1px] flex-grow bg-gradient-to-l from-transparent via-white/10 to-white/10" />
          </div>

          {/* Section Header */}
          <div className="flex flex-col gap-2 mb-6 sm:mb-8 text-center max-w-3xl mx-auto">
            <h2 className="font-sans font-black text-4xl sm:text-6xl text-white tracking-tight leading-none">
              <Typewriter text="Performance details" speed={14} enabled={performanceHeadingEnabled} onComplete={() => setPerformanceHeaderLoaded(true)} />
            </h2>
          </div>

          {performanceHeaderLoaded && (
            <motion.div
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.18,
                    delayChildren: 0.15
                  }
                }
              }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-8"
            >
              
              {/* PERFORMANCE CARD 1 */}
              <motion.div
                variants={{
                  hidden: { opacity: 0, y: 40, scale: 0.92 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    transition: {
                      type: "spring",
                      stiffness: 70,
                      damping: 14,
                      mass: 0.9
                    }
                  }
                }}
                className="bg-black/20 rounded-2xl border border-white/5 p-8 flex flex-col gap-6 shadow-2xl relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/[0.02] rounded-full filter blur-2xl pointer-events-none" />
                
                <div className="flex items-center justify-between border-b border-white/5 pb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded bg-cyan-500/15 flex items-center justify-center text-cyan-400">
                      <Activity className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">ACTIVE FOOTPRINT</span>
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <span className="text-4xl sm:text-5xl font-mono font-black text-white tracking-tight">300 MB</span>
                  <span className="text-xs font-mono text-slate-500 uppercase tracking-widest">Active RAM usage</span>
                </div>

                <div className="flex flex-col gap-1.5 bg-black/40 border border-white/5 rounded-xl p-4 my-2">
                  <div className="flex justify-between text-[10px] font-mono">
                    <span className="text-cyan-400 font-bold">SYSTEM ALLOCATION</span>
                    <span className="text-slate-300">300 MB / 8 GB</span>
                  </div>
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full w-[4.5%] bg-cyan-400 rounded-full" />
                  </div>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed">
                  The launcher uses approximately <strong className="text-white font-semibold">300 MB of RAM</strong> while open with normal graphics, keeping your overall system fast and responsive.
                </p>
              </motion.div>

              {/* PERFORMANCE CARD 2 */}
              <motion.div
                variants={{
                  hidden: { opacity: 0, y: 40, scale: 0.92 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    transition: {
                      type: "spring",
                      stiffness: 70,
                      damping: 14,
                      mass: 0.9
                    }
                  }
                }}
                className="bg-black/20 rounded-2xl border border-white/5 p-8 flex flex-col gap-6 shadow-2xl relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/[0.02] rounded-full filter blur-2xl pointer-events-none" />
                
                <div className="flex items-center justify-between border-b border-white/5 pb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded bg-cyan-500/15 flex items-center justify-center text-cyan-400">
                      <Zap className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">SLEEP RELEASE</span>
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <span className="text-4xl sm:text-5xl font-mono font-black text-white tracking-tight">30 MB</span>
                  <span className="text-xs font-mono text-slate-500 uppercase tracking-widest">Minimized RAM usage</span>
                </div>

                <div className="bg-black/40 border border-white/5 rounded-xl p-4 my-2 flex flex-col justify-center items-center gap-2 text-center">
                  <div className="flex items-center gap-4 text-xs font-mono">
                    <span className="text-slate-500">Active (300MB)</span>
                    <span className="text-cyan-400">→</span>
                    <span className="text-emerald-400 font-bold">Sleep (30MB)</span>
                  </div>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed">
                  When minimized to background mode, memory usage automatically drops to approximately <strong className="text-white font-semibold">30 MB of RAM</strong>, releasing system assets for maximum gaming resource allocation.
                </p>
              </motion.div>

              {/* PERFORMANCE CARD 3 */}
              <motion.div
                variants={{
                  hidden: { opacity: 0, y: 40, scale: 0.92 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    transition: {
                      type: "spring",
                      stiffness: 70,
                      damping: 14,
                      mass: 0.9
                    }
                  }
                }}
                className="bg-black/20 rounded-2xl border border-white/5 p-8 flex flex-col gap-6 shadow-2xl relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/[0.02] rounded-full filter blur-2xl pointer-events-none" />
                
                <div className="flex items-center justify-between border-b border-white/5 pb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded bg-cyan-500/15 flex items-center justify-center text-cyan-400">
                      <Sliders className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">JVM MODIFICATIONS</span>
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <span className="text-4xl sm:text-5xl font-mono font-black text-white tracking-tight">+5% AVG</span>
                  <span className="text-xs font-mono text-slate-500 uppercase tracking-widest">Optimized performance</span>
                </div>

                <div className="bg-black/40 border border-white/5 rounded-xl p-4 my-2 flex items-center gap-3">
                  <div className="w-8 h-8 rounded bg-cyan-500/10 flex items-center justify-center font-mono text-cyan-400 text-xs font-bold">+5%</div>
                  <div className="text-[10px] font-mono text-slate-400 leading-normal">
                    <div className="text-white font-semibold">JVM Tweaks</div>
                    <div>Optimizes runtime heap memory management for a smoother launch cycle.</div>
                  </div>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed">
                  Based on benchmark testing, the launcher's optional JVM parameters provide an average performance improvement of approximately <strong className="text-white font-semibold">5%</strong>.
                </p>
              </motion.div>

            </motion.div>
          )}
        </section>

        </main>

      {/* FOOTER */}
      <footer id="app-footer" className="relative z-10 border-t border-white/10 bg-slate-950/80 backdrop-blur-lg mt-32 py-16">
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex flex-col gap-3 items-center md:items-start text-center md:text-left">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-lg bg-slate-900 border border-white/10 flex items-center justify-center overflow-hidden select-none">
                <img
                  src={launcherLogoImg}
                  alt="N"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                  loading="lazy"
                />
              </div>
              <span className="font-display font-extrabold text-lg text-white select-none">NOTG Launcher</span>
              <span className="text-white/15">|</span>
              <span className="text-xs text-slate-400 font-sans">Made with passion :]</span>
            </div>
            
            <p className="max-w-xl text-xs leading-relaxed text-slate-400 font-sans">
              <strong className="text-indigo-400 font-semibold font-display uppercase tracking-widest text-[9px] block mb-1">NOTE</strong>
              This launcher is a personal hobby project and its not a commercial so there will be many bugs.
            </p>
          </div>

          <div className="flex items-center gap-6 text-[10px] text-slate-500 font-mono">
            <span>© 2026 NOTG</span>
          </div>
        </div>
      </footer>

    </div>
  );
}