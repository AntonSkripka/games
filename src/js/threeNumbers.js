import ApexCharts from 'apexcharts';

const threeNumForm = document.querySelector('.biggest-num__inputs-form');
const threeNumInputs = document.querySelectorAll('.biggest-num__input');
const threeNumMaxValSpan = document.querySelector('.biggest-num__max-val');

const threeNumChartOptions = {
    series: [{
        name: 'Значення',
        data: [0, 0, 0]
    }],
    chart: {
        type: 'bar',
        height: 280,
        toolbar: { show: false },
        animations: {
            enabled: true,
            easing: 'easeinout',
            speed: 500
        }
    },
    plotOptions: {
        bar: {
            borderRadius: 6,
            distributed: true,
        }
    },
    colors: ['#cbd5e1', '#cbd5e1', '#cbd5e1'],
    xaxis: {
        categories: ['Число 1', 'Число 2', 'Число 3'],
        labels: {
            style: { colors: '#94a3b8', fontSize: '14px' }
        }
    },
    legend: { show: false },
    dataLabels: { enabled: false },
    tooltip: { enabled: false },
    yaxis: { show: false }
};

const threeNumChartInstance = new ApexCharts(document.querySelector("#threeNumChart"), threeNumChartOptions);
threeNumChartInstance.render();

function threeNumHandleInput() {
    const values = Array.from(threeNumInputs).map(input => Number(input.value) || 0);
    const isAllEmpty = Array.from(threeNumInputs).every(input => input.value === '');

    if (isAllEmpty) {
        threeNumMaxValSpan.textContent = '(число)';
    } else {
        const max = Math.max(...values);
        threeNumMaxValSpan.textContent = max;
    }

    const currentMax = Math.max(...values);
    const defaultColor = '#cbd5e1';
    const activeColor = '#6366f1';

    const newColors = values.map(val => {
        if (currentMax === 0 && values.every(v => v === 0)) return defaultColor;
        return val === currentMax ? activeColor : defaultColor;
    });

    threeNumChartInstance.updateOptions({
        series: [{
            data: values
        }],
        colors: newColors
    });
}

threeNumForm.addEventListener('submit', (e) => e.preventDefault());
threeNumForm.addEventListener('input', threeNumHandleInput);