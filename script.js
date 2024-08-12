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
    setInterval(() => showRandomVerse(verses), 100000);
});
