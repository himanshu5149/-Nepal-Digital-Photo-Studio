/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Camera, 
  Image as ImageIcon, 
  Printer, 
  Edit3, 
  Video, 
  User, 
  Award, 
  Clock, 
  DollarSign, 
  Star, 
  Phone, 
  MapPin, 
  Facebook, 
  Instagram, 
  Menu, 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Pencil,
  Send,
  Plus,
  Trash2,
  CheckCircle2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// --- CONFIGURATION ---
const CONFIG = {
  studioName: "Nepal Digital Photo Studio",
  tagline: "Professional Photography & Digital Printing",
  phone: "9826810064",
  address: "Barahathawa, Sarlahi, Nepal",
  facebook: "https://facebook.com",
  instagram: "https://instagram.com",
  tiktok: "https://tiktok.com",
  accentColor: "#c9a84c",
  darkBg: "#0d0d0d",
  googleMapEmbed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14283.476483561916!2d85.45934525!3d26.8123456!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39ec3b3b3b3b3b3b%3A0x3b3b3b3b3b3b3b3b!2sBarahathawa%2C%20Nepal!5e0!3m2!1sen!2snp!4v1711945000000!5m2!1sen!2snp"
};

// --- TYPES ---
interface Service {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
}

interface GalleryItem {
  id: number;
  category: string;
  src: string;
  title?: string;
  client?: string;
  location?: string;
  date?: string;
  description?: string;
  clientPhone?: string;
}

interface Testimonial {
  id: number;
  name: string;
  rating: number;
  quote: string;
}

// --- COMPONENTS ---

const EditableText = ({ 
  value, 
  onChange, 
  isEditMode, 
  className = "", 
  tagName: Tag = "span" as any 
}: { 
  value: string, 
  onChange: (val: string) => void, 
  isEditMode: boolean, 
  className?: string, 
  tagName?: any
}) => {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    if (ref.current && ref.current.innerText !== value) {
      ref.current.innerText = value;
    }
  }, [value]);

  if (!isEditMode) {
    return <Tag className={className}>{value}</Tag>;
  }

  return (
    <Tag
      ref={ref}
      contentEditable
      suppressContentEditableWarning
      onBlur={(e: React.FocusEvent<HTMLElement>) => onChange(e.currentTarget.innerText)}
      className={`${className} outline-none border-b border-dashed border-accent/50 focus:border-accent bg-accent/5 px-1 rounded transition-all`}
    >
      {value}
    </Tag>
  );
};

const SectionHeading = ({ children, subtitle }: { children: React.ReactNode, subtitle?: string }) => (
  <div className="text-center mb-16 px-4">
    <motion.h2 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="text-4xl md:text-5xl font-heading font-bold mb-4 text-white"
    >
      {children}
    </motion.h2>
    {subtitle && (
      <motion.p 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.1 }}
        className="text-muted max-w-2xl mx-auto"
      >
        {subtitle}
      </motion.p>
    )}
    <motion.div 
      initial={{ width: 0 }}
      whileInView={{ width: 80 }}
      viewport={{ once: true }}
      transition={{ delay: 0.2, duration: 0.8 }}
      className="h-1 bg-accent mx-auto mt-6"
    />
  </div>
);

const StatCounter = ({ value, label }: { value: string, label: string }) => {
  const [count, setCount] = useState(0);
  const target = parseInt(value.replace(/\D/g, ''));
  const suffix = value.replace(/[0-9]/g, '');
  const ref = useRef<HTMLDivElement>(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          let start = 0;
          const duration = 2000;
          const increment = target / (duration / 16);
          const timer = setInterval(() => {
            start += increment;
            if (start >= target) {
              setCount(target);
              clearInterval(timer);
            } else {
              setCount(Math.floor(start));
            }
          }, 16);
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target, hasAnimated]);

  return (
    <div ref={ref} className="text-center p-6 bg-white/5 rounded-xl border border-white/10 backdrop-blur-sm">
      <div className="text-4xl font-heading font-bold text-accent mb-2">
        {count}{suffix}
      </div>
      <div className="text-sm uppercase tracking-widest text-muted">{label}</div>
    </div>
  );
};

export default function App() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isAdminSession, setIsAdminSession] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('admin') === 'true') {
      setIsAdminSession(true);
    } else {
      setIsAdminSession(false);
      setIsEditMode(false);
    }
  }, [window.location.search]);

  const toggleEditMode = () => {
    if (!isEditMode) {
      const password = window.prompt("Enter Owner Password to customize:");
      if (password === "admin123") { // Simple default password
        setIsEditMode(true);
      } else if (password !== null) {
        alert("Incorrect password.");
      }
    } else {
      setIsEditMode(false);
    }
  };
  
  // --- EDITABLE CONFIG STATE ---
  const [studioConfig, setStudioConfig] = useState(() => {
    const saved = localStorage.getItem('studioConfig');
    return saved ? JSON.parse(saved) : {
      studioName: CONFIG.studioName,
      tagline: CONFIG.tagline,
      phone: CONFIG.phone,
      address: CONFIG.address,
      facebook: CONFIG.facebook,
      instagram: CONFIG.instagram,
      tiktok: CONFIG.tiktok,
    };
  });

  const [logo, setLogo] = useState(() => localStorage.getItem('studioLogo') || "https://picsum.photos/seed/nepal-digital-photo-studio-logo/200/200");
  const [heroImage, setHeroImage] = useState(() => localStorage.getItem('studioHero') || "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?q=80&w=1920&auto=format&fit=crop");
  const [galleryFilter, setGalleryFilter] = useState("All");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [showToast, setShowToast] = useState(false);

  // --- DATA ---
  const services: Service[] = [
    { id: 1, title: "Portrait Photography", description: "Capturing the essence of your personality in every shot.", icon: <User className="w-8 h-8" /> },
    { id: 2, title: "Wedding & Events", description: "Preserving your most precious memories with cinematic style.", icon: <Camera className="w-8 h-8" /> },
    { id: 3, title: "Passport & ID Photos", description: "High-quality, instant digital printing for all official needs.", icon: <ImageIcon className="w-8 h-8" /> },
    { id: 4, title: "Digital Photo Printing", description: "Vibrant prints on premium paper that last a lifetime.", icon: <Printer className="w-8 h-8" /> },
    { id: 5, title: "Editing & Retouching", description: "Professional post-processing to make your photos perfect.", icon: <Edit3 className="w-8 h-8" /> },
    { id: 6, title: "Video Shoots & Reels", description: "Dynamic video content for social media and special occasions.", icon: <Video className="w-8 h-8" /> },
  ];

  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>(() => {
    const saved = localStorage.getItem('galleryItems');
    return saved ? JSON.parse(saved) : [
      { id: 1, category: "Portraits", src: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=80&w=800&auto=format&fit=crop", title: "Classic Studio Portrait", client: "Local Client", location: "Barahathawa", date: "2024" },
      { id: 2, category: "Weddings", src: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=800&auto=format&fit=crop", title: "Traditional Wedding", client: "Local Client", location: "Sarlahi", date: "2023" },
      { id: 3, category: "Events", src: "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=800&auto=format&fit=crop", title: "Corporate Event", client: "Local Client", location: "Kathmandu", date: "2024" },
      { id: 4, category: "Prints", src: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=800&auto=format&fit=crop", title: "Digital Print", client: "Local Client", location: "Nepal Digital Photo Studio", date: "2024" },
      { id: 5, category: "Portraits", src: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800&auto=format&fit=crop", title: "Male Portrait", client: "Local Client", location: "Barahathawa", date: "2024" },
      { id: 6, category: "Weddings", src: "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=800&auto=format&fit=crop", title: "Outdoor Wedding", client: "Local Client", location: "Janakpur", date: "2023" },
      { id: 7, category: "Events", src: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=800&auto=format&fit=crop", title: "Cultural Event", client: "Local Client", location: "Barahathawa", date: "2024" },
      { id: 8, category: "Prints", src: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=800&auto=format&fit=crop", title: "Large Format Print", client: "Local Client", location: "Nepal Digital Photo Studio", date: "2024" },
      { id: 9, category: "Portraits", src: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=800&auto=format&fit=crop", title: "Fashion Portrait", client: "Local Client", location: "Barahathawa", date: "2024" },
      { id: 10, category: "Weddings", src: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=800&auto=format&fit=crop", title: "Wedding Reception", client: "Local Client", location: "Sarlahi", date: "2023" },
      { id: 11, category: "Portraits", src: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=800&auto=format&fit=crop", title: "Female Portrait", client: "Local Client", location: "Barahathawa", date: "2024" },
      { id: 12, category: "Events", src: "https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=800&auto=format&fit=crop", title: "Community Gathering", client: "Local Client", location: "Barahathawa", date: "2024" },
      { id: 13, category: "Weddings", src: "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?q=80&w=800&auto=format&fit=crop", title: "Wedding Ceremony", client: "Local Client", location: "Sarlahi", date: "2023" },
      { id: 14, category: "Portraits", src: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=800&auto=format&fit=crop", title: "Studio Portrait", client: "Local Client", location: "Barahathawa", date: "2024" },
      { id: 15, category: "Events", src: "https://images.unsplash.com/photo-1540575861501-7cf05a4b125a?q=80&w=800&auto=format&fit=crop", title: "Music Event", client: "Local Client", location: "Barahathawa", date: "2024" },
      { id: 16, category: "Events", src: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?q=80&w=800&auto=format&fit=crop", title: "Concert", client: "Local Client", location: "Barahathawa", date: "2024" },
      { id: 17, category: "Events", src: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?q=80&w=800&auto=format&fit=crop", title: "Night Event", client: "Local Client", location: "Barahathawa", date: "2024" },
      { id: 18, category: "Events", src: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=800&auto=format&fit=crop", title: "Stage Performance", client: "Local Client", location: "Barahathawa", date: "2024" },
      { id: 19, category: "Events", src: "https://images.unsplash.com/photo-1514525253344-4256500c4034?q=80&w=800&auto=format&fit=crop", title: "Party", client: "Local Client", location: "Barahathawa", date: "2024" },
      { id: 20, category: "Events", src: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=800&auto=format&fit=crop", title: "Festival", client: "Local Client", location: "Barahathawa", date: "2024" },
      { id: 21, category: "Events", src: "https://images.unsplash.com/photo-1505236858219-8359eb29e329?q=80&w=800&auto=format&fit=crop", title: "Outdoor Event", client: "Local Client", location: "Barahathawa", date: "2024" },
      { id: 22, category: "Product Photography", src: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=800&auto=format&fit=crop", title: "Watch Product", client: "Local Client", location: "Nepal Digital Photo Studio", date: "2024" },
      { id: 23, category: "Product Photography", src: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=800&auto=format&fit=crop", title: "Headphones Product", client: "Local Client", location: "Nepal Digital Photo Studio", date: "2024" },
      { id: 24, category: "Product Photography", src: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=800&auto=format&fit=crop", title: "Shoes Product", client: "Local Client", location: "Nepal Digital Photo Studio", date: "2024" },
      { id: 25, category: "Architectural Shoots", src: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=800&auto=format&fit=crop", title: "Modern Building", client: "Local Client", location: "Kathmandu", date: "2024" },
      { id: 26, category: "Architectural Shoots", src: "https://images.unsplash.com/photo-1449156001437-3a16d1daae39?q=80&w=800&auto=format&fit=crop", title: "Urban Architecture", client: "Local Client", location: "Kathmandu", date: "2024" },
      { id: 27, category: "Architectural Shoots", src: "https://images.unsplash.com/photo-1487958449943-2429e8be8625?q=80&w=800&auto=format&fit=crop", title: "Cityscape", client: "Local Client", location: "Kathmandu", date: "2024" },
    ];
  });

  const [testimonials, setTestimonials] = useState<Testimonial[]>(() => {
    const saved = localStorage.getItem('testimonials');
    return saved ? JSON.parse(saved) : [
      { id: 1, name: "Amit Sah", rating: 5, quote: "Best photo studio in Barahathawa! The quality of digital printing is unmatched." },
      { id: 2, name: "Priya Gupta", rating: 5, quote: "Nepal Digital Photo Studio captured my wedding beautifully. The team is professional and creative." },
      { id: 3, name: "Rajesh Kumar", rating: 5, quote: "Quick turnaround for passport photos and excellent retouching services." },
    ];
  });

  // --- HANDLERS ---
  const updateConfig = (key: keyof typeof studioConfig, value: string) => {
    setStudioConfig(prev => ({ ...prev, [key]: value }));
  };

  const updateTestimonial = (id: number, field: 'name' | 'quote', value: string) => {
    setTestimonials(prev => prev.map(t => t.id === id ? { ...t, [field]: value } : t));
  };

  const updateGalleryItem = (id: number, field: keyof GalleryItem, value: string) => {
    setGalleryItems(prev => prev.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  const deleteGalleryItem = (id: number) => {
    setGalleryItems(prev => prev.filter(item => item.id !== id));
  };

  const addGalleryItem = () => {
    const newItem: GalleryItem = {
      id: Date.now(),
      category: galleryFilter === "All" ? "Portraits" : galleryFilter,
      src: "https://picsum.photos/seed/" + Date.now() + "/800/800",
      title: "New Photo",
      client: "New Client",
      location: "Nepal",
      date: new Date().getFullYear().toString(),
      description: "A beautiful moment captured.",
      clientPhone: ""
    };
    setGalleryItems(prev => [...prev, newItem]);
  };
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // --- PERSISTENCE ---
  useEffect(() => {
    localStorage.setItem('studioConfig', JSON.stringify(studioConfig));
  }, [studioConfig]);

  useEffect(() => {
    localStorage.setItem('galleryItems', JSON.stringify(galleryItems));
  }, [galleryItems]);

  useEffect(() => {
    localStorage.setItem('testimonials', JSON.stringify(testimonials));
  }, [testimonials]);

  useEffect(() => {
    localStorage.setItem('studioLogo', logo);
  }, [logo]);

  useEffect(() => {
    localStorage.setItem('studioHero', heroImage);
  }, [heroImage]);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setLogo(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleHeroUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setHeroImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleGalleryUpload = (id: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setGalleryItems(prev => prev.map(item => item.id === id ? { ...item, src: reader.result as string } : item));
      };
      reader.readAsDataURL(file);
    }
  };

  const filteredGallery = useMemo(() => 
    galleryFilter === "All" ? galleryItems : galleryItems.filter(item => item.category === galleryFilter),
  [galleryFilter, galleryItems]);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
    (e.target as HTMLFormElement).reset();
  };

  // --- RENDER ---
  return (
    <div className="min-h-screen selection:bg-accent selection:text-dark">
      
      {/* EDIT MODE TOGGLE - Hidden from regular users */}
      {isAdminSession && (
        <div className="fixed bottom-10 left-10 z-[120] flex flex-col gap-4">
          <button 
            onClick={toggleEditMode}
            className={`p-4 rounded-full shadow-2xl transition-all flex items-center gap-2 group ${isEditMode ? 'bg-red-500 text-white' : 'bg-accent text-dark'}`}
          >
            <Pencil className={`w-5 h-5 ${isEditMode ? 'animate-pulse' : ''}`} />
            <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-500 whitespace-nowrap font-bold uppercase tracking-widest text-xs">
              {isEditMode ? 'Exit Customization' : 'Customize Studio'}
            </span>
          </button>

          {isEditMode && (
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex flex-col gap-2"
            >
              <button 
                onClick={() => {
                  if (window.confirm("Are you sure you want to reset all customizations to default?")) {
                    localStorage.clear();
                    window.location.reload();
                  }
                }}
                className="bg-white/10 backdrop-blur-md text-white p-3 rounded-full hover:bg-white/20 transition-all flex items-center gap-2 group"
                title="Reset to Defaults"
              >
                <Trash2 className="w-4 h-4" />
                <span className="text-[10px] uppercase font-bold tracking-widest">Reset</span>
              </button>
              <button 
                onClick={() => {
                  setShowToast(true);
                  setTimeout(() => setShowToast(false), 3000);
                }}
                className="bg-green-600 text-white p-3 rounded-full hover:bg-green-700 transition-all flex items-center gap-2 group shadow-lg"
                title="Publish Changes"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span className="text-[10px] uppercase font-bold tracking-widest">Publish</span>
              </button>
            </motion.div>
          )}
        </div>
      )}

      {/* NAVBAR */}
      <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-dark/95 backdrop-blur-md py-4 shadow-xl' : 'bg-transparent py-6'}`}>
        <div className="container mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-4 group cursor-pointer" onClick={() => isEditMode && document.getElementById('logo-upload')?.click()}>
            <input type="file" id="logo-upload" className="hidden" accept="image/*" onChange={handleLogoUpload} />
            <div className="relative">
              <img src={logo} alt="Logo" className="w-12 h-12 rounded-full object-cover border-2 border-accent transition-transform group-hover:scale-110" referrerPolicy="no-referrer" />
              {isEditMode && <div className="absolute inset-0 bg-dark/40 rounded-full flex items-center justify-center text-white"><Pencil className="w-4 h-4" /></div>}
            </div>
            <EditableText 
              value={studioConfig.studioName} 
              onChange={(val) => updateConfig('studioName', val)} 
              isEditMode={isEditMode} 
              className="text-2xl font-heading font-bold tracking-tight text-white" 
            />
          </div>

          <div className="hidden md:flex items-center gap-8">
            {['Home', 'Services', 'Gallery', 'About', 'Contact'].map((item) => (
              <a key={item} href={`#${item.toLowerCase()}`} className="text-sm font-medium uppercase tracking-widest hover:text-accent transition-colors">
                {item}
              </a>
            ))}
            <a href="#contact" className="bg-accent text-dark px-6 py-2.5 rounded-full font-bold text-sm uppercase tracking-widest hover:bg-white transition-all hover:scale-105 active:scale-95 shadow-lg shadow-accent/20">
              Book Now
            </a>
          </div>

          <button className="md:hidden text-white" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-dark border-t border-white/10 overflow-hidden"
            >
              <div className="flex flex-col p-6 gap-4">
                {['Home', 'Services', 'Gallery', 'About', 'Contact'].map((item) => (
                  <a key={item} href={`#${item.toLowerCase()}`} onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-medium uppercase tracking-widest hover:text-accent transition-colors">
                    {item}
                  </a>
                ))}
                <a href="#contact" onClick={() => setIsMobileMenuOpen(false)} className="bg-accent text-dark px-6 py-3 rounded-full font-bold text-center uppercase tracking-widest">
                  Book Now
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* HERO */}
      <section id="home" className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src={heroImage} alt="Hero" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
          <div className="absolute inset-0 bg-gradient-to-b from-dark/70 via-dark/40 to-dark" />
        </div>
        
        <div className="container mx-auto px-6 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-8xl font-heading font-bold mb-6 leading-tight text-white">
              {/* EDIT: main headline */}
              <EditableText 
                value="Capturing Your" 
                onChange={() => {}} 
                isEditMode={isEditMode} 
                tagName="span" 
              /> <br />
              <span className="text-accent italic">
                <EditableText 
                  value="Moments, Forever." 
                  onChange={() => {}} 
                  isEditMode={isEditMode} 
                  tagName="span" 
                />
              </span>
            </h1>
            <p className="text-lg md:text-xl text-muted mb-10 max-w-2xl mx-auto font-light tracking-wide">
              {/* EDIT: subtext */}
              <EditableText 
                value="Professional Photography & Digital Studio — " 
                onChange={() => {}} 
                isEditMode={isEditMode} 
                tagName="span" 
              />
              <EditableText 
                value={studioConfig.address} 
                onChange={(val) => updateConfig('address', val)} 
                isEditMode={isEditMode} 
                tagName="span" 
              />
              <br />
              <EditableText 
                value="We turn your vision into timeless art." 
                onChange={() => {}} 
                isEditMode={isEditMode} 
                tagName="span" 
              />
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a href="#contact" className="w-full sm:w-auto bg-accent text-dark px-10 py-4 rounded-full font-bold uppercase tracking-widest hover:bg-white transition-all hover:scale-105 shadow-xl shadow-accent/20">
                Book a Session
              </a>
              <a href="#gallery" className="w-full sm:w-auto border border-white/30 text-white px-10 py-4 rounded-full font-bold uppercase tracking-widest hover:bg-white/10 transition-all">
                View Gallery
              </a>
            </div>
          </motion.div>
        </div>

        {/* Hero Image Upload Trigger */}
        <button 
          onClick={() => document.getElementById('hero-upload')?.click()}
          className="absolute bottom-10 right-10 p-4 bg-white/10 backdrop-blur-md rounded-full border border-white/20 hover:bg-accent hover:text-dark transition-all group"
          title="Change Background"
        >
          <input type="file" id="hero-upload" className="hidden" accept="image/*" onChange={handleHeroUpload} />
          <ImageIcon className="w-6 h-6" />
        </button>

        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 text-accent/50"
        >
          <div className="w-6 h-10 border-2 border-accent/30 rounded-full flex justify-center p-1">
            <div className="w-1 h-2 bg-accent rounded-full" />
          </div>
        </motion.div>
      </section>

      {/* SERVICES */}
      <section id="services" className="py-24 bg-dark">
        <div className="container mx-auto px-6">
          <SectionHeading subtitle="From professional portraits to high-quality digital printing, we offer a wide range of services to meet your needs.">
            What We Offer
          </SectionHeading>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, idx) => (
              <motion.div 
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="group p-8 bg-white/5 rounded-2xl border border-white/10 hover:border-accent/50 transition-all hover:-translate-y-2 relative overflow-hidden"
              >
                <div className="absolute bottom-0 left-0 w-0 h-1 bg-accent transition-all duration-500 group-hover:w-full" />
                <div className="text-accent mb-6 bg-accent/10 w-16 h-16 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  {service.icon}
                </div>
                <h3 className="text-2xl font-heading font-bold mb-4 text-white">{service.title}</h3>
                <p className="text-muted leading-relaxed">{service.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* GALLERY */}
      <section id="gallery" className="py-24 bg-[#080808]">
        <div className="container mx-auto px-6">
          <SectionHeading subtitle="A glimpse into our world of professional photography and digital art.">
            Our Work
          </SectionHeading>

          {/* Filter Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-4 mb-12">
            {["All", "Portraits", "Weddings", "Events", "Prints", "Product Photography", "Architectural Shoots"].map((filter) => (
              <button
                key={filter}
                onClick={() => setGalleryFilter(filter)}
                className={`px-8 py-2 rounded-full text-sm font-bold uppercase tracking-widest transition-all ${galleryFilter === filter ? 'bg-accent text-dark shadow-lg shadow-accent/20' : 'bg-white/5 text-muted hover:bg-white/10'}`}
              >
                {filter}
              </button>
            ))}
          </div>

          {/* Masonry Grid */}
          <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {filteredGallery.map((item, idx) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4 }}
                  className="relative group aspect-square overflow-hidden rounded-2xl cursor-pointer"
                >
                  <img 
                    src={item.src} 
                    alt={item.category} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                    onClick={() => setLightboxIndex(idx)}
                    referrerPolicy="no-referrer"
                  />
                  <div className={`absolute inset-0 bg-dark/60 transition-opacity flex items-center justify-center gap-4 ${isEditMode ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                    <div className="flex flex-col gap-2">
                      <button 
                        onClick={(e) => { e.stopPropagation(); document.getElementById(`gallery-upload-${item.id}`)?.click(); }}
                        className="p-3 bg-accent text-dark rounded-full hover:scale-110 transition-transform"
                        title="Replace Image"
                      >
                        <input type="file" id={`gallery-upload-${item.id}`} className="hidden" accept="image/*" onChange={handleGalleryUpload(item.id)} />
                        <Pencil className="w-5 h-5" />
                      </button>
                      {isEditMode && (
                        <button 
                          onClick={(e) => { e.stopPropagation(); deleteGalleryItem(item.id); }}
                          className="p-3 bg-red-500 text-white rounded-full hover:scale-110 transition-transform"
                          title="Delete Image"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                    <div className="text-white text-center px-4 max-h-full overflow-y-auto py-4">
                      <p className="text-xs uppercase tracking-widest font-bold text-accent mb-1">
                        {isEditMode && <span className="block text-[8px] opacity-50 mb-0.5">Category:</span>}
                        <EditableText 
                          value={item.category} 
                          onChange={(val) => updateGalleryItem(item.id, 'category', val)} 
                          isEditMode={isEditMode} 
                          tagName="span"
                        />
                      </p>
                      <div className="mb-2">
                        {isEditMode && <span className="block text-[8px] opacity-50 mb-0.5">Title:</span>}
                        <EditableText 
                          value={item.title || "Untitled"} 
                          onChange={(val) => updateGalleryItem(item.id, 'title', val)} 
                          isEditMode={isEditMode} 
                          className="text-lg font-heading font-bold block" 
                          tagName="span"
                        />
                        <div className="flex flex-col gap-1 mt-1">
                          {isEditMode && <span className="block text-[8px] opacity-50 mb-0.5">Client:</span>}
                          <EditableText 
                            value={item.client || "Local Client"} 
                            onChange={(val) => updateGalleryItem(item.id, 'client', val)} 
                            isEditMode={isEditMode} 
                            className="text-xs italic opacity-80 block" 
                            tagName="span"
                          />
                          {isEditMode && (
                            <>
                              <span className="block text-[8px] opacity-50 mb-0.5">Phone:</span>
                              <EditableText 
                                value={item.clientPhone || ""} 
                                onChange={(val) => updateGalleryItem(item.id, 'clientPhone', val)} 
                                isEditMode={isEditMode} 
                                className="text-[10px] opacity-60 block" 
                                tagName="span"
                              />
                            </>
                          )}
                          {isEditMode && (
                            <>
                              <span className="block text-[8px] opacity-50 mb-0.5">Location:</span>
                              <EditableText 
                                value={item.location || "Nepal"} 
                                onChange={(val) => updateGalleryItem(item.id, 'location', val)} 
                                isEditMode={isEditMode} 
                                className="text-[10px] uppercase tracking-tighter opacity-60 block" 
                                tagName="span"
                              />
                              <span className="block text-[8px] opacity-50 mb-0.5">Date:</span>
                              <EditableText 
                                value={item.date || "2024"} 
                                onChange={(val) => updateGalleryItem(item.id, 'date', val)} 
                                isEditMode={isEditMode} 
                                className="text-[10px] opacity-60 block" 
                                tagName="span"
                              />
                              <span className="block text-[8px] opacity-50 mb-0.5">Description:</span>
                              <EditableText 
                                value={item.description || ""} 
                                onChange={(val) => updateGalleryItem(item.id, 'description', val)} 
                                isEditMode={isEditMode} 
                                className="text-[11px] mt-2 opacity-70 block leading-tight" 
                                tagName="span"
                              />
                            </>
                          )}
                          {!isEditMode && (
                            <>
                              <span className="text-[10px] uppercase tracking-tighter opacity-60 block">{item.location}</span>
                              <span className="text-[10px] opacity-60 block">{item.date}</span>
                            </>
                          )}
                        </div>
                      </div>
                      <p className="text-sm font-heading italic">View Fullscreen</p>
                    </div>
                  </div>
                </motion.div>
              ))}
              {isEditMode && (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="relative aspect-square overflow-hidden rounded-2xl border-2 border-dashed border-accent/40 flex items-center justify-center cursor-pointer hover:bg-accent/5 transition-colors"
                  onClick={addGalleryItem}
                >
                  <div className="text-center">
                    <div className="bg-accent/10 p-4 rounded-full inline-block mb-2">
                      <Plus className="w-8 h-8 text-accent" />
                    </div>
                    <p className="text-accent font-bold uppercase tracking-widest text-xs">Add New Photo</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="py-24 bg-dark overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:w-1/2 relative"
            >
              <div className="relative z-10 rounded-3xl overflow-hidden border-4 border-accent/20 shadow-2xl">
                <img src="https://images.unsplash.com/photo-1493863641943-9b68992a8d07?q=80&w=800&auto=format&fit=crop" alt="Studio" className="w-full h-auto" referrerPolicy="no-referrer" />
              </div>
              <div className="absolute -top-10 -left-10 w-40 h-40 bg-accent/10 rounded-full blur-3xl" />
              <div className="absolute -bottom-10 -right-10 w-60 h-60 bg-accent/5 rounded-full blur-3xl" />
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:w-1/2"
            >
              <h4 className="text-accent font-bold uppercase tracking-widest text-sm mb-4">Our Story</h4>
              <h2 className="text-4xl md:text-5xl font-heading font-bold mb-8 text-white">About Nepal Digital Photo Studio</h2>
              <p className="text-muted text-lg leading-relaxed mb-8">
                Located in the heart of Barahathawa, Sarlahi, Nepal Digital Photo Studio has been a cornerstone of digital photography and printing for years. Our mission is to provide premium quality services that capture the true essence of your most cherished moments.
              </p>
              <p className="text-muted text-lg leading-relaxed mb-12">
                We combine state-of-the-art equipment with creative expertise to deliver results that exceed expectations. Whether it's a wedding, a professional portrait, or a simple passport photo, we treat every project with the same level of dedication and precision.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <StatCounter value="5000+" label="Photos Delivered" />
                <StatCounter value="8+" label="Years Experience" />
                <StatCounter value="2000+" label="Happy Clients" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="py-24 bg-[#080808]">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: <Camera />, title: "Pro Equipment", desc: "Latest Sony & Canon gear for sharp, vibrant results." },
              { icon: <Award />, title: "Expert Team", desc: "Creative photographers with years of experience." },
              { icon: <Clock />, title: "Quick Delivery", desc: "Instant prints and fast editing turnaround." },
              { icon: <DollarSign />, title: "Fair Pricing", desc: "Premium quality at competitive local rates." },
            ].map((item, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="text-center p-8 bg-white/5 rounded-2xl border border-white/10 hover:bg-accent/5 transition-colors"
              >
                <div className="text-accent mb-6 flex justify-center scale-125">{item.icon}</div>
                <h3 className="text-xl font-heading font-bold mb-3 text-white">{item.title}</h3>
                <p className="text-muted text-sm leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-24 bg-dark relative overflow-hidden">
        <div className="container mx-auto px-6">
          <SectionHeading subtitle="What our clients say about their experience with Nepal Digital Photo Studio.">
            Client Testimonials
          </SectionHeading>

          <div className="max-w-4xl mx-auto">
            <div className="relative">
              <AnimatePresence mode="wait">
                <motion.div
                  key={lightboxIndex || 0}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="bg-white/5 p-10 md:p-16 rounded-3xl border border-white/10 text-center relative"
                >
                  <div className="flex justify-center gap-1 mb-8">
                    {[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 fill-accent text-accent" />)}
                  </div>
                  <p className="text-xl md:text-2xl font-heading italic text-white mb-8 leading-relaxed">
                    "
                    <EditableText 
                      value={testimonials[(lightboxIndex || 0) % testimonials.length].quote} 
                      onChange={(val) => updateTestimonial(testimonials[(lightboxIndex || 0) % testimonials.length].id, 'quote', val)} 
                      isEditMode={isEditMode} 
                      tagName="span" 
                    />
                    "
                  </p>
                  <h4 className="text-accent font-bold uppercase tracking-widest">
                    <EditableText 
                      value={testimonials[(lightboxIndex || 0) % testimonials.length].name} 
                      onChange={(val) => updateTestimonial(testimonials[(lightboxIndex || 0) % testimonials.length].id, 'name', val)} 
                      isEditMode={isEditMode} 
                      tagName="span" 
                    />
                  </h4>
                </motion.div>
              </AnimatePresence>
              
              {/* Carousel Dots */}
              <div className="flex justify-center gap-3 mt-10">
                {testimonials.map((_, i) => (
                  <button 
                    key={i} 
                    onClick={() => setLightboxIndex(i)}
                    className={`w-3 h-3 rounded-full transition-all ${lightboxIndex === i ? 'bg-accent w-8' : 'bg-white/20'}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="py-24 bg-[#080808]">
        <div className="container mx-auto px-6">
          <SectionHeading subtitle="Ready to capture your moments? Get in touch with us today.">
            Contact Us
          </SectionHeading>

          <div className="flex flex-col lg:flex-row gap-16">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:w-1/2"
            >
              <form onSubmit={handleContactSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest font-bold text-muted">Full Name</label>
                    <input required type="text" placeholder="John Doe" className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 focus:border-accent outline-none transition-colors text-white" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest font-bold text-muted">Phone Number</label>
                    <input required type="tel" placeholder="98XXXXXXXX" className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 focus:border-accent outline-none transition-colors text-white" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest font-bold text-muted">Service Needed</label>
                  <select required className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 focus:border-accent outline-none transition-colors text-white appearance-none">
                    <option className="bg-dark">Portrait Photography</option>
                    <option className="bg-dark">Wedding & Events</option>
                    <option className="bg-dark">Passport Photos</option>
                    <option className="bg-dark">Digital Printing</option>
                    <option className="bg-dark">Video Shoot</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest font-bold text-muted">Message</label>
                  <textarea required rows={4} placeholder="Tell us about your requirements..." className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 focus:border-accent outline-none transition-colors text-white resize-none"></textarea>
                </div>
                <button type="submit" className="w-full bg-accent text-dark py-5 rounded-xl font-bold uppercase tracking-widest hover:bg-white transition-all flex items-center justify-center gap-3 group">
                  Send Message
                  <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </button>
              </form>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:w-1/2 space-y-10"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div className="flex items-start gap-4">
                  <div className="bg-accent/10 p-4 rounded-xl text-accent"><Phone /></div>
                  <div>
                    <p className="text-xs uppercase tracking-widest font-bold text-muted mb-1">Call Us</p>
                    <EditableText 
                      value={studioConfig.phone} 
                      onChange={(val) => updateConfig('phone', val)} 
                      isEditMode={isEditMode} 
                      className="text-xl font-heading text-white" 
                    />
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-accent/10 p-4 rounded-xl text-accent"><MapPin /></div>
                  <div>
                    <p className="text-xs uppercase tracking-widest font-bold text-muted mb-1">Visit Us</p>
                    <EditableText 
                      value={studioConfig.address} 
                      onChange={(val) => updateConfig('address', val)} 
                      isEditMode={isEditMode} 
                      className="text-xl font-heading text-white" 
                    />
                  </div>
                </div>
              </div>

              <div className="rounded-3xl overflow-hidden h-[350px] border border-white/10 grayscale hover:grayscale-0 transition-all duration-700">
                <iframe 
                  src={CONFIG.googleMapEmbed} 
                  width="100%" 
                  height="100%" 
                  style={{ border: 0 }} 
                  allowFullScreen 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-20 bg-dark border-t border-white/5">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <img src={logo} alt="Logo" className="w-10 h-10 rounded-full object-cover border border-accent" referrerPolicy="no-referrer" />
                <EditableText 
                  value={studioConfig.studioName} 
                  onChange={(val) => updateConfig('studioName', val)} 
                  isEditMode={isEditMode} 
                  className="text-2xl font-heading font-bold text-white" 
                />
              </div>
              <p className="text-muted leading-relaxed">
                Professional photography and digital studio in <EditableText value={studioConfig.address} onChange={(val) => updateConfig('address', val)} isEditMode={isEditMode} />. Capturing your moments forever with cinematic quality and artistic vision.
              </p>
              <div className="flex items-center gap-4">
                <a href={studioConfig.facebook} className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center hover:bg-accent hover:text-dark transition-all"><Facebook className="w-5 h-5" /></a>
                <a href={studioConfig.instagram} className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center hover:bg-accent hover:text-dark transition-all"><Instagram className="w-5 h-5" /></a>
                <a href={studioConfig.tiktok} className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center hover:bg-accent hover:text-dark transition-all italic font-bold">T</a>
              </div>
            </div>

            <div>
              <h4 className="text-white font-heading font-bold text-xl mb-8">Quick Links</h4>
              <ul className="space-y-4">
                {['Home', 'Services', 'Gallery', 'About', 'Contact'].map(item => (
                  <li key={item}><a href={`#${item.toLowerCase()}`} className="text-muted hover:text-accent transition-colors">{item}</a></li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-white font-heading font-bold text-xl mb-8">Our Services</h4>
              <ul className="space-y-4">
                {['Portrait Photography', 'Wedding & Event', 'Passport Photos', 'Digital Printing', 'Photo Editing'].map(item => (
                  <li key={item}><a href="#services" className="text-muted hover:text-accent transition-colors">{item}</a></li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-white font-heading font-bold text-xl mb-8">Newsletter</h4>
              <p className="text-muted mb-6">Subscribe to get updates on our latest offers and photography tips.</p>
              <div className="relative">
                <input type="email" placeholder="Email Address" className="w-full bg-white/5 border border-white/10 rounded-full px-6 py-3 outline-none focus:border-accent transition-colors" />
                <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-accent text-dark p-2 rounded-full hover:scale-110 transition-transform"><Send className="w-4 h-4" /></button>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
            <p className="text-muted text-sm text-center">
              © 2025 {studioConfig.studioName} — <EditableText value={studioConfig.tagline} onChange={(val) => updateConfig('tagline', val)} isEditMode={isEditMode} />. All rights reserved.
            </p>
            <div className="flex items-center gap-8 text-sm text-muted">
              <a href="#" className="hover:text-accent transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-accent transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>

      {/* LIGHTBOX */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-dark/95 backdrop-blur-xl flex items-center justify-center p-4 md:p-10"
            onClick={() => setLightboxIndex(null)}
          >
            <button className="absolute top-10 right-10 text-white hover:text-accent transition-colors" onClick={() => setLightboxIndex(null)}>
              <X className="w-10 h-10" />
            </button>
            
            <button 
              className="absolute left-4 md:left-10 text-white hover:text-accent transition-colors" 
              onClick={(e) => { e.stopPropagation(); setLightboxIndex(prev => prev! > 0 ? prev! - 1 : filteredGallery.length - 1); }}
            >
              <ChevronLeft className="w-12 h-12" />
            </button>

            <motion.img 
              key={lightboxIndex}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              src={filteredGallery[lightboxIndex].src} 
              alt="Lightbox" 
              className="max-w-full max-h-full object-contain rounded-xl shadow-2xl"
              onClick={(e) => e.stopPropagation()}
              referrerPolicy="no-referrer"
            />

            <button 
              className="absolute right-4 md:right-10 text-white hover:text-accent transition-colors" 
              onClick={(e) => { e.stopPropagation(); setLightboxIndex(prev => prev! < filteredGallery.length - 1 ? prev! + 1 : 0); }}
            >
              <ChevronRight className="w-12 h-12" />
            </button>

            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-center">
              <p className="text-accent font-bold uppercase tracking-widest text-sm mb-2">{filteredGallery[lightboxIndex].category}</p>
              <p className="text-white/50 text-xs">{lightboxIndex + 1} / {filteredGallery.length}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* SUCCESS TOAST */}
      <AnimatePresence>
        {showToast && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[150] bg-accent text-dark px-8 py-4 rounded-full font-bold shadow-2xl flex items-center gap-3"
          >
            {isEditMode ? <CheckCircle2 className="w-5 h-5" /> : <Send className="w-5 h-5" />}
            {isEditMode ? 'Changes Published Successfully!' : 'Message Sent Successfully!'}
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
