const scientists = [
    { name: 'Albert', surname: 'Einstein', born: 1879, dead: 1955, id: 1 },
    { name: 'Isaac', surname: 'Newton', born: 1643, dead: 1727, id: 2 },
    { name: 'Galileo', surname: 'Galilei', born: 1564, dead: 1642, id: 3 },
    { name: 'Marie', surname: 'Curie', born: 1867, dead: 1934, id: 4 },
    { name: 'Johannes', surname: 'Kepler', born: 1571, dead: 1630, id: 5 },
    { name: 'Nicolaus', surname: 'Copernicus', born: 1473, dead: 1543, id: 6 },
    { name: 'Max', surname: 'Planck', born: 1858, dead: 1947, id: 7 },
    { name: 'Katherine', surname: 'Blodgett', born: 1898, dead: 1979, id: 8 },
    { name: 'Ada', surname: 'Lovelace', born: 1815, dead: 1852, id: 9 },
    { name: 'Sarah E.', surname: 'Goode', born: 1855, dead: 1905, id: 10 },
    { name: 'Lise', surname: 'Meitner', born: 1878, dead: 1968, id: 11 },
    { name: 'Hanna', surname: 'Hammarström', born: 1829, dead: 1909, id: 12 }
];

const cards = document.querySelectorAll('.scientist__card');
const buttons = document.querySelectorAll('.scientist__button'); // Используем для управления классами
const buttonsList = document.querySelector('#listBtn');

let filteredScientists = [...scientists];

function renderScientists(data) {
    cards.forEach((card, index) => {
        if (data[index]) {
            card.textContent = `${data[index].name} ${data[index].surname} (${data[index].born} - ${data[index].dead})`;
        } else {
            card.textContent = '';
        }
    });
}

renderScientists(scientists);

buttonsList.addEventListener("click", (e) => {
    if (e.target === e.currentTarget || !e.target.dataset.action) return;

    const action = e.target.dataset.action;

    if (action === "reset") {
        buttons.forEach(btn => btn.classList.remove('scientist__button--active'));
    } else if (action === "sort-alpha") {
        e.target.classList.add('scientist__button--active');
    } else {
        buttons.forEach(btn => btn.classList.remove('scientist__button--active'));
        e.target.classList.add('scientist__button--active');
    }

    switch (action) {
        case "born-19":
            filteredScientists = scientists.filter((el) => el.born >= 1801 && el.born <= 1900);
            break;
        case "einstein-birth":
            filteredScientists = scientists.filter((el) => el.born === 1879);
            break;
        case "sort-alpha":
            filteredScientists = [...filteredScientists].sort((a, b) => a.name.localeCompare(b.name));
            break;
        case "surname-c":
            filteredScientists = scientists.filter((el) => el.surname.startsWith("C"));
            break;
        case "sort-age":
            filteredScientists = scientists
                .map(scientist => ({ ...scientist, age: scientist.dead - scientist.born }))
                .sort((a, b) => a.age - b.age);
            break;
        case "remove-a":
            filteredScientists = scientists.filter((el) => !el.name.startsWith("A"));
            break;
        case "youngest":
            const youngest = scientists.reduce((latest, current) => current.born > latest.born ? current : latest);
            filteredScientists = [youngest];
            break;
        case "longest-shortest":
            const sortedByAge = scientists.toSorted((a, b) => (a.dead - a.born) - (b.dead - b.born));
            filteredScientists = [sortedByAge[0], sortedByAge[sortedByAge.length - 1]];
            break;
        case "matching-letters":
            filteredScientists = scientists.filter((el) => el.name[0] === el.surname[0]);
            break;
        case "reset":
            filteredScientists = [...scientists];
            break;
    }

    renderScientists(filteredScientists);
});