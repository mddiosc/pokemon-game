<template>
  <!-- Enhanced decorative pokeballs -->
  <div class="pokeball-decoration pokeball-1 spin-slow"></div>
  <div class="pokeball-decoration pokeball-2 spin-slow" style="animation-delay: 1s"></div>
  <div class="pokeball-decoration pokeball-3 spin-slow" style="animation-delay: 2s"></div>
  <div class="pokeball-decoration pokeball-4 spin-slow" style="animation-delay: 3s"></div>

  <!-- Loading Screen with enhanced animations -->
  <section
    v-if="isLoading || !randomPokemon"
    class="pokemon-bg flex flex-col items-center justify-center h-screen w-screen relative overflow-hidden"
  >
    <div class="text-center z-10 fade-in-scale">
      <!-- Enhanced loading pokeball -->
      <div class="mb-8">
        <div class="w-32 h-32 mx-auto mb-8 relative">
          <div
            class="pokeball-decoration pulse-glow"
            style="
              position: relative;
              width: 128px;
              height: 128px;
              opacity: 1;
              animation-duration: 1.5s;
            "
          ></div>
          <div
            class="absolute inset-0 bg-gradient-to-r from-red-400/30 to-white/30 rounded-full blur-xl scale-150"
          ></div>
        </div>
      </div>

      <!-- Enhanced title with gradient text -->
      <h1
        class="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 mb-6 drop-shadow-2xl fade-in-down"
      >
        🔍 Pokemon Game
      </h1>

      <!-- Loading text with better animation -->
      <h3 class="text-2xl md:text-3xl text-white font-bold mb-4 fade-in-up">
        <span class="animate-pulse">Cargando Pokémons</span>
        <span class="loading-dots">
          <span style="animation-delay: 0s">.</span>
          <span style="animation-delay: 0.2s">.</span>
          <span style="animation-delay: 0.4s">.</span>
        </span>
      </h3>

      <p class="text-white/80 text-lg font-medium fade-in-up" style="animation-delay: 0.3s">
        ¡Prepárate para la mejor aventura Pokémon! 🚀
      </p>

      <!-- Loading progress bar -->
      <div class="mt-8 w-64 mx-auto">
        <div class="bg-white/20 rounded-full h-2 overflow-hidden backdrop-blur-sm">
          <div
            class="bg-gradient-to-r from-yellow-400 to-red-500 h-full animate-pulse loading-bar"
          ></div>
        </div>
      </div>
    </div>
  </section>

  <!-- Game Screen with enhanced animations -->
  <section
    v-else
    class="pokemon-bg flex flex-col items-center justify-center min-h-screen w-screen relative overflow-hidden px-4 py-8 game-start"
  >
    <div class="text-center z-10 w-full max-w-2xl">
      <!-- Enhanced game title -->
      <h1 class="text-4xl md:text-6xl font-black mb-8 drop-shadow-2xl fade-in-down">
        <span class="text-6xl md:text-7xl">🎯</span>
        <span
          class="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500"
        >
          ¿Quién es este Pokémon?
        </span>
      </h1>

      <!-- Enhanced play again button -->
      <div class="h-20 mb-8 fade-in-scale">
        <button
          v-if="gameStatus !== GameStatus.Playing"
          @click="getNextRound()"
          class="play-again-btn group relative bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 text-white px-10 py-4 rounded-2xl shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 font-bold text-xl border-2 border-white/30 backdrop-blur-sm overflow-hidden"
        >
          <!-- Button shimmer effect -->
          <div
            class="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"
          ></div>

          <span class="relative z-10 flex items-center space-x-2">
            <span>🎮</span>
            <span>¡Jugar de nuevo!</span>
            <span class="group-hover:animate-bounce">🚀</span>
          </span>
        </button>
      </div>

      <!-- Pokemon Picture with container animation -->
      <div class="mb-8 fade-in-scale" style="animation-delay: 0.2s">
        <PokemonPicture
          :pokemon-id="randomPokemon.id"
          :show-pokemon="gameStatus !== GameStatus.Playing"
        />
      </div>

      <!-- Pokemon options with staggered animation -->
      <div class="fade-in-up" style="animation-delay: 0.4s">
        <PokemonOptions
          :options="pokemonOptions"
          @selectOption="checkAnswer"
          :block-selection="gameStatus !== GameStatus.Playing"
          :correct-answer="randomPokemon.id"
        />
      </div>

      <!-- Game status indicator -->
      <div
        v-if="gameStatus !== GameStatus.Playing"
        class="mt-6 fade-in-up"
        style="animation-delay: 0.6s"
      >
        <div
          :class="[
            'inline-flex items-center space-x-2 px-6 py-3 rounded-2xl font-bold text-lg backdrop-blur-md border-2',
            gameStatus === GameStatus.Won
              ? 'bg-green-500/20 text-green-100 border-green-400/50'
              : 'bg-red-500/20 text-red-100 border-red-400/50',
          ]"
        >
          <span v-if="gameStatus === GameStatus.Won">🎉</span>
          <span v-else>💫</span>
          <span>
            {{ gameStatus === GameStatus.Won ? '¡Correcto! ¡Increíble!' : '¡Sigue intentando!' }}
          </span>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import PokemonPicture from '@pokemon/components/PokemonPicture.vue'
import PokemonOptions from '@pokemon/components/PokemonOptions.vue'
import { usePokemonGame } from '../composables/usePokemonGame'
import { GameStatus } from '../interfaces'

const { isLoading, randomPokemon, gameStatus, pokemonOptions, checkAnswer, getNextRound } =
  usePokemonGame()
</script>
