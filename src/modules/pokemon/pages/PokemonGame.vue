<template>
  <section
    v-if="isLoading || !randomPokemon"
    class="flex flex-col items-center justify-center h-screen w-screen"
  >
    <h1 class="text-3xl">Espere por favor</h1>
    <h3 class="animate-pulse">Cargando Pokémons...</h3>
  </section>

  <section v-else class="flex flex-col items-center justify-center h-screen w-screen">
    <h1 class="m-5">¿Quien es este Pokémon?</h1>
    <div class="h-20">
      <button
        v-if="gameStatus !== GameStatus.Playing"
        @click="getNextRound()"
        class="mb-5 bg-blue-500 text-white p-3 rounded-lg shadow-md hover:bg-blue-600 transition-all"
      >
        Jugar de nuevo
      </button>
    </div>
    <!-- Pokemon Picture -->

    <PokemonPicture
      :pokemon-id="randomPokemon.id"
      :show-pokemon="gameStatus !== GameStatus.Playing"
    />

    <!-- Pokemon options -->

    <PokemonOptions
      :options="pokemonOptions"
      @selectOption="checkAnswer"
      :block-selection="gameStatus !== GameStatus.Playing"
      :correct-answer="randomPokemon.id"
    />
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
