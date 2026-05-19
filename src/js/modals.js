import { ModalManager } from './ModalManager.js'
import { updateAchievementsOnAuthChange } from './achievements.js'

const modals = new ModalManager()

const authModalForm = document.querySelector('.header__modal-form')
const footerEmailForm = document.getElementById('emailForm')
const userName = document.querySelector('#userName')
const authBtn = document.querySelector('#logout')

const setLocalStorage = (name, value) => {
	localStorage.setItem(name, value)
}

const updateAuthUI = (name) => {
	if (name) {
		userName.textContent = name
		if (authBtn) authBtn.textContent = 'Вийти'
	} else {
		userName.textContent = 'User'
		if (authBtn) authBtn.textContent = 'Увійти'
	}
}

const savedName = localStorage.getItem('headerName')
if (savedName) {
	updateAuthUI(savedName)
} else {
	updateAuthUI('')
	modals.open('header')
}

if (authBtn) {
	authBtn.addEventListener('click', () => {
		const isAuthorized = !!localStorage.getItem('headerName')

		if (isAuthorized) {
			setLocalStorage('headerName', '')
			updateAuthUI('')
			updateAchievementsOnAuthChange()
		} else {
			modals.open('header')
		}
	})
}

if (authModalForm) {
	authModalForm.addEventListener('submit', e => {
		e.preventDefault()
		const inputName = e.target.elements.headerName.value.trim()
		
		if (inputName) {
			modals.close('header')
			setLocalStorage('headerName', inputName)
			updateAuthUI(inputName)
			updateAchievementsOnAuthChange()
			authModalForm.reset()
		}
	})
}


if (footerEmailForm) {
	footerEmailForm.addEventListener('submit', (e) => {
		e.preventDefault()
		if (footerEmailForm.checkValidity()) {
			modals.open('footer')
			footerEmailForm.reset()
		} else {
			footerEmailForm.reportValidity()
		}
	})
}