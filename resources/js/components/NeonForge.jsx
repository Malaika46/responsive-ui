import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import {
  Monitor,
  Cpu,
  Sliders,
  Check,
  ShoppingCart,
  ChevronRight,
  Award,
  Zap,
  ShieldCheck,
  Star,
  Send,
  X,
  Plus,
  RefreshCw,
  Flame,
  MousePointer,
  Keyboard,
  Headphones,
  Maximize2
} from 'lucide-react';
import CursorGrid from './CursorGrid';
import TargetCursor from './TargetCursor';
import CyberSetup3D from './CyberSetup3D';

// Product Catalog
const FEATURED_PRODUCTS = [
  {
    id: 'prod-kb',
    name: 'Matrix-65 Cyber Keyboard',
    category: 'Keyboards',
    price: 189,
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=600&auto=format&fit=crop&q=80',
    color: '#D946EF',
    specs: ['Gateron Oil King switches', 'CNC Aluminum case', 'RGB hot-swappable']
  },
  {
    id: 'prod-mouse',
    name: 'VaporGlide Pro Wireless',
    category: 'Mice',
    price: 129,
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=600&auto=format&fit=crop&q=80',
    color: '#06B6D4',
    specs: ['30K optical sensor', '58g ultra-lightweight', '90hr battery life']
  },
  {
    id: 'prod-headset',
    name: 'Aether 7.1 Spatial Audio',
    category: 'Audio',
    price: 159,
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=600&auto=format&fit=crop&q=80',
    color: '#F43F5E',
    specs: ['50mm graphene drivers', 'Ultra-low latency wireless', 'Noise-canceling mic']
  },
  {
    id: 'prod-case',
    name: 'Nebula Glass Cyber Tower',
    category: 'Cases',
    price: 249,
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1624705002806-5d72df19c3ad?w=600&auto=format&fit=crop&q=80',
    color: '#10B981',
    specs: ['Dual-chamber layout', 'Panoramic tempered glass', 'Integrated RGB controller']
  },
  {
    id: 'prod-mat',
    name: 'Synthwave Neon Deskmat',
    category: 'Accessories',
    price: 39,
    rating: 4.6,
    image: 'https://images.unsplash.com/photo-1603481588273-2f908a9a7a1b?w=600&auto=format&fit=crop&q=80',
    color: '#F59E0B',
    specs: ['900x400mm dimensions', 'Waterproof coating', 'Stitched glowing edges']
  },
  {
    id: 'prod-light',
    name: 'ChromaSync Neon LED Strips',
    category: 'Lighting',
    price: 59,
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&auto=format&fit=crop&q=80',
    color: '#8B5CF6',
    specs: ['Addressable COB LEDs', 'Ambient screen-syncing', 'Voice assistant support']
  }
];

const REVIEWS = [
  {
    id: 1,
    name: 'Kaelen "Viper" Vance',
    role: 'Competitive Apex Player',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=150&auto=format&fit=crop&q=80',
    comment: 'The VaporGlide mouse has completely changed my aim consistency. And the CursorGrid ambient lighting when I interact is next level!',
    setup: 'Level 3: Overlord Setup'
  },
  {
    id: 2,
    name: 'Sylvia "Neon_Valkyrie"',
    role: 'Tech Reviewer & Streamer',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    comment: 'Customizing my Desk setup through NeonForge was seamless. It arrived in two weeks, pre-cable-managed. Absolute premium service.',
    setup: 'Level 2: Grid-Master Setup'
  },
  {
    id: 3,
    name: 'Marcus "Cipher" Chen',
    role: 'Cybersecurity Analyst',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    comment: 'The Matrix-65 Cyber Keyboard sounds absolute heaven. It is heavy, metal, beautifully finished, and the RGB lighting is fully customizable.',
    setup: 'Elite L-Desk, Custom Matrix'
  }
];

export default function NeonForge() {
  // Theme state
  const [theme, setTheme] = useState('default');

  // Custom Setup Builder State
  const [deskSize, setDeskSize] = useState('elite'); // standard | pro | elite
  const [monitorType, setMonitorType] = useState('ultrawide'); // dual | ultrawide | triple
  const [keyboardSwitch, setKeyboardSwitch] = useState('rapid'); // tactile | linear | rapid
  const [mouseSensor, setMouseSensor] = useState('superlight'); // superlight | MMO
  const [pcTier, setPcTier] = useState('tier3'); // tier1 | tier2 | tier3
  const [rgbColor, setRgbColor] = useState('#D946EF'); // Magenta, Cyan, Green, Red

  // Cart state
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);

  // Newsletter state
  const [email, setEmail] = useState('');
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);

  // Counter state
  const [setupsCounter, setSetupsCounter] = useState(12840);

  // GSAP animation refs
  const heroRef = useRef(null);
  const heroTitleRef = useRef(null);
  const heroSubRef = useRef(null);
  const heroBtnRef = useRef(null);
  const heroDeskRef = useRef(null);
  const counterRef = useRef(null);

  // Pricing calculations
  const prices = {
    desk: { standard: 399, pro: 549, elite: 899 },
    monitor: { dual: 399, ultrawide: 799, triple: 1299 },
    keyboard: { tactile: 149, linear: 169, rapid: 229 },
    mouse: { superlight: 129, MMO: 99 },
    pc: { tier1: 1199, tier2: 1899, tier3: 3499 }
  };

  const getBuilderTotal = () => {
    return (
      prices.desk[deskSize] +
      prices.monitor[monitorType] +
      prices.keyboard[keyboardSwitch] +
      prices.mouse[mouseSensor] +
      prices.pc[pcTier]
    );
  };

  // Change theme handler
  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);

    // Auto sync configurator LED with the primary color of the theme
    if (newTheme === 'default') setRgbColor('#D946EF');
    else if (newTheme === 'cyan-pink') setRgbColor('#06B6D4');
    else if (newTheme === 'green-cyan') setRgbColor('#22C55E');
    else if (newTheme === 'orange-purple') setRgbColor('#F97316');
  };

  // Add customized setup to cart
  const addCustomSetupToCart = () => {
    const total = getBuilderTotal();
    const configName = `Custom NeonForge Setup (PC Tier: ${pcTier.toUpperCase()}, ${monitorType.toUpperCase()} Screen)`;
    const newCartItem = {
      id: `custom-setup-${Date.now()}`,
      name: configName,
      price: total,
      image: '🎛️',
      specs: [
        `Desk: ${deskSize.toUpperCase()}`,
        `Monitor: ${monitorType.toUpperCase()}`,
        `Switches: ${keyboardSwitch.toUpperCase()}`,
        `PC Tier: ${pcTier.toUpperCase()}`
      ]
    };
    setCart([...cart, newCartItem]);
    setCartOpen(true);
  };

  // Add simple gear product to cart
  const addProductToCart = (product) => {
    const newCartItem = {
      id: `${product.id}-${Date.now()}`,
      name: product.name,
      price: product.price,
      image: product.image,
      specs: product.specs
    };
    setCart([...cart, newCartItem]);
    setCartOpen(true);
  };

  // Remove item from cart
  const removeCartItem = (itemId) => {
    setCart(cart.filter(item => item.id !== itemId));
  };

  // Increment counter periodically (simulating active online setup builds)
  useEffect(() => {
    const interval = setInterval(() => {
      setSetupsCounter(prev => prev + Math.floor(Math.random() * 3) + 1);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // GSAP animation setup
  useEffect(() => {
    // Initial page load animations
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    tl.fromTo(heroTitleRef.current,
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 1 }
    );

    tl.fromTo(heroSubRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.8 },
      '-=0.6'
    );

    tl.fromTo(heroBtnRef.current,
      { opacity: 0, scale: 0.9 },
      { opacity: 1, scale: 1, duration: 0.6 },
      '-=0.4'
    );

    if (heroDeskRef.current) {
      tl.fromTo(heroDeskRef.current, 
        { opacity: 0, y: 100 }, 
        { opacity: 1, y: 0, duration: 1.2 },
        '-=0.8'
      );
    }

    // Floating elements animation
    gsap.to('.hero-float-pc', {
      y: -15,
      duration: 3,
      repeat: -1,
      yoyo: true,
      ease: 'power1.inOut'
    });

    gsap.to('.hero-float-headset', {
      y: 10,
      x: -5,
      duration: 4,
      repeat: -1,
      yoyo: true,
      ease: 'power1.inOut'
    });

    gsap.to('.hero-float-bubble', {
      y: -25,
      duration: 5,
      repeat: -1,
      yoyo: true,
      ease: 'power1.inOut',
      stagger: 0.5
    });

  }, []);

  // Mouse Parallax effect on Hero
  const handleHeroMouseMove = (e) => {
    const { clientX, clientY } = e;
    const xPos = (clientX / window.innerWidth - 0.5) * 30;
    const yPos = (clientY / window.innerHeight - 0.5) * 30;

    gsap.to('.parallax-target-1', {
      x: xPos,
      y: yPos,
      duration: 0.8,
      ease: 'power2.out'
    });

    gsap.to('.parallax-target-2', {
      x: -xPos * 0.7,
      y: -yPos * 0.7,
      duration: 0.8,
      ease: 'power2.out'
    });
  };

  return (
    <div className="relative min-h-screen bg-[#050508] text-white selection:bg-[#D946EF] selection:text-black">

      {/* Background elements */}
      <div className="cyber-bg" />
      <div className="ambient-glow top-[10%] left-[-10%]" />
      <div className="ambient-glow-cyan top-[40%] right-[-10%]" />
      <div className="ambient-glow top-[80%] left-[20%]" />

      {/* Global CursorGrid from React Bits */}
      <div className="fixed inset-0 w-full h-full pointer-events-none z-[1]">
        <CursorGrid
          cellSize={65}
          color={theme === 'default' ? '#D946EF' : theme === 'cyan-pink' ? '#06B6D4' : theme === 'green-cyan' ? '#22C55E' : '#F97316'}
          radius={180}
          falloff="smooth"
          holdTime={250}
          fadeDuration={800}
          lineWidth={1.2}
          maxOpacity={0.95}
          fillOpacity={0.24}
          gridOpacity={0.06}
          cellRadius={4}
          clickPulse={true}
          pulseSpeed={650}
        />
      </div>

      {/* TargetCursor from React Bits */}
      <TargetCursor
        targetSelector=".cursor-target, button, a, select, input, label[for], [role='button']"
        spinDuration={4}
        hideDefaultCursor={true}
        parallaxOn={true}
        cursorColor={theme === 'default' ? '#D946EF' : theme === 'cyan-pink' ? '#06B6D4' : theme === 'green-cyan' ? '#22C55E' : '#F97316'}
        cursorColorOnTarget={theme === 'default' ? '#06B6D4' : theme === 'cyan-pink' ? '#F43F5E' : theme === 'green-cyan' ? '#06B6D4' : '#A855F7'}
      />

      {/* Top Header & Navbar */}
      <header className="fixed top-0 left-0 right-0 z-50 glass-panel border-b border-white/5 py-4 px-6 md:px-12 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="relative w-8 h-8 rounded bg-gradient-to-tr from-[#D946EF] to-[#06B6D4] flex items-center justify-center font-bold text-black text-lg shadow-[0_0_15px_rgba(217,70,239,0.5)]">
            N
            <div className="absolute inset-0.5 rounded bg-[#050508] flex items-center justify-center text-white text-sm font-black font-cyber">
              NF
            </div>
          </div>
          <span className="font-cyber font-black text-xl tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-gray-400">
            NEON<span className="text-[#D946EF] glow-text-primary">FORGE</span>
          </span>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-8 text-sm font-medium tracking-widest text-slate-300">
          <a href="#hero" className="hover:text-white transition-colors duration-200 uppercase font-cyber text-xs">Home</a>
          <a href="#builder" className="hover:text-white transition-colors duration-200 uppercase font-cyber text-xs">Setup Builder</a>
          <a href="#gear" className="hover:text-white transition-colors duration-200 uppercase font-cyber text-xs">Gaming Gear</a>
          <a href="#why-us" className="hover:text-white transition-colors duration-200 uppercase font-cyber text-xs">Why Us</a>
          <a href="#reviews" className="hover:text-white transition-colors duration-200 uppercase font-cyber text-xs">Reviews</a>
        </nav>

        {/* RGB Theme Switcher and Cart button */}
        <div className="flex items-center gap-4">

          {/* RGB Selector UI */}
          <div className="hidden sm:flex items-center gap-2 bg-black/40 border border-white/10 rounded-full px-3 py-1.5">
            <span className="text-[10px] text-slate-500 font-cyber font-bold mr-1">RGB COLORWAY</span>

            <button
              onClick={() => handleThemeChange('default')}
              style={{
                background: 'linear-gradient(to right, #D946EF, #06B6D4)',
                border: theme === 'default' ? '2px solid #ffffff' : '1px solid rgba(255, 255, 255, 0.3)',
                transform: theme === 'default' ? 'scale(1.2)' : 'scale(1)',
                boxShadow: theme === 'default' ? '0 0 10px rgba(217, 70, 239, 0.5)' : 'none'
              }}
              className="w-3.5 h-3.5 rounded-full transition-all duration-200 hover:scale-125 cursor-pointer"
              title="Neo Purple"
            />
            <button
              onClick={() => handleThemeChange('cyan-pink')}
              style={{
                background: 'linear-gradient(to right, #06B6D4, #F43F5E)',
                border: theme === 'cyan-pink' ? '2px solid #ffffff' : '1px solid rgba(255, 255, 255, 0.3)',
                transform: theme === 'cyan-pink' ? 'scale(1.2)' : 'scale(1)',
                boxShadow: theme === 'cyan-pink' ? '0 0 10px rgba(6, 182, 212, 0.5)' : 'none'
              }}
              className="w-3.5 h-3.5 rounded-full transition-all duration-200 hover:scale-125 cursor-pointer"
              title="Neon Cyberpunk"
            />
            <button
              onClick={() => handleThemeChange('green-cyan')}
              style={{
                background: 'linear-gradient(to right, #22C55E, #06B6D4)',
                border: theme === 'green-cyan' ? '2px solid #ffffff' : '1px solid rgba(255, 255, 255, 0.3)',
                transform: theme === 'green-cyan' ? 'scale(1.2)' : 'scale(1)',
                boxShadow: theme === 'green-cyan' ? '0 0 10px rgba(34, 197, 94, 0.5)' : 'none'
              }}
              className="w-3.5 h-3.5 rounded-full transition-all duration-200 hover:scale-125 cursor-pointer"
              title="Toxic Matrix"
            />
            <button
              onClick={() => handleThemeChange('orange-purple')}
              style={{
                background: 'linear-gradient(to right, #F97316, #A855F7)',
                border: theme === 'orange-purple' ? '2px solid #ffffff' : '1px solid rgba(255, 255, 255, 0.3)',
                transform: theme === 'orange-purple' ? 'scale(1.2)' : 'scale(1)',
                boxShadow: theme === 'orange-purple' ? '0 0 10px rgba(249, 115, 22, 0.5)' : 'none'
              }}
              className="w-3.5 h-3.5 rounded-full transition-all duration-200 hover:scale-125 cursor-pointer"
              title="Synthwave Sunrise"
            />
          </div>

          {/* Cart Button */}
          <button
            onClick={() => setCartOpen(true)}
            className="relative flex items-center justify-center p-2.5 rounded-full glass-panel hover:bg-white/5 border border-white/10 transition-all duration-300"
          >
            <ShoppingCart className="w-5 h-5 text-slate-200" />
            {cart.length > 0 && (
              <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-r from-[#D946EF] to-[#06B6D4] text-[10px] font-bold text-black animate-pulse">
                {cart.length}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section
        id="hero"
        onMouseMove={handleHeroMouseMove}
        className="relative z-10 min-h-screen pt-32 pb-20 px-6 md:px-12 flex flex-col justify-center items-center overflow-hidden"
      >
        {/* Hero Content (Centered) */}
        <div className="max-w-4xl z-10 text-center flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#D946EF]/30 bg-[#D946EF]/5 text-xs text-[#D946EF] font-cyber font-bold mb-6 tracking-widest uppercase animate-pulse">
            <Flame className="w-4 h-4 text-[#D946EF]" /> Awards Honorable Mention
          </div>

          <h1
            ref={heroTitleRef}
            className="text-4xl sm:text-6xl md:text-7xl font-black font-cyber tracking-tight leading-none mb-6"
          >
            FORGE YOUR <br className="hidden sm:inline" />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#f8fafc] via-[#f1f5f9] to-[#cbd5e1]">ULTIMATE</span> <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#D946EF] via-[#8B5CF6] to-[#06B6D4] glow-text-primary">
              BATTLESTATION
            </span>
          </h1>

          <p
            ref={heroSubRef}
            className="text-slate-400 max-w-2xl text-base md:text-lg mb-8 leading-relaxed font-sans"
          >
            Elevate your play with customized cyberpunk desks, ultra-wide ambient display modules, custom-tuned mechanical keyboards, and liquid-cooled rigs. Built by and for elite gamers.
          </p>

          <div ref={heroBtnRef} className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto justify-center">
            <a href="#builder" className="cyber-btn cyber-btn-solid text-center w-full sm:w-auto">
              Configure Setup
            </a>
            <a href="#gear" className="cyber-btn text-center w-full sm:w-auto">
              Browse Gear
            </a>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-3 gap-6 md:gap-12 mt-12 pt-8 border-t border-white/5 w-full max-w-xl mx-auto">
            <div>
              <div className="font-cyber font-bold text-2xl md:text-3xl text-white">4.9/5</div>
              <div className="text-[10px] uppercase tracking-widest text-slate-500 font-cyber mt-1">Trustpilot Rating</div>
            </div>
            <div>
              <div className="font-cyber font-bold text-2xl md:text-3xl text-[#06B6D4] glow-text-secondary">
                {setupsCounter.toLocaleString()}+
              </div>
              <div className="text-[10px] uppercase tracking-widest text-slate-500 font-cyber mt-1">Stations Built</div>
            </div>
            <div>
              <div className="font-cyber font-bold text-2xl md:text-3xl text-[#D946EF] glow-text-primary">24H</div>
              <div className="text-[10px] uppercase tracking-widest text-slate-500 font-cyber mt-1">Expert Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Setup Builder (3D Configurator) */}
      <section id="builder" className="relative z-10 py-24 px-6 md:px-12 border-t border-white/5 bg-[#09090e]/50">

        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="cyber-badge mb-4">Battlestation Architect</div>
          <h2 className="text-3xl md:text-5xl font-black font-cyber mb-4">
            BUILD YOUR <span className="glow-text-primary">DREAM</span> SETUP
          </h2>
          <p className="text-slate-400 text-sm md:text-base font-sans">
            Customize every module of your station in real-time. Watch the pricing adjust and preview the neon sync.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-10 items-stretch max-w-7xl mx-auto">

          {/* Builder Simulator Canvas (Left) */}
          <div className="lg:col-span-7 glass-panel rounded-2xl p-6 flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
              <span className="text-[10px] font-cyber tracking-widest text-slate-400">CONFIG PREVIEW: ACTIVE</span>
            </div>

            {/* Custom LED Light selection header in editor */}
            <div className="absolute top-4 right-4 z-10 flex items-center gap-2 bg-black/50 border border-white/10 rounded-full px-3 py-1 text-xs">
              <span className="text-[10px] text-slate-500 font-cyber font-bold">LED COLOR:</span>
              <div className="flex gap-1.5">
                {['#D946EF', '#06B6D4', '#22C55E', '#F97316', '#EF4444'].map((color) => (
                  <button
                    key={color}
                    onClick={() => setRgbColor(color)}
                    className="w-3.5 h-3.5 rounded-full border border-white/20 transition-transform"
                    style={{ backgroundColor: color, transform: rgbColor === color ? 'scale(1.2)' : 'none' }}
                  />
                ))}
              </div>
            </div>

            {/* The live rendering workspace */}
            <div className="flex-1 min-h-[350px] flex flex-col justify-end items-center relative pt-12">
              {/* Glowing Background from custom LED */}
              <div
                className="simulator-glow rounded-full blur-[20px] opacity-80 transition-all duration-500"
                style={{
                  backgroundColor: rgbColor,
                  boxShadow: `0 0 40px 10px ${rgbColor}`
                }}
              />

              {/* Dynamic rendering of monitor based on choice */}
              <div className="relative w-full flex justify-center mb-8">
                {monitorType === 'dual' && (
                  <div className="flex gap-4 simulator-monitor-dual">
                    <div className="flex-1 bg-[#0c0c14] border-2 border-slate-800 rounded p-1 flex items-center justify-center text-xs relative overflow-hidden" style={{ boxShadow: `0 0 15px ${rgbColor}30` }}>
                      <span className="text-[10px] text-slate-500 font-cyber">LEFT MONITOR</span>
                      <div className="absolute inset-0 bg-gradient-to-t from-transparent to-white/5" />
                    </div>
                    <div className="flex-1 bg-[#0c0c14] border-2 border-slate-800 rounded p-1 flex items-center justify-center text-xs relative overflow-hidden" style={{ boxShadow: `0 0 15px ${rgbColor}30` }}>
                      <span className="text-[10px] text-slate-500 font-cyber">RIGHT MONITOR</span>
                      <div className="absolute inset-0 bg-gradient-to-t from-transparent to-white/5" />
                    </div>
                  </div>
                )}

                {monitorType === 'ultrawide' && (
                  <div className="simulator-monitor-ultrawide bg-[#0c0c14] border-2 border-slate-700 rounded-lg flex items-center justify-center p-2 relative overflow-hidden" style={{ boxShadow: `0 0 20px ${rgbColor}40` }}>
                    <div className="text-center z-10">
                      <span className="text-xs text-white font-cyber tracking-widest block font-bold">49" ULTRA-WIDE SCREEN</span>
                      <span className="text-[9px] text-[#06B6D4] font-cyber">CHROMA_SYNC ENABLED</span>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-transparent to-white/5" />
                    <div className="absolute bottom-1 left-2 right-2 h-0.5 bg-gradient-to-r from-transparent via-[#06B6D4]/50 to-transparent" />
                  </div>
                )}

                {monitorType === 'triple' && (
                  <div className="flex gap-1.5 simulator-monitor-triple items-end justify-center">
                    <div className="simulator-monitor-side bg-[#0c0c14] border-2 border-slate-800 rounded-l-md flex items-center justify-center text-[9px] text-slate-500 font-cyber skew-y-3" />
                    <div className="simulator-monitor-center bg-[#0c0c14] border-2 border-slate-700 rounded-md flex items-center justify-center text-xs text-white font-cyber font-bold" style={{ boxShadow: `0 0 20px ${rgbColor}40` }} />
                    <div className="simulator-monitor-side bg-[#0c0c14] border-2 border-slate-800 rounded-r-md flex items-center justify-center text-[9px] text-slate-500 font-cyber -skew-y-3" />
                  </div>
                )}
              </div>

              {/* Monitor Stand */}
              <div className="simulator-monitor-stand" />

              {/* Dynamic Desk Surface */}
              <div
                className="simulator-desk transition-all duration-300"
                style={{
                  borderTopColor: rgbColor,
                  boxShadow: `0 -10px 25px ${rgbColor}15, inset 0 1px 0 rgba(255,255,255,0.05)`
                }}
              >
                {/* Neon strip light below table edge */}
                <div
                  className="absolute top-0 left-[5%] right-[5%] h-1.5 blur-[2px] transition-all duration-500"
                  style={{
                    backgroundColor: rgbColor,
                    boxShadow: `0 0 15px 4px ${rgbColor}`
                  }}
                />

                {/* Desk Size Badge labels */}
                <div className="simulator-desk-label text-[9px] font-cyber text-slate-500">
                  DESK: {deskSize.toUpperCase()} ({deskSize === 'standard' ? '120CM' : deskSize === 'pro' ? '160CM' : '180CM L-SHAPE'})
                </div>

                {/* PC Case based on selection */}
                <div className="simulator-pc-case bg-[#0d0d15] border-2 border-slate-700 rounded p-1 flex flex-col justify-between">
                  <div className="w-full h-full bg-[#050508] rounded border border-white/5 p-1 flex flex-col justify-between overflow-hidden relative">
                    <div className="flex justify-between items-center">
                      <div className="w-4 h-4 rounded-full border border-dashed animate-spin flex items-center justify-center" style={{ borderColor: rgbColor }}>
                        <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: rgbColor }} />
                      </div>
                      <div className="text-[7px] text-[#06B6D4] font-cyber">GPU</div>
                    </div>

                    <div className="text-center font-cyber font-bold text-[8px] tracking-tighter" style={{ color: rgbColor }}>
                      {pcTier === 'tier1' ? 'RTX 4060' : pcTier === 'tier2' ? 'RTX 4070Ti' : 'RTX 4090'}
                    </div>

                    <div className="w-full h-3 bg-slate-900 border border-slate-800 rounded-[1px]" />
                  </div>
                </div>

                {/* Desk Mat (Mousepad) */}
                <div
                  className="simulator-desk-mat bg-slate-950/80 border rounded-lg transition-all duration-500 flex items-center justify-between px-6"
                  style={{
                    borderColor: `${rgbColor}40`,
                    boxShadow: `0 0 15px ${rgbColor}15`
                  }}
                >
                  {/* Keyboard */}
                  <div className="w-32 h-7 bg-[#0c0c14] border border-slate-800 rounded p-0.5 flex justify-between relative" style={{ gap: '1px' }}>
                    <div className="simulator-keyboard-switch-label font-cyber text-slate-500">SWITCH: {keyboardSwitch.toUpperCase()}</div>
                    {Array.from({ length: 12 }).map((_, idx) => (
                      <div
                        key={idx}
                        className="h-full flex-1 rounded-[1px] transition-colors duration-500"
                        style={{
                          backgroundColor: idx % 2 === 0 ? rgbColor : '#1e293b',
                          opacity: idx % 2 === 0 ? 0.9 : 0.4
                        }}
                      />
                    ))}
                  </div>

                  {/* Mouse */}
                  <div className="w-5 h-7 bg-[#0c0c14] border border-slate-800 rounded-full flex justify-center items-center relative">
                    <div className="absolute -top-4 right-0 text-[8px] font-cyber text-slate-500 tracking-wider">MOUSE</div>
                    <div className="w-0.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: rgbColor }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Specs & Pricing summary widget */}
            <div className="bg-black/60 border border-white/5 rounded-xl p-4 flex flex-col sm:flex-row justify-between items-center gap-4 mt-6">
              <div>
                <span className="text-[10px] text-slate-500 font-cyber font-bold tracking-widest block uppercase">Estimated Configurator Price</span>
                <span className="text-2xl font-cyber font-black tracking-wider text-white">
                  ${getBuilderTotal().toLocaleString()}
                </span>
              </div>
              <button
                onClick={addCustomSetupToCart}
                className="cyber-btn cyber-btn-solid text-xs flex items-center gap-2 w-full sm:w-auto justify-center"
              >
                <Plus className="w-4 h-4" /> Add Configuration to Cart
              </button>
            </div>

          </div>

          {/* Configurator Side Controls (Right) */}
          <div className="lg:col-span-5 flex flex-col gap-6">

            {/* Control Group 1: Desk size */}
            <div className="glass-panel rounded-2xl p-5 border border-white/10 flex flex-col gap-3">
              <div className="flex items-center gap-2 text-slate-400">
                <Sliders className="w-4 h-4 text-[#D946EF]" />
                <h3 className="font-cyber text-sm font-bold tracking-wider text-white">1. DESK PLATFORM</h3>
              </div>
              <div className="grid grid-cols-3 gap-2 mt-1">
                {[
                  { id: 'standard', name: 'Standard', desc: '120x60cm', price: 399 },
                  { id: 'pro', name: 'Pro Frame', desc: '160x80cm', price: 549 },
                  { id: 'elite', name: 'Elite L-Desk', desc: '180x120cm', price: 899 }
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setDeskSize(item.id)}
                    className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all duration-300 ${deskSize === item.id ? 'border-[#D946EF] bg-[#D946EF]/10' : 'border-white/5 bg-white/[0.02] hover:bg-white/[0.05]'}`}
                  >
                    <span className="text-xs font-bold font-cyber text-white">{item.name}</span>
                    <span className="text-[10px] text-slate-500 font-sans mt-0.5">{item.desc}</span>
                    <span className="text-xs font-cyber text-[#D946EF] font-bold mt-2">${item.price}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Control Group 2: Monitor setup */}
            <div className="glass-panel rounded-2xl p-5 border border-white/10 flex flex-col gap-3">
              <div className="flex items-center gap-2 text-slate-400">
                <Monitor className="w-4 h-4 text-[#06B6D4]" />
                <h3 className="font-cyber text-sm font-bold tracking-wider text-white">2. DISPLAY MODULE</h3>
              </div>
              <div className="grid grid-cols-3 gap-2 mt-1">
                {[
                  { id: 'dual', name: 'Dual 27"', desc: 'Flat IPS 4K', price: 399 },
                  { id: 'ultrawide', name: 'Curved 49"', desc: '32:9 OLED', price: 799 },
                  { id: 'triple', name: 'Triple 32"', desc: 'Immersive Rig', price: 1299 }
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setMonitorType(item.id)}
                    className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all duration-300 ${monitorType === item.id ? 'border-[#06B6D4] bg-[#06B6D4]/10' : 'border-white/5 bg-white/[0.02] hover:bg-white/[0.05]'}`}
                  >
                    <span className="text-xs font-bold font-cyber text-white">{item.name}</span>
                    <span className="text-[10px] text-slate-500 font-sans mt-0.5">{item.desc}</span>
                    <span className="text-xs font-cyber text-[#06B6D4] font-bold mt-2">${item.price}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Control Group 3: Keyboard switch */}
            <div className="glass-panel rounded-2xl p-5 border border-white/10 flex flex-col gap-3">
              <div className="flex items-center gap-2 text-slate-400">
                <Keyboard className="w-4 h-4 text-[#F43F5E]" />
                <h3 className="font-cyber text-sm font-bold tracking-wider text-white">3. MECHANICAL SWITCHES</h3>
              </div>
              <div className="grid grid-cols-3 gap-2 mt-1">
                {[
                  { id: 'tactile', name: 'Tactile', desc: 'Clicky Blue', price: 149 },
                  { id: 'linear', name: 'Linear', desc: 'Silent Red', price: 169 },
                  { id: 'rapid', name: 'Hall Effect', desc: 'Analog Rapid', price: 229 }
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setKeyboardSwitch(item.id)}
                    className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all duration-300 ${keyboardSwitch === item.id ? 'border-[#F43F5E] bg-[#F43F5E]/10' : 'border-white/5 bg-white/[0.02] hover:bg-white/[0.05]'}`}
                  >
                    <span className="text-xs font-bold font-cyber text-white">{item.name}</span>
                    <span className="text-[10px] text-slate-500 font-sans mt-0.5">{item.desc}</span>
                    <span className="text-xs font-cyber text-[#F43F5E] font-bold mt-2">${item.price}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Control Group 4: PC Tiers */}
            <div className="glass-panel rounded-2xl p-5 border border-white/10 flex flex-col gap-3">
              <div className="flex items-center gap-2 text-slate-400">
                <Cpu className="w-4 h-4 text-emerald-500" />
                <h3 className="font-cyber text-sm font-bold tracking-wider text-white">4. COMPUTATION STATION</h3>
              </div>
              <div className="flex flex-col gap-2 mt-1">
                {[
                  { id: 'tier1', name: 'Tier I: Neo-Runner', desc: 'RTX 4060 Ti | Ryzen 5 | 16GB DDR5', price: 1199 },
                  { id: 'tier2', name: 'Tier II: Grid-Master', desc: 'RTX 4070 Ti Super | Ryzen 7 | 32GB DDR5', price: 1899 },
                  { id: 'tier3', name: 'Tier III: Overlord Custom', desc: 'RTX 4090 Custom Loop | Ryzen 9 | 64GB DDR5', price: 3499 }
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setPcTier(item.id)}
                    className={`flex justify-between items-center p-3 rounded-xl border text-left transition-all duration-300 ${pcTier === item.id ? 'border-emerald-500 bg-emerald-500/10' : 'border-white/5 bg-white/[0.02] hover:bg-white/[0.05]'}`}
                  >
                    <div className="flex flex-col">
                      <span className="text-xs font-bold font-cyber text-white">{item.name}</span>
                      <span className="text-[10px] text-slate-500 font-sans mt-0.5">{item.desc}</span>
                    </div>
                    <span className="text-xs font-cyber text-emerald-500 font-bold ml-2">${item.price}</span>
                  </button>
                ))}
              </div>
            </div>

          </div>

        </div>

      </section>

      {/* Featured Gaming Gear (Products Grid) */}
      <section id="gear" className="relative z-10 py-24 px-6 md:px-12 border-t border-white/5">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="cyber-badge mb-4">Elite Gear Catalog</div>
          <h2 className="text-3xl md:text-5xl font-black font-cyber mb-4">
            FEATURED <span className="glow-text-secondary">GAMING</span> GEAR
          </h2>
          <p className="text-slate-400 text-sm md:text-base font-sans">
            Add hot modular upgrades individually. Tuned for peak competitive responsiveness.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {FEATURED_PRODUCTS.map((product) => (
            <div
              key={product.id}
              className="product-card glass-panel rounded-2xl p-5 border border-white/10 flex flex-col justify-between transition-all duration-300 group hover:translate-y-[-5px]"
            >
              <div>
                {/* Product Image Container */}
                <div className="product-image-container">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="product-image-fit transition-transform duration-500 group-hover:scale-105"
                  />
                  {/* Rating overlay */}
                  <div className="absolute top-3 right-3 flex items-center gap-1 bg-black/80 border border-white/15 rounded-full px-2.5 py-1 text-xs z-10">
                    <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                    <span className="font-cyber font-bold text-[10px] text-white">{product.rating}</span>
                  </div>
                  {/* Category overlay */}
                  <div className="absolute bottom-3 left-3 bg-[#050508]/85 border border-white/10 rounded px-2 py-0.5 text-[9px] font-cyber tracking-widest text-[#06B6D4] uppercase z-10">
                    {product.category}
                  </div>
                </div>

                <h3 className="font-cyber font-bold text-base text-white mb-3 group-hover:text-[#06B6D4] transition-colors duration-200">
                  {product.name}
                </h3>

                {/* Tech Specs bullet list */}
                <ul className="flex flex-col gap-1.5 mb-6">
                  {product.specs.map((spec, i) => (
                    <li key={i} className="flex items-center gap-2 text-[11px] text-slate-400 font-sans">
                      <Check className="w-3 h-3 text-[#06B6D4]" style={{ minWidth: '12px' }} />
                      <span className="truncate">{spec}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Price and Cart Buttons */}
              <div className="flex justify-between items-center pt-3 border-t border-white/5">
                <div>
                  <span className="text-[8px] text-slate-500 uppercase tracking-widest block font-cyber">MSRP PRICE</span>
                  <span className="text-lg font-cyber font-black tracking-wider text-white">
                    ${product.price}
                  </span>
                </div>
                <button
                  onClick={() => addProductToCart(product)}
                  className="cyber-btn text-xs py-1.5 px-3.5 flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" /> Buy
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Why Choose Us */}
      <section id="why-us" className="relative z-10 py-24 px-6 md:px-12 border-t border-white/5 bg-[#09090e]/30">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="cyber-badge mb-4">THE NEONFORGE ADVANTAGE</div>
          <h2 className="text-3xl md:text-5xl font-black font-cyber mb-4">
            WHY GAMERS <span className="glow-text-primary">CHOOSE</span> US
          </h2>
          <p className="text-slate-400 text-sm md:text-base font-sans">
            Every setup is an engineering masterwork. We design layouts that maximize spatial harmony and gaming performance.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid md:grid-cols-12 gap-6 max-w-7xl mx-auto">
          {/* Card 1: Hand-built and customizable (6 cols) */}
          <div className="md:col-span-8 glass-panel rounded-2xl p-8 border border-white/10 flex flex-col justify-between relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#D946EF]/20 to-transparent blur-[20px] pointer-events-none" />

            <div>
              <div className="w-12 h-12 rounded-xl bg-[#D946EF]/10 border border-[#D946EF]/30 flex items-center justify-center mb-6">
                <Award className="w-6 h-6 text-[#D946EF]" />
              </div>
              <h3 className="font-cyber font-bold text-xl text-white mb-3">Custom Handcrafted Assembly</h3>
              <p className="text-slate-400 text-sm leading-relaxed max-w-xl font-sans">
                No assembly lines. Every gaming desk and frame setup is crafted by hand, calibrated by certified structural engineers, and packaged with extreme care. We guarantee zero desk wobble, even at maximum height extension.
              </p>
            </div>

            <div className="mt-8 flex items-center gap-3">
              <span className="text-[10px] font-cyber text-slate-500 tracking-wider">CERTIFICATE ID: NF-84920</span>
              <div className="h-px flex-1 bg-white/5" />
              <span className="text-[10px] font-cyber text-[#D946EF] font-bold">100% QUALITY SHIELD</span>
            </div>
          </div>

          {/* Card 2: Low latency (4 cols) */}
          <div className="md:col-span-4 glass-panel rounded-2xl p-8 border border-white/10 flex flex-col justify-between relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-[#06B6D4]/20 to-transparent blur-[15px] pointer-events-none" />

            <div>
              <div className="w-12 h-12 rounded-xl bg-[#06B6D4]/10 border border-[#06B6D4]/30 flex items-center justify-center mb-6">
                <Zap className="w-6 h-6 text-[#06B6D4]" />
              </div>
              <h3 className="font-cyber font-bold text-xl text-white mb-3">Zero-Latency RGB Link</h3>
              <p className="text-slate-400 text-sm leading-relaxed font-sans">
                Our proprietary ChromaSync technology links all accessories directly to your PC, syncing lighting responses to game cues with 0.1ms latency.
              </p>
            </div>

            <div className="mt-8 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#06B6D4] animate-ping" />
              <span className="text-[10px] font-cyber text-[#06B6D4] font-bold">CHROMA_SYNC ONLINE</span>
            </div>
          </div>

          {/* Card 3: Warranty (4 cols) */}
          <div className="md:col-span-4 glass-panel rounded-2xl p-8 border border-white/10 flex flex-col justify-between relative overflow-hidden group">
            <div>
              <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center mb-6">
                <ShieldCheck className="w-6 h-6 text-rose-500" />
              </div>
              <h3 className="font-cyber font-bold text-xl text-white mb-3">5-Year Battle Warranty</h3>
              <p className="text-slate-400 text-sm leading-relaxed font-sans">
                We believe in our gear. If your motor fails, structural desk brackets snap, or custom LEDs burn out within 5 years, we replace it free of charge. No questions.
              </p>
            </div>
            <div className="mt-8">
              <span className="text-[10px] font-cyber text-slate-500 uppercase tracking-widest">WARRANTY CARD ENCLOSED</span>
            </div>
          </div>

          {/* Card 4: Bento grid visual placeholder/interactive counter (8 cols) */}
          <div className="md:col-span-8 glass-panel rounded-2xl p-8 border border-white/10 flex flex-col justify-between relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#D946EF]/5 pointer-events-none" />
            <div>
              <h3 className="font-cyber font-bold text-xl text-white mb-3">Active Stations Global Map</h3>
              <p className="text-slate-400 text-sm leading-relaxed font-sans mb-4">
                NeonForge battlestations are actively powering streamers, developers, and pro esports centers across 48 countries.
              </p>

              {/* Fake cyberpunk node connections */}
              <div className="relative w-full h-24 border border-white/5 rounded-xl bg-black/40 flex items-center justify-around p-4 overflow-hidden">
                <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] bg-[size:10px_10px]" />
                {['NA_WEST', 'EU_CENTRAL', 'APAC_SEOUL'].map((node, i) => (
                  <div key={i} className="flex flex-col items-center gap-1 z-10">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                    <span className="text-[9px] font-cyber text-slate-400">{node}</span>
                    <span className="text-[10px] font-cyber font-bold text-emerald-400">99.9% LIVE</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 flex justify-between items-center text-xs">
              <span className="text-slate-500 font-sans">Updated: Real-time network sync</span>
              <span className="font-cyber text-[#D946EF] font-bold">SECURE_GRID_SYS</span>
            </div>
          </div>
        </div>
      </section>

      {/* Customer Reviews */}
      <section id="reviews" className="relative z-10 py-24 px-6 md:px-12 border-t border-white/5">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="cyber-badge mb-4">COMS FEEDBACK</div>
          <h2 className="text-3xl md:text-5xl font-black font-cyber mb-4">
            THE INTEL: <span className="glow-text-secondary">GAMERS</span> DIALED IN
          </h2>
          <p className="text-slate-400 text-sm md:text-base font-sans">
            Hear from gaming veterans, streamers, and enthusiasts who forge with us.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {REVIEWS.map((review) => (
            <div
              key={review.id}
              className="glass-panel rounded-2xl p-6 border border-white/10 flex flex-col justify-between relative group transition-all duration-300 hover:border-[#D946EF]/30"
            >
              {/* Glowing quotes icon */}
              <span className="absolute top-4 right-6 text-7xl font-cyber text-[#D946EF]/10 font-black pointer-events-none select-none">"</span>

              <div>
                {/* Stars */}
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: review.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-500 text-amber-500" />
                  ))}
                </div>

                <p className="text-slate-300 text-sm italic leading-relaxed mb-6 font-sans">
                  "{review.comment}"
                </p>
              </div>

              {/* Author bio details */}
              <div className="flex items-center gap-4 pt-4 border-t border-white/5">
                <img
                  src={review.avatar}
                  alt={review.name}
                  className="w-12 h-12 rounded-full border border-white/10 object-cover"
                />
                <div>
                  <h4 className="font-cyber font-bold text-xs text-white tracking-wide">{review.name}</h4>
                  <div className="text-[10px] text-slate-500 font-sans mt-0.5">{review.role}</div>
                  <div className="inline-block text-[9px] font-cyber text-[#06B6D4] mt-1 bg-[#06B6D4]/5 border border-[#06B6D4]/20 px-1.5 py-0.5 rounded">
                    {review.setup}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="relative z-10 py-24 px-6 md:px-12 border-t border-white/5 bg-gradient-to-b from-transparent to-[#08080c]">

        <div className="max-w-4xl mx-auto glass-panel rounded-3xl p-8 md:p-12 border border-white/10 relative overflow-hidden text-center flex flex-col items-center">
          {/* Futuristic ambient grid light */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(var(--primary-rgb),0.08)_0%,transparent_60%)] pointer-events-none" />

          <div className="cyber-badge mb-6">LINK SYSTEM</div>

          <h2 className="text-3xl md:text-5xl font-black font-cyber mb-4">
            JOIN THE <span className="glow-text-primary">SYNDICATE</span>
          </h2>

          <p className="text-slate-400 max-w-lg text-sm md:text-base mb-8 font-sans">
            Subscribe to receive direct firmware updates, drop alerts on modular components, and secret catalog discounts.
          </p>

          {newsletterSubscribed ? (
            <div className="bg-emerald-500/10 border border-emerald-500/40 rounded-xl p-6 text-center max-w-md animate-pulse">
              <Check className="w-10 h-10 text-emerald-400 mx-auto mb-3" />
              <h4 className="font-cyber font-bold text-white text-base mb-1">CONGRATULATIONS. YOU ARE IN.</h4>
              <p className="text-xs text-slate-400 font-sans">Check your network terminal for initial verification codes shortly.</p>
            </div>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (email) setNewsletterSubscribed(true);
              }}
              className="flex flex-col sm:flex-row gap-3 w-full max-w-md z-10"
            >
              <input
                type="email"
                placeholder="ENTER TERMINAL EMAIL"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="flex-1 bg-black/80 border border-white/10 rounded-xl px-5 py-3.5 text-sm text-white focus:outline-none focus:border-[#D946EF] font-cyber transition-all placeholder:text-slate-700 tracking-wider text-center"
              />
              <button
                type="submit"
                className="cyber-btn cyber-btn-solid flex items-center justify-center gap-2"
              >
                Connect <Send className="w-4 h-4" />
              </button>
            </form>
          )}

          <div className="text-[9px] font-cyber text-slate-600 tracking-widest mt-8">
            DATA SECURED // END-TO-END QUANTUM ENCRYPTION
          </div>
        </div>

      </section>

      {/* Cart Slider Drawer */}
      {cartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setCartOpen(false)} />

          <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-md glass-panel border-l border-white/10 flex flex-col justify-between">

              {/* Header */}
              <div className="p-6 border-b border-white/5 flex justify-between items-center bg-black/40">
                <div className="flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5 text-[#D946EF]" />
                  <span className="font-cyber font-bold text-white tracking-widest text-sm">YOUR TERMINAL INVENTORY</span>
                </div>
                <button
                  onClick={() => setCartOpen(false)}
                  className="p-1 rounded bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
                >
                  <X className="w-4 h-4 text-slate-400" />
                </button>
              </div>

              {/* Items List */}
              <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4">
                {cart.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center">
                    <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-3xl mb-4 opacity-40">
                      📭
                    </div>
                    <h4 className="font-cyber font-bold text-slate-500 text-xs tracking-wider">INVENTORY IS EMPTY</h4>
                    <p className="text-[11px] text-slate-600 mt-1 max-w-xs font-sans">Browse setups or featured gear catalogs to add modules.</p>
                  </div>
                ) : (
                  cart.map((item) => (
                    <div
                      key={item.id}
                      className="bg-black/40 border border-white/5 rounded-xl p-4 flex gap-4 items-start relative group"
                    >
                      <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-lg flex items-center justify-center overflow-hidden">
                        {item.image && (item.image.startsWith('http') || item.image.startsWith('/')) ? (
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-2xl">{item.image}</span>
                        )}
                      </div>

                      <div className="flex-1">
                        <h4 className="font-cyber font-bold text-xs text-white leading-snug">{item.name}</h4>
                        <div className="text-[11px] text-[#06B6D4] font-cyber mt-1">${item.price.toLocaleString()}</div>
                        {item.specs && item.specs.length > 0 && (
                          <div className="mt-2 flex flex-col gap-1">
                            {item.specs.map((spec, i) => (
                              <span key={i} className="text-[9px] text-slate-500 font-sans block">• {spec}</span>
                            ))}
                          </div>
                        )}
                      </div>

                      <button
                        onClick={() => removeCartItem(item.id)}
                        className="absolute top-2 right-2 p-1 rounded hover:bg-white/5 opacity-0 group-hover:opacity-100 transition-all"
                        title="Remove"
                      >
                        <X className="w-3.5 h-3.5 text-slate-500 hover:text-rose-500" />
                      </button>
                    </div>
                  ))
                )}
              </div>

              {/* Total & Checkout */}
              {cart.length > 0 && (
                <div className="p-6 border-t border-white/5 bg-black/40 flex flex-col gap-4">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] text-slate-500 font-cyber font-bold tracking-widest">TOTAL VALUE</span>
                    <span className="text-xl font-cyber font-black tracking-wider text-[#D946EF]">
                      ${cart.reduce((sum, item) => sum + item.price, 0).toLocaleString()}
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      alert('Checkout simulated! Terminal orders locked. Thank you for choosing NeonForge.');
                      setCart([]);
                      setCartOpen(false);
                    }}
                    className="cyber-btn cyber-btn-solid text-center w-full flex items-center justify-center gap-2"
                  >
                    LOCK ORDERS & CHECKOUT <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}

            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/5 bg-black py-12 px-6 md:px-12 text-slate-500 text-xs">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-col items-center md:items-start gap-2">
            <span className="font-cyber font-black text-sm text-white tracking-widest">NEON<span className="text-[#D946EF]">FORGE</span></span>
            <span className="text-[10px] font-cyber tracking-widest text-slate-700">CYBERPUNK STATION STORE // EST 2026</span>
          </div>

          <div className="flex gap-8 text-[10px] font-cyber tracking-widest">
            <a href="#" className="hover:text-white transition-colors uppercase">Security policy</a>
            <a href="#" className="hover:text-white transition-colors uppercase">Terms of contract</a>
            <a href="#" className="hover:text-white transition-colors uppercase">Firmware updates</a>
          </div>

          <div className="text-[9px] font-cyber text-slate-700">
            © 2026 NEONFORGE. ALL TERMINAL RIGHTS REGISTERED.
          </div>
        </div>
      </footer>

    </div>
  );
}
