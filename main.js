let input = document.querySelector(".container .search-space input");
let pokemonImg = document.querySelector(".container .info-box img");
let pokemonName = document.querySelector(".container .info-box .pokemon-name");
let pokemonId = document.querySelector(".container .info-box .color-box .pokemon-id");
let pokeTypeBox = document.querySelector(".container .info-box .pokemon-types");
let colorBox = document.querySelector(".container .info-box .color-box");
let pokeStatsBox = document.querySelector(".container .info-box .pokemon-stats");
let prevButton = document.querySelector("#prev-pokemon");
let nextButton = document.querySelector("#next-pokemon");

let currentPokemonId = 1;  // Almacenamos el ID actual del Pokémon

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
    water: "#0190FF",
}

let getPokemonById = (id) => {
    if (id > 0) {  // Evitar que ID sea menor a 1
        let url = `https://pokeapi.co/api/v2/pokemon/${id}`;
        fetch(url)
            .then((res) => res.json())
            .then((data) => {
                renderPokemons(data);
                currentPokemonId = data.id;  // Actualizar el ID actual al que estamos mostrando
            })
            .catch((error) => {
                console.error("Error al obtener el Pokémon", error);
            });
    }
};

prevButton.addEventListener("click", () => {
    if (currentPokemonId > 1) {  // Solo permitir retroceder si no estamos en el primer Pokémon
        getPokemonById(currentPokemonId - 1);
    }
});

nextButton.addEventListener("click", () => {
    getPokemonById(currentPokemonId + 1);  // Avanzar al siguiente Pokémon
});

// Función para aplicar estilos a la tarjeta y a los botones de navegación

let styleCard = (color) => {
    colorBox.style.background = color;
    pokeTypeBox.querySelectorAll("span").forEach(typeColor => typeColor.style.background = color);

    // Aplicar el mismo color al fondo de los botones de navegación
    prevButton.style.background = color;
    nextButton.style.background = color;
};

// Función existente para obtener Pokémon por nombre o ID desde el input
let getPokemon = (pokemon) => {
    if (typeof pokemon === "string") {
        let url = `https://pokeapi.co/api/v2/pokemon/${pokemon.toLowerCase()}`;
        fetch(url)
            .then((res) => {
                if (!res.ok) {
                    // Si la respuesta no es exitosa, lanzar un error para manejarlo en el catch
                    throw new Error("Pokemon no encontrado");
                }
                return res.json();
            })
            .then((data) => {
                renderPokemons(data);
                currentPokemonId = data.id;  // Actualizar el ID al que acabamos de buscar
                input.value = "";  // Limpiar el campo de entrada
            })
            .catch((error) => {
                // Mostrar el mensaje Toastify cuando el Pokémon no se encuentra
                Toastify({
                    text: "Pokemon no encontrado, asegúrate que su nombre esté bien escrito.",
                    duration: 5000,
                    newWindow: true,
                    close: false,
                    gravity: "top", // `top` or `bottom`
                    position: "center", // `left`, `center` or `right`
                    stopOnFocus: true, // Prevents dismissing of toast on hover
                    className: "toastify", // Clase personalizada
                    style: {
                        background: "linear-gradient(to right, #ff5f6d, #ffc371)",  // Gradiente rojo
                    },
                    onClick: function(){} // Callback after click
                }).showToast();
                console.error(error);
            });
    }
};

let renderPokemons = (data) => {
    const sprite = data.sprites.other.dream_world.front_default;
    const name = data.name;
    const pokeId = data.id;
    const themeColor = typeColor[data.types[0].type.name]

    pokemonImg.src = sprite;
    pokemonName.innerHTML = name;
    pokemonId.innerHTML = "#" + pokeId;

    getPokemonTypes(data.types);
    styleCard(themeColor);
    getPokemonStats(data.stats);
};

let getPokemonTypes = (types) => {
    pokeTypeBox.innerHTML = "";
    types.forEach((typ) => {
        let span = document.createElement("span");
        
        // Convierte la primera letra en mayúscula y el resto en minúsculas
        let typeName = typ.type.name.charAt(0).toUpperCase() + typ.type.name.slice(1);
        span.innerHTML = typeName;
        pokeTypeBox.appendChild(span);
        span.classList.add("types-style");
    });
};

let getPokemonStats = (stats) => {
    pokeStatsBox.innerHTML = "";
    stats.forEach((pokeStats) => {
        
        let statElem = document.createElement("div");
        let statElemName = document.createElement("span");
        let statElemValue = document.createElement("span");

        statElemName.innerHTML = pokeStats.stat.name;
        statElemValue.innerHTML = pokeStats.base_stat;

        statElem.appendChild(statElemName);
        statElem.appendChild(statElemValue);

        statElem.classList.add("stat-elem");
        statElemName.classList.add("stat-name");
        statElemValue.classList.add("stat-value");

        pokeStatsBox.appendChild(statElem);
    })
}

input.addEventListener("keyup", (e) => {
    if (e.key === "Enter") {
        getPokemon(input.value);
    }
});

getPokemon(input.value);