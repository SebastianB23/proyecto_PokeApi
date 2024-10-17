

// localStorage.clear(): Esta línea elimina todos los datos almacenados en el localStorage del navegador.
// Esto asegura que cada vez que se carga la página, el juego comienza desde cero, sin pares previamente almacenados.

localStorage.clear();

//cards: Es un array de arrays que contiene objetos de carta. Cada objeto tiene un id único y un value que representa el emoji de la carta.
// Estructura: Hay 6 sub-arrays, cada uno con 4 cartas (total de 24 cartas), donde cada par de cartas tiene el mismo emoji (por ejemplo, las cartas con id: 1 y id: 2 tienen el emoji '😀').
const cards = [
    [ { id: 1, value: '😀' }, { id: 2, value: '😀' }, { id: 3, value: '😡' }, { id: 4, value: '😡' } ],
    [ { id: 5, value: '😈' }, { id: 6, value: '😈' }, { id: 7, value: '🚀' }, { id: 8, value: '🚀' } ],
    [ { id: 9, value: '😱' }, { id: 10, value: '😱' }, { id: 11, value: '🤯' }, { id: 12, value: '🤯' } ],
    [ { id: 13, value: '🐉' }, { id: 14, value: '🐉' }, { id: 15, value: '🐧' }, { id: 16, value: '🐧' } ],
    [ { id: 17, value: '🐝' }, { id: 18, value: '🐝' }, { id: 19, value: '🦭' }, { id: 20, value: '🦭' } ],
    [ { id: 21, value: '🐢' }, { id: 22, value: '🐢' }, { id: 23, value: '🦈' }, { id: 24, value: '🦈' } ]
];

let flippedCards = [];
let matchedPairs = JSON.parse(localStorage.getItem('matchedPairs')) || [];
const totalPairs = 12; // Hay 12 parejas de cartas
let remainingTime = 180; // 3 minutos en segundos
let intervalId = null; // Variable para guardar el identificador del intervalo
let gameActive = true; // Variable que controla si el juego está activo o no

// flippedCards: Un array para almacenar temporalmente las cartas que el jugador ha volteado en el turno actual.
// matchedPairs: Recupera del localStorage cualquier par de cartas que ya se hayan emparejado anteriormente. Si no hay datos, inicializa como un array vacío.
// totalPairs: Define el número total de parejas que se deben encontrar en el juego (12 parejas en este caso).
// remainingTime: Define el tiempo total de juego en segundos (180 segundos equivalen a 3 minutos).
// intervalId: Almacena el identificador del intervalo del temporizador para poder detenerlo posteriormente.
// gameActive: Una bandera que indica si el juego está activo. Si es false, el jugador no puede interactuar con las cartas.

const gameBoard = document.getElementById('game-board');
const timerDisplay = document.getElementById('timer');
const divAlertaRoja = document.getElementById("alertaRoja");
const divAlertaVerde = document.getElementById("alertaVerde");
const reiniciarBtn = document.getElementById('reiniciar');

// gameBoard: El contenedor donde se mostrarán las cartas del juego.
// timerDisplay: Elemento donde se mostrará el tiempo restante.
// divAlertaRoja y divAlertaVerde: Elementos para mostrar mensajes de alerta (rojo para tiempo agotado, verde para victoria).
// reiniciarBtn: Botón para reiniciar el juego.


// Funciones alerta
function alertaRoja(mensaje) {
    divAlertaRoja.innerHTML = `<p>${mensaje}</p>`;
}
function alertaVerde(mensaje) {
    divAlertaVerde.innerHTML = `<p>${mensaje}</p>`;
}
// alertaRoja(mensaje): Muestra un mensaje en el divAlertaRoja. Utilizado para alertas negativas, como cuando se acaba el tiempo.
// alertaVerde(mensaje): Muestra un mensaje en el divAlertaVerde. Utilizado para alertas positivas, como cuando el jugador gana el juego.



// Desactivar cartas cuando el juego se detiene
function disableCards() {
    gameActive = false;
}

// Habilitar cartas cuando se reinicia el juego
function enableCards() {
    gameActive = true;
}

// disableCards(): Establece gameActive en false, lo que impide que el jugador interactúe con las cartas.
// enableCards(): Establece gameActive en true, permitiendo que el jugador interactúe nuevamente con las cartas.


// Mezcla las cartas de forma individual y las agrupa nuevamente en sub-arrays de 4

function shuffleAndGroup(array) {
    
    const flattened = array.flat();
    const shuffled = flattened.sort(() => Math.random() - 0.5);
    const grouped = [];
    
    
    while (shuffled.length) {
        grouped.push(shuffled.splice(0, 4));
    }
    
    return grouped;
}
// shuffleAndGroup(array): Esta función toma el array de cartas y realiza dos operaciones principales:
// Aplanar el Array:
// array.flat(): Convierte el array de arrays de cartas en un solo array plano con todas las cartas.

// Mezclar las Cartas:
// flattened.sort(() => Math.random() - 0.5): Ordena aleatoriamente las cartas. La función de comparación Math.random() - 0.5 es una manera común (aunque no la más eficiente) de mezclar un array en JavaScript.

// Agrupar de Nuevo en Sub-Arrays de 4:
// Utiliza un while que continúa mientras haya elementos en shuffled.

// shuffled.splice(0, 4): Extrae los primeros 4 elementos del array mezclado y los agrega al array grouped.

// Resultado: Un array de arrays, donde cada sub-array contiene 4 cartas mezcladas aleatoriamente.


// Cargar las cartas
function loadGame() {
    
    gameBoard.innerHTML = '';
    divAlertaRoja.innerHTML = '';
    divAlertaVerde.innerHTML = '';
    
    const shuffledCards = shuffleAndGroup(cards);
    shuffledCards.flat().forEach(card => {
        
        
    const cardElement = document.createElement('div');
        cardElement.classList.add('card');
        cardElement.dataset.id = card.id;
        cardElement.dataset.value = card.value;
        cardElement.textContent = '💥';
        cardElement.addEventListener('click', flipCard);

        // Mostrar las cartas que ya han sido emparejadas
        
        if (matchedPairs.includes(card.id)) {
            cardElement.classList.add('matched');
            cardElement.textContent = card.value;
        }

        gameBoard.appendChild(cardElement);
    });

    enableCards(); // Permitir jugar
    startTimer(); // Iniciar el temporizador
}

// loadGame(): Esta función se encarga de preparar el tablero de juego cada vez que se carga o reinicia el juego.

// Limpiar el Tablero y Alertas:
// gameBoard.innerHTML = '': Elimina cualquier contenido previo en el tablero de juego.
// divAlertaRoja.innerHTML = '' y divAlertaVerde.innerHTML = '': Limpia cualquier mensaje de alerta previo.
// Mezclar las Cartas:
// const shuffledCards = shuffleAndGroup(cards): Llama a la función para mezclar y agrupar las cartas.
// Crear y Configurar Elementos de las Cartas:
// shuffledCards.flat().forEach(card => { ... }): Itera sobre cada carta en el array mezclado.
// Crear un elemento div para cada carta:
// document.createElement('div'): Crea un nuevo div para representar la carta.
// cardElement.classList.add('card'): Añade la clase CSS 'card' al elemento.
// cardElement.dataset.id = card.id y cardElement.dataset.value = card.value: Asigna atributos de datos personalizados para almacenar el id y el value de la carta.
// cardElement.textContent = '💥': Inicialmente, todas las cartas muestran el emoji '💥' como su estado oculto.
// cardElement.addEventListener('click', flipCard): Añade un listener para manejar el evento de clic en la carta.
// Mostrar Cartas Emparejadas Anteriormente:
// if (matchedPairs.includes(card.id)) { ... }: Verifica si la carta ya ha sido emparejada previamente (guardada en matchedPairs).
// Si está emparejada:
// cardElement.classList.add('matched'): Añade la clase 'matched' para estilizarla adecuadamente.
// cardElement.textContent = card.value: Muestra el emoji real de la carta, indicando que ya está emparejada.
// Agregar la Carta al Tablero:
// gameBoard.appendChild(cardElement): Añade el elemento de la carta al contenedor del tablero de juego.
// Habilitar el Juego y Iniciar el Temporizador:
// enableCards(): Asegura que el juego está activo y que las cartas son interactivas.
// startTimer(): Inicia el temporizador de cuenta regresiva.


// Temporizador regresivo

function startTimer() {
    if (intervalId) {
        clearInterval(intervalId);
    }

    intervalId = setInterval(() => {
        if (remainingTime <= 0) {
            clearInterval(intervalId);
            alertaRoja("Se acabó el tiempo");
            disableCards(); // Desactivar las cartas
            return;
        }

        remainingTime--;
        updateTimerDisplay();
    }, 1000);
}

// startTimer(): Controla el temporizador del juego.
// Limpiar Intervalos Previos:
// if (intervalId) { clearInterval(intervalId); }: Si ya hay un temporizador en marcha (por ejemplo, después de reiniciar el juego), lo detiene antes de iniciar uno nuevo para evitar múltiples temporizadores simultáneos.
// Configurar un Nuevo Intervalo:
// setInterval(..., 1000): Ejecuta una función cada 1000 milisegundos (1 segundo).
// Función Interna del Intervalo:
// if (remainingTime <= 0) { ... }: Verifica si el tiempo se ha agotado.
// clearInterval(intervalId): Detiene el temporizador.
// alertaRoja("Se acabó el tiempo"): Muestra un mensaje de alerta roja indicando que el tiempo se ha acabado.
// disableCards(): Desactiva las cartas para que el jugador ya no pueda interactuar con ellas.
// return: Sale de la función para evitar ejecutar el código restante.
// Si aún queda tiempo:
// remainingTime--: Decrementa el tiempo restante en 1 segundo.
// updateTimerDisplay(): Actualiza la visualización del temporizador en la pantalla.

// Actualizar el temporizador en pantalla

function updateTimerDisplay() {
    const minutes = Math.floor(remainingTime / 60);
    const seconds = remainingTime % 60;
    timerDisplay.textContent = `Tiempo restante: ${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}

// updateTimerDisplay(): Actualiza el elemento del DOM que muestra el tiempo restante.
// Calcular Minutos y Segundos:
// Math.floor(remainingTime / 60): Calcula los minutos restantes.
// remainingTime % 60: Calcula los segundos restantes.
// Formatear el Tiempo:
// ${seconds < 10 ? '0' : ''}${seconds}: Añade un cero delante de los segundos si son menores a 10 para mantener un formato consistente (por ejemplo, "2:05" en lugar de "2:5").
// Actualizar el Contenido del Temporizador:
// timerDisplay.textContent = ...: Establece el texto del elemento timerDisplay con el tiempo formateado.

// Voltear la carta

function flipCard(event) {
    if (!gameActive) return; // No hacer nada si el juego está inactivo

    const clickedCard = event.target;

    if (clickedCard.classList.contains('matched') || flippedCards.includes(clickedCard)) {
        return;
    }

    clickedCard.classList.add('flipped');
    clickedCard.textContent = clickedCard.dataset.value;
    flippedCards.push(clickedCard);

    if (flippedCards.length === 2) {
        checkForMatch();
    }
}

// updateTimerDisplay(): Actualiza el elemento del DOM que muestra el tiempo restante.
// Calcular Minutos y Segundos:
// Math.floor(remainingTime / 60): Calcula los minutos restantes.
// remainingTime % 60: Calcula los segundos restantes.
// Formatear el Tiempo:
// ${seconds < 10 ? '0' : ''}${seconds}: Añade un cero delante de los segundos si son menores a 10 para mantener un formato consistente (por ejemplo, "2:05" en lugar de "2:5").
// Actualizar el Contenido del Temporizador:
// timerDisplay.textContent = ...: Establece el texto del elemento timerDisplay con el tiempo formateado.


// Verificar si las cartas coinciden
function checkForMatch() {
    const firstCardValue = flippedCards[0].dataset.value;
    const secondCardValue = flippedCards[1].dataset.value;

    if (firstCardValue === secondCardValue) {
        flippedCards[0].classList.add('matched');
        flippedCards[1].classList.add('matched');

        const firstCardId = Number(flippedCards[0].dataset.id);
        const secondCardId = Number(flippedCards[1].dataset.id);

        matchedPairs.push(firstCardId);
        matchedPairs.push(secondCardId);
        localStorage.setItem('matchedPairs', JSON.stringify(matchedPairs));

        resetTurn();
        checkWinCondition(); // Verificar si se han encontrado todas las parejas
    } 
    
    else {
        setTimeout(() => {
            flippedCards.forEach(card => {
                card.classList.remove('flipped');
                card.textContent = '💥';
            });
            resetTurn();
        }, 1000);
    }
}

// checkForMatch(): Determina si las dos cartas volteadas forman un par.
// Obtener los Valores de las Cartas Volteadas:
// const firstCardValue = flippedCards[0].dataset.value;
// const secondCardValue = flippedCards[1].dataset.value;
// Comparar los Valores:
// if (firstCardValue === secondCardValue) { ... }: Si los valores de ambas cartas son iguales, se ha encontrado un par.
// Si Hay un Par:
// Añadir Clase 'matched':
// flippedCards[0].classList.add('matched');
// flippedCards[1].classList.add('matched');
// Esto puede utilizarse en CSS para estilizar las cartas emparejadas (por ejemplo, ocultarlas o marcarlas de manera diferente).
// Obtener los IDs de las Cartas:
// const firstCardId = Number(flippedCards[0].dataset.id);
// const secondCardId = Number(flippedCards[1].dataset.id);
// Actualizar matchedPairs y localStorage:
// matchedPairs.push(firstCardId); y matchedPairs.push(secondCardId);: Añade los IDs de las cartas emparejadas al array matchedPairs.
// localStorage.setItem('matchedPairs', JSON.stringify(matchedPairs));: Guarda el array actualizado en el localStorage para persistir el progreso del juego.
// Resetear el Turno:
// resetTurn();: Limpia el array flippedCards para el siguiente turno.
// Verificar Condición de Victoria:
// checkWinCondition();: Comprueba si el jugador ha encontrado todas las parejas.
// Si No Hay un Par:
// else { ... }: Si los valores de las dos cartas no coinciden.

// Esperar 1 Segundo Antes de Voltear las Cartas de Nuevo:

// setTimeout(() => { ... }, 1000);: Retrasa la ejecución de la función interna en 1 segundo para permitir que el jugador vea las cartas antes de voltearlas nuevamente.
// Voltear las Cartas de Nuevo:

// flippedCards.forEach(card => { ... });:
// card.classList.remove('flipped');: Quita la clase 'flipped' para aplicar el estado de vuelta a la carta.
// card.textContent = '💥';: Cambia el contenido de la carta de vuelta al emoji oculto '💥'.
// Resetear el Turno:

// resetTurn();: Limpia el array flippedCards para el siguiente turno.



// Verificar si el jugador ha encontrado todas las parejas
function checkWinCondition() {
    if (matchedPairs.length === totalPairs * 2) {
        alertaVerde("¡Felicitaciones, has encontrado todas las parejas!");
        clearInterval(intervalId); // Detener el temporizador
        disableCards(); // Desactivar las cartas
    }
}

// checkWinCondition(): Comprueba si el jugador ha encontrado todas las parejas necesarias para ganar el juego.
// Verificar si Todas las Parejas Han Sido Encontradas:
// if (matchedPairs.length === totalPairs * 2): Cada pareja añade dos IDs al array matchedPairs, por lo que cuando la longitud de matchedPairs es el doble de totalPairs, significa que todas las parejas han sido encontradas.
// Si Se Gana el Juego:
// Mostrar Alerta de Victoria:
// alertaVerde("¡Felicitaciones, has encontrado todas las parejas!");: Muestra un mensaje de felicitación al jugador.
// Detener el Temporizador:
// clearInterval(intervalId);: Detiene el temporizador regresivo.
// Desactivar las Cartas:
// disableCards();: Evita que el jugador interactúe más con las cartas después de haber ganado.


// Resetear el turno
function resetTurn() {
    flippedCards = [];
}

// resetTurn(): Limpia el array flippedCards para preparar el siguiente turno.


// Función para reiniciar el juego
function resetGame() {
    localStorage.clear();
    matchedPairs = [];
    flippedCards = [];
    remainingTime = 180; // Resetear el tiempo a 3 minutos
    loadGame(); // Cargar el juego desde el inicio
}

// resetGame(): Reinicia todo el estado del juego para empezar de nuevo.
// Limpiar localStorage:
// localStorage.clear();: Elimina cualquier dato previo almacenado, incluyendo matchedPairs.
// Reiniciar Variables de Estado:
// matchedPairs = [];: Vuelve a inicializar el array de pares emparejados.
// flippedCards = [];: Limpia cualquier carta que pudiera estar volteada.
// remainingTime = 180;: Reinicia el tiempo restante a 3 minutos.
// Recargar el Juego:
// loadGame();: Vuelve a cargar el tablero de juego, mezclando las cartas y reiniciando el temporizador.

// Escuchar el botón de reinicio
reiniciarBtn.addEventListener('click', resetGame);

// reiniciarBtn.addEventListener('click', resetGame);:
// Asocia el evento de clic en el botón de reinicio con la función resetGame(), permitiendo que el jugador reinicie el juego cuando lo desee.


// Iniciar el juego
loadGame();

// loadGame();: Llama a la función loadGame() para configurar y comenzar el juego cuando se carga la página.