// Po załadowaniu całej zawartości strony uruchamiana jest funkcja init
document.addEventListener("DOMContentLoaded", init);

function init() {
    
    // Elementy formularza i kontenera na notatki
    const noteForm = document.getElementById('noteForm');
    const notesContainer = document.getElementById('notesContainer');
    const addNoteButton = document.getElementById('addNoteButton');
    const notePopup = document.getElementById('notePopup');
    const closePopup = document.querySelector('.close');
    const searchInput = document.getElementById('searchInput'); 


    let isEditing = false;
    let editingNoteId = null;

    // Ładowanie istniejących notatek z localStorage
    loadNotes();

    // Obsługa dodawania/edycji notatki
    noteForm.addEventListener('submit', function (e) {
        // Jak domyślna to skipuje/anuluje
        e.preventDefault();
        if (isEditing) {
            editNote();
        } else {
            addNote();
        }
        closePopupModal();
    });

    // Obsługa otwierania formularza dodawania notatki
    addNoteButton.addEventListener('click', () => openPopupModal());

    // Obsługa zamykania formularza dodawania notatki
    closePopup.addEventListener('click', closePopupModal);

    // Obsługa wyszukiwania notatek
    searchInput.addEventListener('input', searchNotes);

    // Funkcja wyszukująca notatki
    function searchNotes() {
        const query = searchInput.value.toLowerCase();
        const notes = JSON.parse(localStorage.getItem('notes')) || [];
        const filteredNotes = notes.filter(note => 
            note.title.toLowerCase().includes(query) ||
            note.content.toLowerCase().includes(query) ||
            note.color.toLowerCase().includes(query) ||
            note.date.toLowerCase().includes(query)
        );
        notesContainer.innerHTML = '';
        filteredNotes.sort((a, b) => b.pin - a.pin || new Date(b.date) - new Date(a.date));
        filteredNotes.forEach(note => appendNoteToDOM(note));
    }
    // Funkcja otwierająca pop-up
    function openPopupModal(note = null) {
        notePopup.style.display = 'block';
        if (note) {
            isEditing = true;
            editingNoteId = note.id;
            // Zaczytanie danych notatki
            document.getElementById('noteId').value = note.id;
            document.getElementById('noteTitle').value = note.title;
            document.getElementById('noteContent').value = note.content;
            document.getElementById('noteColor').value = note.color;
            document.getElementById('notePin').checked = note.pin;
        } else {
            isEditing = false;
            editingNoteId = null;
            noteForm.reset();
        }
    }

    // Funkcja zamykająca pop-up
    function closePopupModal() {
        notePopup.style.display = 'none';
    }

    // Funkcja dodająca nową notatkę
    function addNote() {
        const title = document.getElementById('noteTitle').value;
        const content = document.getElementById('noteContent').value;
        const color = document.getElementById('noteColor').value;
        const pin = document.getElementById('notePin').checked;
        const date = new Date().toISOString();

        const note = {
            id: Date.now(),
            title,
            content,
            color,
            pin,
            date
        };

        saveNoteToLocalStorage(note);
        appendNoteToDOM(note); 
        noteForm.reset(); // Reset formularza
        loadNotes(); // Aby zaczytało przypięcie notki
    }

    // Funkcja edytująca istniejącą notke
    function editNote() {
        const id = editingNoteId;
        const title = document.getElementById('noteTitle').value;
        const content = document.getElementById('noteContent').value;
        const color = document.getElementById('noteColor').value;
        const pin = document.getElementById('notePin').checked;
        const date = new Date().toISOString();

        const updatedNote = {
            id,
            title,
            content,
            color,
            pin,
            date
        };

        updateNoteInLocalStorage(updatedNote);
        updateNoteInDOM(updatedNote);
        noteForm.reset(); // Reset formularza
        loadNotes(); // Refresh notki po edycji
    }

    // Funkcja zapisująca notatkę do localStorage
    function saveNoteToLocalStorage(note) {
        // Pobiera notatki z LocalStorage, jak nie ma to pusta tablica
        let notes = JSON.parse(localStorage.getItem('notes')) || [];
        // Dodaje nową notatkę do tablicy
        notes.push(note);
        // Zapisuje zaktualizowaną tablicę do localStorage
        localStorage.setItem('notes', JSON.stringify(notes));
    }
    

    // Funkcja aktualizująca notatkę w localStorage
    function updateNoteInLocalStorage(updatedNote) {
        let notes = JSON.parse(localStorage.getItem('notes')) || [];
        // Sort notatek pin > data
        notes = notes.map(note => note.id === updatedNote.id ? updatedNote : note);
        localStorage.setItem('notes', JSON.stringify(notes));
    }

    // Funkcja usuwająca notatkę z localStorage
    function deleteNoteFromLocalStorage(id) {
        let notes = JSON.parse(localStorage.getItem('notes')) || [];
        notes = notes.filter(note => note.id !== id);
        localStorage.setItem('notes', JSON.stringify(notes));
    }

    // Funkcja ładująca notatki z localStorage
    function loadNotes() {
        notesContainer.innerHTML = ''; // Wyczyść kontener notatek przed załadowaniem
        let notes = JSON.parse(localStorage.getItem('notes')) || [];
        // Sort notatek pin > data
        notes.sort((a, b) => b.pin - a.pin || new Date(b.date) - new Date(a.date));
        notes.forEach(note => appendNoteToDOM(note));
    }

    // Funkcja wyświetlająca notatkę w DOM
    function appendNoteToDOM(note) {
        // Tworzy div dla notatki
        const noteDiv = document.createElement('div');
        noteDiv.classList.add('note');
        noteDiv.style.backgroundColor = note.color;
        noteDiv.setAttribute('data-id', note.id); // data-id = id notki

        const noteTitle = document.createElement('h2');
        noteTitle.textContent = note.title;

        const noteContent = document.createElement('p');
        noteContent.textContent = note.content;

        const noteDate = document.createElement('div');
        noteDate.classList.add('note-date');
        noteDate.textContent = new Date(note.date).toLocaleString(); // data w formacie lokalnym

        const editButton = document.createElement('button');
        editButton.classList.add('edit-btn');
        editButton.textContent = '✏️';
        editButton.addEventListener('click', () => openPopupModal(note)); //Otwiera pop-up po kliknięciu

        const deleteButton = document.createElement('button');
        deleteButton.classList.add('delete-btn');
        deleteButton.textContent = '🗑️';
        deleteButton.addEventListener('click', () => {
            deleteNoteFromDOM(note.id); // Wywala notkę z DOM
            deleteNoteFromLocalStorage(note.id); // Wywala notkę z LocalStorage
        });

        // Dodaje elementy div'a do notki
        noteDiv.appendChild(noteTitle);
        noteDiv.appendChild(noteContent);
        noteDiv.appendChild(noteDate);
        noteDiv.appendChild(editButton);
        noteDiv.appendChild(deleteButton);

        // Dodaje cały div notki do kontenera z notatkami
        notesContainer.appendChild(noteDiv);
    }

    // Funkcja aktualizująca notatkę w DOM
    function updateNoteInDOM(updatedNote) {
        // Szuka notatki na podstawie id
        const noteDiv = document.querySelector(`.note[data-id='${updatedNote.id}']`);
        noteDiv.style.backgroundColor = updatedNote.color;

        const noteTitle = noteDiv.querySelector('h2');
        noteTitle.textContent = updatedNote.title;

        const noteContent = noteDiv.querySelector('p');
        noteContent.textContent = updatedNote.content;

        const noteDate = noteDiv.querySelector('.note-date');
        noteDate.textContent = new Date(updatedNote.date).toLocaleString();
    }

    // Funkcja usuwająca notatkę z DOM
    function deleteNoteFromDOM(id) {
        // Szuka element div notatki na podstawie identyfikatora i go usuwa z kontenera
        const noteDiv = document.querySelector(`.note[data-id='${id}']`);
        notesContainer.removeChild(noteDiv);
    }
}
