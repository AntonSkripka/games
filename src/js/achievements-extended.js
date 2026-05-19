import {
	getAchievements,
	saveAchievements,
	getAchievementsStorageKey,
	renderAchievements,
} from './achievements.js'

function unlockAllAchievements(username) {
	if (!username) return

	const achievements = getAchievements(username)
	const timestamp = new Date().toISOString()

	Object.values(achievements).forEach(gameAchievements => {
		Object.values(gameAchievements).forEach(achievement => {
			achievement.unlocked = true
			achievement.timestamp = timestamp
		})
	})

	saveAchievements(username, achievements)
	renderAchievements(username)

	console.log(`✓ Всі досягнення розблоковані для ${username}`)
}

function lockAchievement(username, gameId, achievementId) {
	if (!username) return

	const achievements = getAchievements(username)

	if (achievements[gameId] && achievements[gameId][achievementId]) {
		achievements[gameId][achievementId].unlocked = false
		achievements[gameId][achievementId].timestamp = null

		saveAchievements(username, achievements)
		renderAchievements(username)

		console.log(`✓ Досягнення заблоковане: ${gameId}/${achievementId}`)
	}
}

function lockAllAchievements(username) {
	if (!username) return

	const achievements = getAchievements(username)

	Object.values(achievements).forEach(gameAchievements => {
		Object.values(gameAchievements).forEach(achievement => {
			achievement.unlocked = false
			achievement.timestamp = null
		})
	})

	saveAchievements(username, achievements)
	renderAchievements(username)

	console.log(`✓ Всі досягнення заблоковані для ${username}`)
}


export {
	unlockAllAchievements,
	lockAchievement,
	lockAllAchievements
}
