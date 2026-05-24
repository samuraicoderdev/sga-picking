# NxWarehouse - Smart SGA & Picking System

## Industrial Warehouse Management System for Modern Logistics

A comprehensive, mobile-first Warehouse Management System (WMS) designed specifically for industrial logistics operations. This application streamlines inventory management, order picking, and customer relationship management with full support for mobile devices, barcode scanning, and Progressive Web App (PWA) capabilities.

![Version](https://img.shields.io/badge/version-0.5.21-blue.svg)
![React](https://img.shields.io/badge/React-19.0.1-61dafb.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8.2-3178c6.svg)
![Vite](https://img.shields.io/badge/Vite-6.2.3-646cff.svg)

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [System Architecture](#system-architecture)
- [Mobile & PWA Support](#mobile--pwa-support)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage Guide](#usage-guide)
- [API Reference](#api-reference)
- [Project Structure](#project-structure)
- [Development](#development)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

**NxWarehouse** is a state-of-the-art Warehouse Management System that combines:

- **SGA (Sistema de Gestión de Almacenes)**: Complete warehouse management capabilities
- **Advanced Picking System**: Multiple picking strategies for efficient order fulfillment
- **Inventory Control**: Real-time stock tracking and management
- **CRM Integration**: Customer relationship management for B2B operations

The system is built with a **mobile-first approach**, ensuring seamless operation on smartphones, tablets, rugged handheld devices, and desktop computers. It supports both hardware barcode scanners and mobile camera-based scanning.

---

## Features

### Core Modules

#### 📊 Dashboard
Real-time operational overview with key performance indicators:
- Pending orders count and trends
- Low stock alerts and notifications
- Total inventory levels
- Order completion rate metrics
- Recent orders tracking
- Inventory alerts panel

#### 📦 Inventory Management
Complete product and stock control:
- Product catalog with SKU management
- Real-time stock levels
- Location tracking (bin/rack/shelf)
- Category organization
- Barcode integration
- Low stock warnings
- Search and filter capabilities
- Stock status indicators

#### 🎯 Picking System (SGA)
Advanced order fulfillment with multiple strategies:

**Picking Modes:**
1. **Single Order Picking**: Process one order at a time
2. **Batch Picking**: Pick multiple orders simultaneously
3. **Zone Picking**: Assign pickers to specific warehouse zones
4. **Wave Picking**: Schedule picks by time waves

**Scanner Options:**
- **Hardware Scanner Mode**: Compatible with RFID guns and Bluetooth scanners
- **Camera Scanner Mode**: Native mobile camera barcode/QR scanning using HTML5-QRCode

**Features:**
- Real-time task selection
- Visual and audio feedback (success/error sounds)
- Progress tracking per task
- Screen flash indicators
- Automatic input refocus for hardware scanners
- Manual barcode entry fallback

#### 👥 CRM (Customer Relationship Management)
B2B customer management:
- Customer directory with contact details
- Company association
- Status tracking (Active, Lead, Inactive)
- Email and phone integration
- Customer card view with quick actions

### Mobile Capabilities

- 📱 **Responsive Design**: Optimized UI for all screen sizes (320px to 4K displays)
- 📷 **Barcode Scanner**: Native camera integration supporting:
  - QR Codes
  - EAN-13, EAN-8
  - UPC-A, UPC-E
  - Code 128, Code 39
  - Data Matrix
  - PDF417
- 🔄 **Real-time Sync**: Instant data synchronization across devices
- 📲 **PWA Support**: Install as native app on iOS and Android
- 🔔 **Audio Feedback**: Success/error beeps for scanning operations
- ✨ **Visual Indicators**: Screen flash effects for scan results
- 👆 **Touch Optimized**: Large touch targets and gesture support

### Key Features Summary

| Feature | Description |
|---------|-------------|
| Real-time Tracking | Live inventory and order status updates |
| Multi-strategy Picking | 4 different picking modes for flexibility |
| Dual Scanner Support | Hardware + Camera scanning options |
| Offline Capable | PWA with service worker for offline use |
| Audio Feedback | Sound cues for successful/failed scans |
| Visual Feedback | Screen flash and color-coded indicators |
| Mobile First | Designed for warehouse floor mobility |
| Type Safe | Full TypeScript implementation |

---

## Technology Stack

### Frontend

| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | 19.0.1 | UI library with latest features |
| **TypeScript** | 5.8.2 | Type-safe development |
| **Vite** | 6.2.3 | Next-gen build tool |
| **Tailwind CSS** | 4.1.14 | Utility-first styling |
| **Motion** | 12.23.24 | Smooth animations (Framer Motion successor) |
| **Lucide React** | 0.546.0 | Icon library |
| **HTML5-QRCode** | 2.3.8 | Camera-based barcode scanning |
| **Express** | 4.21.2 | Backend server (bundled) |

### Backend

| Technology | Purpose |
|------------|---------|
| **Bun Runtime** | Fast JavaScript runtime |
| **Express.js** | RESTful API server |
| **Prisma ORM** | Type-safe database access |
| **SQLite** | Lightweight database (dev) |
| **PostgreSQL/MySQL** | Production databases |

### PWA Technologies

- **Service Workers**: Offline caching and background sync
- **Web App Manifest**: Installable app configuration
- **IndexedDB**: Local data storage
- **Cache API**: Asset caching strategy

---

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      NxWarehouse System                      │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐          │
│  │   Mobile    │  │   Tablet    │  │   Desktop   │          │
│  │   Device    │  │   Device    │  │   Browser   │          │
│  │  (Scanner)  │  │  (Scanner)  │  │  (Admin)    │          │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘          │
│         │                │                │                   │
│         └────────────────┼────────────────┘                   │
│                          │                                    │
│                  ┌───────▼────────┐                          │
│                  │  React Frontend │                          │
│                  │  + PWA Service  │                          │
│                  └───────┬────────┘                          │
│                          │ REST API                          │
│                  ┌───────▼────────┐                          │
│                  │  Express Server │                          │
│                  │  (Bun Runtime)  │                          │
│                  └───────┬────────┘                          │
│                          │                                    │
│                  ┌───────▼────────┐                          │
│                  │   Prisma ORM   │                          │
│                  └───────┬────────┘                          │
│                          │                                    │
│                  ┌───────▼────────┐                          │
│                  │   Database     │                          │
│                  │  (SQLite/Pg)   │                          │
│                  └────────────────┘                          │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

### Data Flow

1. **User Interaction** → React Components
2. **Component State** → API Client (`src/api/api.ts`)
3. **API Client** → REST Endpoints (`/api/*`)
4. **Server** → Prisma ORM → Database
5. **Response** → State Update → UI Re-render

---

## Mobile & PWA Support

### Progressive Web App Features

NxWarehouse is a fully-featured PWA that can be installed on any modern device:

#### Installation
- **Android**: Chrome "Add to Home Screen" or Play Store
- **iOS**: Safari "Add to Home Screen" (iOS 14.5+)
- **Desktop**: Chrome/Edge "Install App" prompt

#### Capabilities

| Feature | Status | Description |
|---------|--------|-------------|
| Offline Mode | ✅ | Core functionality without internet |
| Camera Access | ✅ | Barcode scanning via device camera |
| Push Notifications | 🔄 | Configurable for alerts |
| Background Sync | ✅ | Queue operations when offline |
| Full Screen | ✅ | Standalone app experience |
| Touch Gestures | ✅ | Optimized for touch interfaces |

### Camera Scanner Implementation

The app uses **HTML5-QRCode** library for camera-based scanning:

```typescript
// Camera initialization with back-camera preference
Html5Qrcode.getCameras().then(devices => {
  const backCamera = devices.find(d =>
    d.label.toLowerCase().includes('back')
  );
  const cameraId = backCamera ? backCamera.id : devices[0].id;

  html5QrCode.start(
    cameraId,
    { fps: 10, qrbox: { width: 250, height: 250 } },
    (decodedText) => onScan(decodedText)
  );
});
```

### Supported Barcode Formats

- **1D Barcodes**: EAN-13, EAN-8, UPC-A, UPC-E, Code 128, Code 39, ITF
- **2D Codes**: QR Code, Data Matrix, PDF417, Aztec

### Hardware Scanner Support

For industrial environments, the app supports:
- **Bluetooth Scanners**: Pair via device settings, auto-input mode
- **USB Scanners**: HID keyboard emulation
- **RFID Readers**: Compatible with standard RFID systems
- **Wedge Scanners**: Direct keyboard wedge integration

---

## Installation

### Prerequisites

Ensure you have the following installed:

- **Node.js** 18+ or **Bun** 1.0+
- **npm** 9+ or **bun** package manager
- **Git** for version control

### Quick Start

```bash
# Clone the repository
git clone <repository-url>
cd NxWarehouse

# Install dependencies (using npm)
npm install

# Or using Bun (recommended for speed)
bun install

# Start development server
npm run dev
# or
bun run dev

# Application will be available at http://localhost:54321
```

### Development Server

The Vite dev server runs on port 54321 by default:

```bash
npm run dev
```

Output:
```
  VITE v6.2.3  ready in 250 ms

  ➜  Local:   http://localhost:54321/
  ➜  Network: http://192.168.x.x:54321/
```

### Build for Production

```bash
# Create production build
npm run build

# Preview production build locally
npm run preview
```

Build output is generated in the `dist/` directory.

---

## Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Database Configuration
DATABASE_URL="file:./dev.db"  # SQLite for development
# DATABASE_URL="postgresql://user:pass@localhost:5432/warehouse"  # PostgreSQL

# API Configuration
API_BASE_URL="/api"

# PWA Configuration
APP_NAME="NxWarehouse"
APP_VERSION="0.5.21"
```

### PWA Manifest Configuration

Edit `public/manifest.json`:

```json
{
  "name": "NxWarehouse - SGA Picking System",
  "short_name": "NxWarehouse",
  "description": "Industrial Warehouse Management System",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#3b82f6",
  "orientation": "portrait-primary",
  "icons": [
    {
      "src": "/icons/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

### Tailwind Configuration

Tailwind CSS v4 uses native Vite plugin - no config file needed. Customize in your CSS:

```css
@import "tailwindcss";

:root {
  --color-primary: #3b82f6;
  --color-secondary: #64748b;
}
```

---

## Usage Guide

### Getting Started

1. **Launch the Application**
   - Open browser and navigate to `http://localhost:54321`
   - On mobile: Install PWA from browser menu

2. **Login/Authentication**
   - Current version uses operator profile (Operator #042)
   - Future versions will include full auth system

3. **Navigation**
   - Use sidebar to switch between modules:
     - 📊 Dashboard
     - 📦 Inventory
     - 🎯 Picking (SGA)
     - 👥 CRM

### Using the Picking Module

#### Step 1: Select Picking Mode

Choose from four picking strategies:

| Mode | Best For | Description |
|------|----------|-------------|
| **Single** | Small orders | One order at a time |
| **Batch** | Multiple similar orders | Pick several orders together |
| **Zone** | Large warehouses | Picker assigned to zone |
| **Wave** | Scheduled operations | Time-based picking waves |

#### Step 2: Choose Scanner Type

- **Hardware Scanner** (Keyboard/RFID): For professional barcode guns
- **Camera Scanner**: For mobile device cameras

#### Step 3: Select Task

- Browse pending tasks in the left panel
- Click on a task to activate it
- View task details: items, quantities, locations

#### Step 4: Scan Products

**Using Hardware Scanner:**
1. Ensure input field is focused
2. Scan barcode with scanner gun
3. Listen for success beep / see green flash
4. Continue scanning next item

**Using Camera Scanner:**
1. Grant camera permissions
2. Point camera at barcode
3. Hold steady until scan completes
4. Automatic detection and validation

#### Step 5: Monitor Progress

- Track picked items vs. total required
- View real-time feedback messages
- Complete task when all items are picked

### Audio & Visual Feedback

The system provides immediate feedback:

**Success:**
- 🔊 High-pitched beep (800Hz → 1200Hz)
- 🟢 Green screen flash
- ✅ Success message display

**Error:**
- 🔊 Low-pitched buzz (300Hz → 150Hz)
- 🔴 Red screen flash
- ❌ Error message with details

### Inventory Management

1. **View Products**: Browse complete product catalog
2. **Search**: Filter by name, SKU, or barcode
3. **Stock Levels**: Real-time quantity display
4. **Location Info**: Bin/rack/shelf identifiers
5. **Status Indicators**: Color-coded stock alerts

### Dashboard Analytics

Monitor key metrics:
- **Pending Orders**: Count with weekly trend
- **Low Stock Alerts**: Products below threshold
- **Total Stock**: Overall inventory units
- **Completion Rate**: On-time order percentage

---

## API Reference

### Base URL

```
/api
```

### Endpoints

#### Health Check
```http
GET /api/health
```
Response:
```json
{ "status": "ok" }
```

#### Products
```http
GET /api/products
```
Response: `Product[]`

#### Customers
```http
GET /api/customers
```
Response: `Customer[]`

#### Orders
```http
GET /api/orders
```
Response: `Order[]`

#### Dashboard Stats
```http
GET /api/dashboard/stats
```
Response: `DashboardStats`

#### Picking Tasks
```http
GET /api/picking/tasks?mode=single|batch|zone|wave
```
Response: `PickingTask[]`

#### Scan Barcode
```http
POST /api/picking/scan
Content-Type: application/json

{
  "mode": "single",
  "taskId": "TASK-001",
  "barcode": "1234567890123",
  "orderId": "ORD-001"
}
```
Response: `ScanResponse`

### TypeScript Interfaces

```typescript
interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  stock: number;
  location: string;
}

interface PickingTask {
  id: string;
  title: string;
  subtitle: string;
  items: {
    productId: string | number;
    quantity: number;
    picked: number;
    orderId?: string;
  }[];
}

interface ScanResponse {
  success: boolean;
  message: string;
  task?: PickingTask;
}
```

---

## Project Structure

```
NxWarehouse/
├── public/
│   ├── icons/              # PWA app icons
│   ├── favicon.svg         # Favicon
│   ├── icons.svg           # Icon sprite
│   ├── manifest.json       # PWA manifest
│   └── sw.js               # Service Worker
├── src/
│   ├── api/
│   │   ├── api.ts          # API client & types
│   │   └── index.ts        # API exports
│   ├── assets/
│   │   ├── hero.png        # Hero image
│   │   ├── react.svg       # React logo
│   │   └── vite.svg        # Vite logo
│   ├── components/
│   │   ├── Sidebar.tsx     # Navigation sidebar
│   │   └── index.ts        # Component exports
│   ├── views/
│   │   ├── Dashboard.tsx   # Dashboard view
│   │   ├── Inventory.tsx   # Inventory management
│   │   ├── Picking.tsx     # Picking station
│   │   ├── CRM.tsx         # Customer management
│   │   └── index.ts        # View exports
│   ├── lib/
│   │   └── data.ts         # Mock data utilities
│   ├── App.tsx             # Main app component
│   ├── App.css             # App styles
│   ├── index.css           # Global styles
│   ├── main.tsx            # Entry point
│   ├── types.ts            # TypeScript types
│   └── index.ts            # Module exports
├── .gitlab-ci.yml          # CI/CD configuration
├── bun.lock                # Bun lockfile
├── eslint.config.js        # ESLint configuration
├── index.html              # HTML entry point
├── package.json            # Dependencies & scripts
├── tsconfig.json           # TypeScript config
├── tsconfig.app.json       # App TS config
├── tsconfig.node.json      # Node TS config
├── vite.config.ts          # Vite configuration
└── README.md               # This file
```

### Key Files Explained

| File | Purpose |
|------|---------|
| `src/App.tsx` | Main application component, routing logic |
| `src/api/api.ts` | API client with all endpoint functions |
| `src/views/Picking.tsx` | Complete picking station implementation |
| `src/components/Sidebar.tsx` | Navigation sidebar with active state |
| `public/sw.js` | Service Worker for offline capabilities |
| `public/manifest.json` | PWA installation configuration |
| `vite.config.ts` | Build tool configuration |

---

## Development

### Available Scripts

```bash
# Development
npm run dev          # Start dev server (port 54321)
npm run build        # Production build
npm run preview      # Preview production build

# Code Quality
npm run lint         # TypeScript type checking
npm run clean        # Remove build artifacts

# Bun-specific
bun run dev          # Faster dev server start
bun run build        # Faster builds
```

### Hot Module Replacement

Vite provides instant HMR (Hot Module Replacement):
- Edit any `.tsx` or `.ts` file
- Changes appear instantly without page reload
- State is preserved for most updates

### TypeScript Development

Full TypeScript support with strict typing:

```bash
# Type check without emitting files
npm run lint
```

### Styling with Tailwind CSS

Utility-first CSS framework:

```tsx
<div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-blue-600 text-white">
  Content
</div>
```

### Adding New Views

1. Create view component in `src/views/`
2. Add route in `src/App.tsx`
3. Add navigation item in `src/components/Sidebar.tsx`
4. Export in `src/views/index.ts`

Example:
```tsx
// src/views/Reports.tsx
export function Reports() {
  return <div>Reports View</div>;
}
```

---

## Deployment

### Build for Production

```bash
npm run build
```

Output directory: `dist/`

### Static Hosting

Deploy the `dist/` folder to any static hosting:

- **Vercel**: Automatic deployment from Git
- **Netlify**: Drag & drop or Git integration
- **AWS S3 + CloudFront**: Enterprise hosting
- **Nginx**: Self-hosted option

### Nginx Configuration

```nginx
server {
    listen 80;
    server_name warehouse.example.com;
    root /var/www/nxwarehouse/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### Docker Deployment

```dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY dist/ ./dist/
COPY public/ ./public/

EXPOSE 3000

CMD ["node", "server.js"]
```

### PWA Considerations

For PWA to work in production:
1. Serve over HTTPS (required for service workers)
2. Ensure `manifest.json` is accessible
3. Verify service worker registration
4. Test offline functionality

---

## Troubleshooting

### Common Issues

#### Camera Scanner Not Working

**Problem**: Camera doesn't start or shows black screen

**Solutions**:
1. Grant camera permissions in browser
2. Ensure HTTPS connection (required for camera access)
3. Check browser compatibility (Chrome, Firefox, Safari, Edge)
4. Verify device has rear camera
5. Close other apps using the camera

```javascript
// Debug camera access
Html5Qrcode.getCameras().then(cameras => {
  console.log('Available cameras:', cameras);
}).catch(err => {
  console.error('Camera error:', err);
});
```

#### Hardware Scanner Not Inputting

**Problem**: Scanner gun doesn't populate input field

**Solutions**:
1. Ensure scanner is in HID/keyboard mode
2. Click/focus the input field before scanning
3. Check scanner configuration (suffix characters)
4. Test scanner in text editor first
5. Verify USB/Bluetooth connection

#### PWA Not Installing

**Problem**: No "Add to Home Screen" prompt

**Solutions**:
1. Serve over HTTPS
2. Ensure `manifest.json` is valid and accessible
3. Register service worker successfully
4. Visit site at least twice (5+ minutes apart)
5. Check browser console for errors

#### Build Errors

**Problem**: TypeScript or build failures

**Solutions**:
```bash
# Clear cache and reinstall
rm -rf node_modules dist bun.lock
npm install  # or bun install

# Check TypeScript errors
npm run lint

# Clean build
npm run clean
npm run build
```

#### API Connection Issues

**Problem**: Cannot connect to backend

**Solutions**:
1. Verify API server is running
2. Check `API_BASE_URL` environment variable
3. Ensure CORS is configured correctly
4. Test endpoints with curl/Postman
5. Check network tab in browser DevTools

### Debug Mode

Enable verbose logging:

```typescript
// In development, add console logs
console.log('API Response:', data);
console.log('Scan Result:', result);
```

### Browser Compatibility

| Browser | Version | Support |
|---------|---------|---------|
| Chrome | 90+ | ✅ Full |
| Firefox | 88+ | ✅ Full |
| Safari | 14+ | ✅ Full |
| Edge | 90+ | ✅ Full |
| Samsung Internet | 14+ | ✅ Full |

---

## Contributing

We welcome contributions! Please follow these guidelines:

### Development Workflow

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** changes (`git commit -m 'Add amazing feature'`)
4. **Push** to branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Code Style

- Use TypeScript for all new code
- Follow existing component patterns
- Write meaningful commit messages
- Add comments for complex logic
- Test on mobile devices

### Pull Request Requirements

- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Tests added/updated (if applicable)
- [ ] Documentation updated
- [ ] No new warnings
- [ ] Tested on mobile devices

### Reporting Issues

When reporting bugs, include:
- Description of the issue
- Steps to reproduce
- Expected behavior
- Actual behavior
- Screenshots/videos
- Device/browser information
- Console errors (if any)

---

## License

This project is proprietary software. All rights reserved.

© 2024 NxWarehouse. Unauthorized copying, distribution, or use is strictly prohibited.

For licensing inquiries, please contact the development team.

---

## Support & Contact

### Documentation

- [PWA Implementation Guide](./PWA-IMPLEMENTATION-SUMMARY.md)
- [API Documentation](./src/api/api.ts)
- [Type Definitions](./src/types.ts)

### Technical Support

For technical support and questions:
- 📧 Email: support@nxwarehouse.com
- 💬 Issue Tracker: [GitHub Issues](../../issues)
- 📚 Wiki: [Project Wiki](../../wiki)

### Training Resources

- Video tutorials (coming soon)
- User manual (PDF download)
- Interactive demo environment
- Webinar schedule

---

## Changelog

### Version 0.5.21 (Current)

**Added:**
- Camera scanner with back-camera preference
- Audio feedback for scan results
- Screen flash visual indicators
- Four picking modes (Single, Batch, Zone, Wave)
- PWA offline capabilities
- Real-time dashboard analytics

**Improved:**
- Mobile-responsive UI
- Scanner input auto-focus
- Error handling and messages
- Performance optimizations

**Fixed:**
- Camera permission handling
- Scanner mode switching
- Task progress calculation
- TypeScript type safety

### Upcoming Features (Roadmap)

- [ ] User authentication & roles
- [ ] Multi-warehouse support
- [ ] Advanced reporting module
- [ ] Push notifications
- [ ] Barcode label printing
- [ ] Integration APIs (ERP, eCommerce)
- [ ] Dark mode theme
- [ ] Multi-language support

---

## Acknowledgments

Built with:
- ⚛️ [React](https://react.dev/)
- 🚀 [Vite](https://vitejs.dev/)
- 🎨 [Tailwind CSS](https://tailwindcss.com/)
- 🎬 [Motion](https://motion.dev/)
- 📷 [HTML5-QRCode](https://github.com/mebjas/html5-qrcode)
- 🎯 [Lucide Icons](https://lucide.dev/)

---

**Made with ❤️ for modern warehouse operations**