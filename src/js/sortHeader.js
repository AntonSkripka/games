const filterBtns = document.querySelectorAll('#btnFilter')
const sections = document.querySelectorAll('section')

const withoutFilter = () => {
	sections.forEach(section => {
		section.style.display = 'block'
	})
}

const filterSections = data => {
	if (data === 'without-filter') {
		withoutFilter()
	} else {
		sections.forEach(section => {
			const dataSection = section.dataset.section
			section.style.display = 'none'
			if (dataSection === data) {
				section.style.display = 'block'
			}
		})
	}
}

filterBtns.forEach(btn => {
	btn.addEventListener('click', () => {
		filterSections(btn.dataset.filter)
	})
})