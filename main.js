let input = document.querySelector(".container .search-space input");
let pokemonImg = document.querySelector(".container .info-box img");
let pokemonName = document.querySelector(".container .info-box .pokemon-name");
let pokemonId = document.querySelector(".container .info-box .color-box .pokemon-id");
let pokeTypeBox = document.querySelector(".container .info-box .pokemon-types");

let getPokemon = (pokemon) => {

    // Verifica que pokemon es una cadena antes de convertirlo en minúsculas
    
    if (typeof pokemon === "string") {
        let url = `https://pokeapi.co/api/v2/pokemon/${pokemon.toLowerCase()}`;
        fetch(url)
            .then((res) => res.json())
            .then((data) => renderPokemons(data))
    }
}

let renderPokemons = (data) => {
    const sprite = data.sprites.other.dream_world.front_default;
    const name = data.name;
    const pokeId = data.id;

    pokemonImg.src = sprite;
    pokemonName.innerHTML = name;
    pokemonId.innerHTML = "#" + pokeId;

    // Llama a getPokemonTypes en lugar de getPokemon para manejar los tipos
    getPokemonTypes(data.types);
};

let getPokemonTypes = (types) => {
    pokeTypeBox.innerHTML = "";
    types.forEach((typ) => {
        let span = document.createElement("span");
        span.innerHTML = typ.type.name;
        pokeTypeBox.appendChild(span);
        span.classList.add("types-style");
    });
};

input.addEventListener("keyup", (e) => {
    if (e.key === "Enter") {
        getPokemon(input.value);
    }
});

// Llamada inicial para Bulbasaur que es el primer pokemmon con el id #1
getPokemon("Bulbasaur");