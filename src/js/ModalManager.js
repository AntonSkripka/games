export class ModalManager {
	constructor() {
		this.init()
	}

	init() {
		document.addEventListener('click', this.handleClick.bind(this))
		document.addEventListener('keydown', this.handleKeyDown.bind(this))
	}

	open(id) {
		const modal = document.querySelector(`[data-modal="${id}"]`)
		if (!modal) return

		modal.classList.remove('is-hidden')
		document.body.classList.add('no-scroll')
	}

	close(id) {
		const modal = document.querySelector(`[data-modal="${id}"]`)
		if (!modal) return

		modal.classList.add('is-hidden')
		
		const anyOpen = document.querySelector('[data-modal]:not(.is-hidden)')
		if (!anyOpen) document.body.classList.remove('no-scroll')
	}

	handleClick(e) {
		const openBtn = e.target.closest('[data-modal-open]')
		const closeBtn = e.target.closest('[data-modal-close]')
		
		if (openBtn) {
			this.open(openBtn.dataset.modalOpen)
		} else if (closeBtn) {
			this.close(closeBtn.dataset.modalClose)
		} else if (e.target.hasAttribute('data-modal')) {
			this.close(e.target.dataset.modal)
		}
	}

	handleKeyDown(e) {
		if (e.key !== 'Escape') return
		const openModals = document.querySelectorAll('[data-modal]:not(.is-hidden)')
		if (openModals.length > 0) {
			this.close(openModals[openModals.length - 1].dataset.modal)
		}
	}
}

