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
        hero: { eyebrow: "Reproductor de video", description: "Moderno, ligero y sin dependencias. Construido sobre el elemento &lt;video&gt; nativo con soporte para HLS, múltiples calidades, subtítulos y modo ambiente.", pills: { quality: "Múltiples calidades", subs: "Subtítulos", multi: "Multi-Player", zero_css: "Aislamiento CSS 100%" }, scroll: "scroll" },
        demo: { title: "Demo en vivo" },
        whatsnew: {
          label: "Versión 1.7",
          title: "Novedades y Mejoras",
          subtitle: "Conoce las nuevas optimizaciones de sincronización, aislamiento y arquitectura.",
          autohide_title: "🎯 Ocultamiento Sincronizado",
          autohide_badge: "UX &amp; Controles",
          autohide_desc: "Los controles se mantienen visibles mientras el menú de configuración esté abierto. La inactividad se reanuda al cerrarlo y el menú se cierra automáticamente si los controles se ocultan por inactividad o pausa.",
          css_title: "🛡️ Aislamiento CSS 100%",
          css_badge: "Cero Conflictos",
          css_desc: "Estilos 100% encapsulados bajo prefijos .dynamo-*. Eliminación de clases globales como .hidden para evitar interferencias con Navbars, Tailwind CSS, Bootstrap o layouts externos.",
          multi_title: "👥 Soporte Multi-Reproductor",
          multi_badge: "Arquitectura Scoped",
          multi_desc: "Múltiples reproductores pueden convivir en una misma página de manera totalmente independiente, con closures y consultas DOM aisladas, soportando clases .dynamo-player o data-dynamo."
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
        hero: { eyebrow: "Video Player", description: "Modern, lightweight, and dependency-free. Built on top of the native &lt;video&gt; element with support for HLS, multiple qualities, subtitles, and ambient mode.", pills: { quality: "Multiple qualities", subs: "Subtitles", multi: "Multi-Player", zero_css: "100% Scoped CSS" }, scroll: "scroll" },
        demo: { title: "Live Demo" },
        whatsnew: {
          label: "Version 1.7",
          title: "What's New & Improvements",
          subtitle: "Discover the new optimizations for synchronization, style isolation, and architecture.",
          autohide_title: "🎯 Synchronized Auto-Hide",
          autohide_badge: "UX &amp; Controls",
          autohide_desc: "Controls stay visible while the settings menu is open. The inactivity timer resumes smoothly upon menu close and the menu closes automatically if controls hide.",
          css_title: "🛡️ 100% Component-Scoped CSS",
          css_badge: "Zero Conflicts",
          css_desc: "All styles are strictly encapsulated under .dynamo-* prefixes. Removed un-namespaced global classes like .hidden to avoid conflicts with Navbars, Tailwind CSS, Bootstrap, or external layouts.",
          multi_title: "👥 Multi-Player Architecture",
          multi_badge: "Scoped Architecture",
          multi_desc: "Multiple players can coexist on the same web page completely independently, with isolated closures and DOM queries, supporting .dynamo-player class or data-dynamo."
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
    }

    // Evento del botón para alternar idiomas
    document.getElementById('lang-toggle').addEventListener('click', () => {
      const newLang = currentLang === 'en' ? 'es' : 'en';
      changeLanguage(newLang);
    });

