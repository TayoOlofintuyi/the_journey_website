console.log("Calendar script loaded");
const date = new Date();
const year = date.getFullYear();
const month = date.getMonth();
const day = document.querySelector(".month-dates");
const current = document.querySelector(".month-name");

const months = [
    "January", "February", "March", "April", "May", "June", 
    "July", "August", "September", "October", "November", "December"
];

const generate = () => {
    const firstday = new Date(year, month, 1).getDay();
    const lastday = new Date(year, month + 1, 0).getDate();
    const ldayd = new Date(year, month, lastday).getDay();
    const prevlstday = new Date(year, month, 0).getDate();
    let td = "";
    let weekRow = "<tr>";

    // Previous month's days
    for (let i = firstday; i > 0; i--) {
        weekRow += `<td class="inactive">${prevlstday - i + 1}</td>`;
    }

    // Current month's days
    for (let i = 1; i <= lastday; i++) {
        const isToday = (i === date.getDate() && month === new Date().getMonth() && year === new Date().getFullYear()) ? "active" : "";
        weekRow += `<td class="${isToday}">${i}</td>`;

        // Start a new row if it's the end of the week
        if ((firstday + i) % 7 === 0) {
            weekRow += "</tr><tr>"; // Close current row and start a new one
        }
    }

    // Next month's days
    for (let i = ldayd + 1; i <= 6; i++) {
        weekRow += `<td class="inactive">${i - ldayd}</td>`;
    }

    weekRow += "</tr>"; // Close the last row

    current.innerHTML = `<th colspan="7">${months[month]} ${year}</th>`;
    day.innerHTML = weekRow; // Populate the dates
};

generate();