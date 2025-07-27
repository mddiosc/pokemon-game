<template>
  <section class="relative fade-in-scale">
    <div class="pokemon-image-container relative">
      <!-- Enhanced glow effect background -->
      <div
        v-if="showPokemon"
        class="absolute inset-0 bg-gradient-to-r from-blue-400/30 via-purple-400/30 to-pink-400/30 rounded-full blur-2xl scale-125 -z-10 pulse-glow"
      ></div>

      <!-- Secondary glow layer -->
      <div
        v-if="showPokemon"
        class="absolute inset-0 bg-gradient-to-r from-cyan-300/20 to-indigo-300/20 rounded-full blur-xl scale-110 -z-10"
        style="animation: pulseGlow 3s ease-in-out infinite reverse"
      ></div>

      <!-- Enhanced image container -->
      <div
        class="relative bg-white/15 backdrop-blur-md rounded-3xl p-8 border border-white/30 shadow-2xl transition-all duration-500 flex items-center justify-center"
        :class="{ 'scale-105': showPokemon }"
      >
        <!-- Pokemon silhouette - simple original logic -->
        <img
          v-if="!showPokemon"
          :src="pokemonImageUrl"
          alt="Silueta de Pokemon"
          class="brightness-0 pokemon-silhouette pokemon-silhouette-hover"
        />

        <!-- Pokemon revealed - simple original logic -->
        <img
          v-else
          :src="pokemonImageUrl"
          class="pokemon-revealed pokemon-reveal fade-in"
          alt="Pokemon revelado"
        />

        <!-- Enhanced sparkle effects -->
        <div v-if="showPokemon" class="sparkles">
          <div class="sparkle sparkle-1 sparkle-effect">✨</div>
          <div class="sparkle sparkle-2 sparkle-effect">⭐</div>
          <div class="sparkle sparkle-3 sparkle-effect">💫</div>
          <div class="sparkle sparkle-4 sparkle-effect">✨</div>
          <div class="sparkle sparkle-5 sparkle-effect">🌟</div>
          <div class="sparkle sparkle-6 sparkle-effect">💎</div>
        </div>

        <!-- Success burst effect -->
        <div v-if="showPokemon" class="absolute inset-0 pointer-events-none">
          <div class="success-burst">🎊</div>
        </div>
      </div>

      <!-- Floating particles effect -->
      <div v-if="showPokemon" class="particles">
        <div class="particle particle-1"></div>
        <div class="particle particle-2"></div>
        <div class="particle particle-3"></div>
        <div class="particle particle-4"></div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Pokemon } from '../interfaces'

interface PokemonPictureProps {
  pokemonId: Pokemon['id']
  showPokemon?: boolean
}

const props = withDefaults(defineProps<PokemonPictureProps>(), {
  showPokemon: false,
})

const pokemonImageUrl = computed(() => {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/${props.pokemonId}.svg`
})
</script>

<style scoped>
.pokemon-image-container {
  width: 320px;
  height: 320px;
  margin: 0 auto;
  position: relative;
}

.pokemon-silhouette,
.pokemon-revealed {
  width: 220px;
  height: 220px;
  user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  -webkit-user-drag: none;
  -webkit-user-select: none;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  filter: drop-shadow(0 15px 35px rgba(0, 0, 0, 0.3));
}

.pokemon-silhouette {
  filter: brightness(0) drop-shadow(0 15px 35px rgba(0, 0, 0, 0.3));
}

.pokemon-silhouette:hover {
  transform: scale(1.08) rotate(-3deg);
  filter: brightness(0) drop-shadow(0 20px 50px rgba(0, 0, 0, 0.5));
  cursor: pointer;
}

.pokemon-revealed:hover {
  transform: scale(1.05) rotate(2deg);
  filter: drop-shadow(0 20px 50px rgba(0, 0, 0, 0.4)) brightness(1.1);
}

/* Enhanced sparkle animations */
.sparkles {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  overflow: hidden;
}

.sparkle {
  position: absolute;
  font-size: 1.8rem;
  z-index: 10;
}

.sparkle-1 {
  top: 15%;
  left: 12%;
  animation-delay: 0s;
}
.sparkle-2 {
  top: 25%;
  right: 18%;
  animation-delay: 0.6s;
}
.sparkle-3 {
  bottom: 30%;
  left: 25%;
  animation-delay: 1.2s;
}
.sparkle-4 {
  bottom: 20%;
  right: 15%;
  animation-delay: 1.8s;
}
.sparkle-5 {
  top: 40%;
  left: 8%;
  animation-delay: 2.4s;
}
.sparkle-6 {
  top: 60%;
  right: 8%;
  animation-delay: 3s;
}

/* Success burst effect */
.success-burst {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 3rem;
  animation: successBurst 1.5s ease-out;
  pointer-events: none;
}

@keyframes successBurst {
  0% {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0) rotate(0deg);
  }
  30% {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1.5) rotate(180deg);
  }
  100% {
    opacity: 0;
    transform: translate(-50%, -50%) scale(3) rotate(360deg);
  }
}

/* Floating particles */
.particles {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  overflow: hidden;
}

.particle {
  position: absolute;
  width: 4px;
  height: 4px;
  background: linear-gradient(45deg, #fbbf24, #f59e0b);
  border-radius: 50%;
  animation: floatParticle 4s ease-in-out infinite;
}

.particle-1 {
  top: 20%;
  left: 20%;
  animation-delay: 0s;
}
.particle-2 {
  top: 30%;
  right: 25%;
  animation-delay: 1s;
}
.particle-3 {
  bottom: 25%;
  left: 30%;
  animation-delay: 2s;
}
.particle-4 {
  bottom: 35%;
  right: 20%;
  animation-delay: 3s;
}

@keyframes floatParticle {
  0%,
  100% {
    opacity: 0;
    transform: translateY(0px) translateX(0px) scale(0);
  }
  25% {
    opacity: 1;
    transform: translateY(-20px) translateX(10px) scale(1);
  }
  50% {
    opacity: 0.8;
    transform: translateY(-40px) translateX(-10px) scale(1.2);
  }
  75% {
    opacity: 0.6;
    transform: translateY(-60px) translateX(15px) scale(0.8);
  }
}

/* Enhanced responsive design */
@media (max-width: 768px) {
  .pokemon-image-container {
    width: 280px;
    height: 280px;
  }

  .pokemon-silhouette,
  .pokemon-revealed {
    width: 180px;
    height: 180px;
  }

  .sparkle {
    font-size: 1.5rem;
  }

  .success-burst {
    font-size: 2.5rem;
  }
}

@media (max-width: 640px) {
  .pokemon-image-container {
    width: 240px;
    height: 240px;
  }

  .pokemon-silhouette,
  .pokemon-revealed {
    width: 160px;
    height: 160px;
  }

  .sparkle {
    font-size: 1.2rem;
  }

  .success-burst {
    font-size: 2rem;
  }
}

/* Performance optimizations */
.pokemon-silhouette,
.pokemon-revealed,
.sparkle,
.particle {
  will-change: transform;
}

/* Accessibility improvements */
@media (prefers-reduced-motion: reduce) {
  .pokemon-silhouette,
  .pokemon-revealed {
    transition: none;
  }

  .sparkle,
  .particle,
  .success-burst {
    animation: none;
  }

  .pulse-glow {
    animation: none;
  }
}
</style>
