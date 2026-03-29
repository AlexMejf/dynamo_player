# ⚡ Dynamo Player


> **v1.6.1 Beta** --- A modern, lightweight and dependency-free video
> player built on top of the native HTML `<video>` element with support
> for **HLS, multiple qualities, subtitles, ambient mode, auto
> thumbnails, PiP, audio tracks, and more**.

------------------------------------------------------------------------

## 📚 Table of Contents

-   [Quick Demo](#-quick-demo)
-   [Installation](#-installation)
-   [Basic Usage](#-basic-usage)
-   [Supported Video Sources](#-supported-video-sources)
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

``` html
<video id="dynamoPlayer" data-src="video.mp4"></video>
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

## ✨ Features

-   🎛️ Overscreen Controls
-   🖼️ Auto Thumbnails
-   🌈 Ambient Mode
-   📺 Picture-in-Picture
-   💬 Subtitle Tracks
-   🎧 HLS Audio Tracks
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

``` javascript
DynamoPlayer.init();
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

