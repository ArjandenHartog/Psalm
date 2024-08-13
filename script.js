function loadVerses() {
    const verses = [];
    const verseElements = document.querySelectorAll('#psalms-container .verse'); // Selecteer alle divs met de klasse 'verse'

    verseElements.forEach(verseElement => {
        const verseId = verseElement.id; // Haal het id op (bijv. '1:1')
        const verseText = verseElement.innerText.trim(); // Haal de tekst van het vers

        // Splits het vers op basis van het eerste punt om het versnummer te verwijderen
        const verseParts = verseText.split('. ');
        const verseWithoutNumber = verseParts.slice(1).join('. '); // Sla het eerste deel over (nummer)

        // Voeg het psalmnummer en het vers toe aan de array, zonder het dubbele versnummer
        verses.push({ id: verseId, text: `Psalm ${verseId}: ${verseWithoutNumber}` });
    });

    return verses;
}

function showRandomVerse(verses) {
    const randomIndex = Math.floor(Math.random() * verses.length);
    const selectedVerse = verses[randomIndex];
    const verseText = selectedVerse.text;
    const psalmNumber = selectedVerse.id.split(':')[0].padStart(3, '0'); // Haal het psalmnummer op en formatteer naar drie cijfers

    document.getElementById('verse').innerText = verseText;

    // Zoek het juiste mp3-bestand op basis van het psalmnummer
    const audioPlayer = document.getElementById('audio-player');
    audioPlayer.src = `audio/${psalmNumber}-iso.mp3`; // Stel de bron in van het mp3-bestand
    audioPlayer.play(); // Speel het mp3-bestand af
}

document.addEventListener('DOMContentLoaded', () => {
    const verses = loadVerses(); // Verzen laden
    showRandomVerse(verses); // Direct een vers tonen

    // Lees de opgeslagen verversingsoptie uit localStorage
    const savedInterval = localStorage.getItem('refreshInterval');
    if (savedInterval) {
        document.getElementById('refresh-interval').value = savedInterval;
        applyRefreshInterval(savedInterval, verses);
    } else {
        applyRefreshInterval('audio', verses); // Standaard naar audio refresh als er geen keuze is
    }

    // Zet de dark mode zoals eerder ingesteld
    const darkModeEnabled = localStorage.getItem('darkMode');
    if (darkModeEnabled === 'enabled') {
        document.body.classList.add('dark-mode');
    }

    // Event listener voor dark mode toggle
    document.querySelector('.dark-mode-toggle').addEventListener('click', toggleDarkMode);
});

// Functie om dark mode in te schakelen en op te slaan
function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    if (document.body.classList.contains('dark-mode')) {
        localStorage.setItem('darkMode', 'enabled');
    } else {
        localStorage.setItem('darkMode', 'disabled');
    }
}

// Selecteer elementen
const audioPlayer = document.getElementById('audio-player');
const refreshIntervalSelect = document.getElementById('refresh-interval');

let refreshTimer;

// Functie om de psalm te verversen
function refreshPsalm(verses) {
    showRandomVerse(verses);
}

// Functie om de psalm te verversen na het einde van de audio
function refreshAfterAudio(verses) {
    audioPlayer.addEventListener('ended', () => refreshPsalm(verses));
}

// Functie om de psalm elke 2 minuten te verversen
function refresh2min(verses) {
    refreshTimer = setInterval(() => refreshPsalm(verses), 120000); // 120000 ms = 2 minuten
}

// Functie om de psalm elke 5 minuten te verversen
function refresh5min(verses) {
    refreshTimer = setInterval(() => refreshPsalm(verses), 300000); // 300000 ms = 5 minuten
}

// Functie om de psalm elke 10 minuten te verversen
function refresh10min(verses) {
    refreshTimer = setInterval(() => refreshPsalm(verses), 600000); // 600000 ms = 10 minuten
}

// Functie om de psalm elk uur te verversen
function refreshHourly(verses) {
    refreshTimer = setInterval(() => refreshPsalm(verses), 3600000); // 3600000 ms = 1 uur
}

// Functie om de psalm elke dag te verversen
function refreshDaily(verses) {
    refreshTimer = setInterval(() => refreshPsalm(verses), 86400000); // 86400000 ms = 1 dag
}

// Functie om het verversingsinterval toe te passen
function applyRefreshInterval(interval, verses) {
    clearInterval(refreshTimer); // Stop eventuele lopende timers
    audioPlayer.removeEventListener('ended', refreshPsalm); // Verwijder bestaande event listener

    if (interval === 'audio') {
        refreshAfterAudio(verses);
    } else if (interval === '2min') {
        refresh2min(verses);
    } else if (interval === '5min') {
        refresh5min(verses);
    } else if (interval === '10min') {
        refresh10min(verses);
    } else if (interval === 'hourly') {
        refreshHourly(verses);
    } else if (interval === 'daily') {
        refreshDaily(verses);
    }
}

// Event listener voor veranderingen in het keuzemenu
refreshIntervalSelect.addEventListener('change', function() {
    const selectedOption = this.value;
    localStorage.setItem('refreshInterval', selectedOption);
    applyRefreshInterval(selectedOption, loadVerses());
});

// Stel de standaard verversoptie in bij het laden van de pagina
applyRefreshInterval(refreshIntervalSelect.value, loadVerses());
