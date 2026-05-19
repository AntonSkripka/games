class Slider {
    constructor() {
        this.container = document.querySelector('.our-team__container') 
        this.slider = document.querySelector('[data-slider]')
        this.sliderWindow = document.querySelector('[data-slider-window]')
        this.arrowLeft = document.querySelector('.our-team__arrleft')
        this.arrowRight = document.querySelector('.our-team__arrright')
        this.paginationContainer = document.querySelector('[data-slider-pagination]')

        const username = localStorage.getItem('headerName')
        if (!username) {
            this.showAuthPlaceholder()
            return
        }

        if (!this.slider || !this.sliderWindow) return

        this.currentPosition = 0
        this.itemWidth = 0
        this.gap = 0 
        this.totalItems = 0
        this.itemsPerPage = 1

        this.init()
    }

    showAuthPlaceholder() {
        if (this.sliderWindow) this.sliderWindow.style.display = 'none';
        if (this.arrowLeft) this.arrowLeft.style.display = 'none';
        if (this.arrowRight) this.arrowRight.style.display = 'none';
        if (this.paginationContainer) this.paginationContainer.style.display = 'none';

        const placeholder = document.createElement('div');
        placeholder.className = 'our-team__placeholder';
        placeholder.innerHTML = `
            <p class="our-team__placeholder-text">
                🏅 Досягнення доступні тільки для авторизованих гравців.<br>
                Будь ласка, увійдіть у свій акаунт, щоб відстежувати свій прогрес!
            </p>
        `;
        if (this.container) {
            this.container.appendChild(placeholder);
        }
    }

    init() {
        this.calculateDimensions()
        this.attachEventListeners()
        
        const resizeObserver = new ResizeObserver(() => {
            this.calculateDimensions()
            this.updateSlider()
        })
        resizeObserver.observe(this.sliderWindow)
    }

    calculateDimensions() {
        const items = this.slider.querySelectorAll('[data-achievement-id], li')
        this.totalItems = items.length

        if (this.totalItems === 0) return

        const firstItem = items[0]
        this.itemWidth = firstItem.offsetWidth

        const computedStyle = window.getComputedStyle(this.slider)
        this.gap = parseFloat(computedStyle.gap) || parseFloat(computedStyle.columnGap) || 0

        const windowWidth = this.sliderWindow.offsetWidth
        this.itemsPerPage = Math.floor((windowWidth + this.gap) / (this.itemWidth + this.gap)) || 1

        this.createPagination()
        this.updateArrows()
    }

    createPagination() {
        if (!this.paginationContainer) return

        this.paginationContainer.innerHTML = ''
        const totalPages = Math.max(1, this.totalItems - this.itemsPerPage + 1)

        if (this.totalItems <= this.itemsPerPage) return

        for (let i = 0; i < totalPages; i++) {
            const button = document.createElement('button')
            button.type = 'button'
            button.className = 'our-team__pagination-item'
            if (i === this.currentPosition) button.classList.add('active')
            
            button.addEventListener('click', () => this.goToPage(i))
            this.paginationContainer.appendChild(button)
        }
    }

    attachEventListeners() {
        this.arrowLeft?.addEventListener('click', () => this.slideLeft())
        this.arrowRight?.addEventListener('click', () => this.slideRight())
    }

    slideLeft() {
        if (this.currentPosition > 0) {
            this.currentPosition--
            this.updateSlider()
        }
    }

    slideRight() {
        const maxPosition = this.totalItems - this.itemsPerPage
        if (this.currentPosition < maxPosition) {
            this.currentPosition++
            this.updateSlider()
        }
    }

    goToPage(pageIndex) {
        this.currentPosition = pageIndex
        this.updateSlider()
    }

    updateSlider() {
        const stepWidth = this.itemWidth + this.gap
        const offset = this.currentPosition * stepWidth
        
        this.slider.style.transform = `translateX(-${offset}px)`
        
        this.updatePagination()
        this.updateArrows()
    }

    updatePagination() {
        if (!this.paginationContainer) return

        this.paginationContainer.querySelectorAll('.our-team__pagination-item').forEach((btn, index) => {
            btn.classList.toggle('active', index === this.currentPosition)
        })
    }

    updateArrows() {
        const maxPosition = this.totalItems - this.itemsPerPage
        
        const setArrowState = (arrow, isActive) => {
            if (arrow) {
                arrow.style.opacity = isActive ? '1' : '0.3'
                arrow.style.pointerEvents = isActive ? 'auto' : 'none'
            }
        }

        setArrowState(this.arrowLeft, this.currentPosition > 0)
        setArrowState(this.arrowRight, this.currentPosition < maxPosition && maxPosition > 0)
    }

    reset() {
        this.currentPosition = 0
        this.updateSlider()
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.mySlider = new Slider();
    });
} else {
    window.mySlider = new Slider();
}