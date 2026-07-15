# Hidden Dot Game Architecture

## Runtime flow

`index.html` → `styles/game.css` + `src/main.js`

`src/main.js` owns the current game state and UI rendering. Reusable platform and tactile concerns are separated:

- `src/platform/runtime.js`: parses `embed`, `preview`, and `lang` query parameters.
- `src/platform/hostBridge.js`: Tactile Worlds `postMessage` bridge and origin filtering.
- `src/platform/ttsAdapter.js`: shared `TW_TTS` access with an ARIA live-region fallback.
- `src/tactile/frame.js`: pure 60×40 tactile frame generation and 2×4-cell hex encoding.
- `src/input/actions.js`: common action names for future keyboard/DotPad/controller unification.

## Porting options

### Current iframe deployment

Deploy this folder as static HTTPS content and register:

`index.html?embed=1&preview=0&lang=ko`

### Future React integration

Move state-changing functions from `main.js` into a reducer. The platform and tactile modules can be imported unchanged. Pass `deviceAdapter`, `ttsAdapter`, `locale`, `onExit`, and `onComplete` as component props.

## DotPad SDK

The package intentionally contains only `dotpad-sdk/README.txt`. Add the authorized `DotPadSDK-3.0.0.js` file before real-device testing. Without it, the visual simulator remains usable.
