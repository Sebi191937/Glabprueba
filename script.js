// Variables globales
const consoles = {
    Xbox: Array(4).fill('Desocupada'),
    PlayStation: Array(4).fill('Desocupada'),
    PC: Array(2).fill('Desocupada')
};

let reservations = JSON.parse(localStorage.getItem('reservations')) || [];

// Funciones de interacción
function toggleMenu() {
    const menu = document.getElementById('menu');
    menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
}

function showSection(section) {
    document.querySelectorAll('.section').forEach(s => s.classList.add('hidden'));
    document.getElementById(section).classList.remove('hidden');
    toggleMenu(); // Cierra el menú al cambiar de sección
}

function submitReservation(event) {
    event.preventDefault();
    const name = document.getElementById('name').value;
    const consola = document.getElementById('consola').value;
    const hora = document.getElementById('hora').value;
    
    const reservation = { name, consola, hora, date: new Date() };
    reservations.push(reservation);
    localStorage.setItem('reservations', JSON.stringify(reservations));
    displayReservations();
    document.getElementById('reservation-message').textContent = 'Reserva realizada';
}

function displayReservations() {
    const list = document.getElementById('reservations-list');
    list.innerHTML = '';
    reservations.forEach(reservation => {
        const div = document.createElement('div');
        div.textContent = `${reservation.name} - ${reservation.consola} - ${reservation.hora}`;
        list.appendChild(div);
    });
}

function checkPassword() {
    const password = document.getElementById('password').value;
    const correctPassword = 'admin'; // Cambia esto a la contraseña real
    if (password === correctPassword) {
        document.getElementById('admin-section').classList.remove('hidden');
        loadConsoleStatus();
    } else {
        alert('Contraseña incorrecta');
    }
}

function loadConsoleStatus() {
    const consoleStatusDiv = document.getElementById('console-status');
    consoleStatusDiv.innerHTML = '';
    ['Xbox', 'PlayStation', 'PC'].forEach(consoleType => {
        consoles[consoleType].forEach((status, index) => {
            const select = document.createElement('select');
            select.innerHTML = `<option value="Desocupada" ${status === 'Desocupada' ? 'selected' : ''}>Desocupada</option>
                                <option value="Ocupada" ${status === 'Ocupada' ? 'selected' : ''}>Ocupada</option>`;
            select.addEventListener('change', (e) => updateConsoleStatus(consoleType, index, e.target.value));
            const label = document.createElement('label');
            label.textContent = `${consoleType} ${index + 1}: `;
            consoleStatusDiv.appendChild(label);
            consoleStatusDiv.appendChild(select);
        });
    });
}

function updateConsoleStatus(consoleType, index, status) {
    consoles[consoleType][index] = status;
    localStorage.setItem('consoles', JSON.stringify(consoles));
    updatePublicStatus();
}

function updatePublicStatus() {
    const statusList = document.getElementById('status-list');
    statusList.innerHTML = '';
    ['Xbox', 'PlayStation', 'PC'].forEach(consoleType => {
        consoles[consoleType].forEach((status, index) => {
            const div = document.createElement('div');
            div.textContent = `${consoleType} ${index + 1}: ${status}`;
            div.className = `status ${status.toLowerCase()}`;
            statusList.appendChild(div);
        });
    });
}

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    updatePublicStatus();
    displayReservations();
});
