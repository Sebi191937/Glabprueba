// Variables globales
const consoles = {
    "Xbox Series 1": Array(1).fill('Desocupada'),
    "Xbox Series 2": Array(1).fill('Desocupada'),
    "Xbox Series 3": Array(1).fill('Desocupada'),
    "PlayStation 5 1": Array(1).fill('Desocupada'),
    "PlayStation 5 2": Array(1).fill('Desocupada'),
    "PlayStation 5 3": Array(1).fill('Desocupada'),
    "Xbox Series X TV": Array(1).fill('Desocupada'),
    "PlayStation 5 TV": Array(1).fill('Desocupada'),
    "PC 2060": Array(1).fill('Desocupada'),
    "PC 4060Ti": Array(1).fill('Desocupada')
};

let reservations = JSON.parse(localStorage.getItem('reservations')) || [];

// Función para eliminar reservas con más de una semana de antigüedad
function cleanOldReservations() {
    const oneWeekInMillis = 7 * 24 * 60 * 60 * 1000; // Una semana en milisegundos
    const now = new Date();
    reservations = reservations.filter(reservation => {
        const reservationDate = new Date(reservation.date);
        return now - reservationDate < oneWeekInMillis;
    });
    localStorage.setItem('reservations', JSON.stringify(reservations));
}

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

    // Verificar si la consola ya está reservada en ese horario
    const conflict = reservations.some(reservation =>
        reservation.consola === consola && reservation.hora === hora
    );

    if (conflict) {
        document.getElementById('reservation-message').textContent = 
            'Error: Esta consola ya está reservada para este horario.';
        return;
    }

    const reservation = { name, consola, hora, date: new Date() };
    reservations.push(reservation);
    localStorage.setItem('reservations', JSON.stringify(reservations));

    // Actualizar estado de la consola
    const consoleIndex = consoles[consola].findIndex(status => status === 'Desocupada');
    if (consoleIndex !== -1) {
        consoles[consola][consoleIndex] = `Ocupada (${hora})`;
        localStorage.setItem('consoles', JSON.stringify(consoles));
    }

    displayReservations();
    updatePublicStatus();
    document.getElementById('reservation-message').textContent = 'Reserva realizada con éxito.';
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
                                <option value="Ocupada" ${status.startsWith('Ocupada') ? 'selected' : ''}>Ocupada</option>`;
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
    Object.keys(consoles).forEach(consoleType => {
        consoles[consoleType].forEach((status, index) => {
            const div = document.createElement('div');
            div.textContent = `${consoleType} ${index + 1}: ${status}`;
            
            // Cambiar la clase en función del estado
            if (status === 'Desocupada') {
                div.className = 'status desocupada'; // Estado verde
            } else if (status === 'Ocupada') {
                div.className = 'status ocupada'; // Estado rojo
            }

            statusList.appendChild(div);
        });
    });
}


function loadConsoleStatus() {
    const consoleStatusDiv = document.getElementById('console-status');
    consoleStatusDiv.innerHTML = '';
    Object.keys(consoles).forEach(consoleType => {
        consoles[consoleType].forEach((status, index) => {
            const select = document.createElement('select');
            select.innerHTML = `<option value="Desocupada" ${status === 'Desocupada' ? 'selected' : ''}>Desocupada</option>
                                <option value="Ocupada" ${status.startsWith('Ocupada') ? 'selected' : ''}>Ocupada</option>`;
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

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    cleanOldReservations(); // Limpiar reservas antiguas al cargar la página
    updatePublicStatus();
    displayReservations();
});
