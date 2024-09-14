// +-Działa gdy html się w pełni załaduje
document.addEventListener('DOMContentLoaded', () => {
    const inputContainer = document.getElementById('input-container');
    const addFieldButton = document.getElementById('add-field');
    const calculateButton = document.getElementById('calculate');
    const sumElement = document.getElementById('sum');
    const averageElement = document.getElementById('average');
    const minElement = document.getElementById('min');
    const maxElement = document.getElementById('max');

    let fieldCount = 0;

    //Dodanie kolejnego inputa
    function addField() {
        fieldCount++;
        const inputGroup = document.createElement('div');
        inputGroup.className = 'input-group';
        inputGroup.innerHTML = 
        `
            <input type="number" id="field-${fieldCount}" placeholder="Wprowadź liczbę">
            <button class="remove-field">Usuń</button>
        `;
        inputContainer.appendChild(inputGroup);

        //liczy co input
        const input = inputGroup.querySelector('input');
        input.addEventListener('input', calculate);

        //Usuwanie inputa
        const removeButton = inputGroup.querySelector('.remove-field');
        removeButton.addEventListener('click', () => {
            inputContainer.removeChild(inputGroup);
            calculate();
        });
    }

    // Funkcja nie ukrywam podpatrzona na necie
    // Zwraca tablice z liczbami z inputów
    // Dzięki temu mamy pewność, że tylko prawidłowe liczby zostaną wrzucone do tablicy
    function getInputValues() {
        return Array.from(inputContainer.querySelectorAll('input[type="number"]'))
            .map(input => parseFloat(input.value))
            .filter(value => !isNaN(value));
    }

    function calculate() {
        const values = getInputValues();
        if (values.length === 0) return;

        //acc ustawione na 0
        //val to wartość z tablicy
        //do acc dodawana jest wartość z tablicy
        const sum = values.reduce((acc, val) => acc + val, 0);
        //suma przez ilość liczb
        const average = sum / values.length;
        //Również podpatrzone na necie
        //3 kropki przed values tak jakby "rozpakowują" tablice na poszczególne argumenty zamiast podawać całą tablice
        //Przykładowo dla liczb w tablicy [1,4,6,8]
        //Będzie to to samo co = Math.min(1,4,6,8) a nie Math.min([1,4,6,8]), chyba dobrze zrozumiałem 
        const min = Math.min(...values);
        const max = Math.max(...values);

        //Do 2 miejsc po przecinku
        sumElement.textContent = sum.toFixed(2);
        averageElement.textContent = average.toFixed(2);
        minElement.textContent = min.toFixed(2);
        maxElement.textContent = max.toFixed(2);
    }


    addFieldButton.addEventListener('click', addField);
    calculateButton.addEventListener('click', calculate);

    // Dodanie 3 pól na start
    for (let i = 0; i < 3; i++) {
        addField();
    }
});