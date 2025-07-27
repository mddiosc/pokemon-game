# 🎮 Pokémon Game

[![Vue 3](https://img.shields.io/badge/Vue-3.5.17-4FC08D?style=for-the-badge&logo=vue.js&logoColor=white)](https://vuejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.0-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.0-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Vitest](https://img.shields.io/badge/Vitest-3.2.4-6E9F18?style=for-the-badge&logo=vitest&logoColor=white)](https://vitest.dev/)

[![Tests](https://img.shields.io/badge/Tests-81%20Passing-brightgreen?style=flat-square)](https://vitest.dev/)
[![Coverage](https://img.shields.io/badge/Coverage-100%25-brightgreen?style=flat-square)](https://vitest.dev/)
[![License](https://img.shields.io/badge/License-MIT-blue?style=flat-square)](LICENSE)

An interactive "Who's That Pokémon?" game built with Vue 3, TypeScript, and modern web technologies. Test your Pokémon knowledge while enjoying smooth animations, visual feedback, and a comprehensive scoring system.

## 🎮 Demo

> **Note**: Replace with actual screenshots when available

![Game Screenshot](https://via.placeholder.com/800x500/667eea/ffffff?text=🎮+Pokémon+Game+Demo)

Experience the thrill of identifying Pokémon with modern UI and smooth animations

## ✨ Features

### 🎯 Core Gameplay

- **Interactive Quiz**: Identify Pokémon from their silhouettes
- **Multiple Choice**: Choose from 4 randomized options per round
- **Real-time Feedback**: Instant visual responses for correct/incorrect answers
- **Progressive Difficulty**: Continuous rounds with varied Pokémon selection

### 📊 Scoring System

- **Points & Levels**: Earn points to unlock new levels (100 points per level)
- **Streak System**: Build consecutive correct answers for bonus points
- **Statistics Tracking**: Monitor accuracy, best streak, and round progress
- **Achievement Notifications**: Celebrate milestones with visual rewards

### 🎨 User Experience

- **Modern UI**: Glass morphism design with gradient backgrounds
- **Smooth Animations**: CSS animations for transitions and feedback states
- **Responsive Design**: Optimized for desktop and mobile devices
- **Visual Effects**: Confetti celebrations and interactive hover states
- **Loading States**: Engaging loading screens with animated elements

### 🏗️ Technical Architecture

- **Composables Pattern**: Centralized game logic with `usePokemonGame`
- **Component Structure**: Modular Vue 3 components with TypeScript
- **API Integration**: Fetch Pokémon data from external APIs
- **State Management**: Reactive state handling with Vue's Composition API

## 🛠️ Tech Stack

- **Frontend**: Vue 3 + TypeScript + Vite
- **Styling**: Tailwind CSS + Custom CSS animations
- **Testing**: Vitest + Vue Test Utils
- **API**: Axios for HTTP requests
- **Effects**: Canvas Confetti for celebrations
- **Development**: ESLint + Prettier for code quality

## 📱 Component Overview

- **PokemonGame**: Main game page with UI orchestration
- **PokemonPicture**: Displays Pokémon silhouettes with reveal animations
- **PokemonOptions**: Interactive multiple-choice buttons
- **GameStats**: Real-time statistics dashboard with progress tracking

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- pnpm package manager

### Installation

```sh
# Clone the repository
git clone <repository-url>

# Navigate to project directory
cd pokemon-game

# Install dependencies
pnpm install
```

### Development

```sh
# Start development server
pnpm dev
```

### Testing

```sh
# Run unit tests
pnpm test:unit

# Run tests with coverage
pnpm test:unit --coverage
```

### Production Build

```sh
# Build for production
pnpm build

# Preview production build
pnpm preview
```

## 🎯 Game Features in Detail

### Scoring Mechanics

- **Base Points**: 10 points per correct answer
- **Streak Bonus**: Additional points for consecutive correct answers (max +10)
- **Level System**: Every 100 points unlocks a new level
- **Progress Tracking**: Visual progress bar showing advancement to next level

### Visual Feedback

- **Success States**: Green highlighting with confetti animations
- **Error States**: Red highlighting with shake animations
- **Hover Effects**: Interactive button states with shimmer effects
- **Achievement Badges**: Pop-up notifications for milestones

### Responsive Design

- **Mobile Optimized**: Touch-friendly interface for mobile devices
- **Adaptive Layout**: Grid system that adjusts to screen size
- **Performance**: Optimized animations for various device capabilities

## 🧪 Testing

The project includes comprehensive test coverage:

- **Unit Tests**: 81 test cases covering all components and composables
- **Component Testing**: Vue Test Utils for component behavior validation
- **Composable Testing**: Business logic validation with proper mocking
- **Mock Strategies**: Efficient API mocking to prevent external dependencies

## 📁 Project Structure

```text
src/
├── assets/              # Static assets and global styles
├── modules/
│   └── pokemon/
│       ├── api/         # API integration layer
│       ├── components/  # Vue components
│       ├── composables/ # Game logic composables
│       ├── interfaces/  # TypeScript type definitions
│       └── pages/       # Main game page
└── main.ts             # Application entry point
```

## 🤝 Contributing

1. Follow the existing code style and conventions
2. Write tests for new features
3. Ensure all tests pass before submitting
4. Use meaningful commit messages
