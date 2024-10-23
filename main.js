
// ----- SECCIÓN DE EVENTOS DE NAVEGACIÓN -----
document.getElementById('search-link').addEventListener('click', function() {
    document.getElementById('search-section').style.display = 'inline-block';
    document.getElementById('list-section').style.display = 'none';
    document.getElementById('most-searched-section').style.display = 'none';
    getPokemonById(1);  // Cargar el primer Pokémon automáticamente
});

document.getElementById('list-link').addEventListener('click', function() {
    document.getElementById('search-section').style.display = 'none';
    document.getElementById('list-section').style.display = 'block';
    document.getElementById('most-searched-section').style.display = 'none';
});

// Evento para mostrar la sección de Pokémon más buscados
document.getElementById('most-searched-link').addEventListener('click', function() {
    document.getElementById('most-searched-section').style.display = 'block';
    document.getElementById('list-section').style.display = 'none';
    document.getElementById('search-section').style.display = 'none';
    loadMostSearchedPokemon(); // Cargar y mostrar la lista de Pokémon más buscados
});

// ----- ELEMENTOS DOM -----
let input = document.querySelector(".container .search-space input");
let pokemonImg = document.querySelector(".container .info-box img");
let pokemonName = document.querySelector(".container .info-box .pokemon-name");
let pokemonId = document.querySelector(".container .info-box .color-box .pokemon-id");
let pokeTypeBox = document.querySelector(".container .info-box .pokemon-types");
let colorBox = document.querySelector(".container .info-box .color-box");
let pokeStatsBox = document.querySelector(".container .info-box .pokemon-stats");
let prevButton = document.querySelector("#prev-pokemon");
let nextButton = document.querySelector("#next-pokemon");

const allPokemonContainer = document.querySelector('.pokemon-grid');
const pokemonGrid = document.querySelector('.pokemon-grid');
const prevPageBtn = document.getElementById('prev-page');
const nextPageBtn = document.getElementById('next-page');
const pageInfo = document.getElementById('page-info');

// ----- VARIABLES GLOBALES -----
let currentPokemonId = 1; // ID del Pokémon actual
let currentPage = 1;
const pokemonPerPage = 10;
let totalPokemons = 0;

// ----- OBJETO DE COLORES POR TIPO -----
const typeColor = {
    bug: "#26de81", 
    dragon: "#ffeaa7", 
    electric: "#fed330", 
    fairy: "#FF0069", 
    fighting: "#30336b",
    fire: "#f0932b", 
    flying: "#17d4d4", 
    grass: "#00b894", 
    ground: "#EFB549", 
    ghost: "#a55eea",
    ice: "#74b9ff", 
    normal: "#95afc0", 
    poison: "#6c5ce7", 
    psychic: "#a29bfe", 
    rock: "#2d3436", 
    water: "#0190FF"
};

// ----- FUNCIONES PARA OBTENER Y RENDERIZAR POKÉMON -----

// Obtener Pokémon por ID
let getPokemonById = (id) => {
    if (id > 0) { // Evitar ID menor a 1
        let url = `https://pokeapi.co/api/v2/pokemon/${id}`;
        fetch(url)
            .then((res) => res.json())
            .then((data) => {
                renderPokemons(data);
                currentPokemonId = data.id;  // Actualizar ID actual
            })
            .catch((error) => console.error("Error al obtener el Pokémon", error));
    }
};

// Obtener Pokémon por nombre o ID desde el input
let getPokemon = (pokemon) => {
    let url = `https://pokeapi.co/api/v2/pokemon/${pokemon.toLowerCase()}`;
    fetch(url)
        .then((res) => {
            if (!res.ok) throw new Error("Pokemon no encontrado");
            return res.json();
        })
        .then((data) => {
            renderPokemons(data);
            currentPokemonId = data.id;  // Actualizar ID
            input.value = "";  // Limpiar el input

            // Guardar la búsqueda en localStorage
            saveSearch(pokemon);
        })
        .catch((error) => {
            Toastify({
                text: "Pokemon no encontrado, asegúrate que su nombre esté bien escrito.",
                duration: 5000,
                gravity: "top",
                position: "center",
                style: { background: "linear-gradient(to right, #ff5f6d, #ffc371)" }
            }).showToast();
            console.error(error);
        });
};

// Obtener todos los Pokémon con paginación
const getAllPokemons = async (offset = 0, limit = pokemonPerPage) => {
    const url = `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`;
    const response = await fetch(url);
    const data = await response.json();
    
    totalPokemons = data.count; // Total de Pokémon en la API
    return data.results; // Lista de Pokémon
};

// ----- FUNCIONES PARA RENDERIZAR -----

// Renderizar un Pokémon individual
let renderPokemons = (data) => {
    const sprite = data.sprites.other.dream_world.front_default;
    const name = data.name;
    const pokeId = data.id;
    const themeColor = typeColor[data.types[0].type.name];

    pokemonImg.src = sprite;
    pokemonName.innerHTML = name;
    pokemonId.innerHTML = "#" + pokeId;

    getPokemonTypes(data.types);
    styleCard(themeColor);
    getPokemonStats(data.stats);
};

// Renderizar lista de Pokémon
let renderAllPokemon = async (pokemonList) => {
    allPokemonContainer.innerHTML = '';  // Limpiar el contenedor antes de agregar nuevos Pokémon
    
    // Calcular el ID base según la página actual
    const baseId = (currentPage - 1) * pokemonPerPage;

    for (let i = 0; i < pokemonList.length; i++) {
        let pokemon = pokemonList[i];
        
        let pokemonCard = document.createElement('div');
        pokemonCard.classList.add('pokemon-card');

        // Calcular el ID del Pokémon basado en la página actual
        let pokemonId = baseId + i + 1; // +1 porque el ID comienza en 1

        let pokemonName = document.createElement('h3');
        pokemonName.textContent = `${pokemonId}. ${capitalizeFirstLetter(pokemon.name)}`;

        // Añadir la imagen del Pokémon
        let pokemonImg = document.createElement('img');
        
        // Hacemos una petición para obtener los detalles del Pokémon, incluida la imagen
        try {
            let response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon.name}`);
            let data = await response.json();
            pokemonImg.src = data.sprites.front_default; // Imagen frontal del Pokémon
        } catch (error) {
            console.error('Error al obtener la imagen del Pokémon:', error);
            pokemonImg.alt = 'Imagen no disponible';
        }

        pokemonCard.appendChild(pokemonImg); // Añadir imagen a la tarjeta
        pokemonCard.appendChild(pokemonName); // Añadir el nombre a la tarjeta
        allPokemonContainer.appendChild(pokemonCard); // Añadir la tarjeta al contenedor principal
    }
};

// Renderizar página de Pokémon
const renderPokemonPage = async (page = 1) => {
    // Muestra el mensaje de carga
    document.getElementById('loading-message').style.display = 'block';
    pokemonGrid.style.display = 'none'; // Oculta la cuadrícula de Pokémon

    const offset = (page - 1) * pokemonPerPage;
    const pokemons = await getAllPokemons(offset);

    // Limpiar el grid antes de agregar los nuevos Pokémon
    pokemonGrid.innerHTML = '';

    // Renderizar los Pokémon en la página actual
    await renderAllPokemon(pokemons);

    // Actualizar la información de la página
    pageInfo.textContent = `Página ${page} de ${Math.ceil(totalPokemons / pokemonPerPage)}`;

    // Oculta el mensaje de carga y muestra la cuadrícula
    document.getElementById('loading-message').style.display = 'none';
    pokemonGrid.style.display = 'grid'; // Muestra la cuadrícula de Pokémon

    // Habilitar/deshabilitar botones
    prevPageBtn.disabled = page === 1;
    nextPageBtn.disabled = page === Math.ceil(totalPokemons / pokemonPerPage);
};


let capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
};


let styleCard = (color) => {
    colorBox.style.background = color;
    pokeTypeBox.querySelectorAll("span").forEach(typeColor => typeColor.style.background = color);
    prevButton.style.background = color;
    nextButton.style.background = color;
};

// Obtener tipos del Pokémon
let getPokemonTypes = (types) => {
    pokeTypeBox.innerHTML = '';
    types.forEach((typ) => {
        let span = document.createElement('span');
        let typeName = typ.type.name.charAt(0).toUpperCase() + typ.type.name.slice(1);
        span.innerHTML = typeName;
        span.classList.add("types-style");
        pokeTypeBox.appendChild(span);
    });
};

// Obtener estadísticas del Pokémon
let getPokemonStats = (stats) => {
    pokeStatsBox.innerHTML = '';
    stats.forEach((pokeStats) => {
        let statElem = document.createElement('div');
        let statElemName = document.createElement('span');
        let statElemValue = document.createElement('span');
        statElemName.innerHTML = pokeStats.stat.name;
        statElemValue.innerHTML = pokeStats.base_stat;
        statElem.classList.add("stat-elem");
        statElemName.classList.add("stat-name");
        statElemValue.classList.add("stat-value");
        statElem.appendChild(statElemName);
        statElem.appendChild(statElemValue);
        pokeStatsBox.appendChild(statElem);
    });
};

// ----- EVENTOS -----

// Buscar Pokémon al presionar Enter
input.addEventListener("keyup", (e) => {
    if (e.key === "Enter") getPokemon(input.value);
});

// Navegar entre Pokémon
prevButton.addEventListener("click", () => {
    if (currentPokemonId > 1) getPokemonById(currentPokemonId - 1);
});

nextButton.addEventListener("click", () => {
    getPokemonById(currentPokemonId + 1);
});

// Inicializar la lista con la primera página
document.addEventListener('DOMContentLoaded', loadMostSearchedPokemon);

// Paginación
prevPageBtn.addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        renderPokemonPage(currentPage);
    }
});

nextPageBtn.addEventListener('click', () => {
    if (currentPage < Math.ceil(totalPokemons / pokemonPerPage)) {
        currentPage++;
        renderPokemonPage(currentPage);
    }
});

// Inicializar la lista con la primera página
document.getElementById('list-link').addEventListener('click', function() {
    currentPage = 1;
    renderPokemonPage(currentPage);
});

// Guardar o incrementar la búsqueda en localStorage
function saveSearch(pokemon) {
    let searches = JSON.parse(localStorage.getItem('pokemonSearchCounts')) || {};
    let pokemonName = pokemon.toLowerCase();
    if (searches[pokemonName]) {
        searches[pokemonName]++;
    } else {
        searches[pokemonName] = 1;
    }
    localStorage.setItem('pokemonSearchCounts', JSON.stringify(searches));
}

// Cargar y mostrar los Pokémon más buscados con sus imágenes
async function loadMostSearchedPokemon() {
    let searches = JSON.parse(localStorage.getItem('pokemonSearchCounts')) || {};
    
    // Convertir el objeto en un array de [nombre, conteo] y ordenarlo por cantidad de búsquedas
    let sortedSearches = Object.entries(searches).sort((a, b) => b[1] - a[1]);

    let searchContainer = document.getElementById('most-searched-pokemon');
    searchContainer.innerHTML = '';  // Limpiar la lista

    // Mostrar solo los primeros 6 resultados
    for (let i = 0; i < Math.min(6, sortedSearches.length); i++) {
        const [pokemon, count] = sortedSearches[i];

        // Crear contenedor de la tarjeta
        let pokemonCard = document.createElement('div');
        pokemonCard.classList.add('searched-pokemon-card'); // Cambiamos a 'searched-pokemon-card'

        // Título con el nombre y conteo de búsquedas
        let pokemonName = document.createElement('h3');
        pokemonName.textContent = `${capitalizeFirstLetter(pokemon)} - Buscado ${count} ${count === 1 ? 'vez' : 'veces'}`;
        pokemonName.classList.add('searched-pokemon-title');  // Clase específica para el título
        pokemonCard.appendChild(pokemonName);

        // Crear la imagen del Pokémon
        let pokemonImg = document.createElement('img');
        pokemonImg.classList.add('searched-pokemon-img'); // Clase específica para la imagen

        // Hacer una solicitud para obtener la imagen de la API
        try {
            let response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon}`);
            let data = await response.json();
            pokemonImg.src = data.sprites.front_default;  // Imagen frontal del Pokémon
        } catch (error) {
            console.error('Error al obtener la imagen del Pokémon:', error);
            pokemonImg.alt = 'Imagen no disponible';
        }

        // Agregar la imagen al contenedor de la tarjeta
        pokemonCard.appendChild(pokemonImg);

        // Permitir hacer clic para buscar ese Pokémon de nuevo
        pokemonCard.addEventListener('click', () => getPokemon(pokemon));

        // Añadir la tarjeta al contenedor principal
        searchContainer.appendChild(pokemonCard);
    }
}
// Llamar a la función cuando se carga la página
document.addEventListener('DOMContentLoaded', loadMostSearchedPokemon);

