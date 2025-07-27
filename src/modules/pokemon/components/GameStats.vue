<template>
  <div class="game-stats fade-in-up">
    <!-- Score Display -->
    <div class="score-section">
      <div class="score-card glass-morphism">
        <div class="score-header">
          <span class="score-icon">🏆</span>
          <span class="score-label">Puntuación</span>
        </div>
        <div class="score-value score-update">{{ score }}</div>
        <div class="score-info">
          <span class="streak-indicator" :class="{ 'streak-active': streak > 0 }">
            🔥 {{ streak }} en racha
          </span>
        </div>
      </div>

      <!-- Level Progress -->
      <div class="level-card glass-morphism">
        <div class="level-header">
          <span class="level-icon">⭐</span>
          <span class="level-label">Nivel {{ currentLevel }}</span>
        </div>
        <div class="progress-bar">
          <div class="progress-fill" :style="{ width: `${progressPercentage}%` }"></div>
        </div>
        <div class="level-info">
          <span class="points-to-next"
            >{{ pointsToNextLevel }} pts para nivel {{ currentLevel + 1 }}</span
          >
        </div>
      </div>
    </div>

    <!-- Detailed Stats -->
    <div class="stats-grid">
      <div class="stat-item glass-morphism">
        <div class="stat-icon">📊</div>
        <div class="stat-content">
          <div class="stat-value">{{ accuracy }}%</div>
          <div class="stat-label">Precisión</div>
        </div>
      </div>

      <div class="stat-item glass-morphism">
        <div class="stat-icon">🎯</div>
        <div class="stat-content">
          <div class="stat-value">{{ correctAnswers }}/{{ totalQuestions }}</div>
          <div class="stat-label">Correctas</div>
        </div>
      </div>

      <div class="stat-item glass-morphism">
        <div class="stat-icon">🔥</div>
        <div class="stat-content">
          <div class="stat-value">{{ bestStreak }}</div>
          <div class="stat-label">Mejor Racha</div>
        </div>
      </div>

      <div class="stat-item glass-morphism">
        <div class="stat-icon">#</div>
        <div class="stat-content">
          <div class="stat-value">{{ round }}</div>
          <div class="stat-label">Ronda</div>
        </div>
      </div>
    </div>

    <!-- Achievement Notifications -->
    <div v-if="showAchievement" class="achievement-notification fade-in-scale">
      <div class="achievement-content">
        <span class="achievement-icon">🎉</span>
        <span class="achievement-text">{{ achievementText }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

interface GameStatsProps {
  score: number
  streak: number
  totalQuestions: number
  correctAnswers: number
  bestStreak: number
  round: number
  accuracy: number
  currentLevel: number
  pointsToNextLevel: number
  progressPercentage: number
}

const props = defineProps<GameStatsProps>()
const showAchievement = ref(false)
const achievementText = ref('')

// Watch for achievements
watch(
  () => props.streak,
  (newStreak, oldStreak) => {
    if (newStreak > oldStreak && newStreak >= 3) {
      showAchievement.value = true

      if (newStreak === 3) {
        achievementText.value = '¡Excelente racha de 3!'
      } else if (newStreak === 5) {
        achievementText.value = '¡Increíble racha de 5! 🔥'
      } else if (newStreak === 10) {
        achievementText.value = '¡LEGENDARIO! ¡10 en racha! 🚀'
      } else if (newStreak % 5 === 0) {
        achievementText.value = `¡Imparable! ¡${newStreak} en racha!`
      }

      setTimeout(() => {
        showAchievement.value = false
      }, 3000)
    }
  },
)

watch(
  () => props.currentLevel,
  (newLevel, oldLevel) => {
    if (newLevel > oldLevel) {
      showAchievement.value = true
      achievementText.value = `¡NIVEL ${newLevel} DESBLOQUEADO! ⭐`

      setTimeout(() => {
        showAchievement.value = false
      }, 4000)
    }
  },
)
</script>

<style scoped>
.game-stats {
  max-width: 800px;
  margin: 0 auto;
  padding: 1rem;
}

.score-section {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.score-card,
.level-card {
  padding: 1.5rem;
  border-radius: 1rem;
  text-align: center;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.score-header,
.level-header {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
  color: rgba(255, 255, 255, 0.9);
  font-weight: 600;
}

.score-icon,
.level-icon {
  font-size: 1.5rem;
}

.score-value {
  font-size: 2.5rem;
  font-weight: bold;
  color: #fbbf24;
  margin: 0.5rem 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.streak-indicator {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.7);
  transition: all 0.3s ease;
}

.streak-active {
  color: #f59e0b;
  text-shadow: 0 0 10px rgba(245, 158, 11, 0.5);
  animation: pulseGlow 2s ease-in-out infinite;
}

.progress-bar {
  width: 100%;
  height: 8px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 4px;
  overflow: hidden;
  margin: 1rem 0;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #fbbf24, #f59e0b);
  border-radius: 4px;
  transition: width 0.5s ease;
  position: relative;
}

.progress-fill::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  animation: shimmer 2s infinite;
}

@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

.level-info,
.score-info {
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.7);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 1rem;
}

.stat-item {
  padding: 1rem;
  border-radius: 0.75rem;
  text-align: center;
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
}

.stat-item:hover {
  transform: translateY(-2px);
  border-color: rgba(255, 255, 255, 0.3);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
}

.stat-icon {
  font-size: 1.8rem;
  margin-bottom: 0.5rem;
  display: block;
}

.stat-value {
  font-size: 1.4rem;
  font-weight: bold;
  color: #60a5fa;
  margin-bottom: 0.25rem;
}

.stat-label {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.7);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.achievement-notification {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1000;
  padding: 1rem 2rem;
  background: linear-gradient(135deg, #10b981, #059669);
  border-radius: 2rem;
  color: white;
  font-weight: bold;
  box-shadow: 0 10px 25px rgba(16, 185, 129, 0.4);
  border: 2px solid rgba(255, 255, 255, 0.3);
}

.achievement-content {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.achievement-icon {
  font-size: 1.5rem;
  animation: bounce 1s ease-in-out infinite;
}

@keyframes bounce {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-5px);
  }
}

/* Responsive Design */
@media (max-width: 768px) {
  .score-section {
    grid-template-columns: 1fr;
  }

  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .score-value {
    font-size: 2rem;
  }

  .achievement-notification {
    left: 1rem;
    right: 1rem;
    transform: none;
  }
}

@media (max-width: 480px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }
}

/* Glass Morphism Effect */
.glass-morphism {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}
</style>
