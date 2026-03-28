# 🎬 Dynamo Player

> **v1.6.0** — Reproductor de video moderno, ligero y sin dependencias. Construido sobre el elemento `<video>` nativo con soporte para HLS, múltiples calidades, subtítulos, modo ambiente y mucho más.

---

## Tabla de Contenidos

- [Demo rápido](#demo-rápido)
- [Instalación](#instalación)
- [Uso básico](#uso-básico)
- [Atributos de configuración](#atributos-de-configuración)
- [Fuentes de video](#fuentes-de-video)
  - [URL simple](#url-simple)
  - [Múltiples calidades (JSON)](#múltiples-calidades-json)
  - [Con subtítulos](#con-subtítulos)
  - [HLS (.m3u8)](#hls-m3u8)
- [Funcionalidades](#funcionalidades)
  - [Controles sobre pantalla](#controles-sobre-pantalla)
  - [Miniaturas automáticas en seek](#miniaturas-automáticas-en-seek)
  - [Modo Ambiente (Ambient Light)](#modo-ambiente-ambient-light)
  - [Picture-in-Picture](#picture-in-picture)
  - [Subtítulos](#subtítulos)
  - [Pistas de Audio (HLS)](#pistas-de-audio-hls)
- [Atajos de teclado](#atajos-de-teclado)
- [Compatibilidad](#compatibilidad)
- [Estructura del proyecto](#estructura-del-proyecto)
- [Licencia](#licencia)

---

## Demo rápido

```html
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Dynamo Player Demo</title>
</head>
<body>

  <video id="dynamoPlayer"
    data-src="https://example.com/video.mp4"
    thumbnail="https://example.com/poster.jpg"
    controlsOverscreen="true"
    autoThumbnails="true"
    ambientMode="true"
    inPicture="true"
    width="854"
    height="480">
  </video>

  <script src="dynamo-player.js"></script>

</body>
</html>
```

---

## Instalación

**Opción 1 — Archivo local**

Descarga `dynamo-player.js` e inclúyelo al final de tu `<body>`:

```html
<script src="dynamo-player.js"></script>
```

**Opción 2 — CDN (próximamente)**

```html
<script src="https://cdn.example.com/dynamo-player@1.6.0/dynamo-player.min.js"></script>
```

> El reproductor se inicializa automáticamente al cargar el DOM. No necesitas llamar a ninguna función adicional. Si necesitas inicializar manualmente (por ejemplo, en contenido dinámico):
>
> ```javascript
> DynamoPlayer.init();
> ```

---

## Uso básico

El reproductor se activa sobre cualquier elemento `<video>` que tenga el atributo `id="dynamoPlayer"`.

```html
<video id="dynamoPlayer" data-src="video.mp4"></video>
```

---

## Atributos de configuración

Todos los atributos se definen directamente en el elemento `<video>`.

| Atributo | Tipo | Default | Descripción |
|---|---|---|---|
| `data-src` | `string` / `JSON` | — | **Requerido.** URL del video o JSON con fuentes múltiples. |
| `thumbnail` | `string` (URL) | Auto-generado | Imagen del poster. Si se omite, se captura un frame automáticamente. |
| `controlsOverscreen` | `"true"` | `"false"` | Muestra botones de Play/Pausa, Atrás y Adelante centrados sobre el video. |
| `autoThumbnails` | `"true"` | `"false"` | Activa la previsualización de miniaturas al pasar el cursor por la barra de progreso. |
| `ambientMode` | `"true"` | `"false"` | Activa el efecto de luz ambiente que proyecta los colores del video hacia el fondo. |
| `inPicture` | `"true"` | `"false"` | Muestra el botón de Picture-in-Picture en los controles. |

---

## Fuentes de video

### URL simple

La forma más directa. Acepta `.mp4`, `.webm` u cualquier formato soportado por el navegador.

```html
<video id="dynamoPlayer" data-src="https://example.com/video.mp4"></video>
```

---

### Múltiples calidades (JSON)

Pasa un array JSON con objetos `{ label, src }`. El menú de configuración (⚙️) mostrará las opciones de calidad automáticamente.

```html
<video id="dynamoPlayer" data-src='[
  { "label": "1080p", "src": "https://example.com/video-1080.mp4" },
  { "label": "720p",  "src": "https://example.com/video-720.mp4" },
  { "label": "480p",  "src": "https://example.com/video-480.mp4" }
]'></video>
```

> El primer elemento del array es el que se carga por defecto.

---

### Con subtítulos

Usa la estructura extendida con las claves `sources` y `subtitles`:

```html
<video id="dynamoPlayer" data-src='{
  "sources": [
    { "label": "1080p", "src": "https://example.com/video-1080.mp4" },
    { "label": "720p",  "src": "https://example.com/video-720.mp4" }
  ],
  "subtitles": [
    { "label": "Español", "srclang": "es", "src": "https://example.com/subs-es.vtt", "default": true },
    { "label": "English", "srclang": "en", "src": "https://example.com/subs-en.vtt" }
  ]
}'></video>
```

**Propiedades del objeto subtítulo:**

| Propiedad | Tipo | Descripción |
|---|---|---|
| `label` | `string` | Nombre que se muestra en el menú. |
| `srclang` | `string` | Código de idioma (ej. `"es"`, `"en"`). |
| `src` | `string` | URL del archivo `.vtt`. |
| `default` | `boolean` | Si es `true`, el subtítulo se activa al cargar. |

---

### HLS (.m3u8)

El reproductor detecta automáticamente las URLs `.m3u8` e inyecta [hls.js](https://github.com/video-dev/hls.js/) dinámicamente si el navegador no tiene soporte nativo.

```html
<video id="dynamoPlayer" data-src="https://example.com/stream/master.m3u8"></video>
```

Con HLS, el reproductor extrae automáticamente:
- **Calidades**: Listadas desde el manifiesto principal del stream.
- **Pistas de audio**: Si el `.m3u8` contiene múltiples idiomas de audio.
- **Subtítulos HLS**: Si el manifiesto incluye pistas de subtítulos.

---

## Funcionalidades

### Controles sobre pantalla

Muestra tres botones flotantes sobre el video (Retroceder 10s, Play/Pausa, Adelantar 10s) para una experiencia similar a plataformas de streaming.

```html
<video id="dynamoPlayer"
  data-src="video.mp4"
  controlsOverscreen="true">
</video>
```

---

### Miniaturas automáticas en seek

Al pasar el cursor sobre la barra de progreso, se genera una miniatura en tiempo real del frame correspondiente usando un video "fantasma" en segundo plano.

```html
<video id="dynamoPlayer"
  data-src="video.mp4"
  autoThumbnails="true">
</video>
```

> **Requisito CORS:** El servidor que sirve el video debe permitir solicitudes de origen cruzado (`Access-Control-Allow-Origin: *`) para que la captura de canvas funcione correctamente.

---

### Modo Ambiente (Ambient Light)

Proyecta un halo de luz difusa detrás del reproductor que refleja los colores dominantes del video en tiempo real.

```html
<video id="dynamoPlayer"
  data-src="video.mp4"
  ambientMode="true">
</video>
```

> El efecto usa un canvas de baja resolución (32×18px) para garantizar un rendimiento óptimo.

---

### Picture-in-Picture

Habilita el botón de PiP en la barra de controles. Solo aparece si el navegador soporta la API nativa de Picture-in-Picture.

```html
<video id="dynamoPlayer"
  data-src="video.mp4"
  inPicture="true">
</video>
```

---

### Subtítulos

Los subtítulos se gestionan desde el menú de configuración (⚙️ → Subtítulos). Se pueden incluir como archivos `.vtt` externos en el JSON de fuentes o embebidos en un stream HLS.

El estilo de los subtítulos puede personalizarse con CSS usando el pseudo-elemento `::cue`:

```css
video::cue {
  background: rgba(0, 0, 0, 0.75);
  color: #ffffff;
  font-size: 15px;
}
```

---

### Pistas de Audio (HLS)

Si el stream HLS contiene múltiples pistas de audio (ej. idiomas), el menú de configuración mostrará automáticamente la sección **Audio** para cambiar entre ellas sin interrumpir la reproducción.

Ejemplo de manifiesto `.m3u8` con múltiples audios:

```m3u8
#EXT-X-MEDIA:TYPE=AUDIO,GROUP-ID="audio",NAME="Español",DEFAULT=YES,URI="audio-es.m3u8"
#EXT-X-MEDIA:TYPE=AUDIO,GROUP-ID="audio",NAME="English",DEFAULT=NO,URI="audio-en.m3u8"
```

---

## Atajos de teclado

El reproductor captura eventos de teclado cuando tiene el foco (se puede enfocar haciendo clic sobre él).

| Tecla | Acción |
|---|---|
| `Espacio` | Play / Pausa |
| `→` Flecha derecha | Adelantar 5 segundos |
| `←` Flecha izquierda | Retroceder 5 segundos |

---

## Compatibilidad

| Característica | Chrome | Firefox | Safari | Edge |
|---|---|---|---|---|
| Reproducción MP4/WebM | ✅ | ✅ | ✅ | ✅ |
| HLS (hls.js) | ✅ | ✅ | ✅ | ✅ |
| HLS Nativo | ❌ | ❌ | ✅ | ❌ |
| Picture-in-Picture | ✅ | ✅ | ✅ | ✅ |
| Ambient Mode | ✅ | ✅ | ⚠️* | ✅ |
| Auto Thumbnails | ✅ | ✅ | ⚠️* | ✅ |

> ⚠️ *Safari requiere que el servidor sirva el video con cabeceras CORS correctas para el canvas.*

---

## Estructura del proyecto

```
dynamo-player/
├── dynamo-player.js     # Archivo principal del reproductor (todo-en-uno)
└── README.md            # Esta documentación
```

El reproductor está contenido en un único archivo JavaScript autoejectable. No tiene dependencias de producción. La librería `hls.js` se carga dinámicamente **solo si** se detecta una fuente `.m3u8`.

---

## API JavaScript

Si necesitas inicializar el reproductor manualmente (por ejemplo, después de insertar un `<video>` dinámicamente en el DOM):

```javascript
// Inicializa todos los <video id="dynamoPlayer"> que aún no hayan sido procesados
DynamoPlayer.init();
```

---

## Licencia

MIT © 2024 — Dynamo Player

---

<p align="center">
  Hecho con ❤️ para la web abierta
</p>
