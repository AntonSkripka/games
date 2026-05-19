import { unlockAchievement } from './achievements.js'

/**
 * Додати цей код у dino.js
 */
function dinoGameExample() {
	const username = localStorage.getItem('headerName')

	// При завершенні першої гри
	function onGameComplete(score) {
		// Досягнення: Завершити першу гру
		unlockAchievement(username, 'dino', 'first_game')

		// Досягнення: Набрати 100 балів
		if (score >= 100) {
			unlockAchievement(username, 'dino', 'score_100')
		}

		if (score >= 500) {
			unlockAchievement(username, 'dino', 'score_500')
		}
	}

}

// ============================================================
// ЗАГАЛЬНА ФУНКЦІЯ ДЛЯ ОТРИМАННЯ СТАТИСТИКИ
// ============================================================

import { getAchievementsStats } from './achievements.js'

function showAchievementsStats() {
	const username = localStorage.getItem('headerName')
	if (!username) return

	const stats = getAchievementsStats(username)
	console.log(`Досягнення: ${stats.unlocked}/${stats.total} (${stats.percentage}%)`)
	// stats = { total: 21, unlocked: 5, percentage: 24 }
}

export {
	dinoGameExample,
	showAchievementsStats,
}
