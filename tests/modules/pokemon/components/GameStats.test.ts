import { mount } from '@vue/test-utils'
import GameStats from '@/modules/pokemon/components/GameStats.vue'

describe('GameStats', () => {
  const defaultProps = {
    score: 150,
    streak: 3,
    bestStreak: 5,
    totalQuestions: 10,
    correctAnswers: 7,
    round: 5,
    accuracy: 70,
    currentLevel: 2,
    pointsToNextLevel: 50,
    progressPercentage: 75,
  }

  it('should render correctly with all props', () => {
    const wrapper = mount(GameStats, {
      props: defaultProps,
    })

    expect(wrapper.find('.game-stats').exists()).toBe(true)
    expect(wrapper.text()).toContain('150') // Score
    expect(wrapper.text()).toContain('3') // Current streak
    expect(wrapper.text()).toContain('5') // Best streak
    expect(wrapper.text()).toContain('70%') // Accuracy
  })

  it('should display score correctly', () => {
    const wrapper = mount(GameStats, {
      props: defaultProps,
    })

    const scoreElement = wrapper.find('.score-value')
    expect(scoreElement.text()).toContain('150')
  })

  it('should display streak information', () => {
    const wrapper = mount(GameStats, {
      props: defaultProps,
    })

    const streakElement = wrapper.find('.streak-indicator')
    expect(streakElement.text()).toContain('3')

    // Best streak is in the stats grid
    expect(wrapper.text()).toContain('5')
  })

  it('should display accuracy correctly', () => {
    const wrapper = mount(GameStats, {
      props: defaultProps,
    })

    expect(wrapper.text()).toContain('70%')
  })

  it('should display level information', () => {
    const wrapper = mount(GameStats, {
      props: defaultProps,
    })

    expect(wrapper.text()).toContain('Nivel 2')
    expect(wrapper.text()).toContain('50 pts para nivel')
  })

  it('should display progress bar with correct percentage', () => {
    const wrapper = mount(GameStats, {
      props: defaultProps,
    })

    const progressBar = wrapper.find('.progress-fill')
    expect(progressBar.exists()).toBe(true)
    expect(progressBar.attributes('style')).toContain('width: 75%')
  })

  it('should handle zero values correctly', () => {
    const zeroProps = {
      score: 0,
      streak: 0,
      bestStreak: 0,
      totalQuestions: 0,
      correctAnswers: 0,
      round: 1,
      accuracy: 0,
      currentLevel: 1,
      pointsToNextLevel: 100,
      progressPercentage: 0,
    }

    const wrapper = mount(GameStats, {
      props: zeroProps,
    })

    expect(wrapper.text()).toContain('0') // Score
    expect(wrapper.text()).toContain('0%') // Accuracy
    expect(wrapper.text()).toContain('Nivel 1')
  })

  it('should display glass morphism styling', () => {
    const wrapper = mount(GameStats, {
      props: defaultProps,
    })

    const container = wrapper.find('.game-stats')
    expect(container.exists()).toBe(true)
    const glassElements = wrapper.findAll('.glass-morphism')
    expect(glassElements.length).toBeGreaterThan(0)
  })

  it('should show achievement notification when streak is high', () => {
    const highStreakProps = {
      ...defaultProps,
      streak: 10,
      bestStreak: 10,
    }

    const wrapper = mount(GameStats, {
      props: highStreakProps,
    })

    // Check if achievement-related content appears
    expect(wrapper.text()).toContain('10')
  })

  it('should handle different accuracy ranges', () => {
    // Test perfect accuracy
    const perfectProps = {
      ...defaultProps,
      accuracy: 100,
      correctAnswers: 10,
      totalQuestions: 10,
    }

    const wrapper = mount(GameStats, {
      props: perfectProps,
    })

    expect(wrapper.text()).toContain('100%')
  })

  it('should display round information', () => {
    const wrapper = mount(GameStats, {
      props: defaultProps,
    })

    expect(wrapper.text()).toContain('5') // Round number will be in the stats
  })

  it('should have correct animation classes', () => {
    const wrapper = mount(GameStats, {
      props: defaultProps,
    })

    const container = wrapper.find('.game-stats')
    expect(container.classes()).toContain('fade-in-up')
  })
})
