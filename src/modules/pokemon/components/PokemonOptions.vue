<template>
  <section class="mt-8 flex flex-col items-center w-full max-w-md mx-auto fade-in-up">
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
      <button
        v-for="({ name, id }, index) in options"
        :key="id"
        @click="handleOptionClick(id)"
        :class="[
          'pokemon-option-btn',
          'relative overflow-hidden',
          'bg-white/90 backdrop-blur-sm shadow-lg rounded-xl p-4 mb-2',
          'cursor-pointer w-full text-center font-medium',
          'transition-all duration-300 ease-out',
          'border border-white/20',
          'hover:bg-white hover:shadow-2xl hover:border-blue-200',
          'disabled:cursor-not-allowed',
          'capitalize text-gray-700',
          {
            'correct-answer': id === correctAnswer && blockSelection,
            'incorrect-answer': id !== correctAnswer && blockSelection && selectedOption === id,
            'disabled-option': blockSelection && selectedOption !== id && id !== correctAnswer,
          },
        ]"
        :disabled="blockSelection"
        :style="`animation-delay: ${index * 100}ms`"
      >
        <!-- Shimmer effect overlay -->
        <div
          v-if="!blockSelection"
          class="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-300"
          style="
            background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
            transform: translateX(-100%);
            animation: shimmer 2s infinite;
          "
        ></div>

        <!-- Pokemon name -->
        <span class="pokemon-name relative z-10 block text-lg">{{ name }}</span>

        <!-- Success icon with animation -->
        <div
          v-if="id === correctAnswer && blockSelection"
          class="success-icon absolute top-2 right-2 text-2xl sparkle-burst"
        >
          🎉
        </div>

        <!-- Error icon with shake animation -->
        <div
          v-else-if="id !== correctAnswer && blockSelection && selectedOption === id"
          class="error-icon absolute top-2 right-2 text-2xl"
          style="animation: shake 0.5s ease-in-out"
        >
          ❌
        </div>

        <!-- Glow effect for correct answer -->
        <div
          v-if="id === correctAnswer && blockSelection"
          class="absolute inset-0 bg-gradient-to-r from-emerald-400/20 to-green-400/20 rounded-xl -z-10 animate-pulse"
        ></div>
      </button>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { Pokemon } from '../interfaces'

interface PokemonOptionsProps {
  options: Pokemon[]
  correctAnswer: Pokemon['id']
  blockSelection: boolean
}

const props = defineProps<PokemonOptionsProps>()
const emit = defineEmits<{
  selectOption: [id: Pokemon['id']]
}>()

const selectedOption = ref<Pokemon['id'] | null>(null)

const handleOptionClick = (id: Pokemon['id']) => {
  if (props.blockSelection) return

  selectedOption.value = id
  emit('selectOption', id)
}
</script>

<style scoped>
/* Custom shimmer animation */
@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

/* Shake animation for wrong answers */
@keyframes shake {
  0%,
  100% {
    transform: translateX(0);
  }
  25% {
    transform: translateX(-5px);
  }
  50% {
    transform: translateX(5px);
  }
  75% {
    transform: translateX(-3px);
  }
}

/* Enhanced button states */
.pokemon-option-btn {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.8));
  backdrop-filter: blur(10px);
  transform: translateY(0);
}

.pokemon-option-btn:hover:not(:disabled) {
  transform: translateY(-3px);
  box-shadow:
    0 15px 35px rgba(0, 0, 0, 0.1),
    0 3px 10px rgba(0, 0, 0, 0.05);
}

.pokemon-option-btn:active:not(:disabled) {
  transform: translateY(-1px);
  transition: all 0.1s;
}

/* Success state with enhanced styling */
.correct-answer {
  background: linear-gradient(135deg, #10b981, #059669) !important;
  color: white !important;
  box-shadow:
    0 0 30px rgba(16, 185, 129, 0.4),
    0 10px 20px rgba(16, 185, 129, 0.2);
  border-color: #10b981 !important;
}

/* Error state with enhanced styling */
.incorrect-answer {
  background: linear-gradient(135deg, #ef4444, #dc2626) !important;
  color: white !important;
  box-shadow:
    0 0 30px rgba(239, 68, 68, 0.4),
    0 10px 20px rgba(239, 68, 68, 0.2);
  border-color: #ef4444 !important;
}

/* Disabled state */
.disabled-option {
  opacity: 0.5;
  transform: scale(0.96) translateY(0);
  filter: grayscale(0.5);
}

/* Responsive adjustments */
@media (max-width: 640px) {
  .pokemon-option-btn {
    padding: 1rem;
    font-size: 1rem;
  }

  .success-icon,
  .error-icon {
    font-size: 1.5rem;
  }
}
</style>
