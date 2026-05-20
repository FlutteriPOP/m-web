# 3D Device Mockup Generator

A web-based, interactive 3D device mockup generator inspired by Rotato. This tool allows users to view a 3D smartphone, upload images or videos to dynamically map onto the device screen, and adjust its orientation and casing color through a sleek control panel.

## Features

- **Interactive 3D Canvas**: Smooth rendering of a 3D smartphone frame and screen using React Three Fiber.
- **Dynamic Texture Mapping**: Seamlessly upload PNG/JPG images or MP4/WebM videos to dynamically texture the smartphone's screen mesh.
- **Real-time Customization**: 
  - Change the phone's casing color (Space Gray, Silver, Deep Purple, Gold).
  - Adjust manual rotation (X, Y, Z axes) with sliders.
  - Explore the scene via interactive 3D orbit controls (zoom, pan, and rotate).
- **Premium UI**: A polished sidebar built with Tailwind CSS v4, utilizing a sleek glassmorphism aesthetic over a dark mode environment.
- **Clean Architecture**: Strict separation of concerns between React UI state components and the React Three Fiber 3D scene components.

## Tech Stack

- **Framework**: React 18 with Vite
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **3D Graphics**: Three.js, React Three Fiber (`@react-three/fiber`), React Three Drei (`@react-three/drei`)
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn

### Installation

1. Clone the repository and navigate to the project directory.
2. Install the dependencies:
   ```bash
   npm install
   ```

### Running Locally

To start the Vite development server, run:
```bash
npm run dev
```

Open your browser and navigate to `http://localhost:5173/` (or the port specified in your terminal) to interact with the mockup generator.

### Building for Production

To create a production build, run:
```bash
npm run build
```
This will compile your TypeScript files and bundle your application using Vite into the `dist` directory.

## Project Structure

```
├── src/
│   ├── components/
│   │   ├── canvas/
│   │   │   ├── PhoneModel.tsx   # 3D mesh for the phone and screen textures
│   │   │   └── Scene.tsx        # Environment, lighting, and R3F Canvas wrapper
│   │   └── ui/
│   │       └── Sidebar.tsx      # Tailwind CSS control panel for user inputs
│   ├── App.tsx                  # Main layout and state orchestration
│   ├── index.css                # Tailwind CSS imports and global styling
│   └── main.tsx                 # React entry point
└── package.json
```

## Future Enhancements
- Swap the procedural Three.js mockup mesh with a high-fidelity `.glb`/`.gltf` smartphone model.
- Add animation keyframing and export to video.
- Add background environment swapping (e.g., HDRI maps or solid color backdrops).
