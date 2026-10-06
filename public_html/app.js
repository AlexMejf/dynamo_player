    // 1. TABS LOGIC
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const target = btn.dataset.tab;
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
        btn.classList.add('active');
        document.getElementById('tab-' + target).classList.add('active');
      });
    });

    document.querySelector('a[href="#attr-tab"]').addEventListener('click', (e) => {
      e.preventDefault();
      document.querySelector('[data-tab="atributos"]').click();
      document.querySelector('#docs').scrollIntoView({ behavior: 'smooth' });
    });
    
    document.querySelector('a[href="#fmt-tab"]').addEventListener('click', (e) => {
      e.preventDefault();
      document.querySelector('[data-tab="formatos"]').click();
      document.querySelector('#docs').scrollIntoView({ behavior: 'smooth' });
    });

    // 2. COPY CODE LOGIC
    function copyCode(btn) {
      const pre = btn.closest('.code-wrap').querySelector('pre');
      navigator.clipboard.writeText(pre.innerText).then(() => {
        const isEn = currentLang === 'en';
        btn.textContent = isEn ? 'Copied!' : '¡Copiado!';
        btn.classList.add('copied');
        setTimeout(() => {
          btn.textContent = isEn ? 'Copy' : 'Copiar';
          btn.classList.remove('copied');
        }, 2000);
      });
    }

    // 3. I18N LOGIC (Traducción automática)
    const translations = {
      es: {
        nav: { home: "Inicio", demo: "Demo", whatsnew: "Novedades", usage: "Uso", attributes: "Atributos", formats: "Formatos" },
        hero: { eyebrow: "Reproductor de video", description: "Moderno, ligero y sin dependencias. Construido sobre el elemento &lt;video&gt; nativo con soporte para HLS, múltiples calidades, subtítulos y modo ambiente.", pills: { quality: "Múltiples calidades", subs: "Subtítulos", ctx: "Menú Contextual", multi: "Multi-Player", zero_css: "Aislamiento CSS 100%", lightweight: "~11 KB Gzip" }, scroll: "scroll" },
        demo: {
          title: "Demo en vivo",
          input_placeholder: "Introduce la URL de un video (.mp4, .m3u8, etc.) o deja vacío para predeterminado",
          load_btn: "Cargar",
          reset_btn: "Predeterminado",
          presets_label: "Presets rápidos:",
          preset_default: "Default (MP4)",
          preset_hls: "HLS Stream (.m3u8)",
          preset_oceans: "Océanos (1080p MP4)",
          empty_fallback: "Sin URL especificada: cargando video y poster predeterminados.",
          error_load: "⚠️ No se pudo reproducir este video. Comprueba que el enlace sea accesible y el formato sea compatible.",
          loaded_custom: "Cargando video personalizado...",
          loaded_default: "Video y portada predeterminados cargados."
        },
        whatsnew: {
          label: "Versión 1.8",
          title: "Novedades y Mejoras",
          subtitle: "Conoce las nuevas optimizaciones de sincronización, aislamiento y arquitectura.",
          ctx_title: "🖱️ Menú Contextual Cinemático",
          ctx_badge: "Click Derecho / Móvil",
          ctx_desc: "Menú contextual al hacer click derecho (o presión sostenida en táctiles) con el diseño Glassmorphism de ajustes. Bucle continuo, captura de pantalla en HD (PNG), copiar enlace con tiempo, PiP y estadísticas técnicas con cero fugas de listeners vía AbortController.",
          autohide_title: "🎯 Ocultamiento Sincronizado",
          autohide_badge: "UX &amp; Controles",
          autohide_desc: "Los controles se mantienen visibles mientras el menú de configuración esté abierto. La inactividad se reanuda al cerrarlo y el menú se cierra automáticamente si los controles se ocultan por inactividad o pausa.",
          css_title: "🛡️ Aislamiento CSS 100%",
          css_badge: "Cero Conflictos",
          css_desc: "Estilos 100% encapsulados bajo prefijos .dynamo-*. Eliminación de clases globales como .hidden para evitar interferencias con Navbars, Tailwind CSS, Bootstrap o layouts externos.",
          multi_title: "👥 Soporte Multi-Reproductor",
          multi_badge: "Arquitectura Scoped",
          multi_desc: "Múltiples reproductores pueden convivir en una misma página de manera totalmente independiente, con closures y consultas DOM aisladas, soportando clases .dynamo-player o data-dynamo.",
          weight_title: "⚡ 51% Más Ligero (~8 KB Gzip)",
          weight_badge: "Rendimiento Extremo",
          weight_desc: "El bundle se redujo de 63 KB a solo 30.9 KB (reducción del 51% y 55% en transferencia de red gzip) mediante la vectorización pura de SVG y compresión avanzada."
        },
        docs: {
          title: "Cómo usarlo", subtitle: "Todo lo que necesitas para integrar Dynamo Player en tu proyecto.",
          tabs: { install: "Instalación", attributes: "Atributos", formats: "Formatos de fuente", keyboard: "Teclado" },
          install: { step1_title: "Importación desde CDN", step1_desc: "Carga un único archivo JS desde la CDN o descarga el archivo", step2_title: "Agrega el elemento &lt;video&gt;", step2_desc: "El reproductor se activa automáticamente sobre cualquier &lt;video class=\"dynamo-player\"&gt;, &lt;video data-dynamo&gt; o &lt;video id=\"dynamoPlayer\"&gt; en el DOM.", step3_title: "Inicialización dinámica (opcional)", step3_desc: "Si insertas el elemento de video dinámicamente o usas selectores personalizados, llama a init() manualmente.", copy_btn: "Copiar" },
          attributes: { notice: "Todos los atributos se declaran directamente en el elemento &lt;video&gt;.", required: "Requerido", desc_src: "URL del video o JSON con fuentes múltiples. Soporta .mp4, .webm y .m3u8.", desc_poster: "Imagen del poster. Si se omite, el player captura un frame automáticamente del video.", desc_overscreen: "Muestra botones de Play/Pausa, Atrás y Adelante flotando sobre el video al estilo streaming.", desc_thumbnails: "Activa la previsualización de frames al pasar el cursor por la barra de progreso.", desc_ambient: "Proyecta un halo de luz difusa detrás del player que refleja los colores dominantes del video.", desc_pip: "Muestra el botón de Picture-in-Picture. Solo aparece si el navegador soporta la API nativa." },
          formats: { notice: "El atributo data-src acepta tres formatos distintos.", simple: "URL simple", hls: "HLS (.m3u8)", hls_note: "// hls.js se carga automáticamente", multiple: "Múltiples calidades", subs: "Con subtítulos" },
          keyboard: { notice: "El reproductor captura eventos de teclado cuando tiene el foco. Haz clic sobre él para enfocarlo.", play_pause: "Play / Pausa", forward: "Adelantar 5 segundos", backward: "Retroceder 5 segundos", compat_title: "Compatibilidad", compat_subtitle: "Funciona en todos los navegadores modernos.", compat_chrome: "Soporte completo incluyendo Ambient Mode y Auto Thumbnails.", compat_firefox: "Soporte completo. HLS vía hls.js.", compat_safari: "HLS nativo. Ambient Mode requiere cabeceras CORS en el servidor." },
          code_comments: {
            req: "// o id=\"dynamoPlayer\" / data-dynamo",
            src: "// HLS, M3U8, MP4, WebM...",
            poster: "// url del poster",
            controls: "// controles sobre el video",
            ambient: "// modo ambiental",
            thumbs: "// miniaturas en seek",
            pip: "// picture-in-picture",
            apiInit: "// Inicializa automáticamente todos los reproductores",
            apiCustom: "// O con selector personalizado / elemento específico"
          }
        }
      },
      en: {
        nav: { home: "Home", demo: "Demo", whatsnew: "What's New", usage: "Usage", attributes: "Attributes", formats: "Formats" },
        hero: { eyebrow: "Video Player", description: "Modern, lightweight, and dependency-free. Built on top of the native &lt;video&gt; element with support for HLS, multiple qualities, subtitles, and ambient mode.", pills: { quality: "Multiple qualities", subs: "Subtitles", ctx: "Context Menu", multi: "Multi-Player", zero_css: "100% Scoped CSS", lightweight: "~11 KB Gzip" }, scroll: "scroll" },
        demo: {
          title: "Live Demo",
          input_placeholder: "Enter video URL (.mp4, .m3u8, etc.) or leave empty for default",
          load_btn: "Load",
          reset_btn: "Default",
          presets_label: "Quick presets:",
          preset_default: "Default (MP4)",
          preset_hls: "HLS Stream (.m3u8)",
          preset_oceans: "Oceans (1080p MP4)",
          empty_fallback: "No URL specified: loading default video and poster.",
          error_load: "⚠️ Could not play this video. Check that the link is accessible and the format is supported.",
          loaded_custom: "Loading custom video...",
          loaded_default: "Default video and poster loaded."
        },
        whatsnew: {
          label: "Version 1.8",
          title: "What's New & Improvements",
          subtitle: "Discover the new optimizations for synchronization, style isolation, and architecture.",
          ctx_title: "🖱️ Cinematic Context Menu",
          ctx_badge: "Right Click / Touch",
          ctx_desc: "Native right-click context menu (and touch long-press) with identical Glassmorphism design tokens. Features continuous loop, HD snapshot capture (PNG), copy URL with timestamp, PiP, and real-time technical stats with zero listener leaks using AbortController.",
          autohide_title: "🎯 Synchronized Auto-Hide",
          autohide_badge: "UX &amp; Controls",
          autohide_desc: "Controls stay visible while the settings menu is open. The inactivity timer resumes smoothly upon menu close and the menu closes automatically if controls hide.",
          css_title: "🛡️ 100% Component-Scoped CSS",
          css_badge: "Zero Conflicts",
          css_desc: "All styles are strictly encapsulated under .dynamo-* prefixes. Removed un-namespaced global classes like .hidden to avoid conflicts with Navbars, Tailwind CSS, Bootstrap, or external layouts.",
          multi_title: "👥 Multi-Player Architecture",
          multi_badge: "Scoped Architecture",
          multi_desc: "Multiple players can coexist on the same web page completely independently, with isolated closures and DOM queries, supporting .dynamo-player class or data-dynamo.",
          weight_title: "⚡ 51% Lighter (~8 KB Gzip)",
          weight_badge: "Extreme Performance",
          weight_desc: "The bundle was reduced from 63 KB down to only 30.9 KB (51% raw size reduction and 55% gzipped network savings) through pure SVG vectorization and advanced compression."
        },
        docs: {
          title: "How to use", subtitle: "Everything you need to integrate Dynamo Player into your project.",
          tabs: { install: "Installation", attributes: "Attributes", formats: "Source Formats", keyboard: "Keyboard" },
          install: { step1_title: "Import via CDN", step1_desc: "Load a single JS file from the CDN or download the file", step2_title: "Add the &lt;video&gt; element", step2_desc: "The player automatically initializes on any &lt;video class=\"dynamo-player\"&gt;, &lt;video data-dynamo&gt; or &lt;video id=\"dynamoPlayer\"&gt; in the DOM.", step3_title: "Dynamic initialization (optional)", step3_desc: "If you inject video elements dynamically or use custom selectors, call init() manually.", copy_btn: "Copy" },
          attributes: { notice: "All attributes are declared directly on the &lt;video&gt; element.", required: "Required", desc_src: "Video URL or JSON for multiple sources. Supports .mp4, .webm and .m3u8.", desc_poster: "Poster image. If omitted, the player automatically captures a frame from the video.", desc_overscreen: "Shows streaming-style Play/Pause, Forward, and Backward buttons hovering over the video.", desc_thumbnails: "Enables frame preview when hovering over the progress bar.", desc_ambient: "Projects a soft light halo behind the player that reflects the video's dominant colors.", desc_pip: "Shows the Picture-in-Picture button. Only appears if the browser supports the native API." },
          formats: { notice: "The data-src attribute accepts three different formats.", simple: "Simple URL", hls: "HLS (.m3u8)", hls_note: "// hls.js loads automatically", multiple: "Multiple qualities", subs: "With subtitles" },
          keyboard: { notice: "The player captures keyboard events when focused. Click on it to focus.", play_pause: "Play / Pause", forward: "Forward 5 seconds", backward: "Backward 5 seconds", compat_title: "Compatibility", compat_subtitle: "Works on all modern browsers.", compat_chrome: "Full support including Ambient Mode and Auto Thumbnails.", compat_firefox: "Full support. HLS via hls.js.", compat_safari: "Native HLS. Ambient Mode requires CORS headers on the server." },
          code_comments: {
            req: "// or id=\"dynamoPlayer\" / data-dynamo",
            src: "// HLS, M3U8, MP4, WebM...",
            poster: "// poster url",
            controls: "// controls over video",
            ambient: "// ambient mode",
            thumbs: "// thumbnails on seek",
            pip: "// picture-in-picture",
            apiInit: "// Automatically initializes all player instances",
            apiCustom: "// Or with custom selector / specific element"
          }
        }
      }
    };

    let currentLang = 'en';
    changeLanguage(currentLang);

    function changeLanguage(lang) {
      currentLang = lang;
      document.querySelectorAll('[data-i18n]').forEach(el => {
        const keys = el.getAttribute('data-i18n').split('.');
        let text = translations[lang];
        
        // Navega por el objeto JSON usando las llaves (ej: "hero.description")
        keys.forEach(k => { if(text) text = text[k]; });
        
        if (text) {
          // Si el texto contiene HTML (como &lt;video&gt;), usamos innerHTML
          if (text.includes('<') || text.includes('&lt;')) {
            el.innerHTML = text;
          } else {
            el.textContent = text;
          }
        }
      });

      // Traduce los placeholders de los inputs
      document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const keys = el.getAttribute('data-i18n-placeholder').split('.');
        let text = translations[lang];
        keys.forEach(k => { if(text) text = text[k]; });
        if (text) el.setAttribute('placeholder', text);
      });
    }

    // Evento del botón para alternar idiomas
    document.getElementById('lang-toggle').addEventListener('click', () => {
      const newLang = currentLang === 'en' ? 'es' : 'en';
      changeLanguage(newLang);
    });

    // 4. LIVE DEMO TESTER LOGIC
    function initLiveDemoTester() {
      const DEFAULT_VIDEO_SRC = 'assets/videos/video.mp4';
      const DEFAULT_POSTER_SRC = 'https://image.tmdb.org/t/p/original/6MxCEaIClUJ962LMiu0yTzuZAB.jpg';

      const form = document.getElementById('demo-url-form');
      const input = document.getElementById('demo-url-input');
      const clearBtn = document.getElementById('demo-clear-btn');
      const resetBtn = document.getElementById('demo-reset-btn');
      const presetBtns = document.querySelectorAll('.demo-preset-btn');
      const statusMsg = document.getElementById('demo-status-msg');
      const video = document.getElementById('dynamoPlayer');

      if (!form || !input || !video) return;

      let statusTimer = null;
      function showStatus(text, type = 'info', autoHide = 3500) {
        if (!statusMsg) return;
        clearTimeout(statusTimer);
        statusMsg.className = `demo-status-msg ${type}`;
        statusMsg.textContent = text;
        statusMsg.style.display = 'block';
        if (autoHide) {
          statusTimer = setTimeout(() => {
            statusMsg.style.display = 'none';
          }, autoHide);
        }
      }

      function clearStatus() {
        if (!statusMsg) return;
        clearTimeout(statusTimer);
        statusMsg.style.display = 'none';
      }

      function setActivePreset(presetName) {
        presetBtns.forEach(btn => {
          if (btn.dataset.preset === presetName) {
            btn.classList.add('active');
          } else {
            btn.classList.remove('active');
          }
        });
      }

      function loadDefault() {
        input.value = '';
        if (clearBtn) clearBtn.style.display = 'none';
        setActivePreset('default');
        clearStatus();

        if (window.DynamoPlayer && window.DynamoPlayer.loadSource) {
          window.DynamoPlayer.loadSource(video, DEFAULT_VIDEO_SRC, DEFAULT_POSTER_SRC, true);
        } else if (video.dynamoPlayer) {
          video.dynamoPlayer.loadSource(DEFAULT_VIDEO_SRC, DEFAULT_POSTER_SRC, true);
        }

        const msg = translations[currentLang]?.demo?.loaded_default || 'Video predeterminado cargado.';
        showStatus(msg, 'success', 2500);
      }

      function loadCustom(url, poster = '') {
        const trimmed = url.trim();
        if (!trimmed) {
          loadDefault();
          return;
        }

        clearStatus();
        let matchedPreset = null;
        presetBtns.forEach(btn => {
          if (btn.dataset.url && btn.dataset.url.toLowerCase() === trimmed.toLowerCase()) {
            matchedPreset = btn.dataset.preset;
          }
        });
        setActivePreset(matchedPreset);

        if (window.DynamoPlayer && window.DynamoPlayer.loadSource) {
          window.DynamoPlayer.loadSource(video, trimmed, poster, true);
        } else if (video.dynamoPlayer) {
          video.dynamoPlayer.loadSource(trimmed, poster, true);
        }

        const msg = translations[currentLang]?.demo?.loaded_custom || 'Cargando video personalizado...';
        showStatus(msg, 'info', 2500);
      }

      // Input changes: show/hide clear button
      input.addEventListener('input', () => {
        if (clearBtn) {
          clearBtn.style.display = input.value.trim() ? 'block' : 'none';
        }
      });

      // Clear button
      if (clearBtn) {
        clearBtn.addEventListener('click', () => {
          input.value = '';
          clearBtn.style.display = 'none';
          input.focus();
        });
      }

      // Form submit: if empty, load default; otherwise, load custom URL
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const url = input.value.trim();
        if (!url) {
          loadDefault();
        } else {
          loadCustom(url);
        }
      });

      // Reset button: revert to default video & poster
      if (resetBtn) {
        resetBtn.addEventListener('click', () => {
          loadDefault();
        });
      }

      // Presets
      presetBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          const preset = btn.dataset.preset;
          if (preset === 'default') {
            loadDefault();
          } else {
            const url = btn.dataset.url;
            const poster = btn.dataset.poster || '';
            input.value = url;
            if (clearBtn) clearBtn.style.display = 'block';
            loadCustom(url, poster);
          }
        });
      });

      // Error handler on the video element for invalid URLs or CORS blocks
      video.addEventListener('error', () => {
        const current = video._currentSrc || video.src || '';
        // Only show error if not playing the default video or if explicit failure
        if (current && !current.includes(DEFAULT_VIDEO_SRC)) {
          const errMsg = translations[currentLang]?.demo?.error_load || '⚠️ Error al cargar el video.';
          showStatus(errMsg, 'error', 6000);
        }
      });
    }

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initLiveDemoTester);
    } else {
      initLiveDemoTester();
    }

