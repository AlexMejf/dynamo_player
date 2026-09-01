# ⚡ Dynamo Player


> **v1.7 Beta** --- A modern, lightweight and dependency-free video
> player built on top of the native HTML `<video>` element with support
> for **HLS, multiple qualities, subtitles, ambient mode, auto
> thumbnails, PiP, audio tracks, and more**.

------------------------------------------------------------------------

## 📚 Table of Contents

-   [Quick Demo](#-quick-demo)
-   [Installation](#-installation)
-   [Basic Usage](#-basic-usage)
-   [Supported Video Sources](#-supported-video-sources)
-   [New Features & Improvements](#-new-features--improvements)
-   [Features](#-features)
-   [Browser Compatibility](#-browser-compatibility)
-   [JavaScript API](#-javascript-api)
-   [Contributing](#-contributing)
-   [License](#-license)

------------------------------------------------------------------------

## 🎬 Quick Demo

``` html
<video
  id="dynamoPlayer"
  data-src="https://example.com/video.mp4"
  poster="https://example.com/poster.jpg"
  controlsOverscreen="true"
  autoThumbnails="true"
  ambientMode="true"
  inPicture="true">
</video>

<script src="https://alexmejf.github.io/dynamo_player/dist/dynamo-player.min.js"></script>
```

------------------------------------------------------------------------

## 🚀 Installation

### CDN

``` html
<script src="https://alexmejf.github.io/dynamo_player/dist/dynamo-player.min.js"></script>
```

### Local Build

``` html
<script src="./dist/dynamo-player.min.js"></script>
```

> The player auto-initializes on DOM load.

For dynamic content:

``` javascript
DynamoPlayer.init();
```

------------------------------------------------------------------------

## 🎥 Basic Usage

### Single Player
``` html
<video id="dynamoPlayer" data-src="video.mp4"></video>
```

### Multiple Players on the Same Page
You can instantiate multiple players seamlessly using classes or data attributes without ID conflicts:
``` html
<!-- Video 1 -->
<video class="dynamo-player" data-src="video1.mp4"></video>

<!-- Video 2 -->
<video class="dynamo-player" data-src="video2.mp4" ambientMode="true"></video>

<!-- Video 3 (via data attribute) -->
<video data-dynamo data-src="video3.mp4"></video>
```

------------------------------------------------------------------------

## ⚙️ Configuration Attributes

  ----------------------------------------------------------------------------
  Attribute              Type              Default           Description
  ---------------------- ----------------- ----------------- -----------------
  `data-src`             `string / JSON`   ---               **Required.**
                                                             Video URL, HLS
                                                             stream or JSON
                                                             multi-source
                                                             config

  `poster`               `string`          Auto-generated    Poster image URL

  `controlsOverscreen`   `true/false`      `false`           Streaming-style
                                                             overscreen
                                                             controls

  `autoThumbnails`       `true/false`      `false`           Seek preview
                                                             thumbnails

  `ambientMode`          `true/false`      `false`           Dynamic ambient
                                                             glow

  `inPicture`            `true/false`      `false`           Enables PiP
                                                             button
                                                             
  ----------------------------------------------------------------------------

------------------------------------------------------------------------

## 📦 Supported Video Sources

### Simple URL

``` html
<video id="dynamoPlayer" data-src="video.mp4"></video>
```

### HLS (.m3u8)

``` html
<video id="dynamoPlayer" data-src="stream.m3u8"></video>
```

### Multiple Qualities

``` html
<video id="dynamoPlayer" data-src='[
  { "label": "1080p", "src": "video-1080.mp4" },
  { "label": "720p", "src": "video-720.mp4" }
]'></video>
```

### With Subtitles

``` html
<video id="dynamoPlayer" data-src='{
  "sources": [{ "label": "1080p", "src": "video.mp4" }],
  "subtitles": [
    { "label": "English", "srclang": "en", "src": "subs-en.vtt", "default": true }
  ]
}'></video>
```

------------------------------------------------------------------------

## 🌟 New Features & Improvements

### 🎯 Synchronized Controls & Settings Menu Auto-Hide
- **Persistent Visibility on Interaction:** When opening the settings menu (Quality, Audio, Speed, Subtitles), the controls bar remains visible and the inactivity countdown is suspended.
- **Graceful Inactivity Resume:** Once the menu is closed, the inactivity timer smoothly resumes, hiding controls after 2.8s during active playback.
- **Unified State Coordination:** Controls and menus are strictly linked—if controls hide due to state changes or buffering, menus close automatically to prevent orphan floating overlays.

### 🛡️ Zero Host CSS Bleed (100% Isolated Component Scope)
- **Scoped Styles:** Removed un-namespaced global CSS rules (such as `.hidden { display: none !important }`) that could collide with host page elements, navigation bars, or utility classes from frameworks like Tailwind CSS and Bootstrap.
- **Strict Prefixing:** All styles and classes are strictly encapsulated within `.dynamo-*` selectors and the `.dynamo-wrapper` container.

### 👥 Robust Multi-Player Architecture
- **Autonomous Instances:** Multiple players can coexist on the same web page without cross-talk or conflicting timers, event handlers, or seeking states.
- **Instance-Scoped DOM Queries:** All internal DOM element queries are performed strictly relative to each player's wrapper element.
- **Flexible Declarative & JS Instantiation:** Seamless initialization using `.dynamo-player`, `data-dynamo`, `#dynamoPlayer`, or custom selectors via `DynamoPlayer.init()`.

------------------------------------------------------------------------

## ✨ Features

-   🎛️ Overscreen Controls
-   🖼️ Auto Thumbnails
-   🌈 Ambient Mode
-   📺 Picture-in-Picture
-   💬 Subtitle Tracks
-   🎧 HLS Audio Tracks
-   🎯 Synchronized Menu & Controls Auto-Hide
-   👥 Multi-Instance Support on Single Page
-   🛡️ 100% Component-Scoped CSS (Zero Global Conflicts)
-   ⚡ Zero dependencies
-   🧠 Dynamic initialization API

------------------------------------------------------------------------

## ⌨️ Keyboard Shortcuts

  Key       Action
  --------- --------------
  `Space`   Play / Pause
  `←`       Backward 5s
  `→`       Forward 5s

------------------------------------------------------------------------

## 🌍 Browser Compatibility

  | Feature         | Chrome | Firefox | Safari | Edge |
| --------------- | ------ | ------- | ------ | ---- |
| MP4 / WebM      | ✅      | ✅       | ✅      | ✅    |
| HLS             | ✅      | ✅       | ✅      | ✅    |
| Native HLS      | ❌      | ❌       | ✅      | ❌    |
| PiP             | ✅      | ✅       | ✅      | ✅    |
| Ambient Mode    | ✅      | ✅       | ⚠️     | ✅    |
| Auto Thumbnails | ✅      | ✅       | ⚠️     | ✅    |

------------------------------------------------------------------------

## 🧠 JavaScript API

### Default Initialization
Auto-initializes all `<video id="dynamoPlayer">`, `<video class="dynamo-player">`, and `<video data-dynamo>` elements:
``` javascript
DynamoPlayer.init();
```

### Targeted / Custom Selector Initialization
Initialize specific elements or custom CSS selectors dynamically:
``` javascript
// Target by CSS selector
DynamoPlayer.init('.my-custom-video-class');

// Target a specific DOM element
const videoEl = document.querySelector('#specialVideo');
DynamoPlayer.init(videoEl);

// Target a NodeList or Array
const videoList = document.querySelectorAll('.gallery-video');
DynamoPlayer.init(videoList);
```

------------------------------------------------------------------------

## 🛣️ -Roadmap

-   [ ] NPM package support
-   [ ] React wrapper
-   [ ] Vue wrapper
-   [ ] DASH support
-   [ ] Chromecast support
-   [ ] Playlist mode
-   [ ] Theme customization API

------------------------------------------------------------------------

## 🤝 Contributing

Contributions, issues and feature requests are welcome.

1.  Fork the repository
2.  Create your feature branch
3.  Commit your changes
4.  Open a Pull Request

------------------------------------------------------------------------

## 📄 License

MIT License © Aex Studios

------------------------------------------------------------------------


Made with ❤️ for the open web by AEX STUDIOS

