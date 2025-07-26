<template>
  <section>
    <img v-if="!showPokemon" :src="pokemonImageUrl" alt="" class="brightness-0" />
    <img v-else :src="pokemonImageUrl" class="fade-in" alt="" />
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
img {
  width: 200px;
  height: 200px;
  user-select: nones;
  -moz-user-select: none;
  -ms-user-select: none;
  -webkit-user-drag: none;
  -webkit-user-select: none;
}
</style>
