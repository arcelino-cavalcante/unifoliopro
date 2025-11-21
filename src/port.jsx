import React, { useState, useEffect, useRef } from 'react';
import {
    Layout, Save, Download, Upload, Plus, Trash2, ExternalLink,
    GraduationCap, Briefcase, User, Share2, Code, Palette,
    Smartphone, Monitor, Settings, Eye, Zap, Layers, Sparkles, PaintBucket,
    BookOpen, Microscope, Building2, Calendar, Menu, X, Info
} from 'lucide-react';

// --- Componentes de UI ---

const Section = ({ title, icon: Icon, children, isOpen, onToggle }) => (
    <div className="border border-gray-200 rounded-xl mb-4 overflow-hidden bg-white shadow-sm transition-all duration-300">
        <button
            onClick={onToggle}
            className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
        >
            <div className="flex items-center gap-3">
                <Icon className="w-5 h-5 text-indigo-600" />
                <span className="font-semibold text-gray-700 text-sm">{title}</span>
            </div>
            <span className={`text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>▼</span>
        </button>
        {isOpen && <div className="p-5 border-t border-gray-100 animate-fadeIn">{children}</div>}
    </div>
);

const InputGroup = ({ label, value, onChange, placeholder, as = "input" }) => (
    <div className="mb-3">
        <label className="block text-[10px] font-bold text-gray-400 mb-1 uppercase tracking-wider">{label}</label>
        {as === "textarea" ? (
            <textarea
                className="w-full p-2 text-sm border border-gray-200 bg-gray-50 rounded-lg focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                rows="3"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
            />
        ) : (
            <input
                type="text"
                className="w-full p-2 text-sm border border-gray-200 bg-gray-50 rounded-lg focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
            />
        )}
    </div>
);

const ColorPicker = ({ label, value, onChange }) => (
    <div className="flex items-center justify-between mb-3 p-2 border border-gray-100 rounded-lg">
        <span className="text-xs font-medium text-gray-600">{label}</span>
        <div className="flex items-center gap-2">
            <span className="text-[10px] text-gray-400 uppercase">{value}</span>
            <input
                type="color"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-8 h-8 rounded cursor-pointer border-none p-0 bg-transparent"
            />
        </div>
    </div>
);

const ToggleSwitch = ({ label, checked, onChange }) => (
    <div className="flex items-center justify-between py-2">
        <span className="text-sm text-gray-700 font-medium">{label}</span>
        <button
            onClick={() => onChange(!checked)}
            className={`w-10 h-5 flex items-center rounded-full p-0.5 transition-colors duration-300 ${checked ? 'bg-indigo-600' : 'bg-gray-300'}`}
        >
            <div className={`bg-white w-4 h-4 rounded-full shadow-md transform duration-300 ${checked ? 'translate-x-5' : ''}`}></div>
        </button>
    </div>
);

// --- Dados Iniciais ---

const initialData = {
    config: {
        preloader: true,
        cardStyle: 'glass', // glass, flat, outline, neubrutalism
        animationStyle: 'apple', // fade, slide-up, slide-side, zoom, apple
        avatarShape: 'round', // round, square, modern
        avatarFrame: 'default', // default, outline, shadow, none
        profileType: 'universitario', // universitario, professor
        showAvatar: true,
        showBio: true,
        showLocation: true,
        showFooter: true,
        showEvents: true,
        showContactCTA: true,
        salesLink: 'https://unifolio.com'
    },
    style: {
        bgType: 'gradient', // gradient, solid
        bgStart: '#EEF2FF',
        bgEnd: '#C7D2FE',
        textColor: '#1e293b',
        cardColor: '#ffffff',
        cardOpacity: 0.7,
        buttonColor: '#4F46E5',
        buttonTextColor: '#ffffff',
        font: 'Inter'
    },
    profile: {
        name: 'Gabriel Martins',
        role: 'Engenharia de Software',
        bio: 'Estudante apaixonado por tecnologia, buscando transformar problemas complexos em soluções digitais simples.',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80', // Default image
        location: 'São Paulo, SP'
    },
    links: [
        { id: 1, title: 'GitHub', url: '#', icon: 'github' },
        { id: 2, title: 'LinkedIn', url: '#', icon: 'linkedin' },
        { id: 3, title: 'Lattes / CV', url: '#', icon: 'file' }
    ],
    academic: [
        { id: 1, title: 'Universidade Estadual', subtitle: 'Bacharelado em Ciência da Computação', period: '2021 - Presente', description: 'Membro do centro acadêmico e monitor de Algoritmos I.' }
    ],
    projects: [
        { id: 1, title: 'EcoTrack App', description: 'Aplicativo mobile para rastreamento de pegada de carbono pessoal.', tags: 'React Native, Firebase' }
    ],
    research: [
        { id: 1, title: 'Iniciação Científica', subtitle: 'Inteligência Artificial na Saúde', period: '2023', description: 'Pesquisa sobre uso de redes neurais para detecção precoce de doenças.' }
    ],
    internships: [
        { id: 1, title: 'Tech Solutions', subtitle: 'Estagiário Front-end', period: '2023 - 2024', description: 'Desenvolvimento de interfaces web utilizando React e Next.js.' }
    ],
    studySummaries: [
        { id: 1, title: 'Arquitetura de Software', description: 'Resumo curto sobre Clean Architecture e camadas de domínio.', link: '#' }
    ],
    events: [
        { id: 1, title: 'Semana de Tecnologia', description: 'Ministrei uma talk sobre carreira em front-end.', image: 'https://images.unsplash.com/photo-1545239351-1141bd82e8a6?w=800&q=80', type: 'evento' },
        { id: 2, title: 'Hackathon Local', description: 'Equipe finalista construindo MVP em 24h.', image: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800&q=80', type: 'acao' }
    ],
    contact: {
        whatsapp: '5511999999999'
    },
    school: {
        name: 'Escola Municipal Aurora',
        role: 'Professor de Matemática',
        logo: ''
    },
    graduations: [
        { id: 1, title: 'Licenciatura em Matemática', institution: 'UF Estadual', period: '2010 - 2014', description: 'Ênfase em didática e educação básica.' }
    ],
    postGraduations: [
        { id: 1, title: 'Pós em Metodologias Ativas', institution: 'Instituto Educação Digital', period: '2016', description: 'Aplicação de metodologias ativas em sala de aula.' }
    ],
    masters: [
        { id: 1, title: 'Mestrado em Educação', institution: 'Universidade Federal', period: '2017 - 2019', description: 'Pesquisa em avaliação formativa e feedback contínuo.' }
    ],
    doctorates: [],
    postDocs: [],
    extraCourses: [
        { id: 1, title: 'Formação em Ensino Híbrido', institution: 'Google for Education', period: '2020', description: 'Modelagem de aulas híbridas e recursos digitais.' }
    ],
    lectures: [
        { id: 1, title: 'Palestra: Aula invertida na prática', institution: 'Congresso EduTech', period: '2023', description: 'Demonstração de estratégias de engajamento.' }
    ],
    lessonPlans: [
        { id: 1, title: 'Plano de Aula: Funções Quadráticas', period: '2024', description: 'Sequência didática com exercícios graduais e avaliação formativa.', link: '#' }
    ],
    activities: [
        { id: 1, title: 'Atividade: Probabilidade com dados', period: '2024', description: 'Guia prático para exercícios em grupo.', link: '#' }
    ],
    teacherSummaries: [
        { id: 1, title: 'Resumo: Avaliação Formativa', description: 'Síntese de técnicas de avaliação contínua.', link: '#' }
    ],
    skills: ['React', 'TypeScript', 'Python', 'Scrum', 'Inglês Avançado']
};

export default function UniFolioUltimate() {
    const [data, setData] = useState(initialData);
    const [activeSection, setActiveSection] = useState('style');
    const [previewMode, setPreviewMode] = useState('mobile');
    const [showPreloaderPreview, setShowPreloaderPreview] = useState(false);
    const backupInputRef = useRef(null);
    const [eventIndex, setEventIndex] = useState(0);
    const [typedName, setTypedName] = useState('');
    const [showMobilePreview, setShowMobilePreview] = useState(false);
    const [showMobileActions, setShowMobileActions] = useState(false);
    const [showTutorial, setShowTutorial] = useState(false);

    // --- Lógica de Imagem (Base64) ---
    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                updateData('profile', 'avatar', reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    // --- Lógica de CSS Generators ---

    const getBackgroundCSS = () => {
        const { bgType, bgStart, bgEnd } = data.style;
        if (bgType === 'solid') return { backgroundColor: bgStart };
        if (bgType === 'gradient') return { backgroundImage: `linear-gradient(135deg, ${bgStart}, ${bgEnd})` };
        return {};
    };

    const getCardCSS = () => {
        const { cardStyle } = data.config;
        const { cardColor, cardOpacity, textColor } = data.style;

        const hexToRgb = (hex) => {
            const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
            return result ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : '255,255,255';
        };
        const rgb = hexToRgb(cardColor);

        const baseStyle = {
            color: textColor,
            transition: 'transform 0.3s ease, box-shadow 0.3s ease'
        };

        if (cardStyle === 'glass') return {
            ...baseStyle,
            backgroundColor: `rgba(${rgb}, ${cardOpacity})`,
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255,255,255,0.3)',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            borderRadius: '16px'
        };
        if (cardStyle === 'flat') return {
            ...baseStyle,
            backgroundColor: `rgba(${rgb}, ${cardOpacity})`,
            borderBottom: '1px solid rgba(0,0,0,0.05)',
            borderRadius: '0px'
        };
        if (cardStyle === 'outline') return {
            ...baseStyle,
            backgroundColor: 'transparent',
            border: `2px solid ${data.style.buttonColor}`,
            borderRadius: '12px'
        };
        if (cardStyle === 'neubrutalism') return {
            ...baseStyle,
            backgroundColor: `rgba(${rgb}, ${cardOpacity})`,
            border: '2px solid #000',
            boxShadow: '4px 4px 0px #000',
            borderRadius: '8px'
        };
        return baseStyle;
    };

    const getAnimationKeyframes = (type) => {
        switch (type) {
            case 'apple': return `@keyframes enter { 0% { opacity: 0; transform: scale(0.95) translateY(10px); filter: blur(10px); } 100% { opacity: 1; transform: scale(1) translateY(0); filter: blur(0); } }`;
            case 'slide-up': return `@keyframes enter { from { opacity: 0; transform: translateY(40px); } to { opacity: 1; transform: translateY(0); } }`;
            case 'slide-side': return `@keyframes enter { from { opacity: 0; transform: translateX(-40px); } to { opacity: 1; transform: translateX(0); } }`;
            case 'zoom': return `@keyframes enter { from { opacity: 0; transform: scale(0.5); } to { opacity: 1; transform: scale(1); } }`;
            default: return `@keyframes enter { from { opacity: 0; } to { opacity: 1; } }`;
        }
    };

    // --- Handlers ---

    const updateData = (section, field, value) => {
        setData(prev => ({ ...prev, [section]: { ...prev[section], [field]: value } }));
    };

    const addItem = (section, template) => {
        setData(prev => ({
            ...prev,
            [section]: [...prev[section], { ...template, id: Date.now() }]
        }));
    };

    const updateArrayItem = (section, id, field, value) => {
        setData(prev => ({
            ...prev,
            [section]: prev[section].map(item => item.id === id ? { ...item, [field]: value } : item)
        }));
    };

    const removeItem = (section, id) => {
        setData(prev => ({
            ...prev,
            [section]: prev[section].filter(item => item.id !== id)
        }));
    };

    const triggerPreloader = () => {
        setShowPreloaderPreview(true);
        setTimeout(() => setShowPreloaderPreview(false), 2200);
    };

    useEffect(() => {
        if (data.config.preloader) triggerPreloader();
    }, [data.config.preloader, data.config.animationStyle]);

    useEffect(() => {
        if (!showPreloaderPreview) {
            setTypedName('');
            return;
        }
        const name = data.profile.name || '';
        let i = 0;
        setTypedName('');
        const ti = setInterval(() => {
            i += 1;
            setTypedName(name.slice(0, i));
            if (i >= name.length) clearInterval(ti);
        }, 80);
        return () => clearInterval(ti);
    }, [showPreloaderPreview, data.profile.name]);

    // Evento: autoplay se houver 2+ cards e seção ativa
    // --- Export Logic ---

    const modernRadius = '58% 42% 46% 54% / 64% 38% 62% 36%';

    const getAvatarShapeStyle = (shape) => {
        if (shape === 'square') return { borderRadius: '12px' };
        if (shape === 'modern') return { borderRadius: modernRadius }; // organic squircle
        return { borderRadius: '9999px' }; // round
    };

    const getAvatarFrameStyle = (frame, styles) => {
        const base = {};
        if (frame === 'none') {
            return base;
        }
        if (frame === 'outline') {
            return {
                border: `3px solid ${styles.buttonColor}`,
            };
        }
        if (frame === 'shadow') {
            return {
                boxShadow: '0 10px 30px rgba(0,0,0,0.18)',
                border: `2px solid ${styles.cardColor}`,
            };
        }
        // default
        return {
            border: `4px solid ${styles.cardColor}`,
            boxShadow: '0 8px 18px rgba(0,0,0,0.12)',
        };
    };

        const downloadHTML = () => {
            const styles = data.style;
            const config = data.config;

        let bgCSS = '';
        if (styles.bgType === 'solid') bgCSS = `background-color: ${styles.bgStart};`;
        if (styles.bgType === 'gradient') bgCSS = `background-image: linear-gradient(135deg, ${styles.bgStart}, ${styles.bgEnd});`;

        const hexToRgb = (hex) => {
            const r = parseInt(hex.slice(1, 3), 16);
            const g = parseInt(hex.slice(3, 5), 16);
            const b = parseInt(hex.slice(5, 7), 16);
            return `${r}, ${g}, ${b}`;
        };
        const isProfessor = config.profileType === 'professor';

        const avatarShapeStyle = (() => {
            if (config.avatarShape === 'square') return 'border-radius: 12px;';
            if (config.avatarShape === 'modern') return `border-radius: ${modernRadius};`;
            return 'border-radius: 9999px;';
        })();
        const avatarFrameStyle = (() => {
            if (config.avatarFrame === 'none') return '';
            if (config.avatarFrame === 'outline') return `border: 3px solid ${styles.buttonColor};`;
            if (config.avatarFrame === 'shadow') return `box-shadow: 0 10px 30px rgba(0,0,0,0.18); border: 2px solid ${styles.cardColor};`;
            return `border: 4px solid ${styles.cardColor}; box-shadow: 0 8px 18px rgba(0,0,0,0.12);`;
        })();
        const avatarWrapperStyle = (() => {
            if (config.avatarShape !== 'modern') return '';
            return `padding: 2px; border-radius: ${modernRadius};`;
        })();
        const salesLink = config.salesLink || 'https://unifolio.com';

        const htmlContent = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${data.profile.name}</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=${styles.font.replace(' ', '+')}:wght@300;400;600;700&display=swap" rel="stylesheet">
    <style>
      :root {
        --primary: ${styles.buttonColor};
        --text: ${styles.textColor};
        --card-bg: rgba(${hexToRgb(styles.cardColor)}, ${styles.cardOpacity});
      }
      body { 
        font-family: '${styles.font}', sans-serif; 
        color: var(--text);
        min-height: 100vh;
        margin: 0;
        ${bgCSS}
        background-attachment: fixed;
      }
      ${getAnimationKeyframes(config.animationStyle)}
      .animate-enter { animation: enter 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; opacity: 0; }
      .card {
        ${config.cardStyle === 'glass' ? `
          background-color: var(--card-bg);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(255,255,255,0.3);
          box-shadow: 0 8px 32px rgba(0,0,0,0.05);
          border-radius: 16px;
        ` : config.cardStyle === 'flat' ? `
          background-color: var(--card-bg);
          border-bottom: 1px solid rgba(0,0,0,0.1);
          border-radius: 0;
        ` : config.cardStyle === 'neubrutalism' ? `
          background-color: var(--card-bg);
          border: 2px solid #000;
          box-shadow: 4px 4px 0px #000;
          border-radius: 8px;
        ` : `
          background: transparent;
          border: 2px solid var(--primary);
          border-radius: 12px;
        `}
        transition: transform 0.2s ease;
      }
      ${config.cardStyle !== 'flat' ? `.card:hover { transform: translateY(-3px); }` : ''}
      
      /* Neubrutalism specific hover */
      ${config.cardStyle === 'neubrutalism' ? `.card:hover { transform: translate(-2px, -2px); box-shadow: 6px 6px 0px #000; }` : ''}

      #preloader {
        position: fixed; inset: 0; z-index: 9999;
        background: ${styles.bgType === 'solid' ? styles.bgStart : '#ffffff'};
        display: flex; align-items: center; justify-content: center;
        transition: opacity 0.6s ease;
      }
    </style>
</head>
<body class="py-12 px-4 antialiased">
    ${config.preloader ? `
    <div id="preloader">
      <div class="text-center">
        <h1 class="text-3xl font-bold tracking-tight" style="color: var(--primary)">${data.profile.name}</h1>
        <div class="mt-2 w-12 h-1 bg-gray-200 rounded-full mx-auto overflow-hidden">
            <div class="h-full bg-[${styles.buttonColor}] animate-[ping_1.5s_infinite]"></div>
        </div>
      </div>
    </div>
    <script>window.addEventListener('load', () => { setTimeout(() => { document.getElementById('preloader').style.opacity = '0'; setTimeout(() => document.getElementById('preloader').remove(), 600); }, 1500); });<\/script>
    ` : ''}

    <main class="max-w-xl mx-auto space-y-8">
        <header class="text-center space-y-4 animate-enter">
            ${config.showAvatar ? `<div class="relative inline-block" style="${avatarWrapperStyle}"><img src="${data.profile.avatar}" alt="Profile" class="w-32 h-32 object-cover mx-auto" style="background:#fff; ${avatarShapeStyle} ${avatarFrameStyle}"></div>` : ''}
            <div>
                <h1 class="text-3xl font-bold mb-1">${data.profile.name}</h1>
                <p class="text-sm opacity-80 font-medium uppercase tracking-wide" style="color: var(--primary)">${data.profile.role}</p>
                ${config.showLocation ? `<p class="text-xs mt-2 opacity-60">${data.profile.location}</p>` : ''}
            </div>
            ${config.showBio ? `<p class="leading-relaxed opacity-80 max-w-sm mx-auto">${data.profile.bio}</p>` : ''}
        </header>

        <section class="grid gap-3 animate-enter" style="animation-delay: 100ms">
            ${data.links.map(link => `
            <a href="${link.url}" target="_blank" class="card p-4 flex items-center justify-between group text-decoration-none">
                <span class="font-semibold">${link.title}</span>
                <svg class="w-5 h-5 opacity-40 group-hover:opacity-100 group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
            </a>`).join('')}
        </section>

        ${(data.school.name || data.school.role || data.school.logo) ? `
        <section class="animate-enter" style="animation-delay: 150ms">
            <div class="card p-4 flex items-center gap-3">
                ${data.school.logo ? `<img src="${data.school.logo}" alt="Logo da escola" class="w-10 h-10 object-cover rounded-lg border border-white/50" style="background:#fff;">` : ''}
                <div class="flex-1">
                    <div class="text-sm font-bold">${data.school.name}</div>
                    <div class="text-xs opacity-70">${data.school.role}</div>
                </div>
            </div>
        </section>` : ''}

        ${!isProfessor && data.academic.length > 0 ? `
        <section class="animate-enter space-y-4" style="animation-delay: 200ms">
            <h2 class="text-xs font-bold uppercase tracking-wider opacity-40 text-center">Jornada Acadêmica</h2>
            ${data.academic.map(item => `
            <div class="card p-5">
                <h3 class="font-bold text-lg">${item.title}</h3>
                <p class="text-sm font-medium opacity-80" style="color: var(--primary)">${item.subtitle}</p>
                <p class="text-xs opacity-50 mt-1 mb-2">${item.period}</p>
                <p class="text-sm opacity-70">${item.description}</p>
            </div>`).join('')}
        </section>` : ''}

        ${!isProfessor && data.projects.length > 0 ? `
        <section class="space-y-4 animate-enter" style="animation-delay: 300ms">
            <h2 class="text-xs font-bold uppercase tracking-wider opacity-40 text-center">Projetos</h2>
            ${data.projects.map(proj => `
            <div class="card p-5">
                <h3 class="font-bold text-lg mb-1">${proj.title}</h3>
                <p class="text-sm opacity-70 mb-3">${proj.description}</p>
                <div class="flex items-center justify-between">
                    <span class="text-[10px] font-bold px-2 py-1 rounded bg-gray-100 text-gray-600">${proj.tags}</span>
                    <span class="text-xs font-bold" style="color: var(--primary)">Ver &rarr;</span>
                </div>
            </div>`).join('')}
        </section>` : ''}

        ${!isProfessor && data.internships.length > 0 ? `
        <section class="space-y-4 animate-enter" style="animation-delay: 400ms">
            <h2 class="text-xs font-bold uppercase tracking-wider opacity-40 text-center">Estágios</h2>
            ${data.internships.map(item => `
            <div class="card p-5">
                <h3 class="font-bold text-lg">${item.title}</h3>
                <p class="text-sm font-medium opacity-80" style="color: var(--primary)">${item.subtitle}</p>
                <p class="text-xs opacity-50 mt-1 mb-2">${item.period}</p>
                <p class="text-sm opacity-70">${item.description}</p>
            </div>`).join('')}
        </section>` : ''}

        ${!isProfessor && data.research.length > 0 ? `
        <section class="space-y-4 animate-enter" style="animation-delay: 500ms">
            <h2 class="text-xs font-bold uppercase tracking-wider opacity-40 text-center">Pesquisa & Extensão</h2>
            ${data.research.map(item => `
            <div class="card p-5">
                <h3 class="font-bold text-lg">${item.title}</h3>
                <p class="text-sm font-medium opacity-80" style="color: var(--primary)">${item.subtitle}</p>
                <p class="text-xs opacity-50 mt-1 mb-2">${item.period}</p>
                <p class="text-sm opacity-70">${item.description}</p>
            </div>`).join('')}
        </section>` : ''}

        ${!isProfessor && data.studySummaries.length > 0 ? `
        <section class="space-y-4 animate-enter" style="animation-delay: 550ms">
            <h2 class="text-xs font-bold uppercase tracking-wider opacity-40 text-center">Resumos de Estudos</h2>
            ${data.studySummaries.map(item => `
            <a class="card p-5 block" href="${item.link}" target="_blank" rel="noopener noreferrer">
                <div class="flex items-start justify-between gap-3">
                    <div>
                        <h3 class="font-bold text-lg mb-1">${item.title}</h3>
                        <p class="text-sm opacity-70">${item.description}</p>
                    </div>
                    <span class="text-xs font-bold" style="color: var(--primary)">Abrir ↗</span>
                </div>
            </a>`).join('')}
        </section>` : ''}

        ${config.showEvents && data.events.length > 0 ? `
        <section class="space-y-4 animate-enter" style="animation-delay: 600ms">
            <h2 class="text-xs font-bold uppercase tracking-wider opacity-40 text-center">Eventos & Ações</h2>
            <div class="relative overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
                <div class="relative h-[260px] bg-black/5">
                    ${data.events.map((ev, idx) => `
                        <div class="event-slide absolute inset-0 transition-all duration-500" data-index="${idx}" style="opacity:${idx === 0 ? '1' : '0'}; transform: translateX(${idx === 0 ? '0' : '10px'});">
                            <div class="absolute inset-0">
                                <img src="${ev.image}" alt="${ev.title}" class="w-full h-full object-cover rounded-2xl" />
                                <div class="absolute inset-0 bg-gradient-to-t from-black/55 via-black/30 to-transparent rounded-2xl pointer-events-none"></div>
                            </div>
                            <div class="relative z-10 p-4 text-white flex flex-col h-full justify-end gap-2">
                                <div class="flex items-center gap-2">
                                    <span class="px-2 py-1 text-[10px] font-bold uppercase tracking-[0.15em] bg-white/90 text-gray-800 rounded-full">
                                        ${ev.type === 'acao' ? 'Ação' : 'Evento'}
                                    </span>
                                </div>
                                <h3 class="text-xl font-bold leading-tight">${ev.title}</h3>
                                <p class="text-sm text-white/85">${ev.description}</p>
                            </div>
                        </div>
                    `).join('')}
                </div>
                ${data.events.length > 1 ? `
                <div class="absolute inset-0 flex items-center justify-between px-3">
                    <button type="button" id="events-prev" class="w-8 h-8 rounded-full bg-white/80 text-gray-700 hover:bg-white shadow" aria-label="Anterior">‹</button>
                    <button type="button" id="events-next" class="w-8 h-8 rounded-full bg-white/80 text-gray-700 hover:bg-white shadow" aria-label="Próximo">›</button>
                </div>
                <div class="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                    ${data.events.map((_, idx) => `<span class="event-dot w-2 h-2 rounded-full ${idx === 0 ? 'bg-white' : 'bg-white/50'}" data-index="${idx}"></span>`).join('')}
                </div>
                ` : ''}
            </div>
        </section>
        <script>
        (() => {
            const slides = Array.from(document.querySelectorAll('.event-slide'));
            if (!slides.length) return;
            let current = 0;
            const dots = Array.from(document.querySelectorAll('.event-dot'));
            const update = () => {
                slides.forEach((s, i) => {
                    const active = i === current;
                    s.style.opacity = active ? '1' : '0';
                    s.style.transform = active ? 'translateX(0)' : 'translateX(10px)';
                    s.style.zIndex = active ? '2' : '1';
                });
                dots.forEach((d, i) => d.className = 'event-dot w-2 h-2 rounded-full ' + (i === current ? 'bg-white' : 'bg-white/50'));
            };
            const next = () => { current = (current + 1) % slides.length; update(); };
            const prev = () => { current = (current - 1 + slides.length) % slides.length; update(); };
            document.getElementById('events-next')?.addEventListener('click', next);
            document.getElementById('events-prev')?.addEventListener('click', prev);
            update();
        })();
        </script>
        ` : ''}

        ${config.showFooter ? `<footer class="text-center text-[10px] py-8 opacity-40 animate-enter" style="animation-delay: 600ms"><p>Criado com UniFolio</p></footer>` : ''}

        ${config.showContactCTA && data.contact.whatsapp ? `
        <a
          href="${`https://wa.me/${(data.contact.whatsapp || '').replace(/\D/g, '')}?text=${encodeURIComponent('Oi! Vi seu UniFolio e gostaria de conversar.')}`}"
          target="_blank"
          rel="noreferrer"
          class="fixed right-5 bottom-5 z-40 flex items-center gap-2 px-4 py-3 rounded-full shadow-lg text-white"
          style="background:${styles.buttonColor}; color:${styles.buttonTextColor};"
        >
          <span style="display:inline-flex; width:18px; height:18px;">${`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2M12.05 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.58 20.15 12.04 20.15C10.56 20.15 9.11 19.76 7.85 19L7.55 18.83L4.43 19.65L5.26 16.61L5.06 16.29C4.24 15 3.8 13.47 3.8 11.91C3.81 7.37 7.5 3.67 12.05 3.67M8.53 7.33C8.37 7.33 8.1 7.39 7.87 7.64C7.65 7.89 7 8.5 7 9.71C7 10.93 7.89 12.1 8 12.27C8.14 12.44 9.76 14.94 12.25 16C12.84 16.27 13.3 16.42 13.66 16.53C14.25 16.72 14.79 16.69 15.22 16.63C15.7 16.56 16.68 16.03 16.89 15.45C17.1 14.87 17.1 14.38 17.04 14.27C16.97 14.17 16.81 14.11 16.56 14C16.31 13.86 15.09 13.26 14.87 13.18C14.64 13.1 14.5 13.06 14.31 13.3C14.15 13.55 13.67 14.11 13.53 14.27C13.38 14.44 13.24 14.46 13 14.34C12.74 14.21 11.94 13.95 11 13.11C10.26 12.45 9.77 11.64 9.62 11.39C9.5 11.15 9.61 11 9.73 10.89C9.84 10.78 10 10.6 10.1 10.45C10.23 10.31 10.27 10.2 10.35 10.04C10.43 9.87 10.39 9.73 10.33 9.61C10.27 9.5 9.77 8.26 9.56 7.77C9.36 7.29 9.16 7.35 9 7.34C8.86 7.34 8.7 7.33 8.53 7.33Z"/></svg>`}</span>
          <span class="text-sm font-semibold">Fale comigo</span>
        </a>
        ` : ''}

        <div class="mt-10 mb-6 text-center text-[11px] opacity-60">
            <a href="${salesLink}" target="_blank" rel="noreferrer" class="inline-flex items-center gap-1 text-gray-600 hover:text-indigo-700 font-semibold">
                Feito com UniFolio · Quero o meu
            </a>
        </div>
    </main>
</body>
</html>`;

        const blob = new Blob([htmlContent], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `unifolio-${data.profile.name.replace(/\s+/g, '-').toLowerCase()}.html`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    // Backup: salvar JSON do estado corrente
    const downloadBackup = () => {
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'unifolio-backup.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    // Backup: carregar JSON e aplicar ao state
    const handleBackupUpload = (event) => {
        const file = event.target.files && event.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => {
            try {
                const parsed = JSON.parse(reader.result);
                if (parsed && parsed.config && parsed.style && parsed.profile) {
                    setData(parsed);
                } else {
                    alert('Arquivo inválido: estrutura inesperada.');
                }
            } catch (err) {
                alert('Não foi possível ler o backup. Verifique o JSON.');
            } finally {
                event.target.value = '';
            }
        };
        reader.readAsText(file);
    };

    const getWhatsAppLink = () => {
        const phone = (data.contact.whatsapp || '').replace(/\D/g, '');
        const message = encodeURIComponent('Oi! Vi seu UniFolio e gostaria de conversar.');
        return phone ? `https://wa.me/${phone}?text=${message}` : '#';
    };

    const handleEventImageUpload = (event, id) => {
        const file = event.target.files && event.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onloadend = () => {
            updateArrayItem('events', id, 'image', reader.result);
            event.target.value = '';
        };
        reader.readAsDataURL(file);
    };

    const handleSchoolLogoUpload = (event) => {
        const file = event.target.files && event.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onloadend = () => {
            updateData('school', 'logo', reader.result);
            event.target.value = '';
        };
        reader.readAsDataURL(file);
    };

    // --- Render: Preview Component ---

    const Preview = ({ data, mode, showPreloader, containerClassName = '' }) => {
        const isMobile = mode === 'mobile';
        const bgStyle = getBackgroundCSS();
        const cardStyle = getCardCSS();
        const animationKeyframes = getAnimationKeyframes(data.config.animationStyle);
        const whatsappLink = getWhatsAppLink();
        const isProfessor = data.config.profileType === 'professor';
        const salesLink = data.config.salesLink || 'https://unifolio.com';

        // Container Style Switcher
        const containerStyle = isMobile
            ? 'w-[360px] sm:w-[390px] max-w-full min-h-[620px] sm:min-h-[720px] rounded-[26px] sm:rounded-[2.75rem] border-[10px] border-slate-900 shadow-2xl'
            : 'w-full max-w-5xl min-h-[720px] rounded-[2rem] border border-gray-200 shadow-xl bg-white';

        return (
            <div className={`transition-all duration-500 ease-in-out mx-auto overflow-hidden relative flex flex-col ${containerStyle} ${containerClassName}`}>

                {/* Desktop Title Bar */}
                {!isMobile && (
                    <div className="h-10 bg-gray-100 border-b border-gray-200 flex items-center px-4 gap-2 flex-shrink-0">
                        <div className="w-3 h-3 rounded-full bg-red-400"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                        <div className="w-3 h-3 rounded-full bg-green-400"></div>
                        <div className="flex-1 text-center text-xs text-gray-500 font-medium bg-white py-1 rounded px-2 mx-4 shadow-sm truncate">
                            unifolio.com/{data.profile.name.replace(/\s+/g, '').toLowerCase()}
                        </div>
                    </div>
                )}

                {/* Mobile Notch */}
                {isMobile && <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-6 bg-gray-800 rounded-b-xl z-30"></div>}

                {/* Inject dynamic keyframes for preview */}
                <style>{animationKeyframes}</style>

                {/* Preloader Overlay */}
                {showPreloader && (
                    <div className="absolute inset-0 z-50 flex items-start justify-center bg-white transition-opacity duration-500 pt-16">
                        <div className="text-center space-y-2">
                            <h1 className="text-2xl font-bold" style={{ color: data.style.buttonColor }}>
                                {typedName}
                                <span className="inline-block w-[10px] animate-pulse">|</span>
                            </h1>
                            <div className="text-xs text-gray-400">Carregando perfil...</div>
                        </div>
                    </div>
                )}

                <div className="flex-1 overflow-y-auto scrollbar-hide transition-all duration-500 relative" style={{ ...bgStyle, color: data.style.textColor }}>
                    <div className={`p-6 ${isMobile ? 'pt-16 pb-14' : 'max-w-2xl mx-auto py-16'}`}>

                        {/* Header */}
                        <div className="text-center mb-8" style={{ animation: 'enter 0.8s cubic-bezier(0.2,0.8,0.2,1) forwards' }}>
                            {data.config.showAvatar && (
                                <div
                                    className="relative inline-block mb-4"
                                    style={data.config.avatarShape === 'modern' ? {
                                        padding: '2px',
                                        borderRadius: modernRadius
                                    } : {}}
                                >
                                    <img
                                        src={data.profile.avatar}
                                        className="w-28 h-28 object-cover mx-auto"
                                        style={{
                                            background: '#fff',
                                            ...getAvatarShapeStyle(data.config.avatarShape),
                                            ...getAvatarFrameStyle(data.config.avatarFrame, data.style)
                                        }}
                                    />
                                </div>
                            )}
                            <h1 className="text-3xl font-bold tracking-tight mb-1">{data.profile.name}</h1>
                            <span className="text-sm font-semibold opacity-80 uppercase tracking-wider" style={{ color: data.style.buttonColor }}>{data.profile.role}</span>
                            {data.config.showBio && <p className="text-sm opacity-70 mt-3 leading-relaxed max-w-xs mx-auto">{data.profile.bio}</p>}
                            {data.config.showLocation && <p className="text-xs opacity-50 mt-2 flex items-center justify-center gap-1"><ExternalLink className="w-3 h-3" /> {data.profile.location}</p>}
                        </div>

                        {/* Links */}
                        <div className="space-y-3 mb-8" style={{ animation: 'enter 0.8s cubic-bezier(0.2,0.8,0.2,1) forwards', animationDelay: '100ms', opacity: 0 }}>
                            {data.links.map((link) => (
                                <div key={link.id} style={cardStyle} className="p-4 flex items-center justify-between cursor-pointer group">
                                    <span className="font-semibold text-sm">{link.title}</span>
                                    <ExternalLink className="w-4 h-4 opacity-40 group-hover:translate-x-1 transition-transform" />
                                </div>
                            ))}
                        </div>

                        {/* School info */}
                        {(data.school.name || data.school.role || data.school.logo) && (
                            <div className="mb-8" style={{ animation: 'enter 0.8s cubic-bezier(0.2,0.8,0.2,1) forwards', animationDelay: '150ms', opacity: 0 }}>
                                <div style={cardStyle} className="p-4 flex items-center gap-3">
                                    {data.school.logo && (
                                        <img src={data.school.logo} alt="Logo da escola" className="w-10 h-10 object-cover rounded-lg border border-white/60" style={{ background: '#fff' }} />
                                    )}
                                    <div className="flex-1">
                                        <div className="text-sm font-bold">{data.school.name}</div>
                                        <div className="text-xs opacity-70">{data.school.role}</div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Academic Journey (Universitário) */}
                        {!isProfessor && data.academic.length > 0 && (
                            <div className="space-y-4 mb-8" style={{ animation: 'enter 0.8s cubic-bezier(0.2,0.8,0.2,1) forwards', animationDelay: '200ms', opacity: 0 }}>
                                <h3 className="text-[10px] font-bold uppercase tracking-wider opacity-40 text-center mb-2">Jornada Acadêmica</h3>
                                {data.academic.map((item) => (
                                    <div key={item.id} style={cardStyle} className="p-5">
                                        <h4 className="font-bold text-lg">{item.title}</h4>
                                        <p className="text-sm font-medium opacity-80" style={{ color: data.style.buttonColor }}>{item.subtitle}</p>
                                        <p className="text-xs opacity-50 mt-1 mb-2">{item.period}</p>
                                        <p className="text-sm opacity-70">{item.description}</p>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Projects (Universitário) */}
                        {!isProfessor && data.projects.length > 0 && (
                            <div className="space-y-4 mb-8" style={{ animation: 'enter 0.8s cubic-bezier(0.2,0.8,0.2,1) forwards', animationDelay: '300ms', opacity: 0 }}>
                                <h3 className="text-[10px] font-bold uppercase tracking-wider opacity-40 text-center mb-2">Projetos</h3>
                                {data.projects.map((proj) => (
                                    <div key={proj.id} style={cardStyle} className="p-5">
                                        <h4 className="font-bold text-lg mb-1">{proj.title}</h4>
                                        <p className="text-sm opacity-70 mb-3">{proj.description}</p>
                                        <div className="flex justify-between items-center">
                                            <span className="text-[10px] px-2 py-1 rounded bg-black/5 font-bold opacity-60">{proj.tags}</span>
                                            <span className="text-xs font-bold" style={{ color: data.style.buttonColor }}>Ver &rarr;</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Internships (Universitário) */}
                        {!isProfessor && data.internships.length > 0 && (
                            <div className="space-y-4 mb-8" style={{ animation: 'enter 0.8s cubic-bezier(0.2,0.8,0.2,1) forwards', animationDelay: '400ms', opacity: 0 }}>
                                <h3 className="text-[10px] font-bold uppercase tracking-wider opacity-40 text-center mb-2">Estágios</h3>
                                {data.internships.map((item) => (
                                    <div key={item.id} style={cardStyle} className="p-5">
                                        <h4 className="font-bold text-lg">{item.title}</h4>
                                        <p className="text-sm font-medium opacity-80" style={{ color: data.style.buttonColor }}>{item.subtitle}</p>
                                        <p className="text-xs opacity-50 mt-1 mb-2">{item.period}</p>
                                        <p className="text-sm opacity-70">{item.description}</p>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Research (Universitário) */}
                        {!isProfessor && data.research.length > 0 && (
                            <div className="space-y-4 mb-8" style={{ animation: 'enter 0.8s cubic-bezier(0.2,0.8,0.2,1) forwards', animationDelay: '500ms', opacity: 0 }}>
                                <h3 className="text-[10px] font-bold uppercase tracking-wider opacity-40 text-center mb-2">Pesquisa & Extensão</h3>
                                {data.research.map((item) => (
                                    <div key={item.id} style={cardStyle} className="p-5">
                                        <h4 className="font-bold text-lg">{item.title}</h4>
                                        <p className="text-sm font-medium opacity-80" style={{ color: data.style.buttonColor }}>{item.subtitle}</p>
                                        <p className="text-xs opacity-50 mt-1 mb-2">{item.period}</p>
                                        <p className="text-sm opacity-70">{item.description}</p>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Study summaries (Universitário) */}
                        {!isProfessor && data.studySummaries.length > 0 && (
                            <div className="space-y-4 mb-8" style={{ animation: 'enter 0.8s cubic-bezier(0.2,0.8,0.2,1) forwards', animationDelay: '550ms', opacity: 0 }}>
                                <h3 className="text-[10px] font-bold uppercase tracking-wider opacity-40 text-center mb-2">Resumos de Estudos</h3>
                                {data.studySummaries.map((item) => (
                                    <a key={item.id} style={cardStyle} className="p-5 block" href={item.link || '#'} target="_blank" rel="noreferrer">
                                        <div className="flex items-start justify-between gap-3">
                                            <div>
                                                <h4 className="font-bold text-lg mb-1">{item.title}</h4>
                                                <p className="text-sm opacity-70">{item.description}</p>
                                            </div>
                                            <span className="text-xs font-bold" style={{ color: data.style.buttonColor }}>Abrir ↗</span>
                                        </div>
                                    </a>
                                ))}
                            </div>
                        )}

                        {/* Professor sections */}
                        {isProfessor && data.graduations.length > 0 && (
                            <div className="space-y-4 mb-8" style={{ animation: 'enter 0.8s cubic-bezier(0.2,0.8,0.2,1) forwards', animationDelay: '200ms', opacity: 0 }}>
                                <h3 className="text-[10px] font-bold uppercase tracking-wider opacity-40 text-center mb-2">Graduações</h3>
                                {data.graduations.map((item) => (
                                    <div key={item.id} style={cardStyle} className="p-5">
                                        <h4 className="font-bold text-lg">{item.title}</h4>
                                        <p className="text-sm font-medium opacity-80" style={{ color: data.style.buttonColor }}>{item.institution}</p>
                                        <p className="text-xs opacity-50 mt-1 mb-2">{item.period}</p>
                                        <p className="text-sm opacity-70">{item.description}</p>
                                    </div>
                                ))}
                            </div>
                        )}

                        {isProfessor && data.postGraduations.length > 0 && (
                            <div className="space-y-4 mb-8" style={{ animation: 'enter 0.8s cubic-bezier(0.2,0.8,0.2,1) forwards', animationDelay: '260ms', opacity: 0 }}>
                                <h3 className="text-[10px] font-bold uppercase tracking-wider opacity-40 text-center mb-2">Pós-Graduação</h3>
                                {data.postGraduations.map((item) => (
                                    <div key={item.id} style={cardStyle} className="p-5">
                                        <h4 className="font-bold text-lg">{item.title}</h4>
                                        <p className="text-sm font-medium opacity-80" style={{ color: data.style.buttonColor }}>{item.institution}</p>
                                        <p className="text-xs opacity-50 mt-1 mb-2">{item.period}</p>
                                        <p className="text-sm opacity-70">{item.description}</p>
                                    </div>
                                ))}
                            </div>
                        )}

                        {isProfessor && data.masters.length > 0 && (
                            <div className="space-y-4 mb-8" style={{ animation: 'enter 0.8s cubic-bezier(0.2,0.8,0.2,1) forwards', animationDelay: '320ms', opacity: 0 }}>
                                <h3 className="text-[10px] font-bold uppercase tracking-wider opacity-40 text-center mb-2">Mestrado</h3>
                                {data.masters.map((item) => (
                                    <div key={item.id} style={cardStyle} className="p-5">
                                        <h4 className="font-bold text-lg">{item.title}</h4>
                                        <p className="text-sm font-medium opacity-80" style={{ color: data.style.buttonColor }}>{item.institution}</p>
                                        <p className="text-xs opacity-50 mt-1 mb-2">{item.period}</p>
                                        <p className="text-sm opacity-70">{item.description}</p>
                                    </div>
                                ))}
                            </div>
                        )}

                        {isProfessor && data.doctorates.length > 0 && (
                            <div className="space-y-4 mb-8" style={{ animation: 'enter 0.8s cubic-bezier(0.2,0.8,0.2,1) forwards', animationDelay: '380ms', opacity: 0 }}>
                                <h3 className="text-[10px] font-bold uppercase tracking-wider opacity-40 text-center mb-2">Doutorado</h3>
                                {data.doctorates.map((item) => (
                                    <div key={item.id} style={cardStyle} className="p-5">
                                        <h4 className="font-bold text-lg">{item.title}</h4>
                                        <p className="text-sm font-medium opacity-80" style={{ color: data.style.buttonColor }}>{item.institution}</p>
                                        <p className="text-xs opacity-50 mt-1 mb-2">{item.period}</p>
                                        <p className="text-sm opacity-70">{item.description}</p>
                                    </div>
                                ))}
                            </div>
                        )}

                        {isProfessor && data.postDocs.length > 0 && (
                            <div className="space-y-4 mb-8" style={{ animation: 'enter 0.8s cubic-bezier(0.2,0.8,0.2,1) forwards', animationDelay: '440ms', opacity: 0 }}>
                                <h3 className="text-[10px] font-bold uppercase tracking-wider opacity-40 text-center mb-2">Pós-Doutorado</h3>
                                {data.postDocs.map((item) => (
                                    <div key={item.id} style={cardStyle} className="p-5">
                                        <h4 className="font-bold text-lg">{item.title}</h4>
                                        <p className="text-sm font-medium opacity-80" style={{ color: data.style.buttonColor }}>{item.institution}</p>
                                        <p className="text-xs opacity-50 mt-1 mb-2">{item.period}</p>
                                        <p className="text-sm opacity-70">{item.description}</p>
                                    </div>
                                ))}
                            </div>
                        )}

                        {isProfessor && data.extraCourses.length > 0 && (
                            <div className="space-y-4 mb-8" style={{ animation: 'enter 0.8s cubic-bezier(0.2,0.8,0.2,1) forwards', animationDelay: '500ms', opacity: 0 }}>
                                <h3 className="text-[10px] font-bold uppercase tracking-wider opacity-40 text-center mb-2">Cursos & Certificações</h3>
                                {data.extraCourses.map((item) => (
                                    <div key={item.id} style={cardStyle} className="p-5">
                                        <h4 className="font-bold text-lg">{item.title}</h4>
                                        <p className="text-sm font-medium opacity-80" style={{ color: data.style.buttonColor }}>{item.institution}</p>
                                        <p className="text-xs opacity-50 mt-1 mb-2">{item.period}</p>
                                        <p className="text-sm opacity-70">{item.description}</p>
                                    </div>
                                ))}
                            </div>
                        )}

                        {isProfessor && data.lectures.length > 0 && (
                            <div className="space-y-4 mb-8" style={{ animation: 'enter 0.8s cubic-bezier(0.2,0.8,0.2,1) forwards', animationDelay: '560ms', opacity: 0 }}>
                                <h3 className="text-[10px] font-bold uppercase tracking-wider opacity-40 text-center mb-2">Palestras</h3>
                                {data.lectures.map((item) => (
                                    <div key={item.id} style={cardStyle} className="p-5">
                                        <h4 className="font-bold text-lg">{item.title}</h4>
                                        <p className="text-sm font-medium opacity-80" style={{ color: data.style.buttonColor }}>{item.institution}</p>
                                        <p className="text-xs opacity-50 mt-1 mb-2">{item.period}</p>
                                        <p className="text-sm opacity-70">{item.description}</p>
                                    </div>
                                ))}
                            </div>
                        )}

                        {isProfessor && data.lessonPlans.length > 0 && (
                            <div className="space-y-4 mb-8" style={{ animation: 'enter 0.8s cubic-bezier(0.2,0.8,0.2,1) forwards', animationDelay: '620ms', opacity: 0 }}>
                                <h3 className="text-[10px] font-bold uppercase tracking-wider opacity-40 text-center mb-2">Planos de Aula</h3>
                                {data.lessonPlans.map((item) => (
                                    <a key={item.id} style={cardStyle} className="p-5 block" href={item.link || '#'} target="_blank" rel="noreferrer">
                                        <div className="flex items-start justify-between gap-3">
                                            <div>
                                                <h4 className="font-bold text-lg mb-1">{item.title}</h4>
                                                <p className="text-xs opacity-50 mt-1 mb-2">{item.period}</p>
                                                <p className="text-sm opacity-70">{item.description}</p>
                                            </div>
                                            <span className="text-xs font-bold" style={{ color: data.style.buttonColor }}>Abrir ↗</span>
                                        </div>
                                    </a>
                                ))}
                            </div>
                        )}

                        {isProfessor && data.activities.length > 0 && (
                            <div className="space-y-4 mb-8" style={{ animation: 'enter 0.8s cubic-bezier(0.2,0.8,0.2,1) forwards', animationDelay: '680ms', opacity: 0 }}>
                                <h3 className="text-[10px] font-bold uppercase tracking-wider opacity-40 text-center mb-2">Atividades</h3>
                                {data.activities.map((item) => (
                                    <a key={item.id} style={cardStyle} className="p-5 block" href={item.link || '#'} target="_blank" rel="noreferrer">
                                        <div className="flex items-start justify-between gap-3">
                                            <div>
                                                <h4 className="font-bold text-lg mb-1">{item.title}</h4>
                                                <p className="text-xs opacity-50 mt-1 mb-2">{item.period}</p>
                                                <p className="text-sm opacity-70">{item.description}</p>
                                            </div>
                                            <span className="text-xs font-bold" style={{ color: data.style.buttonColor }}>Abrir ↗</span>
                                        </div>
                                    </a>
                                ))}
                            </div>
                        )}

                        {isProfessor && data.teacherSummaries.length > 0 && (
                            <div className="space-y-4 mb-8" style={{ animation: 'enter 0.8s cubic-bezier(0.2,0.8,0.2,1) forwards', animationDelay: '740ms', opacity: 0 }}>
                                <h3 className="text-[10px] font-bold uppercase tracking-wider opacity-40 text-center mb-2">Resumos</h3>
                                {data.teacherSummaries.map((item) => (
                                    <a key={item.id} style={cardStyle} className="p-5 block" href={item.link || '#'} target="_blank" rel="noreferrer">
                                        <div className="flex items-start justify-between gap-3">
                                            <div>
                                                <h4 className="font-bold text-lg mb-1">{item.title}</h4>
                                                <p className="text-sm opacity-70">{item.description}</p>
                                            </div>
                                            <span className="text-xs font-bold" style={{ color: data.style.buttonColor }}>Abrir ↗</span>
                                        </div>
                                    </a>
                                ))}
                            </div>
                        )}

                        {/* Events carousel */}
                        {data.config.showEvents && data.events.length > 0 && (
                            <>
                                <div className="space-y-4 mb-8" style={{ animation: 'enter 0.8s cubic-bezier(0.2,0.8,0.2,1) forwards', animationDelay: '600ms', opacity: 0 }}>
                                    <h3 className="text-[10px] font-bold uppercase tracking-wider opacity-40 text-center mb-2">Eventos & Ações</h3>
                                    <div className="relative overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
                                        <div className="relative h-[240px]">
                                            {data.events.map((ev, idx) => (
                                                <div
                                                    key={ev.id}
                                                    className="absolute inset-0 transition-all duration-500"
                                                    style={{
                                                        opacity: idx === eventIndex ? 1 : 0,
                                                        transform: idx === eventIndex ? 'translateX(0)' : 'translateX(12px)',
                                                    }}
                                                >
                                                    <div className="absolute inset-0">
                                                        <img src={ev.image} alt={ev.title} className="w-full h-full object-cover rounded-2xl" />
                                                        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/30 to-transparent rounded-2xl pointer-events-none"></div>
                                                    </div>
                                                    <div className="relative z-10 p-4 text-white flex flex-col h-full justify-end gap-2">
                                                        <div className="flex items-center gap-2">
                                                            <span className="px-2 py-1 text-[10px] font-bold uppercase tracking-[0.15em] bg-white/90 text-gray-800 rounded-full">
                                                                {ev.type === 'acao' ? 'Ação' : 'Evento'}
                                                            </span>
                                                        </div>
                                                        <h4 className="text-xl font-bold leading-tight">{ev.title}</h4>
                                                        <p className="text-sm text-white/85">{ev.description}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        {data.events.length > 1 && (
                                            <>
                                                <div className="absolute inset-0 flex items-center justify-between px-3">
                                                    <button
                                                        type="button"
                                                        onClick={() => setEventIndex((eventIndex - 1 + data.events.length) % data.events.length)}
                                                        className="w-8 h-8 rounded-full bg-white/80 text-gray-700 hover:bg-white shadow"
                                                        aria-label="Anterior"
                                                    >‹</button>
                                                    <button
                                                        type="button"
                                                        onClick={() => setEventIndex((eventIndex + 1) % data.events.length)}
                                                        className="w-8 h-8 rounded-full bg-white/80 text-gray-700 hover:bg-white shadow"
                                                        aria-label="Próximo"
                                                    >›</button>
                                                </div>
                                                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                                                    {data.events.map((ev, idx) => (
                                                        <span key={ev.id} className={`w-2 h-2 rounded-full ${idx === eventIndex ? 'bg-white' : 'bg-white/50'}`}></span>
                                                    ))}
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>

                                {data.config.showContactCTA && data.contact.whatsapp && (
                                    <div className="absolute inset-0 pointer-events-none">
                                        <a
                                            href={whatsappLink}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="pointer-events-auto flex items-center gap-2 px-4 py-3 rounded-full shadow-lg text-white absolute right-4 md:right-6 bottom-4 md:bottom-6"
                                            style={{ background: data.style.buttonColor, color: data.style.buttonTextColor, zIndex: 60 }}
                                        >
                                            <span className="inline-flex w-4 h-4">
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2M12.05 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.58 20.15 12.04 20.15C10.56 20.15 9.11 19.76 7.85 19L7.55 18.83L4.43 19.65L5.26 16.61L5.06 16.29C4.24 15 3.8 13.47 3.8 11.91C3.81 7.37 7.5 3.67 12.05 3.67M8.53 7.33C8.37 7.33 8.1 7.39 7.87 7.64C7.65 7.89 7 8.5 7 9.71C7 10.93 7.89 12.1 8 12.27C8.14 12.44 9.76 14.94 12.25 16C12.84 16.27 13.3 16.42 13.66 16.53C14.25 16.72 14.79 16.69 15.22 16.63C15.7 16.56 16.68 16.03 16.89 15.45C17.1 14.87 17.1 14.38 17.04 14.27C16.97 14.17 16.81 14.11 16.56 14C16.31 13.86 15.09 13.26 14.87 13.18C14.64 13.1 14.5 13.06 14.31 13.3C14.15 13.55 13.67 14.11 13.53 14.27C13.38 14.44 13.24 14.46 13 14.34C12.74 14.21 11.94 13.95 11 13.11C10.26 12.45 9.77 11.64 9.62 11.39C9.5 11.15 9.61 11 9.73 10.89C9.84 10.78 10 10.6 10.1 10.45C10.23 10.31 10.27 10.2 10.35 10.04C10.43 9.87 10.39 9.73 10.33 9.61C10.27 9.5 9.77 8.26 9.56 7.77C9.36 7.29 9.16 7.35 9 7.34C8.86 7.34 8.7 7.33 8.53 7.33Z"/></svg>
                                            </span>
                                            <span className="text-sm font-semibold">Fale comigo</span>
                                        </a>
                                    </div>
                                )}
                            </>
                        )}

                        <div className="mt-10 mb-6 text-center text-[11px] opacity-60">
                            <a
                                href={salesLink}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1 text-gray-500 hover:text-indigo-700 font-semibold"
                            >
                                Feito com UniFolio · Quero o meu
                            </a>
                        </div>
                    </div>
                </div>

            </div>
        );
    };

    // --- Interface Principal ---

    return (
        <div className="flex flex-col h-screen bg-slate-50 text-slate-900 font-sans overflow-hidden">

            {/* Navbar */}
            <nav className="bg-white border-b border-gray-200 flex flex-col gap-3 px-4 md:px-6 py-3 md:py-0 shrink-0 z-20 shadow-sm md:shadow-none">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-9 h-9 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold shadow-lg shadow-indigo-200">U</div>
                        <span className="font-bold text-lg text-slate-800">UniFolio <span className="text-[10px] align-top text-indigo-600 bg-indigo-50 px-1.5 rounded">ULTIMATE</span></span>
                    </div>
                    <div className="flex items-center gap-2 md:hidden">
                        <button
                            onClick={() => { setPreviewMode('mobile'); setShowMobilePreview(true); setShowMobileActions(false); }}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-semibold bg-indigo-600 text-white shadow-md"
                        >
                            <Eye className="w-4 h-4" /> Preview
                        </button>
                        <button
                            onClick={() => setShowMobileActions(prev => !prev)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-semibold border border-gray-200 text-gray-700 bg-gray-50"
                        >
                            <Menu className="w-4 h-4" /> Menu
                        </button>
                    </div>
                </div>

                <div className="hidden md:flex items-center gap-2 flex-wrap justify-end">
                    <div className="flex items-center gap-2 bg-gray-100 border border-gray-200 rounded-full px-2 py-1 shadow-sm">
                        <span className="text-[11px] font-semibold text-gray-600 px-2">Perfil</span>
                        <select
                            className="text-xs bg-white border border-gray-200 rounded-full px-2 py-1 font-semibold text-gray-700 focus:outline-none"
                            value={data.config.profileType}
                            onChange={(e) => updateData('config', 'profileType', e.target.value)}
                        >
                            <option value="universitario">Universitário</option>
                            <option value="professor">Professor</option>
                        </select>
                    </div>
                    <div className="flex items-center gap-1 bg-gray-100 border border-gray-200 rounded-full px-1.5 py-1 shadow-sm">
                        <button
                            onClick={() => setPreviewMode('mobile')}
                            className={`px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1 transition-colors ${previewMode === 'mobile' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                            title="Modo Celular"
                        >
                            <Smartphone className="w-4 h-4" /> Celular
                        </button>
                        <button
                            onClick={() => setPreviewMode('desktop')}
                            className={`px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1 transition-colors ${previewMode === 'desktop' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                            title="Modo Desktop"
                        >
                            <Monitor className="w-4 h-4" /> Desktop
                        </button>
                    </div>
                    <button onClick={() => setShowTutorial(true)} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                        <BookOpen className="w-4 h-4" /> Tutorial
                    </button>
                    <button onClick={downloadBackup} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                        <Save className="w-4 h-4" /> Salvar backup
                    </button>
                    <button onClick={() => backupInputRef.current?.click()} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                        <Upload className="w-4 h-4" /> Carregar backup
                    </button>
                    <button onClick={downloadHTML} className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-1.5 rounded-lg text-sm font-medium flex items-center gap-2 shadow-md hover:shadow-lg transition-all">
                        <Download className="w-4 h-4" /> Baixar Site
                    </button>
                </div>

                <input
                    ref={backupInputRef}
                    type="file"
                    accept="application/json"
                    className="hidden"
                    onChange={handleBackupUpload}
                />
            </nav>

            {showMobileActions && (
                <div className="md:hidden bg-white border-b border-gray-200 shadow-sm px-4 pt-3 pb-4 space-y-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                            <Settings className="w-4 h-4 text-indigo-600" /> Ajustes rápidos
                        </div>
                        <button onClick={() => setShowMobileActions(false)} className="p-2 rounded-full bg-gray-100 text-gray-600">
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-[11px] font-semibold text-gray-600">Perfil</span>
                        <select
                            className="flex-1 text-xs bg-white border border-gray-200 rounded-full px-2 py-2 font-semibold text-gray-700 focus:outline-none"
                            value={data.config.profileType}
                            onChange={(e) => updateData('config', 'profileType', e.target.value)}
                        >
                            <option value="universitario">Universitário</option>
                            <option value="professor">Professor</option>
                        </select>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setPreviewMode('mobile')}
                            className={`flex-1 px-3 py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 border ${previewMode === 'mobile' ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-gray-200 text-gray-700'}`}
                        >
                            <Smartphone className="w-4 h-4" /> Celular
                        </button>
                        <button
                            onClick={() => { setPreviewMode('mobile'); setShowMobilePreview(true); setShowMobileActions(false); }}
                            className="flex-1 px-3 py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 bg-indigo-600 text-white shadow"
                        >
                            <Eye className="w-4 h-4" /> Ver
                        </button>
                        <button
                            onClick={() => { setShowTutorial(true); setShowMobileActions(false); }}
                            className="flex-1 px-3 py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 border border-gray-200 text-gray-700 bg-white"
                        >
                            <BookOpen className="w-4 h-4" /> Tutorial
                        </button>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                        <button onClick={downloadBackup} className="w-full inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg border border-gray-200 text-xs font-semibold text-gray-700 bg-gray-50">
                            <Save className="w-4 h-4" /> Backup
                        </button>
                        <button onClick={() => backupInputRef.current?.click()} className="w-full inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg border border-gray-200 text-xs font-semibold text-gray-700 bg-gray-50">
                            <Upload className="w-4 h-4" /> Carregar
                        </button>
                        <button onClick={downloadHTML} className="col-span-2 w-full inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-white bg-indigo-600 shadow">
                            <Download className="w-4 h-4" /> Baixar site
                        </button>
                    </div>
                </div>
            )}

            <div className="flex flex-1 flex-col lg:flex-row overflow-hidden">

                {/* Editor Sidebar */}
                <div className="w-full lg:w-[420px] bg-white border-r border-gray-200 overflow-y-auto flex flex-col scrollbar-thin">
                    <div className="p-5 space-y-2 pb-20">

                        {/* 1. Seção Design */}
                        <Section title="Design & Layout" icon={PaintBucket} isOpen={activeSection === 'style'} onToggle={() => setActiveSection(activeSection === 'style' ? '' : 'style')}>

                            <div className="mb-6">
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2 block">Fundo da Página</label>
                                <div className="grid grid-cols-2 gap-2 mb-3">
                                    {['gradient', 'solid'].map(t => (
                                        <button
                                            key={t} onClick={() => updateData('style', 'bgType', t)}
                                            className={`h-10 rounded border transition-all capitalize text-xs font-medium ${data.style.bgType === t ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-gray-200 hover:bg-gray-50'}`}
                                        >
                                            {t === 'gradient' ? 'Gradiente' : 'Sólido'}
                                        </button>
                                    ))}
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                    <ColorPicker label="Cor Inicial" value={data.style.bgStart} onChange={(v) => updateData('style', 'bgStart', v)} />
                                    {data.style.bgType === 'gradient' && <ColorPicker label="Cor Final" value={data.style.bgEnd} onChange={(v) => updateData('style', 'bgEnd', v)} />}
                                </div>
                            </div>

                            <div className="border-t border-gray-100 pt-4">
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2 block">Cores & Elementos</label>
                                <ColorPicker label="Texto Principal" value={data.style.textColor} onChange={(v) => updateData('style', 'textColor', v)} />
                                <ColorPicker label="Fundo dos Cards" value={data.style.cardColor} onChange={(v) => updateData('style', 'cardColor', v)} />

                                {/* Controle de Opacidade dos Cards */}
                                <div className="mb-4 px-1">
                                    <div className="flex justify-between text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                                        <span>Opacidade dos Cards</span>
                                        <span>{Math.round(data.style.cardOpacity * 100)}%</span>
                                    </div>
                                    <input
                                        type="range"
                                        min="0"
                                        max="1"
                                        step="0.05"
                                        value={data.style.cardOpacity}
                                        onChange={(e) => updateData('style', 'cardOpacity', parseFloat(e.target.value))}
                                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                                    />
                                </div>

                                <ColorPicker label="Destaque / Botão" value={data.style.buttonColor} onChange={(v) => updateData('style', 'buttonColor', v)} />
                            </div>
                        </Section>

                        {/* 2. Seção Efeitos */}
                        <Section title="Efeitos & Animações" icon={Sparkles} isOpen={activeSection === 'effects'} onToggle={() => setActiveSection(activeSection === 'effects' ? '' : 'effects')}>
                            <div className="mb-5">
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2 block">Estilo de Entrada</label>
                                <select
                                    className="w-full p-2 border border-gray-200 rounded bg-gray-50 text-sm"
                                    value={data.config.animationStyle}
                                    onChange={(e) => updateData('config', 'animationStyle', e.target.value)}
                                >
                                    <option value="apple">Apple Reveal (Suave)</option>
                                    <option value="slide-up">Slide Up (Clássico)</option>
                                    <option value="slide-side">Slide Lateral</option>
                                    <option value="zoom">Elastic Zoom</option>
                                    <option value="fade">Fade Simples</option>
                                </select>
                            </div>

                            <div className="mb-5">
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2 block">Estilo dos Cards</label>
                                <div className="flex gap-2">
                                    {['glass', 'flat', 'outline', 'neubrutalism'].map(s => (
                                        <button
                                            key={s}
                                            onClick={() => updateData('config', 'cardStyle', s)}
                                            className={`flex-1 py-2 text-[10px] uppercase font-bold border rounded transition-colors ${data.config.cardStyle === s ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-gray-500 hover:bg-gray-50'}`}
                                        >
                                            {s === 'neubrutalism' ? 'Neubr.' : s}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                                <ToggleSwitch label="Intro / Preloader" checked={data.config.preloader} onChange={(v) => updateData('config', 'preloader', v)} />
                            </div>
                        </Section>

                        {/* 3. Perfil */}
                        <Section title="Dados Pessoais" icon={User} isOpen={activeSection === 'profile'} onToggle={() => setActiveSection(activeSection === 'profile' ? '' : 'profile')}>
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-16 h-16 rounded-full bg-gray-100 overflow-hidden border border-gray-200 relative group">
                                    <img src={data.profile.avatar} alt="Avatar" className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                        <Upload className="w-4 h-4 text-white" />
                                    </div>
                                    <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleImageUpload} />
                                </div>
                                <div className="text-xs text-gray-500">
                                    <p className="font-medium text-gray-700">Foto de Perfil</p>
                                    <p>Clique na imagem para alterar (Base64)</p>
                                </div>
                            </div>
                            <InputGroup label="Nome" value={data.profile.name} onChange={(v) => updateData('profile', 'name', v)} />
                            <InputGroup label="Cargo / Título" value={data.profile.role} onChange={(v) => updateData('profile', 'role', v)} />
                            <InputGroup label="Bio" as="textarea" value={data.profile.bio} onChange={(v) => updateData('profile', 'bio', v)} />
                            <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Forma da foto</p>
                                    <div className="flex flex-wrap gap-2">
                                        {[
                                            { key: 'round', label: 'Redonda' },
                                            { key: 'square', label: 'Quadrada' },
                                            { key: 'modern', label: 'Moderna' },
                                        ].map(opt => (
                                            <button
                                                key={opt.key}
                                                onClick={() => updateData('config', 'avatarShape', opt.key)}
                                                className={`text-[11px] px-3 py-2 rounded-md border transition-colors ${data.config.avatarShape === opt.key ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                                            >
                                                {opt.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Borda da foto</p>
                                    <div className="flex flex-wrap gap-2">
                                        {[
                                            { key: 'default', label: 'Padrão' },
                                            { key: 'outline', label: 'Destaque' },
                                            { key: 'shadow', label: 'Sombra' },
                                            { key: 'none', label: 'Sem' },
                                        ].map(opt => (
                                            <button
                                                key={opt.key}
                                                onClick={() => updateData('config', 'avatarFrame', opt.key)}
                                                className={`text-[11px] px-3 py-2 rounded-md border transition-colors ${data.config.avatarFrame === opt.key ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                                            >
                                                {opt.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div className="mt-2">
                                <ToggleSwitch label="Avatar" checked={data.config.showAvatar} onChange={(v) => updateData('config', 'showAvatar', v)} />
                                <ToggleSwitch label="Localização" checked={data.config.showLocation} onChange={(v) => updateData('config', 'showLocation', v)} />
                            </div>
                        </Section>

                        {/* 4. Escola / Instituição */}
                        <Section title="Escola / Instituição" icon={Building2} isOpen={activeSection === 'school'} onToggle={() => setActiveSection(activeSection === 'school' ? '' : 'school')}>
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-14 h-14 rounded-lg bg-gray-100 overflow-hidden border border-gray-200 relative group">
                                    <img src={data.school.logo} alt="Logo da escola" className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                        <Upload className="w-4 h-4 text-white" />
                                    </div>
                                    <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleSchoolLogoUpload} />
                                </div>
                                <div className="text-xs text-gray-500">
                                    <p className="font-medium text-gray-700">Logo da Escola</p>
                                    <p>Suba a logo (Base64)</p>
                                </div>
                            </div>
                            <InputGroup label="Nome da escola" value={data.school.name} onChange={(v) => updateData('school', 'name', v)} />
                            <InputGroup label="Cargo / Função" value={data.school.role} onChange={(v) => updateData('school', 'role', v)} />
                        </Section>

                        {/* 5. Conteúdo Acadêmico (Universitário) */}
                        {data.config.profileType !== 'professor' && (
                            <Section title="Jornada Acadêmica" icon={GraduationCap} isOpen={activeSection === 'academic'} onToggle={() => setActiveSection(activeSection === 'academic' ? '' : 'academic')}>
                                <div className="space-y-4">
                                    {data.academic.map(item => (
                                        <div key={item.id} className="bg-gray-50 p-3 rounded-lg border border-gray-200 relative">
                                            <button onClick={() => removeItem('academic', item.id)} className="absolute top-3 right-3 text-red-300 hover:text-red-500"><Trash2 className="w-3 h-3" /></button>
                                            <InputGroup label="Instituição" value={item.title} onChange={(v) => updateArrayItem('academic', item.id, 'title', v)} />
                                            <InputGroup label="Curso / Grau" value={item.subtitle} onChange={(v) => updateArrayItem('academic', item.id, 'subtitle', v)} />
                                            <InputGroup label="Período" value={item.period} onChange={(v) => updateArrayItem('academic', item.id, 'period', v)} />
                                            <InputGroup label="Detalhes" as="textarea" value={item.description} onChange={(v) => updateArrayItem('academic', item.id, 'description', v)} />
                                        </div>
                                    ))}
                                    <button onClick={() => addItem('academic', { title: 'Nova Instituição', subtitle: 'Curso', period: '2024', description: '' })} className="w-full py-2 border-2 border-dashed border-gray-200 rounded-lg text-xs font-bold text-gray-400 hover:border-indigo-300 hover:text-indigo-600 flex items-center justify-center gap-2">
                                        <Plus className="w-3 h-3" /> Adicionar Acadêmico
                                    </button>
                                </div>
                            </Section>
                        )}

                        {/* 5. Estágios (Universitário) */}
                        {data.config.profileType !== 'professor' && (
                            <Section title="Estágios" icon={Briefcase} isOpen={activeSection === 'internships'} onToggle={() => setActiveSection(activeSection === 'internships' ? '' : 'internships')}>
                                <div className="space-y-4">
                                    {data.internships.map(item => (
                                        <div key={item.id} className="bg-gray-50 p-3 rounded-lg border border-gray-200 relative">
                                            <button onClick={() => removeItem('internships', item.id)} className="absolute top-3 right-3 text-red-300 hover:text-red-500"><Trash2 className="w-3 h-3" /></button>
                                            <InputGroup label="Empresa" value={item.title} onChange={(v) => updateArrayItem('internships', item.id, 'title', v)} />
                                            <InputGroup label="Cargo" value={item.subtitle} onChange={(v) => updateArrayItem('internships', item.id, 'subtitle', v)} />
                                            <InputGroup label="Período" value={item.period} onChange={(v) => updateArrayItem('internships', item.id, 'period', v)} />
                                            <InputGroup label="Descrição" as="textarea" value={item.description} onChange={(v) => updateArrayItem('internships', item.id, 'description', v)} />
                                        </div>
                                    ))}
                                    <button onClick={() => addItem('internships', { title: 'Empresa', subtitle: 'Estagiário', period: '2024', description: '' })} className="w-full py-2 border-2 border-dashed border-gray-200 rounded-lg text-xs font-bold text-gray-400 hover:border-indigo-300 hover:text-indigo-600 flex items-center justify-center gap-2">
                                        <Plus className="w-3 h-3" /> Adicionar Estágio
                                    </button>
                                </div>
                            </Section>
                        )}

                        {/* 6. Pesquisa & Extensão (Universitário) */}
                        {data.config.profileType !== 'professor' && (
                            <Section title="Pesquisa & Extensão" icon={Microscope} isOpen={activeSection === 'research'} onToggle={() => setActiveSection(activeSection === 'research' ? '' : 'research')}>
                                <div className="space-y-4">
                                    {data.research.map(item => (
                                        <div key={item.id} className="bg-gray-50 p-3 rounded-lg border border-gray-200 relative">
                                            <button onClick={() => removeItem('research', item.id)} className="absolute top-3 right-3 text-red-300 hover:text-red-500"><Trash2 className="w-3 h-3" /></button>
                                            <InputGroup label="Projeto / Grupo" value={item.title} onChange={(v) => updateArrayItem('research', item.id, 'title', v)} />
                                            <InputGroup label="Área / Função" value={item.subtitle} onChange={(v) => updateArrayItem('research', item.id, 'subtitle', v)} />
                                            <InputGroup label="Período" value={item.period} onChange={(v) => updateArrayItem('research', item.id, 'period', v)} />
                                            <InputGroup label="Resumo" as="textarea" value={item.description} onChange={(v) => updateArrayItem('research', item.id, 'description', v)} />
                                        </div>
                                    ))}
                                    <button onClick={() => addItem('research', { title: 'Projeto', subtitle: 'Bolsista', period: '2024', description: '' })} className="w-full py-2 border-2 border-dashed border-gray-200 rounded-lg text-xs font-bold text-gray-400 hover:border-indigo-300 hover:text-indigo-600 flex items-center justify-center gap-2">
                                        <Plus className="w-3 h-3" /> Adicionar Pesquisa
                                    </button>
                                </div>
                            </Section>
                        )}

                        {/* 7. Projetos & Links (universitário) */}
                        <Section title="Links & Projetos" icon={Layers} isOpen={activeSection === 'content'} onToggle={() => setActiveSection(activeSection === 'content' ? '' : 'content')}>
                            <div className="space-y-3">
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Links Rápidos</label>
                                {data.links.map(link => (
                                    <div key={link.id} className="flex gap-2 mb-2">
                                        <input className="flex-1 p-2 text-sm border rounded bg-gray-50" value={link.title} onChange={(e) => updateArrayItem('links', link.id, 'title', e.target.value)} />
                                        <button onClick={() => removeItem('links', link.id)} className="text-red-300"><Trash2 className="w-4 h-4" /></button>
                                    </div>
                                ))}
                                <button onClick={() => addItem('links', { title: 'Novo Link', url: '#' })} className="text-xs text-indigo-600 font-bold">+ Adicionar Link</button>
                            </div>

                            <div className="space-y-3 mt-6 border-t pt-4">
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Projetos Pessoais</label>
                                {data.projects.map(proj => (
                                    <div key={proj.id} className="bg-gray-50 p-2 rounded border mb-2">
                                        <input className="w-full bg-transparent font-bold text-sm mb-1" value={proj.title} onChange={(e) => updateArrayItem('projects', proj.id, 'title', e.target.value)} />
                                        <textarea className="w-full bg-transparent text-xs resize-none" value={proj.description} onChange={(e) => updateArrayItem('projects', proj.id, 'description', e.target.value)} />
                                        <button onClick={() => removeItem('projects', proj.id)} className="text-xs text-red-400 mt-1">Remover</button>
                                    </div>
                                ))}
                                <button onClick={() => addItem('projects', { title: 'Novo Projeto', description: '...', tags: '' })} className="text-xs text-indigo-600 font-bold">+ Adicionar Projeto</button>
                            </div>
                        </Section>

                        {/* 8. Resumos de Estudos (Universitário) */}
                        {data.config.profileType !== 'professor' && (
                            <Section title="Resumos de Estudos" icon={BookOpen} isOpen={activeSection === 'summaries'} onToggle={() => setActiveSection(activeSection === 'summaries' ? '' : 'summaries')}>
                                <div className="space-y-4">
                                    {data.studySummaries.map(item => (
                                        <div key={item.id} className="bg-gray-50 p-3 rounded-lg border border-gray-200 relative">
                                            <button onClick={() => removeItem('studySummaries', item.id)} className="absolute top-3 right-3 text-red-300 hover:text-red-500"><Trash2 className="w-3 h-3" /></button>
                                            <InputGroup label="Título" value={item.title} onChange={(v) => updateArrayItem('studySummaries', item.id, 'title', v)} />
                                            <InputGroup label="Descrição" as="textarea" value={item.description} onChange={(v) => updateArrayItem('studySummaries', item.id, 'description', v)} />
                                            <InputGroup label="Link do resumo" value={item.link} onChange={(v) => updateArrayItem('studySummaries', item.id, 'link', v)} />
                                        </div>
                                    ))}
                                    <button onClick={() => addItem('studySummaries', { title: 'Novo Resumo', description: 'Breve descrição...', link: '#' })} className="w-full py-2 border-2 border-dashed border-gray-200 rounded-lg text-xs font-bold text-gray-400 hover:border-indigo-300 hover:text-indigo-600 flex items-center justify-center gap-2">
                                        <Plus className="w-3 h-3" /> Adicionar Resumo
                                    </button>
                                </div>
                            </Section>
                        )}

                        {/* 9. Eventos & Ações */}
                        <Section title="Eventos & Ações" icon={Calendar} isOpen={activeSection === 'events'} onToggle={() => setActiveSection(activeSection === 'events' ? '' : 'events')}>
                            <div className="mb-3">
                                <ToggleSwitch label="Mostrar seção de eventos" checked={data.config.showEvents} onChange={(v) => updateData('config', 'showEvents', v)} />
                            </div>
                            <div className="space-y-4">
                                {data.events.map(item => (
                                    <div key={item.id} className="bg-gray-50 p-3 rounded-lg border border-gray-200 relative">
                                        <button onClick={() => removeItem('events', item.id)} className="absolute top-3 right-3 text-red-300 hover:text-red-500"><Trash2 className="w-3 h-3" /></button>
                                        <InputGroup label="Título" value={item.title} onChange={(v) => updateArrayItem('events', item.id, 'title', v)} />
                                        <InputGroup label="Descrição" as="textarea" value={item.description} onChange={(v) => updateArrayItem('events', item.id, 'description', v)} />
                                        <InputGroup label="Imagem (link)" value={item.image} onChange={(v) => updateArrayItem('events', item.id, 'image', v)} />
                                        <label className="mt-2 inline-flex items-center gap-2 text-xs text-gray-600 cursor-pointer">
                                            <Upload className="w-3 h-3" />
                                            <span>Enviar imagem (Base64)</span>
                                            <input type="file" accept="image/*" className="hidden" onChange={(e) => handleEventImageUpload(e, item.id)} />
                                        </label>
                                        <div className="mt-2">
                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Tipo</p>
                                            <div className="flex gap-2">
                                                {['evento', 'acao'].map(opt => (
                                                    <button
                                                        key={opt}
                                                        onClick={() => updateArrayItem('events', item.id, 'type', opt)}
                                                        className={`flex-1 text-[11px] px-3 py-2 rounded-md border transition-colors ${item.type === opt ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                                                    >
                                                        {opt === 'evento' ? 'Evento' : 'Ação'}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                <button onClick={() => addItem('events', { title: 'Novo Evento', description: 'Breve descrição...', image: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=600&q=80' })} className="w-full py-2 border-2 border-dashed border-gray-200 rounded-lg text-xs font-bold text-gray-400 hover:border-indigo-300 hover:text-indigo-600 flex items-center justify-center gap-2">
                                    <Plus className="w-3 h-3" /> Adicionar Evento
                                </button>
                            </div>
                        </Section>

                        {/* 10. Contato / CTA */}
                        <Section title="Contato / WhatsApp" icon={Share2} isOpen={activeSection === 'contact'} onToggle={() => setActiveSection(activeSection === 'contact' ? '' : 'contact')}>
                            <div className="space-y-3">
                                <ToggleSwitch label="Mostrar botão WhatsApp" checked={data.config.showContactCTA} onChange={(v) => updateData('config', 'showContactCTA', v)} />
                                <InputGroup label="WhatsApp (apenas números, ex: 5511999999999)" value={data.contact.whatsapp} onChange={(v) => updateData('contact', 'whatsapp', v)} />
                                <InputGroup label="Link da página de vendas" value={data.config.salesLink} onChange={(v) => updateData('config', 'salesLink', v)} />
                            </div>
                        </Section>

                        {/* 11. Seções de Professor */}
                        {data.config.profileType === 'professor' && (
                            <>
                                <Section title="Graduações" icon={GraduationCap} isOpen={activeSection === 'grad'} onToggle={() => setActiveSection(activeSection === 'grad' ? '' : 'grad')}>
                                    <div className="space-y-4">
                                        {data.graduations.map(item => (
                                            <div key={item.id} className="bg-gray-50 p-3 rounded-lg border border-gray-200 relative">
                                                <button onClick={() => removeItem('graduations', item.id)} className="absolute top-3 right-3 text-red-300 hover:text-red-500"><Trash2 className="w-3 h-3" /></button>
                                                <InputGroup label="Título" value={item.title} onChange={(v) => updateArrayItem('graduations', item.id, 'title', v)} />
                                                <InputGroup label="Instituição" value={item.institution} onChange={(v) => updateArrayItem('graduations', item.id, 'institution', v)} />
                                                <InputGroup label="Período" value={item.period} onChange={(v) => updateArrayItem('graduations', item.id, 'period', v)} />
                                                <InputGroup label="Descrição" as="textarea" value={item.description} onChange={(v) => updateArrayItem('graduations', item.id, 'description', v)} />
                                            </div>
                                        ))}
                                        <button onClick={() => addItem('graduations', { title: 'Graduação', institution: '', period: '2024', description: '' })} className="w-full py-2 border-2 border-dashed border-gray-200 rounded-lg text-xs font-bold text-gray-400 hover:border-indigo-300 hover:text-indigo-600 flex items-center justify-center gap-2">
                                            <Plus className="w-3 h-3" /> Adicionar
                                        </button>
                                    </div>
                                </Section>

                                <Section title="Pós-Graduação" icon={GraduationCap} isOpen={activeSection === 'postgrad'} onToggle={() => setActiveSection(activeSection === 'postgrad' ? '' : 'postgrad')}>
                                    <div className="space-y-4">
                                        {data.postGraduations.map(item => (
                                            <div key={item.id} className="bg-gray-50 p-3 rounded-lg border border-gray-200 relative">
                                                <button onClick={() => removeItem('postGraduations', item.id)} className="absolute top-3 right-3 text-red-300 hover:text-red-500"><Trash2 className="w-3 h-3" /></button>
                                                <InputGroup label="Título" value={item.title} onChange={(v) => updateArrayItem('postGraduations', item.id, 'title', v)} />
                                                <InputGroup label="Instituição" value={item.institution} onChange={(v) => updateArrayItem('postGraduations', item.id, 'institution', v)} />
                                                <InputGroup label="Período" value={item.period} onChange={(v) => updateArrayItem('postGraduations', item.id, 'period', v)} />
                                                <InputGroup label="Descrição" as="textarea" value={item.description} onChange={(v) => updateArrayItem('postGraduations', item.id, 'description', v)} />
                                            </div>
                                        ))}
                                        <button onClick={() => addItem('postGraduations', { title: 'Pós-graduação', institution: '', period: '2024', description: '' })} className="w-full py-2 border-2 border-dashed border-gray-200 rounded-lg text-xs font-bold text-gray-400 hover:border-indigo-300 hover:text-indigo-600 flex items-center justify-center gap-2">
                                            <Plus className="w-3 h-3" /> Adicionar
                                        </button>
                                    </div>
                                </Section>

                                <Section title="Mestrado" icon={GraduationCap} isOpen={activeSection === 'masters'} onToggle={() => setActiveSection(activeSection === 'masters' ? '' : 'masters')}>
                                    <div className="space-y-4">
                                        {data.masters.map(item => (
                                            <div key={item.id} className="bg-gray-50 p-3 rounded-lg border border-gray-200 relative">
                                                <button onClick={() => removeItem('masters', item.id)} className="absolute top-3 right-3 text-red-300 hover:text-red-500"><Trash2 className="w-3 h-3" /></button>
                                                <InputGroup label="Título" value={item.title} onChange={(v) => updateArrayItem('masters', item.id, 'title', v)} />
                                                <InputGroup label="Instituição" value={item.institution} onChange={(v) => updateArrayItem('masters', item.id, 'institution', v)} />
                                                <InputGroup label="Período" value={item.period} onChange={(v) => updateArrayItem('masters', item.id, 'period', v)} />
                                                <InputGroup label="Descrição" as="textarea" value={item.description} onChange={(v) => updateArrayItem('masters', item.id, 'description', v)} />
                                            </div>
                                        ))}
                                        <button onClick={() => addItem('masters', { title: 'Mestrado', institution: '', period: '2024', description: '' })} className="w-full py-2 border-2 border-dashed border-gray-200 rounded-lg text-xs font-bold text-gray-400 hover:border-indigo-300 hover:text-indigo-600 flex items-center justify-center gap-2">
                                            <Plus className="w-3 h-3" /> Adicionar
                                        </button>
                                    </div>
                                </Section>

                                <Section title="Doutorado" icon={GraduationCap} isOpen={activeSection === 'doctorates'} onToggle={() => setActiveSection(activeSection === 'doctorates' ? '' : 'doctorates')}>
                                    <div className="space-y-4">
                                        {data.doctorates.map(item => (
                                            <div key={item.id} className="bg-gray-50 p-3 rounded-lg border border-gray-200 relative">
                                                <button onClick={() => removeItem('doctorates', item.id)} className="absolute top-3 right-3 text-red-300 hover:text-red-500"><Trash2 className="w-3 h-3" /></button>
                                                <InputGroup label="Título" value={item.title} onChange={(v) => updateArrayItem('doctorates', item.id, 'title', v)} />
                                                <InputGroup label="Instituição" value={item.institution} onChange={(v) => updateArrayItem('doctorates', item.id, 'institution', v)} />
                                                <InputGroup label="Período" value={item.period} onChange={(v) => updateArrayItem('doctorates', item.id, 'period', v)} />
                                                <InputGroup label="Descrição" as="textarea" value={item.description} onChange={(v) => updateArrayItem('doctorates', item.id, 'description', v)} />
                                            </div>
                                        ))}
                                        <button onClick={() => addItem('doctorates', { title: 'Doutorado', institution: '', period: '2024', description: '' })} className="w-full py-2 border-2 border-dashed border-gray-200 rounded-lg text-xs font-bold text-gray-400 hover:border-indigo-300 hover:text-indigo-600 flex items-center justify-center gap-2">
                                            <Plus className="w-3 h-3" /> Adicionar
                                        </button>
                                    </div>
                                </Section>

                                <Section title="Pós-Doutorado" icon={GraduationCap} isOpen={activeSection === 'postdocs'} onToggle={() => setActiveSection(activeSection === 'postdocs' ? '' : 'postdocs')}>
                                    <div className="space-y-4">
                                        {data.postDocs.map(item => (
                                            <div key={item.id} className="bg-gray-50 p-3 rounded-lg border border-gray-200 relative">
                                                <button onClick={() => removeItem('postDocs', item.id)} className="absolute top-3 right-3 text-red-300 hover:text-red-500"><Trash2 className="w-3 h-3" /></button>
                                                <InputGroup label="Título" value={item.title} onChange={(v) => updateArrayItem('postDocs', item.id, 'title', v)} />
                                                <InputGroup label="Instituição" value={item.institution} onChange={(v) => updateArrayItem('postDocs', item.id, 'institution', v)} />
                                                <InputGroup label="Período" value={item.period} onChange={(v) => updateArrayItem('postDocs', item.id, 'period', v)} />
                                                <InputGroup label="Descrição" as="textarea" value={item.description} onChange={(v) => updateArrayItem('postDocs', item.id, 'description', v)} />
                                            </div>
                                        ))}
                                        <button onClick={() => addItem('postDocs', { title: 'Pós-doutorado', institution: '', period: '2024', description: '' })} className="w-full py-2 border-2 border-dashed border-gray-200 rounded-lg text-xs font-bold text-gray-400 hover:border-indigo-300 hover:text-indigo-600 flex items-center justify-center gap-2">
                                            <Plus className="w-3 h-3" /> Adicionar
                                        </button>
                                    </div>
                                </Section>

                                <Section title="Cursos & Certificações" icon={BookOpen} isOpen={activeSection === 'extraCourses'} onToggle={() => setActiveSection(activeSection === 'extraCourses' ? '' : 'extraCourses')}>
                                    <div className="space-y-4">
                                        {data.extraCourses.map(item => (
                                            <div key={item.id} className="bg-gray-50 p-3 rounded-lg border border-gray-200 relative">
                                                <button onClick={() => removeItem('extraCourses', item.id)} className="absolute top-3 right-3 text-red-300 hover:text-red-500"><Trash2 className="w-3 h-3" /></button>
                                                <InputGroup label="Curso" value={item.title} onChange={(v) => updateArrayItem('extraCourses', item.id, 'title', v)} />
                                                <InputGroup label="Instituição" value={item.institution} onChange={(v) => updateArrayItem('extraCourses', item.id, 'institution', v)} />
                                                <InputGroup label="Período" value={item.period} onChange={(v) => updateArrayItem('extraCourses', item.id, 'period', v)} />
                                                <InputGroup label="Descrição" as="textarea" value={item.description} onChange={(v) => updateArrayItem('extraCourses', item.id, 'description', v)} />
                                            </div>
                                        ))}
                                        <button onClick={() => addItem('extraCourses', { title: 'Curso', institution: '', period: '2024', description: '' })} className="w-full py-2 border-2 border-dashed border-gray-200 rounded-lg text-xs font-bold text-gray-400 hover:border-indigo-300 hover:text-indigo-600 flex items-center justify-center gap-2">
                                            <Plus className="w-3 h-3" /> Adicionar
                                        </button>
                                    </div>
                                </Section>

                                <Section title="Palestras" icon={Calendar} isOpen={activeSection === 'lectures'} onToggle={() => setActiveSection(activeSection === 'lectures' ? '' : 'lectures')}>
                                    <div className="space-y-4">
                                        {data.lectures.map(item => (
                                            <div key={item.id} className="bg-gray-50 p-3 rounded-lg border border-gray-200 relative">
                                                <button onClick={() => removeItem('lectures', item.id)} className="absolute top-3 right-3 text-red-300 hover:text-red-500"><Trash2 className="w-3 h-3" /></button>
                                                <InputGroup label="Título" value={item.title} onChange={(v) => updateArrayItem('lectures', item.id, 'title', v)} />
                                                <InputGroup label="Evento / Instituição" value={item.institution} onChange={(v) => updateArrayItem('lectures', item.id, 'institution', v)} />
                                                <InputGroup label="Período" value={item.period} onChange={(v) => updateArrayItem('lectures', item.id, 'period', v)} />
                                                <InputGroup label="Descrição" as="textarea" value={item.description} onChange={(v) => updateArrayItem('lectures', item.id, 'description', v)} />
                                            </div>
                                        ))}
                                        <button onClick={() => addItem('lectures', { title: 'Palestra', institution: '', period: '2024', description: '' })} className="w-full py-2 border-2 border-dashed border-gray-200 rounded-lg text-xs font-bold text-gray-400 hover:border-indigo-300 hover:text-indigo-600 flex items-center justify-center gap-2">
                                            <Plus className="w-3 h-3" /> Adicionar
                                        </button>
                                    </div>
                                </Section>

                                <Section title="Planos de Aula" icon={Layout} isOpen={activeSection === 'lessonPlans'} onToggle={() => setActiveSection(activeSection === 'lessonPlans' ? '' : 'lessonPlans')}>
                                    <div className="space-y-4">
                                        {data.lessonPlans.map(item => (
                                            <div key={item.id} className="bg-gray-50 p-3 rounded-lg border border-gray-200 relative">
                                                <button onClick={() => removeItem('lessonPlans', item.id)} className="absolute top-3 right-3 text-red-300 hover:text-red-500"><Trash2 className="w-3 h-3" /></button>
                                                <InputGroup label="Plano" value={item.title} onChange={(v) => updateArrayItem('lessonPlans', item.id, 'title', v)} />
                                                <InputGroup label="Período" value={item.period} onChange={(v) => updateArrayItem('lessonPlans', item.id, 'period', v)} />
                                                <InputGroup label="Descrição" as="textarea" value={item.description} onChange={(v) => updateArrayItem('lessonPlans', item.id, 'description', v)} />
                                                <InputGroup label="Link" value={item.link} onChange={(v) => updateArrayItem('lessonPlans', item.id, 'link', v)} />
                                            </div>
                                        ))}
                                        <button onClick={() => addItem('lessonPlans', { title: 'Plano de Aula', period: '2024', description: '', link: '#' })} className="w-full py-2 border-2 border-dashed border-gray-200 rounded-lg text-xs font-bold text-gray-400 hover:border-indigo-300 hover:text-indigo-600 flex items-center justify-center gap-2">
                                            <Plus className="w-3 h-3" /> Adicionar
                                        </button>
                                    </div>
                                </Section>

                                <Section title="Atividades" icon={Layers} isOpen={activeSection === 'activities'} onToggle={() => setActiveSection(activeSection === 'activities' ? '' : 'activities')}>
                                    <div className="space-y-4">
                                        {data.activities.map(item => (
                                            <div key={item.id} className="bg-gray-50 p-3 rounded-lg border border-gray-200 relative">
                                                <button onClick={() => removeItem('activities', item.id)} className="absolute top-3 right-3 text-red-300 hover:text-red-500"><Trash2 className="w-3 h-3" /></button>
                                                <InputGroup label="Atividade" value={item.title} onChange={(v) => updateArrayItem('activities', item.id, 'title', v)} />
                                                <InputGroup label="Período" value={item.period} onChange={(v) => updateArrayItem('activities', item.id, 'period', v)} />
                                                <InputGroup label="Descrição" as="textarea" value={item.description} onChange={(v) => updateArrayItem('activities', item.id, 'description', v)} />
                                                <InputGroup label="Link" value={item.link} onChange={(v) => updateArrayItem('activities', item.id, 'link', v)} />
                                            </div>
                                        ))}
                                        <button onClick={() => addItem('activities', { title: 'Atividade', period: '2024', description: '', link: '#' })} className="w-full py-2 border-2 border-dashed border-gray-200 rounded-lg text-xs font-bold text-gray-400 hover:border-indigo-300 hover:text-indigo-600 flex items-center justify-center gap-2">
                                            <Plus className="w-3 h-3" /> Adicionar
                                        </button>
                                    </div>
                                </Section>

                                <Section title="Resumos (Docente)" icon={BookOpen} isOpen={activeSection === 'teacherSummaries'} onToggle={() => setActiveSection(activeSection === 'teacherSummaries' ? '' : 'teacherSummaries')}>
                                    <div className="space-y-4">
                                        {data.teacherSummaries.map(item => (
                                            <div key={item.id} className="bg-gray-50 p-3 rounded-lg border border-gray-200 relative">
                                                <button onClick={() => removeItem('teacherSummaries', item.id)} className="absolute top-3 right-3 text-red-300 hover:text-red-500"><Trash2 className="w-3 h-3" /></button>
                                                <InputGroup label="Título" value={item.title} onChange={(v) => updateArrayItem('teacherSummaries', item.id, 'title', v)} />
                                                <InputGroup label="Descrição" as="textarea" value={item.description} onChange={(v) => updateArrayItem('teacherSummaries', item.id, 'description', v)} />
                                                <InputGroup label="Link" value={item.link} onChange={(v) => updateArrayItem('teacherSummaries', item.id, 'link', v)} />
                                            </div>
                                        ))}
                                        <button onClick={() => addItem('teacherSummaries', { title: 'Resumo', description: '', link: '#' })} className="w-full py-2 border-2 border-dashed border-gray-200 rounded-lg text-xs font-bold text-gray-400 hover:border-indigo-300 hover:text-indigo-600 flex items-center justify-center gap-2">
                                            <Plus className="w-3 h-3" /> Adicionar
                                        </button>
                                    </div>
                                </Section>
                            </>
                        )}

                    </div>
                </div>

                {/* Preview Area */}
                <div className="hidden md:flex flex-1 bg-gray-100 relative p-4 md:p-8 overflow-auto">
                    <div className="min-h-full flex items-start justify-center w-full">
                        <Preview data={data} mode={previewMode} showPreloader={showPreloaderPreview} containerClassName="mx-auto" />
                    </div>
                </div>

            </div>

            {/* Floating preview trigger on mobile */}
            <button
                onClick={() => { setPreviewMode('mobile'); setShowMobilePreview(true); setShowMobileActions(false); }}
                className="md:hidden fixed bottom-4 right-4 z-40 flex items-center gap-2 px-4 py-3 rounded-full bg-indigo-600 text-white shadow-lg shadow-indigo-200"
            >
                <Eye className="w-4 h-4" /> Preview
            </button>

            {/* Fullscreen preview for small screens */}
            {showMobilePreview && (
                <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex flex-col">
                    <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between gap-2 shadow-sm">
                        <div className="flex items-center gap-2 text-sm font-semibold text-gray-800">
                            <Eye className="w-4 h-4 text-indigo-600" /> Pré-visualização
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setPreviewMode('mobile')}
                                className={`px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1 border ${previewMode === 'mobile' ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-gray-200 text-gray-700'}`}
                            >
                                <Smartphone className="w-4 h-4" /> Celular
                            </button>
                            <button onClick={() => setShowMobilePreview(false)} className="p-2 rounded-full bg-gray-100 text-gray-600">
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                    <div className="flex-1 overflow-auto p-3 sm:p-6 bg-gray-100">
                        <div className="max-w-5xl mx-auto">
                            <Preview
                                data={data}
                                mode={previewMode}
                                showPreloader={showPreloaderPreview}
                                containerClassName="max-w-full w-full"
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* Tutorial modal */}
            {showTutorial && (
                <div className="fixed inset-0 z-50 bg-black/55 backdrop-blur-sm flex items-center justify-center px-4 py-6">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden">
                        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                            <div className="flex items-center gap-2">
                                <Info className="w-5 h-5 text-indigo-600" />
                                <div>
                                    <p className="text-sm font-semibold text-gray-800">Tutorial rápido</p>
                                    <p className="text-xs text-gray-500">Siga os passos para lançar seu portfólio</p>
                                </div>
                            </div>
                            <button onClick={() => setShowTutorial(false)} className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200">
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                        <div className="p-5 space-y-3 text-sm text-gray-700 leading-relaxed">
                            <div className="flex items-start gap-3">
                                <span className="w-6 h-6 rounded-full bg-indigo-50 text-indigo-700 text-xs flex items-center justify-center font-bold">1</span>
                                <div>
                                    <p className="font-semibold text-gray-800">Assista às aulas do módulo</p>
                                    <p className="text-gray-600 text-sm">Na área de membros tem o passo a passo para montar tudo.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <span className="w-6 h-6 rounded-full bg-indigo-50 text-indigo-700 text-xs flex items-center justify-center font-bold">2</span>
                                <div>
                                    <p className="font-semibold text-gray-800">Monte seu portfólio aqui</p>
                                    <p className="text-gray-600 text-sm">Preencha dados, imagens e eventos. Use o preview para validar.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <span className="w-6 h-6 rounded-full bg-indigo-50 text-indigo-700 text-xs flex items-center justify-center font-bold">3</span>
                                <div>
                                    <p className="font-semibold text-gray-800">Salve o backup</p>
                                    <p className="text-gray-600 text-sm">Baixe o JSON para continuar editando depois ou em outro device.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <span className="w-6 h-6 rounded-full bg-indigo-50 text-indigo-700 text-xs flex items-center justify-center font-bold">4</span>
                                <div>
                                    <p className="font-semibold text-gray-800">Baixe o site</p>
                                    <p className="text-gray-600 text-sm">Gere o HTML prontinho, já configurado para hospedar onde quiser.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <span className="w-6 h-6 rounded-full bg-indigo-50 text-indigo-700 text-xs flex items-center justify-center font-bold">5</span>
                                <div>
                                    <p className="font-semibold text-gray-800">Carregue o backup quando precisar</p>
                                    <p className="text-gray-600 text-sm">Faça upload do JSON salvo e continue de onde parou.</p>
                                </div>
                            </div>
                        </div>
                        <div className="px-5 py-4 bg-gray-50 border-t border-gray-100 flex flex-wrap gap-2 justify-end">
                            <button onClick={() => setShowTutorial(false)} className="px-4 py-2 text-sm font-semibold text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-100">
                                Entendi
                            </button>
                            <button onClick={() => setShowTutorial(false)} className="px-4 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-lg shadow hover:bg-indigo-700">
                                Voltar para o editor
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
