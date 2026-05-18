import { gsap } from 'gsap';

document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('.time-calculator-form');
    const input = document.querySelector('.time-calculator-form__input');
    const button = document.querySelector('.time-calculator-form__button');
    const resultSpan = document.querySelector('.time-calculator__result');

    const hourHand = document.getElementById('hourHand');
    const minuteHand = document.getElementById('minuteHand');
    function calculateTime() {
        const totalMinutes = parseInt(input.value, 10);

        if (isNaN(totalMinutes) || totalMinutes < 0) {
            resultSpan.textContent = '0 год . 0 хв';
            gsap.to([hourHand, minuteHand], { rotation: 0, duration: 1, ease: 'back.out(1.7)' });
            return;
        }

        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;
        resultSpan.textContent = `${hours} год . ${minutes} хв`;

        const minuteAngle = totalMinutes * 6;
        const hourAngle = totalMinutes * 0.5;

        gsap.to(minuteHand, {
            rotation: minuteAngle,
            svgOrigin: "100 100",
            duration: 2.0,
            ease: "power2.out",
            overwrite: "auto"
        });

        gsap.to(hourHand, {
            rotation: hourAngle,
            svgOrigin: "100 100",
            duration: 2.0,
            ease: "power2.out",
            overwrite: "auto"
        });
    }

    button.addEventListener('click', (e) => {
        e.preventDefault();
        calculateTime();
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        calculateTime();
    });
});