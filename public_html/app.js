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
        nav: { home: "Inicio", demo: "Demo", usage: "Uso", attributes: "Atributos", formats: "Formatos" },
        hero: { eyebrow: "Reproductor de video", description: "Moderno, ligero y sin dependencias. Construido sobre el elemento &lt;video&gt; nativo con soporte para HLS, múltiples calidades, subtítulos y modo ambiente.", pills: { quality: "Múltiples calidades", subs: "Subtítulos" }, scroll: "scroll" },
        demo: { title: "Demo en vivo" },
        docs: {
          title: "Cómo usarlo", subtitle: "Todo lo que necesitas para integrar Dynamo Player en tu proyecto.",
          tabs: { install: "Instalación", attributes: "Atributos", formats: "Formatos de fuente", keyboard: "Teclado" },
          install: { step1_title: "Importación desde CDN", step1_desc: "Carga un único archivo JS desde la CDN o descarga el archivo", step2_title: "Agrega el elemento &lt;video&gt;", step2_desc: "El reproductor se activa automáticamente sobre cualquier &lt;video id=\"dynamoPlayer\"&gt; en el DOM.", step3_title: "Inicialización dinámica (opcional)", step3_desc: "Si insertas el elemento de video dinámicamente (ej. con JS o un framework), llama a init() manualmente.", copy_btn: "Copiar" },
          attributes: { notice: "Todos los atributos se declaran directamente en el elemento &lt;video&gt;.", required: "Requerido", desc_src: "URL del video o JSON con fuentes múltiples. Soporta .mp4, .webm y .m3u8.", desc_poster: "Imagen del poster. Si se omite, el player captura un frame automáticamente del video.", desc_overscreen: "Muestra botones de Play/Pausa, Atrás y Adelante flotando sobre el video al estilo streaming.", desc_thumbnails: "Activa la previsualización de frames al pasar el cursor por la barra de progreso.", desc_ambient: "Proyecta un halo de luz difusa detrás del player que refleja los colores dominantes del video.", desc_pip: "Muestra el botón de Picture-in-Picture. Solo aparece si el navegador soporta la API nativa." },
          formats: { notice: "El atributo data-src acepta tres formatos distintos.", simple: "URL simple", hls: "HLS (.m3u8)", hls_note: "// hls.js se carga automáticamente", multiple: "Múltiples calidades", subs: "Con subtítulos" },
          keyboard: { notice: "El reproductor captura eventos de teclado cuando tiene el foco. Haz clic sobre él para enfocarlo.", play_pause: "Play / Pausa", forward: "Adelantar 5 segundos", backward: "Retroceder 5 segundos", compat_title: "Compatibilidad", compat_subtitle: "Funciona en todos los navegadores modernos.", compat_chrome: "Soporte completo incluyendo Ambient Mode y Auto Thumbnails.", compat_firefox: "Soporte completo. HLS vía hls.js.", compat_safari: "HLS nativo. Ambient Mode requiere cabeceras CORS en el servidor." },
          code_comments: {
  req: "// Requerido",
  src: "// HLS, M3U8, MP4, WebM...",
  poster: "// url del poster",
  controls: "// controles sobre el video",
  ambient: "// modo ambiental",
  thumbs: "// miniaturas en seek",
  pip: "// picture-in-picture",
  apiInit : "// Inicializa todos los &lt;video id=\"dynamoPlayer\"&gt; nuevos",
}
        }
      },
      en: {
        nav: { home: "Home", demo: "Demo", usage: "Usage", attributes: "Attributes", formats: "Formats" },
        hero: { eyebrow: "Video Player", description: "Modern, lightweight, and dependency-free. Built on top of the native &lt;video&gt; element with support for HLS, multiple qualities, subtitles, and ambient mode.", pills: { quality: "Multiple qualities", subs: "Subtitles" }, scroll: "scroll" },
        demo: { title: "Live Demo" },
        docs: {
          title: "How to use", subtitle: "Everything you need to integrate Dynamo Player into your project.",
          tabs: { install: "Installation", attributes: "Attributes", formats: "Source Formats", keyboard: "Keyboard" },
          install: { step1_title: "Import via CDN", step1_desc: "Load a single JS file from the CDN or download the file", step2_title: "Add the &lt;video&gt; element", step2_desc: "The player automatically initializes on any &lt;video id=\"dynamoPlayer\"&gt; in the DOM.", step3_title: "Dynamic initialization (optional)", step3_desc: "If you inject the video element dynamically (e.g., with JS or a framework), call init() manually.", copy_btn: "Copy" },
          attributes: { notice: "All attributes are declared directly on the &lt;video&gt; element.", required: "Required", desc_src: "Video URL or JSON for multiple sources. Supports .mp4, .webm and .m3u8.", desc_poster: "Poster image. If omitted, the player automatically captures a frame from the video.", desc_overscreen: "Shows streaming-style Play/Pause, Forward, and Backward buttons hovering over the video.", desc_thumbnails: "Enables frame preview when hovering over the progress bar.", desc_ambient: "Projects a soft light halo behind the player that reflects the video's dominant colors.", desc_pip: "Shows the Picture-in-Picture button. Only appears if the browser supports the native API." },
          formats: { notice: "The data-src attribute accepts three different formats.", simple: "Simple URL", hls: "HLS (.m3u8)", hls_note: "// hls.js loads automatically", multiple: "Multiple qualities", subs: "With subtitles" },
          keyboard: { notice: "The player captures keyboard events when focused. Click on it to focus.", play_pause: "Play / Pause", forward: "Forward 5 seconds", backward: "Backward 5 seconds", compat_title: "Compatibility", compat_subtitle: "Works on all modern browsers.", compat_chrome: "Full support including Ambient Mode and Auto Thumbnails.", compat_firefox: "Full support. HLS via hls.js.", compat_safari: "Native HLS. Ambient Mode requires CORS headers on the server." },
          code_comments: {
  req: "// Required",
  src: "// HLS, M3U8, MP4, WebM...",
  poster: "// poster url",
  controls: "// controls over video",
  ambient: "// ambient mode",
  thumbs: "// thumbnails on seek",
  pip: "// picture-in-picture",
  apiInit : "// Initializes all &lt;video id=\"dynamoPlayer\"&gt; elements",
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

