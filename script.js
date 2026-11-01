// Κρατάμε ιστορικό οθονών για να λειτουργεί το κουμπί «Επιστροφή»
let previousScreen = 'screen-home';
let currentScreen = 'screen-home';
let map; // Μεταβλητή για τον χάρτη Leaflet

// 1. Συνάρτηση εναλλαγής οθονών
function showScreen(screenId) {
  if (screenId !== currentScreen) {
    previousScreen = currentScreen;
    currentScreen = screenId;
  }

  // Κρύβουμε όλες τις οθόνες
  const screens = document.querySelectorAll('.screen');
  screens.forEach(function(screen) {
    screen.classList.remove('active');
  });

  // Εμφανίζουμε την επιλεγμένη οθόνη
  document.getElementById(screenId).classList.add('active');

  // Ενημερώνουμε το ενεργό κουμπί στο κάτω μενού
  document.querySelectorAll('.nav-btn').forEach(function(btn) {
    btn.classList.remove('active-nav');
  });

  if (screenId === 'screen-home') document.getElementById('nav-home').classList.add('active-nav');
  if (screenId === 'screen-services') document.getElementById('nav-services').classList.add('active-nav');
  if (screenId === 'screen-form') document.getElementById('nav-form').classList.add('active-nav');
  if (screenId === 'screen-map') {
    document.getElementById('nav-map').classList.add('active-nav');
    // Ανανέωση μεγέθους του χάρτη Leaflet ώστε να εμφανιστεί σωστά
    setTimeout(function() {
      if (map) {
        map.invalidateSize();
      }
    }, 100);
  }

  window.scrollTo(0, 0);
}

// 2. Συνάρτηση επιστροφής στην προηγούμενη οθόνη
function goBack() {
  showScreen(previousScreen);
}

// 3. Επιλογή υπηρεσίας (Γεμίζει το dropdown της φόρμας)
function selectService(serviceName) {
  document.getElementById('service-category').value = serviceName;
  showScreen('screen-form');
}

// 4. Επιλογή σημείου εξυπηρέτησης από τον Χάρτη (Γεμίζει το dropdown της φόρμας)
function selectStation(stationName) {
  document.getElementById('location-select').value = stationName;
  showScreen('screen-form');
}

// 5. Έλεγχος πεδίων φόρμας και προσομοίωση υποβολής
function submitForm(event) {
  event.preventDefault(); // Αποτρέπει την ανανέωση της σελίδας

  // Παίρνουμε όλες τις τιμές
  const service = document.getElementById('service-category').value.trim();
  const location = document.getElementById('location-select').value.trim();
  const equipment = document.getElementById('equipment').value.trim();
  const description = document.getElementById('description').value.trim();
  const priority = document.getElementById('priority').value.trim();
  const contactName = document.getElementById('contact-name').value.trim();
  const contactPhone = document.getElementById('contact-phone').value.trim();
  const errorMsg = document.getElementById('form-error');

  // Έλεγχος αν λείπουν πεδία ή αν το τηλέφωνο δεν είναι ακριβώς 10 ψηφία
  if (!service || !location || !equipment || !description || !priority || !contactName || contactPhone.length !== 10) {
    errorMsg.style.display = 'block';
    if (contactPhone.length > 0 && contactPhone.length !== 10) {
        errorMsg.textContent = 'Το τηλέφωνο πρέπει να έχει ακριβώς 10 ψηφία.';
    } else {
        errorMsg.textContent = 'Παρακαλώ συμπληρώστε όλα τα υποχρεωτικά πεδία (*).';
    }
    return;
  }

  errorMsg.style.display = 'none';

  // Απόκρυψη της φόρμας και εμφάνιση επιβεβαίωσης
  document.getElementById('support-form').style.display = 'none';
  const confirmationBox = document.getElementById('confirmation-box');
  const detailsBox = document.getElementById('confirmation-details');

  detailsBox.innerHTML =
    '<p><strong>Εγκατάσταση:</strong> ' + location + '</p>' +
    '<p><strong>Υπηρεσία:</strong> ' + service + '</p>' +
    '<p><strong>Εξοπλισμός:</strong> ' + equipment + '</p>' +
    '<p><strong>Προτεραιότητα:</strong> ' + priority + '</p>' +
    '<p><strong>Περιγραφή:</strong> ' + description + '</p>' +
    '<p><strong>Επικοινωνία:</strong> ' + contactName + ' (' + contactPhone + ')</p>';

  confirmationBox.style.display = 'block';
}

// 6. Επαναφορά φόρμας για νέο αίτημα
function resetSupportForm() {
  document.getElementById('support-form').reset();
  document.getElementById('support-form').style.display = 'block';
  document.getElementById('confirmation-box').style.display = 'none';
  document.getElementById('form-error').style.display = 'none';
}

// 7. Αρχικοποίηση Χάρτη Leaflet + OpenStreetMap
window.onload = function() {
  // Κεντράρισμα στην Αττική
  map = L.map('map').setView([38.00, 23.65], 11);

  // Προσθήκη πλακιδίων OpenStreetMap
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);

  // Σημείο 1: Αιγάλεω
  const marker1 = L.marker([37.989, 23.676]).addTo(map);
  marker1.bindPopup(
    '<b>Κέντρο Δυτικής Αττικής (Αιγάλεω)</b><br>' +
    'Υποστήριξη PLC, CNC & Αυτοματισμών.<br>' +
    '<button class="popup-btn" onclick="selectStation(\'Κέντρο Αιγάλεω\')">Υποβολή Αιτήματος εδώ</button>'
  );

  // Σημείο 2: Ασπρόπυργος
  const marker2 = L.marker([38.061, 23.589]).addTo(map);
  marker2.bindPopup(
    '<b>Βιομηχανικός Σταθμός Ασπροπύργου</b><br>' +
    'Βαριά Μηχανήματα & Υδραυλικά Συστήματα.<br>' +
    '<button class="popup-btn" onclick="selectStation(\'Σταθμός Ασπροπύργου\')">Υποβολή Αιτήματος εδώ</button>'
  );

  // Σημείο 3: Πειραιάς
  const marker3 = L.marker([37.947, 23.642]).addTo(map);
  marker3.bindPopup(
    '<b>Τεχνική Βάση Πειραιά</b><br>' +
    'Ηλεκτρομηχανολογικές Επισκευές.<br>' +
    '<button class="popup-btn" onclick="selectStation(\'Τεχνική Βάση Πειραιά\')">Υποβολή Αιτήματος εδώ</button>'
  );
};