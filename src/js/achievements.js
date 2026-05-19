const ACHIEVEMENTS_CONFIG = {
	dino: {
		first_game: {
			title: 'Перша гра',
			description: 'Завершити першу гру в динозаврі',
			icon: 'lock',
		},
		score_100: {
			title: '100 балів',
			description: 'Набрати 100 балів в динозаврі',
			icon: 'lock',
		},
		score_500: {
			title: '500 балів',
			description: 'Набрати 500 балів в динозаврі',
			icon: 'lock',
		},
	},
	guessNumber: {
		first_guess: {
			title: 'Перша спроба',
			description: 'Вгадати число з першої спроби',
			icon: 'lock',
		},
		lucky: {
			title: 'Везучий',
			description: 'Вгадати число за 2 ходи',
			icon: 'lock',
		},
		detective: {
			title: 'Детектив',
			description: 'Вгадати число за 5 ходів',
			icon: 'lock',
		},
	},
	rpsGame: {
		first_win: {
			title: 'Перша перемога',
			description: 'Виграти першу гру в камінь-ножиці-папір',
			icon: 'lock',
		},
		five_wins: {
			title: '5 перемог',
			description: 'Виграти 5 ігор підряд в камінь-ножиці-папір',
			icon: 'lock',
		},
		master: {
			title: 'Майстер',
			description: 'Виграти 10 ігор',
			icon: 'lock',
		},
	},
	threeNumbers: {
		first_combo: {
			title: 'Перша комбінація',
			description: 'Створити першу комбінацію в Три Числа',
			icon: 'lock',
		},
		sum_100: {
			title: 'Сотня',
			description: 'Набрати суму 100',
			icon: 'lock',
		},
		perfect: {
			title: 'Ідеальна гра',
			description: 'Набрати суму 500',
			icon: 'lock',
		},
	},
	calculator: {
		first_calc: {
			title: 'Перший розрахунок',
			description: 'Виконати перший розрахунок',
			icon: 'lock',
		},
		hundred_calcs: {
			title: 'Калькулятор',
			description: 'Виконати 100 розрахунків',
			icon: 'lock',
		},
	},
	yearCheck: {
		first_check: {
			title: 'Перевірка року',
			description: 'Перевірити рік на високосність',
			icon: 'lock',
		},
		leap_found: {
			title: 'Знайдено',
			description: 'Знайти перший високосний рік',
			icon: 'lock',
		},
	},
	timeCalc: {
		first_time: {
			title: 'Перший час',
			description: 'Виконати перший розрахунок часу',
			icon: 'lock',
		},
	},
}

const SVG_ICONS = {

    lock: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="40" height="40">
        <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
    </svg>`,

    unlock: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="40" height="40">
        <path d="M12 17c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm6-9h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6h1.9c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm0 12H6V10h12v10z"/>
    </svg>`,
}

function getAchievementsStorageKey(username) {
	return `achievements_${username}`
}

function initAchievements(username) {
    if (!username) return

    const storageKey = getAchievementsStorageKey(username)
    const existingData = localStorage.getItem(storageKey)

    if (existingData) return

    const defaultAchievements = {}

    Object.entries(ACHIEVEMENTS_CONFIG).forEach(([gameId, achievements]) => {
        defaultAchievements[gameId] = {}
        Object.keys(achievements).forEach((achievementId) => {
            defaultAchievements[gameId][achievementId] = {
                id: achievementId,
                unlocked: false,
                timestamp: null,
            }
        })
    })

    localStorage.setItem(storageKey, JSON.stringify(defaultAchievements))
}

function getAchievements(username) {
	if (!username) return {}

	const storageKey = getAchievementsStorageKey(username)
	const data = localStorage.getItem(storageKey)

	if (!data) {
		initAchievements(username)
		return getAchievements(username)
	}

	try {
		return JSON.parse(data)
	} catch (error) {
		console.error('Помилка при парсингу досягнень:', error)
		return {}
	}
}

function getGameAchievements(username, gameId) {
	const allAchievements = getAchievements(username)
	return allAchievements[gameId] || {}
}

function saveAchievements(username, achievements) {
	if (!username) return

	const storageKey = getAchievementsStorageKey(username)
	localStorage.setItem(storageKey, JSON.stringify(achievements))
}

function unlockAchievement(username, gameId, achievementId) {
	if (!username) {
		console.warn('Користувач не авторизований')
		return false
	}

	const achievements = getAchievements(username)

	if (!achievements[gameId] || !achievements[gameId][achievementId]) {
		console.warn(`Досягнення не знайдено: ${gameId}/${achievementId}`)
		return false
	}

	if (achievements[gameId][achievementId].unlocked) {
		return false
	}

	achievements[gameId][achievementId].unlocked = true
	achievements[gameId][achievementId].timestamp = new Date().toISOString()

	saveAchievements(username, achievements)

	renderAchievements(username)

	return true
}

function getAchievementsStats(username) {
	const achievements = getAchievements(username)
	let total = 0
	let unlocked = 0

	Object.values(achievements).forEach(gameAchievements => {
		Object.values(gameAchievements).forEach(achievement => {
			total++
			if (achievement.unlocked) unlocked++
		})
	})

	return {
		total,
		unlocked,
		percentage: total > 0 ? Math.round((unlocked / total) * 100) : 0,
	}
}

function getAchievementIcon(unlocked) {
	return unlocked ? SVG_ICONS.unlock : SVG_ICONS.lock
}

function createAchievementCard(gameId, achievement) {
    const baseClass = 'our-team__item'
    const statusClass = achievement.unlocked ? 'unlocked' : 'locked'
    const icon = getAchievementIcon(achievement.unlocked)

    const configData = ACHIEVEMENTS_CONFIG[gameId]?.[achievement.id] || {};
    const title = configData.title || achievement.title || 'Секретне досягнення';
    const description = configData.description || achievement.description || '';

    return `
        <li class="${baseClass} ${statusClass}" data-achievement-id="${achievement.id}">
            <div class="our-team__icon">
                ${icon}
            </div>
            <h3 class="our-team__name">${title}</h3>
            <p class="our-team__work">${description}</p>
        </li>
    `
}

function renderAchievements(username) {
    if (!username) return;

    const sliderElement = document.querySelector('[data-slider]');
    if (!sliderElement) return;

    const achievements = getAchievements(username);
    let html = '';

    Object.entries(achievements).forEach(([gameId, gameAchievements]) => {
        Object.values(gameAchievements).forEach(achievement => {
            html += createAchievementCard(gameId, achievement);
        });
    });

    sliderElement.innerHTML = html;

    if (window.mySlider && typeof window.mySlider.calculateDimensions === 'function') {
        window.mySlider.calculateDimensions();
    }
}

function updateAchievementsOnAuthChange() {
    const username = localStorage.getItem('headerName');

    const sliderWindow = document.querySelector('[data-slider-window]');
    const arrowLeft = document.querySelector('.our-team__arrleft');
    const arrowRight = document.querySelector('.our-team__arrright');
    const paginationContainer = document.querySelector('[data-slider-pagination]');
    const placeholder = document.querySelector('.our-team__placeholder');

    if (username) {
        if (sliderWindow) sliderWindow.style.display = '';
        if (arrowLeft) arrowLeft.style.display = '';
        if (arrowRight) arrowRight.style.display = '';
        if (paginationContainer) paginationContainer.style.display = '';
        
        if (placeholder) placeholder.remove();

        initAchievements(username);
        renderAchievements(username);
    } else {
        if (window.mySlider && typeof window.mySlider.showAuthPlaceholder === 'function') {
            window.mySlider.showAuthPlaceholder();
        }
    }

    if (typeof Slider !== 'undefined') {
        window.mySlider = new Slider();
    }
}

document.addEventListener('DOMContentLoaded', () => {
	const username = localStorage.getItem('headerName')
	if (username) {
		initAchievements(username)
		renderAchievements(username)
	}
})

export {
	unlockAchievement,
	getAchievements,
	getGameAchievements,
	getAchievementsStats,
	initAchievements,
	renderAchievements,
	updateAchievementsOnAuthChange,
}

if (typeof window !== 'undefined') {
    window.unlockAchievement = unlockAchievement;
    window.initAchievements = initAchievements;
    window.renderAchievements = renderAchievements;
}