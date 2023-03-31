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

> **Warning**
> The API key set using the Android App is semi-permenant. To change the key go to Settings > Apps > Remote > Clear Data > Clear All Data.

### Screenshots
<p align="left">
<img src="https://user-images.githubusercontent.com/62234360/229007209-165dbce0-d133-499c-9f82-c17efd3531b2.png" width="20%">
<img src="https://user-images.githubusercontent.com/62234360/229007231-64b8781e-f3b2-45cc-8c88-ff45d7c2f2bc.png" width="20%">
<img src="https://user-images.githubusercontent.com/62234360/229007272-d3bb0595-6e33-40c5-9f75-6b4dbb06e18c.png" width="20%">
<img src="https://user-images.githubusercontent.com/62234360/229007948-29806e26-4e01-4844-8d51-bd70e40876d3.png" width="20%">
</p>
