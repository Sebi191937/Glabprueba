// Variables globales
let reservations = JSON.parse(localStorage.getItem('reservations')) || [];
let consoleStatus = {
    "Xbox Series 1": "Disponible",
    "Xbox Series 2": "Disponible",
    "PlayStation 5 1": "Disponible",
    "PC 4060Ti": "Disponible"
};

// Variables de estado de las consolas
let consoles = {
    "Xbox Series 1": { status: "Disponible", id: "xbox1" },
    "Xbox Series 2": { status: "Disponible", id: "xbox2" },
    "PlayStation 5 1": { status: "Disponible", id: "ps51" },
    "PC 4060Ti": { status: "Disponible", id: "pc4060" }
};

// Función para alternar el menú
function toggleMenu() {
    document.getElementById('menu').classList.toggle('hidden');
}

// Función para mostrar secciones
function showSection(sectionId) {
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => section.classList.add('hidden'));
    document.getElementById(sectionId).classList.remove('hidden');
}

// Función para mostrar el estado público de las consolas
function displayPublicStatus() {
    const publicStatus = document.getElementById('public-status');
    publicStatus.innerHTML = '';
    for (let consola in consoleStatus) {
        const status = document.createElement('div');
        status.textContent = `${consola}: ${consoleStatus[consola]}`;
        publicStatus.appendChild(status);
    }
}

// Función para mostrar el estado privado y las reservas
function displayPrivateStatus() {
    const privateStatus = document.getElementById('private-status');
    privateStatus.innerHTML = `
        <h3>Estado de Consolas - Privado</h3>
        ${Object.keys(consoles).map(consola => `
            <div>
                <label for="${consola}">${consola}</label>
                <select id="${consola}" onchange="updateConsoleStatus('${consola}')">
                    <option value="Disponible" ${consoles[consola].status === "Disponible" ? 'selected' : ''}>Disponible</option>
                    <option value="Ocupada" ${consoles[consola].status === "Ocupada" ? 'selected' : ''}>Ocupada</option>
                </select>
            </div>
        `).join('')}
    `;
    displayReservations();
}

// Función para actualizar el estado de una consola
function updateConsoleStatus(consola) {
    const newStatus = document.getElementById(consola).value;
    consoles[consola].status = newStatus;
    consoleStatus[consola] = newStatus;
    displayPublicStatus();
    displayPrivateStatus();
}

// Función para verificar disponibilidad de la consola
function checkConsoleAvailability(consola) {
    if (consoles[consola].status === "Ocupada") {
        return false;
    }
    return true;
}

// Función para reservar una consola
function reserveConsole(name, consola, hour) {
    if (!checkConsoleAvailability(consola)) {
        return false;
    }

    const reservation = { name, consola, hour, date: new Date().toISOString() };
    reservations.push(reservation);
    localStorage.setItem('reservations', JSON.stringify(reservations));

    // Cambiar el estado de la consola a ocupada
    consoles[consola].status = "Ocupada";
    consoleStatus[consola] = "Ocupada";

    displayPublicStatus();
    displayPrivateStatus();

    return true;
}

// Función para enviar la reserva
function submitReservation(event) {
    event.preventDefault();

    const name = document.getElementById('name').value;
    const consola = document.getElementById('consola').value;
    const hour = document.getElementById('hora').value;

    const success = reserveConsole(name, consola, hour);

    if (success) {
        document.getElementById('reservation-message').textContent = `Reserva hecha para ${name} en ${hour}.`;
    } else {
        document.getElementById('reservation-message').textContent = "Error: Esta consola ya está ocupada.";
    }
}

// Función para mostrar todas las reservas
function displayReservations() {
    const reservationsList = document.getElementById('reservations-list');
    reservationsList.innerHTML = '';
    reservations.forEach(reservation => {
        const reservationElement = document.createElement('div');
        reservationElement.textContent = `${reservation.name} reservó ${reservation.consola} a las ${reservation.hour}.`;
        reservationsList.appendChild(reservationElement);
    });
}

// Función para eliminar una reserva
function deleteReservation(reservationId) {
    const updatedReservations = reservations.filter(reservation => reservation.id !== reservationId);
    reservations = updatedReservations;
    localStorage.setItem('reservations', JSON.stringify(reservations));
    displayReservations();
}

// Función para filtrar reservas
function filterReservations(criteria) {
    const filteredReservations = reservations.filter(reservation => reservation.consola === criteria);
    displayFilteredReservations(filteredReservations);
}

// Función para mostrar reservas filtradas
function displayFilteredReservations(filteredReservations) {
    const reservationsList = document.getElementById('reservations-list');
    reservationsList.innerHTML = '';
    filteredReservations.forEach(reservation => {
        const reservationElement = document.createElement('div');
        reservationElement.textContent = `${reservation.name} reservó ${reservation.consola} a las ${reservation.hour}.`;
        reservationsList.appendChild(reservationElement);
    });
}

// Función para actualizar el estado de la consola y reservas cuando se reinicia la página
function initializeStatusFromLocalStorage() {
    const storedConsoles = JSON.parse(localStorage.getItem('consoles'));
    if (storedConsoles) {
        consoles = storedConsoles;
    }
    displayPublicStatus();
    displayPrivateStatus();
}

// Función para guardar el estado en el almacenamiento local
function saveConsoleState() {
    localStorage.setItem('consoles', JSON.stringify(consoles));
}

// Función para actualizar la interfaz
function updateInterface() {
    displayPublicStatus();
    displayPrivateStatus();
    displayReservations();
}

// Función para cargar todos los datos al inicio
document.addEventListener('DOMContentLoaded', () => {
    initializeStatusFromLocalStorage();
    updateInterface();
});

// Función para cambiar el estado de las consolas cuando se hace una reserva
document.getElementById('reservation-form').addEventListener('submit', submitReservation);
