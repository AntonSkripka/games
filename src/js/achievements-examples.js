import { unlockAchievement } from './achievements.js'

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
	showAchievementsStats,
}
