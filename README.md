# youtube-music-api
🖥️ API for @th-ch/youtube-music

## Usage
- Install [@th-ch/youtube-music](https://github.com/th-ch/youtube-music)
- Enable the API plugin
- Click Plugins > API > Set API Key
- Make note of your current key or set a new one
- Use this key with all API calls to identify yourself

## Documentation
> **Note**
> The main API endpoint is `https://youtube-music-api.zohan.tech/api/`

### Current song
#### `GET /status`

**Query Params:**
- `key`: Your API key

### Song control
#### `POST /control`

**Request Body:**
- `key`: Your API key
- `controls`: A list (array) of controls to execute; controls can be:
    - `play`
    - `pause`
    - `playPause`
    - `previous`
    - `next`
    - `like`
    - `dislike`
    - `go10sBack`
    - `go10sForward`
    - `go1sBack`
    - `go1sBack`
    - `shuffle`
    - `switchRepeat`
    - `volumeMinus10`
    - `volumePlus10`
    - `fullscreen`
    - `muteUnmute`
    - `maximizeMinimisePlayer`
    - `goToHome`
    - `goToLibrary`
    - `goToSettings`
    - `goToExplore`
    - `search`
    - `showShortcuts`

## Android App
Download from [Google Play]() or use the latest APK from the `./android/` folder.

### Screenshots
