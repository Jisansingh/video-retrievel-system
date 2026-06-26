import Navbar from '../components/Navbar';
import { Link } from 'react-router-dom';
import { CheckCircle, Languages, Image as ImageIcon, Film, Grid3X3, ScanSearch, PlayCircle, Search, Brain, Database, ArrowUpDown, BrainCircuit, Server, Terminal, Monitor, Palette, Network, Zap } from 'lucide-react';

export default function About() {
  return (
    <div className="bg-surface text-on-surface font-body-md antialiased min-h-screen flex flex-col w-full">
      <Navbar />
      
      <main className="pt-28 pb-16 flex-grow w-full flex flex-col max-w-screen-2xl mx-auto px-6 gap-24">
        
        {/* Hero Section */}
        <section className="text-center max-w-5xl mx-auto w-full">
          <h1 className="font-display-lg text-display-lg text-on-surface mb-6 font-bold">Multimodal Video Retrieval System</h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed">
            A multimodal video retrieval system supporting text, image, video, and frame-level search using CLIP embeddings and FAISS similarity indexing.
          </p>
        </section>

        {/* Project Overview */}
        <section className="grid md:grid-cols-2 gap-12 items-center bg-surface-container-low p-8 md:p-12 rounded-3xl border border-outline-variant w-full">
          <div className="flex flex-col gap-6">
            <span className="text-primary font-label-sm uppercase tracking-widest font-bold">Platform Core</span>
            <h2 className="font-headline-lg text-headline-lg font-bold">Semantic Discovery Reimagined</h2>
            <p className="font-body-md text-on-surface-variant leading-relaxed text-lg">
              Our system transcends traditional keyword-based searching by understanding the semantic relationship between visual content and linguistic descriptions. By mapping videos, images, and text into a shared high-dimensional latent space, we enable fluid discovery across four distinct retrieval paradigms.
            </p>
            <ul className="flex flex-col gap-4 mt-2">
              <li className="flex items-start gap-4">
                <CheckCircle className="text-primary w-6 h-6 shrink-0" />
                <span className="font-body-md font-medium text-on-surface text-lg leading-snug">Text-to-Video Search - natural language understanding for complex descriptive queries.</span>
              </li>
              <li className="flex items-start gap-4">
                <CheckCircle className="text-primary w-6 h-6 shrink-0" />
                <span className="font-body-md font-medium text-on-surface text-lg leading-snug">Image-to-Video Search - find visually similar content using a reference image.</span>
              </li>
              <li className="flex items-start gap-4">
                <CheckCircle className="text-primary w-6 h-6 shrink-0" />
                <span className="font-body-md font-medium text-on-surface text-lg leading-snug">Video-to-Video Search - identify related sequences by providing a video clip.</span>
              </li>
              <li className="flex items-start gap-4">
                <CheckCircle className="text-primary w-6 h-6 shrink-0" />
                <span className="font-body-md font-medium text-on-surface text-lg leading-snug">Text-to-Frame Search - locate the most relevant video frames for precise scene-level retrieval.</span>
              </li>
            </ul>
          </div>
          {/* Technology Stack - Premium Dashboard Layout */}
          <div className="flex flex-col bg-white rounded-2xl border border-gray-200/80 shadow-sm overflow-hidden">
            {/* Centered heading with decorative lines */}
            <div className="flex items-center gap-4 px-6 pt-6 pb-4">
              <div className="flex-1 h-px bg-primary/25"></div>
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-primary whitespace-nowrap">Technology Stack</span>
              <div className="flex-1 h-px bg-primary/25"></div>
            </div>

            {/* Rows wrapper */}
            <div className="flex flex-col gap-2.5 px-5 pb-5">

              {/* AI & Retrieval Row */}
              <div className="flex items-center gap-3 rounded-xl border border-gray-100 bg-gray-50/50 px-4 py-5">
                {/* Category label — open, no harsh border */}
                <div className="flex flex-col items-center justify-center gap-2 w-[88px] shrink-0">
                  <div className="w-12 h-12 rounded-full border border-primary/20 bg-primary/8 flex items-center justify-center" style={{background: 'rgba(var(--color-primary-rgb, 13 148 136), 0.07)'}}>
                    <BrainCircuit className="w-6 h-6 text-primary" strokeWidth={1.5} />
                  </div>
                  <span className="text-[9px] font-bold uppercase tracking-[0.14em] text-primary text-center leading-tight">AI &amp;<br/>Retrieval</span>
                </div>

                {/* Tech cards */}
                <div className="flex flex-1 gap-2.5 min-w-0">
                  <div className="flex items-center gap-3 flex-1 min-w-0 rounded-xl border border-gray-200/80 bg-white px-3.5 py-4 shadow-[0_1px_3px_rgba(0,0,0,0.05)] cursor-default transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)] hover:border-primary/30">
                    <div className="w-14 h-14 rounded-xl flex items-center justify-center shrink-0" style={{background: 'rgba(var(--color-primary-rgb, 13 148 136), 0.12)'}}>
                      <Network className="w-7 h-7 text-primary" strokeWidth={1.5} />
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-[14px] text-on-surface leading-tight">CLIP ViT-B/32</p>
                      <p className="text-[11px] text-on-surface-variant/55 leading-snug mt-1">Vision-language model</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 flex-1 min-w-0 rounded-xl border border-gray-200/80 bg-white px-3.5 py-4 shadow-[0_1px_3px_rgba(0,0,0,0.05)] cursor-default transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)] hover:border-primary/30">
                    <div className="w-14 h-14 rounded-xl flex items-center justify-center shrink-0" style={{background: 'rgba(var(--color-primary-rgb, 13 148 136), 0.12)'}}>
                      <Database className="w-7 h-7 text-primary" strokeWidth={1.5} />
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-[14px] text-on-surface leading-tight">FAISS</p>
                      <p className="text-[11px] text-on-surface-variant/55 leading-snug mt-1">Vector similarity search</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Backend Row */}
              <div className="flex items-center gap-3 rounded-xl border border-gray-100 bg-gray-50/50 px-4 py-5">
                <div className="flex flex-col items-center justify-center gap-2 w-[88px] shrink-0">
                  <div className="w-12 h-12 rounded-full border border-primary/20 flex items-center justify-center" style={{background: 'rgba(var(--color-primary-rgb, 13 148 136), 0.07)'}}>
                    <Server className="w-6 h-6 text-primary" strokeWidth={1.5} />
                  </div>
                  <span className="text-[9px] font-bold uppercase tracking-[0.14em] text-primary text-center leading-tight">Backend</span>
                </div>

                <div className="flex flex-1 gap-2.5 min-w-0">
                  <div className="flex items-center gap-3 flex-1 min-w-0 rounded-xl border border-gray-200/80 bg-white px-3.5 py-4 shadow-[0_1px_3px_rgba(0,0,0,0.05)] cursor-default transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)] hover:border-primary/30">
                    <div className="w-14 h-14 rounded-xl flex items-center justify-center shrink-0" style={{background: 'rgba(var(--color-primary-rgb, 13 148 136), 0.12)'}}>
                      <Zap className="w-7 h-7 text-primary" strokeWidth={1.5} fill="currentColor" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-[14px] text-on-surface leading-tight">FastAPI</p>
                      <p className="text-[11px] text-on-surface-variant/55 leading-snug mt-1">High-performance REST API</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 flex-1 min-w-0 rounded-xl border border-gray-200/80 bg-white px-3.5 py-4 shadow-[0_1px_3px_rgba(0,0,0,0.05)] cursor-default transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)] hover:border-primary/30">
                    <div className="w-14 h-14 rounded-xl flex items-center justify-center shrink-0" style={{background: 'rgba(var(--color-primary-rgb, 13 148 136), 0.12)'}}>
                      {/* Python official logo — monochrome SVG */}
                      <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7 text-primary" aria-hidden="true">
                        <path d="M11.914 0C5.82 0 6.2 2.656 6.2 2.656l.007 2.752h5.814v.826H3.9S0 5.789 0 11.969C0 18.149 3.403 17.93 3.403 17.93h2.034v-2.875s-.11-3.402 3.347-3.402h5.766s3.236.052 3.236-3.13V3.127S18.33 0 11.914 0zm-3.2 1.809c.578 0 1.048.47 1.048 1.05s-.47 1.048-1.048 1.048c-.58 0-1.05-.47-1.05-1.048s.47-1.05 1.05-1.05z"/>
                        <path d="M12.086 24c6.094 0 5.714-2.656 5.714-2.656l-.007-2.752H12V17.766h8.121S24 18.211 24 12.031C24 5.851 20.597 6.07 20.597 6.07h-2.034v2.875s.11 3.402-3.347 3.402H9.45s-3.236-.052-3.236 3.13v5.396S5.67 24 12.086 24zm3.2-1.809c-.578 0-1.048-.47-1.048-1.05s.47-1.048 1.048-1.048c.58 0 1.05.47 1.05 1.048s-.47 1.05-1.05 1.05z"/>
                      </svg>
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-[14px] text-on-surface leading-tight">Python</p>
                      <p className="text-[11px] text-on-surface-variant/55 leading-snug mt-1">Core application language</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Frontend Row */}
              <div className="flex items-center gap-3 rounded-xl border border-gray-100 bg-gray-50/50 px-4 py-5">
                <div className="flex flex-col items-center justify-center gap-2 w-[88px] shrink-0">
                  <div className="w-12 h-12 rounded-full border border-primary/20 flex items-center justify-center" style={{background: 'rgba(var(--color-primary-rgb, 13 148 136), 0.07)'}}>
                    <Monitor className="w-6 h-6 text-primary" strokeWidth={1.5} />
                  </div>
                  <span className="text-[9px] font-bold uppercase tracking-[0.14em] text-primary text-center leading-tight">Frontend</span>
                </div>

                <div className="flex flex-1 gap-2.5 min-w-0">
                  <div className="flex items-center gap-3 flex-1 min-w-0 rounded-xl border border-gray-200/80 bg-white px-3.5 py-4 shadow-[0_1px_3px_rgba(0,0,0,0.05)] cursor-default transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)] hover:border-primary/30">
                    <div className="w-14 h-14 rounded-xl flex items-center justify-center shrink-0" style={{background: 'rgba(var(--color-primary-rgb, 13 148 136), 0.12)'}}>
                      {/* React official atom logo — monochrome SVG */}
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" className="w-7 h-7 text-primary" aria-hidden="true">
                        <ellipse cx="12" cy="12" rx="10.5" ry="3.6"/>
                        <ellipse cx="12" cy="12" rx="10.5" ry="3.6" transform="rotate(60 12 12)"/>
                        <ellipse cx="12" cy="12" rx="10.5" ry="3.6" transform="rotate(120 12 12)"/>
                        <circle cx="12" cy="12" r="1.6" fill="currentColor" stroke="none"/>
                      </svg>
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-[14px] text-on-surface leading-tight">React</p>
                      <p className="text-[11px] text-on-surface-variant/55 leading-snug mt-1">Interactive user interface</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 flex-1 min-w-0 rounded-xl border border-gray-200/80 bg-white px-3.5 py-4 shadow-[0_1px_3px_rgba(0,0,0,0.05)] cursor-default transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)] hover:border-primary/30">
                    <div className="w-14 h-14 rounded-xl flex items-center justify-center shrink-0" style={{background: 'rgba(var(--color-primary-rgb, 13 148 136), 0.12)'}}>
                      {/* Tailwind CSS official wave logo — monochrome SVG */}
                      <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7 text-primary" aria-hidden="true">
                        <path d="M12.001 4.8c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624C13.666 10.618 15.027 12 18.001 12c3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C16.337 6.182 14.976 4.8 12.001 4.8zm-6 7.2c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624 1.177 1.194 2.538 2.576 5.512 2.576 3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C10.337 14.382 8.976 12 6.001 12z"/>
                      </svg>
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-[14px] text-on-surface leading-tight">Tailwind CSS</p>
                      <p className="text-[11px] text-on-surface-variant/55 leading-snug mt-1">Utility-first CSS framework</p>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Technical Capabilities */}
        <section className="w-full">
          <div className="text-center mb-16">
            <h2 className="font-headline-lg text-headline-lg font-bold">Technical Capabilities</h2>
            <div className="w-16 h-1.5 bg-primary mx-auto mt-6 rounded-full"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-surface-container-lowest p-10 rounded-2xl border border-outline-variant hover:shadow-lg transition-shadow h-full min-h-[280px] flex flex-col">
              <div className="w-16 h-16 bg-primary-container rounded-2xl flex items-center justify-center mb-8 shrink-0">
                <Languages className="text-on-primary-container w-8 h-8" />
              </div>
              <h3 className="font-headline-sm text-headline-sm font-bold mb-4">Text-to-Video Search</h3>
              <p className="font-body-sm text-on-surface-variant text-base leading-relaxed flex-grow">Perform semantic searches using natural language descriptions. The CLIP model encodes text queries into the same latent space as video frames for accurate retrieval.</p>
            </div>
            <div className="bg-surface-container-lowest p-10 rounded-2xl border border-outline-variant hover:shadow-lg transition-shadow h-full min-h-[280px] flex flex-col">
              <div className="w-16 h-16 bg-primary-container rounded-2xl flex items-center justify-center mb-8 shrink-0">
                <ImageIcon className="text-on-primary-container w-8 h-8" />
              </div>
              <h3 className="font-headline-sm text-headline-sm font-bold mb-4">Image-to-Video Search</h3>
              <p className="font-body-sm text-on-surface-variant text-base leading-relaxed flex-grow">Upload a reference image to find videos with visually similar content. CLIP generates embeddings for comparison against the FAISS index.</p>
            </div>
            <div className="bg-surface-container-lowest p-10 rounded-2xl border border-outline-variant hover:shadow-lg transition-shadow h-full min-h-[280px] flex flex-col">
              <div className="w-16 h-16 bg-primary-container rounded-2xl flex items-center justify-center mb-8 shrink-0">
                <Film className="text-on-primary-container w-8 h-8" />
              </div>
              <h3 className="font-headline-sm text-headline-sm font-bold mb-4">Video-to-Video Search</h3>
              <p className="font-body-sm text-on-surface-variant text-base leading-relaxed flex-grow">Upload a video clip as a query. Frames are sampled every 30th interval, mean-pooled into a single embedding, and matched against the index.</p>
            </div>
            <div className="bg-surface-container-lowest p-10 rounded-2xl border border-outline-variant hover:shadow-lg transition-shadow h-full min-h-[280px] flex flex-col">
              <div className="w-16 h-16 bg-primary-container rounded-2xl flex items-center justify-center mb-8 shrink-0">
                <Grid3X3 className="text-on-primary-container w-8 h-8" />
              </div>
              <h3 className="font-headline-sm text-headline-sm font-bold mb-4">Categorized Browsing</h3>
              <p className="font-body-sm text-on-surface-variant text-base leading-relaxed flex-grow">Browse 500 indexed videos organized across 5 categories: Animals, Nature, Humans, Vehicles, and Indoors.</p>
            </div>
            <div className="bg-surface-container-lowest p-10 rounded-2xl border border-outline-variant hover:shadow-lg transition-shadow h-full min-h-[280px] flex flex-col">
              <div className="w-16 h-16 bg-primary-container rounded-2xl flex items-center justify-center mb-8 shrink-0">
                <ScanSearch className="text-on-primary-container w-8 h-8" />
              </div>
              <h3 className="font-headline-sm text-headline-sm font-bold mb-4">Text-to-Frame Search</h3>
              <p className="font-body-sm text-on-surface-variant text-base leading-relaxed flex-grow">Search using natural language and retrieve the most relevant video frames with timestamp information for precise scene localization.</p>
            </div>
            <div className="bg-surface-container-lowest p-10 rounded-2xl border border-outline-variant hover:shadow-lg transition-shadow h-full min-h-[280px] flex flex-col">
              <div className="w-16 h-16 bg-primary-container rounded-2xl flex items-center justify-center mb-8 shrink-0">
                <PlayCircle className="text-on-primary-container w-8 h-8" />
              </div>
              <h3 className="font-headline-sm text-headline-sm font-bold mb-4">Video Playback</h3>
              <p className="font-body-sm text-on-surface-variant text-base leading-relaxed flex-grow">Integrated HTML5 video player for seamless verification of results directly within the retrieval interface.</p>
            </div>
          </div>
        </section>

        {/* Retrieval Pipeline */}
        <section className="bg-surface-container py-20 px-8 md:px-16 rounded-3xl border border-outline-variant/50 w-full shadow-inner">
          <div className="text-center mb-20">
            <h2 className="font-headline-lg text-headline-lg font-bold">Retrieval Pipeline</h2>
          </div>
          <div className="flex flex-col md:flex-row items-center justify-between gap-12 relative max-w-7xl mx-auto z-0">
            
            <div className="hidden md:block absolute top-12 left-[12%] right-[12%] h-1 bg-outline-variant/50 rounded-full -z-10"></div>
            
            <div className="flex flex-col items-center flex-1 text-center w-full z-10 bg-surface-container md:bg-transparent">
              <div className="w-24 h-24 rounded-full bg-surface-container-lowest flex items-center justify-center border-[5px] border-primary mb-6 shadow-md">
                <Search className="text-primary w-11 h-11" />
              </div>
              <h4 className="font-label-md text-label-md font-bold mb-3 text-lg">Text / Image / Video Query</h4>
              <p className="font-body-sm text-on-surface-variant max-w-[220px] text-base leading-snug">Input text, image, or video seed.</p>
            </div>
            
            <div className="md:hidden w-1 h-16 bg-outline-variant/50 rounded-full z-10"></div>
            
            <div className="flex flex-col items-center flex-1 text-center w-full z-10 bg-surface-container md:bg-transparent">
              <div className="w-24 h-24 rounded-full bg-surface-container-lowest flex items-center justify-center border-[5px] border-primary mb-6 shadow-md">
                <Brain className="text-primary w-11 h-11" />
              </div>
              <h4 className="font-label-md text-label-md font-bold mb-3 text-lg">CLIP Embedding</h4>
              <p className="font-body-sm text-on-surface-variant max-w-[220px] text-base leading-snug">Vector transformation into 512-D space.</p>
            </div>
            
            <div className="md:hidden w-1 h-16 bg-outline-variant/50 rounded-full z-10"></div>
            
            <div className="flex flex-col items-center flex-1 text-center w-full z-10 bg-surface-container md:bg-transparent">
              <div className="w-24 h-24 rounded-full bg-surface-container-lowest flex items-center justify-center border-[5px] border-primary mb-6 shadow-md">
                <Database className="text-primary w-11 h-11" />
              </div>
              <h4 className="font-label-md text-label-md font-bold mb-3 text-lg">FAISS Search</h4>
              <p className="font-body-sm text-on-surface-variant max-w-[220px] text-base leading-snug">Nearest neighbor similarity matching.</p>
            </div>
            
            <div className="md:hidden w-1 h-16 bg-outline-variant/50 rounded-full z-10"></div>
            
            <div className="flex flex-col items-center flex-1 text-center w-full z-10 bg-surface-container md:bg-transparent">
              <div className="w-24 h-24 rounded-full bg-surface-container-lowest flex items-center justify-center border-[5px] border-primary mb-6 shadow-md">
                <ArrowUpDown className="text-primary w-11 h-11" />
              </div>
              <h4 className="font-label-md text-label-md font-bold mb-3 text-lg">Ranked Results</h4>
              <p className="font-body-sm text-on-surface-variant max-w-[220px] text-base leading-snug">Visual gallery sorted by cosine similarity.</p>
            </div>
          </div>
        </section>

        {/* Metrics & Stats */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-10 w-full">
          <div className="grid grid-cols-2 gap-8">
            <div className="bg-surface-container-lowest p-8 rounded-3xl border border-outline-variant shadow-sm flex flex-col justify-center text-center sm:text-left h-full">
              <div className="text-primary font-display-lg font-bold text-5xl mb-4">500</div>
              <div className="font-label-sm text-on-surface-variant uppercase tracking-wider font-bold">Indexed Videos</div>
            </div>
            <div className="bg-surface-container-lowest p-8 rounded-3xl border border-outline-variant shadow-sm flex flex-col justify-center text-center sm:text-left h-full">
              <div className="text-primary font-display-lg font-bold text-5xl mb-4">5</div>
              <div className="font-label-sm text-on-surface-variant uppercase tracking-wider font-bold">Categories</div>
            </div>
            <div className="bg-surface-container-lowest p-8 rounded-3xl border border-outline-variant shadow-sm flex flex-col justify-center text-center sm:text-left h-full">
              <div className="text-primary font-display-lg font-bold text-5xl mb-4">512-D</div>
              <div className="font-label-sm text-on-surface-variant uppercase tracking-wider font-bold">Embeddings</div>
            </div>
            <div className="bg-surface-container-lowest p-8 rounded-3xl border border-outline-variant shadow-sm flex flex-col justify-center text-center sm:text-left h-full">
              <div className="text-primary font-display-lg font-bold text-3xl sm:text-4xl mb-4">CLIP</div>
              <div className="font-label-sm text-on-surface-variant uppercase tracking-wider font-bold">ViT-B/32 Model</div>
            </div>
          </div>

          <div className="bg-surface-container-lowest p-10 rounded-3xl border border-outline-variant shadow-sm h-full flex flex-col">
            <h3 className="font-headline-sm text-headline-sm font-bold mb-10">Dataset Composition</h3>
            <div className="flex flex-col gap-8 flex-grow justify-center">
              {[
                { name: 'Animals' },
                { name: 'Nature' },
                { name: 'Humans' },
                { name: 'Vehicles' },
                { name: 'Indoors' }
              ].map((cat) => (
                <div key={cat.name}>
                  <div className="flex justify-between mb-3">
                    <span className="font-label-md font-semibold text-lg">{cat.name}</span>
                    <span className="font-label-md text-primary font-bold text-lg">100 / 20%</span>
                  </div>
                  <div className="w-full bg-surface-container rounded-full h-3 shadow-inner">
                    <div className="bg-primary h-3 rounded-full" style={{ width: '20%' }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Tech Stack */}
        <section className="bg-surface-container-high py-16 px-8 rounded-3xl text-center border border-outline-variant/30 w-full mb-12">
          <h3 className="font-label-sm text-label-sm uppercase tracking-[0.2em] mb-10 text-on-surface-variant font-bold">Built With High-Performance Technologies</h3>
          <div className="flex flex-wrap justify-center gap-5">
            {['React', 'FastAPI', 'CLIP ViT-B/32', 'FAISS', 'Python', 'Tailwind CSS'].map(tech => (
              <span key={tech} className="px-8 py-3 bg-surface-container-lowest rounded-full border border-outline-variant font-label-md text-label-md shadow-sm font-semibold text-on-surface hover:border-primary transition-colors cursor-default text-base">
                {tech}
              </span>
            ))}
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="w-full py-8 px-6 bg-surface-container-low dark:bg-surface-dim border-t border-outline-variant dark:border-outline mt-auto">
        <div className="max-w-screen-2xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
            <span className="font-headline-sm text-headline-sm font-bold text-primary">Video Retrieval System</span>
            <p className="font-body-sm text-body-sm text-secondary dark:text-secondary-fixed-dim hidden md:block">© 2026 Video Retrieval System.</p>
          </div>
          <div className="flex items-center gap-8">
            <Link className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-colors font-medium" to="#">Terms</Link>
            <Link className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-colors font-medium" to="#">Privacy</Link>
            <Link className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-colors font-medium" to="#">Github</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
