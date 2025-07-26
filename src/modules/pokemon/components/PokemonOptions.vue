<template>
  <section class="mt-5 flex flex-col items-center">
    <button
      v-for="{ name, id } in options"
      :key="id"
      @click="$emit('selectOption', id)"
      :class="[
        'disabled:shadow-none disabled:bg-gray-100',
        {
          correct: id === correctAnswer && blockSelection,
          incorrect: id !== correctAnswer && blockSelection,
        },
      ]"
      :disabled="blockSelection"
    >
      {{ name }}
    </button>
  </section>
</template>

<script setup lang="ts">
import type { Pokemon } from '../interfaces'

interface PokemonOptionsProps {
  options: Pokemon[]
  correctAnswer: Pokemon['id']
  blockSelection: boolean // Optional prop to block selection
}

const { options, blockSelection } = defineProps<PokemonOptionsProps>()

defineEmits<{
  selectOption: [id: Pokemon['id']]
}>()
</script>

<style scoped>
button {
  @apply bg-white shadow-md rounded-lg p-3 mb-2 cursor-pointer w-40 text-center transition-all hover:bg-gray-100 hover:shadow-lg capitalize;
}

.correct {
  @apply bg-blue-500 text-white;
}

.incorrect {
  @apply bg-red-500 opacity-70;
}
</style>
