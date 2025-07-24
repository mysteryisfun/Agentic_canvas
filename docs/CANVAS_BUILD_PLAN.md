# Agentic Canvas - Phased Build Plan

This document outlines a phased, iterative plan to build the dynamic and interactive canvas frontend. Each phase represents a milestone with specific build and testing goals, allowing for an agile development process.

---

## Core Technology Stack

*   **Framework:** React (with Vite for scaffolding)
*   **Language:** TypeScript
*   **3D Rendering:** THREE.js, integrated via `@react-three/fiber` and `@react-three/drei`
*   **Communication:** WebSocket (`socket.io-client` or native WebSocket API)
*   **State Management:** React Context API or Zustand for simplicity

---

## Command API Definition

The frontend will listen for commands from the backend "Canvas Agent" via WebSocket. All communication will be in JSON format. This is the contract between the backend and frontend.

| Command               | Payload Fields                                                                                             | Description                                                                                                                                |
| --------------------- | ---------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| `ADD_ELEMENT`         | `id`, `type`, `content`, `position`, `size`, `options`                                                     | Adds a new element to the canvas. `type` can be `text`, `image`, `video`, `3d_model`, `js_animation`. `content` holds the data (text, URL, or JS code). |
| `UPDATE_ELEMENT`      | `id`, `updates`                                                                                            | Modifies an existing element. `updates` is an object with new values for fields like `position`, `size`, or `content`.                     |
| `REMOVE_ELEMENT`      | `id`                                                                                                       | Removes a specific element from the canvas.                                                                                                |
| `CLEAR_CANVAS`        | (none)                                                                                                     | Removes all elements from the canvas. Used for transitions between major steps or topics.                                                |
| `UPDATE_3D_CAMERA`    | `id`, `cameraPosition`, `lookAt`                                                                           | A specialized update command to control the camera for a specific 3D model, allowing for contextual focus.                                 |

---

## Phase 1: Project Scaffolding & Foundation

**Objective:** Set up the basic project structure, install dependencies, and establish the main application container.

**Tasks:**
1.  Initialize a new React project using Vite:
    ```bash
    npm create vite@latest agentic-canvas-frontend -- --template react-ts
    ```
2.  Navigate into the project directory: `cd agentic-canvas-frontend`
3.  Install core dependencies:
    ```bash
    npm install three @react-three/fiber @react-three/drei socket.io-client
    ```
4.  Clean up the default `App.tsx` and create a main `CanvasContainer.tsx` component that will house the entire application.
5.  Set up basic CSS for a full-screen canvas layout.

**Testing/Verification:**
*   Run the development server (`npm run dev`).
*   Verify that a blank, full-screen page loads without any errors in the console.

---

## Phase 2: WebSocket Connection & State Management

**Objective:** Enable communication with the backend and set up a robust state management system to handle canvas elements.

**Tasks:**
1.  Create a `useWebSocket.ts` custom hook to manage the WebSocket connection, including connection, disconnection, and message handling logic.
2.  Establish a global state using React Context or Zustand. This state will hold an array of all elements currently on the canvas (e.g., `elements: CanvasElement[]`).
3.  In the WebSocket message handler, parse incoming JSON commands.
4.  Implement the logic for the command handlers:
    *   `ADD_ELEMENT`: Adds a new element object to the state array.
    *   `REMOVE_ELEMENT`: Filters the element with the matching `id` from the state array.
    *   `UPDATE_ELEMENT`: Finds the element by `id` and updates its properties.
    *   `CLEAR_CANVAS`: Resets the state array to be empty.

**Testing/Verification:**
*   Create a mock WebSocket message sender (this can be done via the browser's developer console or a simple test script).
*   Send mock `ADD_ELEMENT`, `UPDATE_ELEMENT`, and `REMOVE_ELEMENT` commands.
*   Use React DevTools or console logs to verify that the global state updates correctly in response to each command.

---

## Phase 3: Rendering Basic Elements (Text & Image)

**Objective:** Visually render the most basic content types based on the application state.

**Tasks:**
1.  In `CanvasContainer.tsx`, map over the global `elements` state array.
2.  Create individual components for each element type: `TextElement.tsx` and `ImageElement.tsx`.
3.  The mapping function in `CanvasContainer` should render the correct component based on the element's `type` property.
4.  Use CSS `position: absolute` and the `position` data from the element's state to place it on the screen.

**Testing/Verification:**
*   Send an `ADD_ELEMENT` command with `type: 'text'`. Verify the text appears at the correct position.
*   Send an `ADD_ELEMENT` command with `type: 'image'`. Verify the image loads and displays correctly.
*   Send an `UPDATE_ELEMENT` command to change the position of an element. Verify it moves on the screen.
*   Send a `REMOVE_ELEMENT` command. Verify the element disappears.

---

## Phase 4: Rendering Complex Elements (Video & 3D Models)

**Objective:** Integrate advanced rendering capabilities for video and interactive 3D models.

**Tasks:**
1.  Create a `VideoElement.tsx` component that uses the HTML5 `<video>` tag. The `content` field of the command will contain the video URL.
2.  Create a `ThreeDElement.tsx` component. This component will be the most complex:
    *   It will use `@react-three/fiber`'s `<Canvas>` component to create a dedicated WebGL rendering context.
    *   It will use `@react-three/drei`'s `<Gltf>` helper to load 3D models from a URL (provided in the `content` field).
    *   Add `<OrbitControls />` from `@react-three/drei` to allow user interaction (rotate, pan, zoom).
3.  Implement the `UPDATE_3D_CAMERA` command handler. This will involve using a `ref` to control the camera within the `ThreeDElement` component, allowing the AI to programmatically change the user's viewpoint.

**Testing/Verification:**
*   Send a command to add a video and verify it plays.
*   Send a command to add a `.glb` 3D model. Verify it loads and can be manipulated with the mouse.
*   Send an `UPDATE_3D_CAMERA` command and verify the camera position and angle change programmatically.

---

## Phase 5: Custom JS Animations & Manim Support

**Objective:** Implement the ability to render custom drawings and support animations.

**Tasks:**
1.  **JavaScript Animations:**
    *   Create a `JsAnimationElement.tsx` component.
    *   This component will render an HTML `<canvas>` element.
    *   The `content` of the `ADD_ELEMENT` command will be a string of JavaScript code.
    *   The component will use `new Function('canvas', 'ctx', jsCode)` to safely execute the provided drawing code, passing the canvas element and its 2D rendering context as arguments. This allows the backend to send drawing instructions like `ctx.fillRect(10, 10, 150, 100);`.
2.  **Manim Animation Support:**
    *   **Strategy:** The simplest and most robust approach is to treat Manim animations as videos. The backend will be responsible for rendering a Manim scene into an `.mp4` file.
    *   **Implementation:** No new frontend work is required. The backend will simply send an `ADD_ELEMENT` command with `type: 'video'` and the URL to the generated Manim video file. This reuses the `VideoElement` component from Phase 4.

**Testing/Verification:**
*   Send a `js_animation` command with simple drawing code (e.g., draw a rectangle or circle). Verify the drawing appears correctly.
*   To simulate Manim support, send a `video` command pointing to any `.mp4` file and confirm it plays.

---

## Phase 6: Final Polish & Flow Control

**Objective:** Refine the user experience, ensure smooth transitions, and finalize the application for integration.

**Tasks:**
1.  **Adaptive Flow:** Thoroughly test the "pause and resume" flow. This involves the backend sending `CLEAR_CANVAS`, followed by commands for the detailed explanation, another `CLEAR_CANVAS`, and finally the commands to restore the original lesson step.
2.  **UI/UX Refinements:** Add smooth CSS transitions for elements appearing, moving, or disappearing to create a less jarring experience.
3.  **Error Handling:** Implement error boundaries in React and add logic in the WebSocket handler to gracefully handle malformed commands from the backend.
4.  **Code Cleanup:** Refactor code, add comments where necessary, and ensure the project structure is clean and maintainable.

**Testing/Verification:**
*   Perform end-to-end manual testing of the entire learning flow.
*   Simulate receiving corrupted or invalid commands to ensure the application doesn't crash.
*   Review the visual presentation and responsiveness of all elements.
