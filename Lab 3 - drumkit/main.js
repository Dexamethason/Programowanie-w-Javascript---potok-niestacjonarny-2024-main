const channels = [[], [], [], []]; 

let isRecording = [false, false, false, false]; 
let startTime = 0; // Czas rozpoczęcia 
let loopPlayback = false; // Czy loop jest odpalony

// Timeouty dźwięków
let playbackTimeouts = [null, null, null, null]; 

const clap = new Audio('./sounds/clap.wav');
const kick = new Audio('./sounds/kick.wav');
const hihat = new Audio('./sounds/hihat.wav');

// Odpala nagrywanie przy kliknięciu record'a
document.getElementById('record1').addEventListener('click', () => toggleRecording(0));
document.getElementById('record2').addEventListener('click', () => toggleRecording(1));
document.getElementById('record3').addEventListener('click', () => toggleRecording(2));
document.getElementById('record4').addEventListener('click', () => toggleRecording(3));

// Odpala nagranie po kliknięciu play
document.getElementById('play1').addEventListener('click', () => playChannel(0));
document.getElementById('play2').addEventListener('click', () => playChannel(1));
document.getElementById('play3').addEventListener('click', () => playChannel(2));
document.getElementById('play4').addEventListener('click', () => playChannel(3));

// Clearowanie kanału
document.getElementById('clear1').addEventListener('click', () => clearChannel(0));
document.getElementById('clear2').addEventListener('click', () => clearChannel(1));
document.getElementById('clear3').addEventListener('click', () => clearChannel(2));
document.getElementById('clear4').addEventListener('click', () => clearChannel(3));

// Odpala wszystkie 4 kanały 
document.getElementById('playAll').addEventListener('click', playAllChannels);
// Stopuje wszystkie kanały
document.getElementById('stopAll').addEventListener('click', stopAllChannels);

// Loop on/off
document.getElementById('loopPlayback').addEventListener('change', (event) => {
    loopPlayback = event.target.checked; // Aktualizowanie flagi zapętlania
});

// Nagrywa dźwięk na odpowiedni kanał (po wciśnięciu przycisku a/s/d)
addEventListener('keypress', (ev) => {
    const key = ev.key; 
    const time = Date.now() - startTime; // Liczenia czasu od startu nagrania

    // Gra dźwięk po naciśnięciu
    switch(key) {
        case 'a':
            playSound(clap);
            break;
        case 's':
            playSound(kick);
            break;
        case 'd':
            playSound(hihat);
            break;
    }

    // Do danej ścieżki dodaje wciskany przycisk i czas
    isRecording.forEach((recording, index) => {
        if (recording) {
            channels[index].push({ key, time });
        }
    });
});


function playSound(sound) {
    sound.currentTime = 0; // Gra od początku dźwięku
    sound.play(); 
}

function toggleRecording(channel) {
    if (isRecording[channel]) {
        // Jak aktywne to zatrzymuje
        isRecording[channel] = false;
        document.getElementById(`record${channel + 1}`).classList.remove('active'); // Usunięcie aktywnej klasy
        document.getElementById(`play${channel + 1}`).disabled = false; // Odtwarzanie on
        document.getElementById(`clear${channel + 1}`).disabled = false; // Clear on
    } else {
        // Jak nie aktywne to rozpoczyna nowe nagranie
        clearChannel(channel); 
        isRecording[channel] = true; 
        startTime = Date.now(); 
        document.getElementById(`record${channel + 1}`).classList.add('active');
        document.getElementById(`play${channel + 1}`).disabled = true; 
        document.getElementById(`clear${channel + 1}`).disabled = true; 
    }
}

// Odsłuch dźwięków
function playChannel(channel) {
    // Jak loop to przerywa
    if (playbackTimeouts[channel] !== null) {
        clearTimeout(playbackTimeouts[channel]); 
    }

    // Jeśli aktywny to odtwarza
    if (document.getElementById(`active${channel + 1}`).checked) {
        channels[channel].forEach(({ key, time }) => {
            playbackTimeouts[channel] = setTimeout(() => {
                switch(key) {
                    case 'a':
                        playSound(clap);
                        break;
                    case 's':
                        playSound(kick);
                        break;
                    case 'd':
                        playSound(hihat);
                        break;
                }
            }, time);
        });

        // Jeśli loop odpalony, ustawi timeout do odtworzenia kanału
        // opóźnienie równe "długości kanału"
        if (loopPlayback) {
            playbackTimeouts[channel] = setTimeout(() => playChannel(channel), channels[channel].length ? channels[channel].at(-1).time + 100 : 0);
        }
    }
}

// Odtwarza wszystkie kanały
function playAllChannels() {
    channels.forEach((_, index) => playChannel(index));
}

// Czyści kanał
function clearChannel(channel) {
    channels[channel] = []; // Clear tablicy
    document.getElementById(`play${channel + 1}`).disabled = true; 
    document.getElementById(`clear${channel + 1}`).disabled = true; 
    // Loop off
    if (playbackTimeouts[channel] !== null) {
        clearTimeout(playbackTimeouts[channel]); // Usunięcie timeoutu 
        playbackTimeouts[channel] = null; // Reset timeoutu
    }
}

// Stop odtwarzania
function stopAllChannels() {
    playbackTimeouts.forEach(timeout => {
        if (timeout !== null) {
            clearTimeout(timeout); 
        }
    });
    playbackTimeouts.fill(null); 
}
