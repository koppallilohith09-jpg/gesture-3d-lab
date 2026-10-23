# Gesture 3D Lab

Explore a spatial model with hand tracking, mouse or keyboard.

Independent local application, with a holographic interface. Requires Node.js 22 or newer.

## Run

Run `npm install`, then `npm start` and open http://127.0.0.1:8802. On Windows you can also double-click START.cmd after installation. Run `npm test` for automated checks.

## Privacy and operation

This app listens only on loopback and has no cloud deployment or remote-access configuration. Do not expose the port publicly. Source code contains no personal documents or credentials. Browser storage is local to the browser profile and origin (including the port); clearing that storage removes saved data. Back up/export anything important. Browser storage is not application-level encryption.

## Features and limitations

Three.js planet/orbit, water molecule and crystal with drag, rotate/zoom/reset buttons, and motion pause. MediaPipe controls yaw/pitch from palm position and zoom via pinch. Camera starts only after Enable camera; Stop releases tracks. Run npm run setup:model once to download Google’s official hand_landmarker float16 version 1 model. Camera frames stay local. Camera permission, WebGL and adequate lighting required. Three.js bundled under MIT; MediaPipe dependency is Apache-2.0. https://ai.google.dev/edge/mediapipe/solutions/vision/hand_landmarker/web_js
