    // 1. TABS LOGIC
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const target = btn.dataset.tab;
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
        btn.classList.add('active');
        document.getElementById('tab-' + target)?.classList.add('active');
      });
    });

    // Dropdown toggle & outside click handling
    const navDropdown = document.querySelector('.nav-dropdown');
    const navDropdownBtn = document.querySelector('.nav-dropdown-btn');

    if (navDropdownBtn && navDropdown) {
      navDropdownBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = navDropdown.classList.toggle('active');
        navDropdownBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      });

      document.addEventListener('click', (e) => {
        if (!navDropdown.contains(e.target)) {
          navDropdown.classList.remove('active');
          navDropdownBtn.setAttribute('aria-expanded', 'false');
        }
      });
    }

    // Navigation links with data-tab (dropdown and direct anchors)
    document.querySelectorAll('[data-tab]').forEach(el => {
      if (el.classList.contains('tab-btn')) return;
      el.addEventListener('click', (e) => {
        e.preventDefault();
        const tabTarget = el.dataset.tab;
        const tabBtn = document.querySelector(`.tab-btn[data-tab="${tabTarget}"]`);
        if (tabBtn) tabBtn.click();
        const docsSection = document.getElementById('docs');
        if (docsSection) docsSection.scrollIntoView({ behavior: 'smooth' });
        if (navDropdown) {
          navDropdown.classList.remove('active');
          navDropdownBtn?.setAttribute('aria-expanded', 'false');
        }
      });
    });

    // 2. COPY CODE LOGIC
    function copyCode(btn) {
      const pre = btn.closest('.code-wrap').querySelector('pre');
      navigator.clipboard.writeText(pre.innerText).then(() => {
        const isEn = currentLang === 'en';
        btn.innerHTML = `<i class="fa-solid fa-check"></i> <span>${isEn ? 'Copied!' : '¡Copiado!'}</span>`;
        btn.classList.add('copied');
        setTimeout(() => {
          btn.innerHTML = `<i class="fa-regular fa-copy"></i> <span>${isEn ? 'Copy' : 'Copiar'}</span>`;
          btn.classList.remove('copied');
        }, 2000);
      });
    }

    // 3. I18N LOGIC (Traducción automática)
    const translations = {
      es: {
        nav: {
          home: "Inicio",
          demo: "Demo",
          whatsnew: "Novedades",
          usage: "Uso",
          attributes: "Atributos",
          formats: "Formatos",
          icons: "Iconos",
          dropdown: {
            install: "Instalación",
            attributes: "Atributos",
            formats: "Formatos",
            icons: "Iconos SVG",
            keyboard: "Atajos de Teclado"
          }
        },
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
          label: "Versión 1.9",
          title: "Novedades y Mejoras",
          subtitle: "Descubre las nuevas características diseñadas para una experiencia cinematográfica simple y potente.",
          aspect_title: "Aspect Ratio Ajustable",
          aspect_badge: "Pantalla &amp; Zoom Móvil",
          aspect_desc: "Adapta el video a tu pantalla con facilidad. Alterna entre el formato original y el modo rellenar pantalla sin deformaciones, eliminando las barras negras en teléfonos móviles y monitores anchos.",
          icons_title: "Personalizable Icons Config",
          icons_badge: "Iconos &amp; CDN",
          icons_desc: "Configura y personaliza los iconos del reproductor directamente desde JavaScript o CDN. Cambia play, pausa, volumen y ajustes con tus propios SVGs al instante sin recompilar.",
          ctx_title: "Menú de Click Izquierdo &amp; Derecho",
          ctx_badge: "Ajustes &amp; Contexto",
          ctx_desc: "Acceso completo a todos los controles: menú de ajustes con click izquierdo (calidades, audio, subtítulos y velocidad) y menú contextual con click derecho o toque sostenido (capturas HD, bucle, PiP y estadísticas).",
          autohide_title: "Controles Inteligentes",
          autohide_badge: "UX &amp; Controles",
          autohide_desc: "Los controles se ocultan suavemente durante la reproducción para no tapar el contenido, pero permanecen visibles mientras tengas abierto cualquier menú de configuración.",
          css_title: "Cero Conflictos de Diseño",
          css_badge: "Aislamiento Total",
          css_desc: "Estilos totalmente encapsulados bajo prefijos .dynamo-*, eliminando colisiones con Tailwind CSS o Bootstrap y garantizando que tu sitio mantenga su apariencia intacta.",
          multi_title: "Múltiples Reproductores",
          multi_badge: "Multi-Instancia",
          multi_desc: "Inserta tantos reproductores como necesites en una misma página; cada uno opera de forma totalmente independiente sin interferir en los demás."
        },
        docs: {
          title: "Cómo usarlo", subtitle: "Todo lo que necesitas para integrar Dynamo Player en tu proyecto.",
          tabs: { install: "Instalación", attributes: "Atributos", formats: "Formatos de fuente", icons: "Iconos", keyboard: "Teclado" },
          install: { step1_title: "Importación desde CDN", step1_desc: "Carga un único archivo JS desde la CDN o descarga el archivo", step2_title: "Agrega el elemento &lt;video&gt;", step2_desc: "El reproductor se activa automáticamente sobre cualquier &lt;video class=\"dynamo-player\"&gt;, &lt;video data-dynamo&gt; o &lt;video id=\"dynamoPlayer\"&gt; en el DOM.", step3_title: "Inicialización dinámica (opcional)", step3_desc: "Si insertas el elemento de video dinámicamente o usas selectores personalizados, llama a init() manualmente.", copy_btn: "Copiar" },
          attributes: { notice: "Todos los atributos se declaran directamente en el elemento &lt;video&gt;.", required: "Requerido", desc_src: "URL del video o JSON con fuentes múltiples. Soporta .mp4, .webm y .m3u8.", desc_poster: "Imagen del poster. Si se omite, el player captura un frame automáticamente del video.", desc_overscreen: "Muestra botones de Play/Pausa, Atrás y Adelante flotando sobre el video al estilo streaming.", desc_thumbnails: "Activa la previsualización de frames al pasar el cursor por la barra de progreso.", desc_ambient: "Proyecta un halo de luz difusa detrás del player que refleja los colores dominantes del video.", desc_pip: "Muestra el botón de Picture-in-Picture. Solo aparece si el navegador soporta la API nativa." },
          formats: { notice: "El atributo data-src acepta tres formatos distintos.", simple: "URL simple", hls: "HLS (.m3u8)", hls_note: "// hls.js se carga automáticamente", multiple: "Múltiples calidades", subs: "Con subtítulos" },
          icons: {
            notice: "Personaliza o sobrescribe cualquier icono SVG directamente mediante la API en tiempo de ejecución o desde el CDN, sin recompilar el proyecto y con actualización reactiva en caliente.",
            step1_title: "Múltiples iconos (Recomendado)",
            step1_desc: "Actualiza uno o varios iconos simultáneamente con setIcons(). Los reproductores activos en la página se actualizarán al instante:",
            step2_title: "Icono individual o Proxy reactivo",
            step2_desc: "Modifica iconos individuales mediante setIcon() o asignando directamente en controls / DynamoPlayer.icons:",
            step3_title: "Restauración y consulta",
            step3_desc: "Restaura todos los iconos originales o consulta el código predeterminado:",
            comment_single: "// Cambio individual con setIcon():",
            comment_proxy: "// Asignación directa en caliente con el alias 'controls':",
            comment_instance: "// O por instancia de reproductor específica:",
            comment_reset: "// Restaurar todos los iconos por defecto:",
            comment_get: "// Consultar los iconos originales:",
            table_title: "Catálogo de Nombres y Aliases",
            table_subtitle: "Nombres soportados por setIcons() y DynamoPlayer.icons:",
            desc_play: "Botones de reproducción y pausa principales.",
            desc_skip: "Botones de salto ±10 segundos en la barra y centro de pantalla.",
            desc_vol: "Estados de volumen alto y moderado en el control deslizante.",
            desc_mute: "Icono de audio silenciado (mute).",
            desc_settings: "Botón de rueda de engranaje para abrir el menú de ajustes.",
            desc_pip: "Botón de Picture-in-Picture en controles y menú contextual.",
            desc_fs: "Entrar y salir de pantalla completa.",
            desc_ctx1: "Iconos de bucle, captura de fotograma y relación de aspecto.",
            desc_ctx2: "Iconos de modo ambiente, estadísticas técnicas (\"Stats for Nerds\") y créditos."
          },
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
        nav: {
          home: "Home",
          demo: "Demo",
          whatsnew: "What's New",
          usage: "Usage",
          attributes: "Attributes",
          formats: "Formats",
          icons: "Icons",
          dropdown: {
            install: "Installation",
            attributes: "Attributes",
            formats: "Formats",
            icons: "SVG Icons",
            keyboard: "Keyboard Shortcuts"
          }
        },
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
          label: "Version 1.9",
          title: "What's New & Improvements",
          subtitle: "Discover the latest enhancements crafted for a seamless, cinematic video experience.",
          aspect_title: "Adjustable Aspect Ratio",
          aspect_badge: "Screen &amp; Mobile Zoom",
          aspect_desc: "Easily adapt videos to your display. Seamlessly toggle between original fit and fill screen mode with natural mobile zoom, eliminating black bars without distorting video proportions.",
          icons_title: "Personalizable Icons Config",
          icons_badge: "Icons &amp; CDN",
          icons_desc: "Easily configure and customize any player icon directly via JavaScript or CDN. Swap play, pause, volume, and settings icons with your own SVGs on the fly without rebuilds.",
          ctx_title: "Left-Click &amp; Right-Click Menus",
          ctx_badge: "Settings &amp; Context",
          ctx_desc: "Complete control access: left-click settings menu for qualities, audio, subtitles, and speed; right-click or long-press context menu for HD snapshots, continuous loop, PiP, and stats.",
          autohide_title: "Smart Controls Auto-Hide",
          autohide_badge: "Seamless UX",
          autohide_desc: "Controls gracefully fade away during playback so you can enjoy the video, but stay visible while interacting with menus so nothing dismisses unexpectedly.",
          css_title: "Zero Style Collisions",
          css_badge: "100% Scoped CSS",
          css_desc: "Fully encapsulated component styles that never bleed into your page layout, perfectly compatible with Tailwind CSS, Bootstrap, and custom themes.",
          multi_title: "Multi-Player Support",
          multi_badge: "Multi-Instance",
          multi_desc: "Embed as many Dynamo players as you need on a single page; each player functions completely independently with isolated closures and timers."
        },
        docs: {
          title: "How to use", subtitle: "Everything you need to integrate Dynamo Player into your project.",
          tabs: { install: "Installation", attributes: "Attributes", formats: "Source Formats", icons: "Icons", keyboard: "Keyboard" },
          install: { step1_title: "Import via CDN", step1_desc: "Load a single JS file from the CDN or download the file", step2_title: "Add the &lt;video&gt; element", step2_desc: "The player automatically initializes on any &lt;video class=\"dynamo-player\"&gt;, &lt;video data-dynamo&gt; or &lt;video id=\"dynamoPlayer\"&gt; in the DOM.", step3_title: "Dynamic initialization (optional)", step3_desc: "If you inject video elements dynamically or use custom selectors, call init() manually.", copy_btn: "Copy" },
          attributes: { notice: "All attributes are declared directly on the &lt;video&gt; element.", required: "Required", desc_src: "Video URL or JSON for multiple sources. Supports .mp4, .webm and .m3u8.", desc_poster: "Poster image. If omitted, the player automatically captures a frame from the video.", desc_overscreen: "Shows streaming-style Play/Pause, Forward, and Backward buttons hovering over the video.", desc_thumbnails: "Enables frame preview when hovering over the progress bar.", desc_ambient: "Projects a soft light halo behind the player that reflects the video's dominant colors.", desc_pip: "Shows the Picture-in-Picture button. Only appears if the browser supports the native API." },
          formats: { notice: "The data-src attribute accepts three different formats.", simple: "Simple URL", hls: "HLS (.m3u8)", hls_note: "// hls.js loads automatically", multiple: "Multiple qualities", subs: "With subtitles" },
          icons: {
            notice: "Customize or override any SVG icon directly via JavaScript API or CDN at runtime, with zero project recompilation and instant hot reloading.",
            step1_title: "Multiple Icons (Recommended)",
            step1_desc: "Update one or multiple icons simultaneously using setIcons(). Active players on the page will update instantly:",
            step2_title: "Single Icon or Reactive Proxy",
            step2_desc: "Modify individual icons using setIcon() or by directly assigning to controls / DynamoPlayer.icons:",
            step3_title: "Reset & Defaults",
            step3_desc: "Restore all original icons or inspect their default SVG markup:",
            comment_single: "// Single icon override via setIcon():",
            comment_proxy: "// Direct hot-assignment with 'controls' alias:",
            comment_instance: "// Or per specific player instance:",
            comment_reset: "// Reset all icons to default:",
            comment_get: "// Inspect default icons map:",
            table_title: "Icon Names & Aliases Catalog",
            table_subtitle: "All names accepted by setIcons() and DynamoPlayer.icons:",
            desc_play: "Primary play and pause buttons.",
            desc_skip: "±10 seconds seek buttons on controls bar and overscreen.",
            desc_vol: "High and moderate volume states on the volume slider.",
            desc_mute: "Muted audio state icon.",
            desc_settings: "Gear icon button opening the settings menu.",
            desc_pip: "Picture-in-Picture button on controls and context menu.",
            desc_fs: "Enter and exit fullscreen mode.",
            desc_ctx1: "Loop, snapshot frame capture, and aspect ratio icons.",
            desc_ctx2: "Ambient mode, technical stats (\"Stats for Nerds\"), and credits icons."
          },
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

