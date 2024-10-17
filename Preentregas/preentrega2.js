

//                                 PRENTREGA #2                       //

// Función para calcular la edad basado en la fecha de nacimiento

function calcularEdad(fechaNacimiento) {

    // calcularEdad(): Calcula la edad de una persona en función de la fecha de nacimiento ingresada.
    
    let hoy = new Date();
    let fechaNac = new Date(fechaNacimiento);
    let edad = hoy.getFullYear() - fechaNac.getFullYear();
    let diferenciaMeses = hoy.getMonth() - fechaNac.getMonth();
    
    // Si el mes de hoy es menor al mes de nacimiento o si es el mismo mes pero el día aún no ha pasado, restamos un año
    
    if (diferenciaMeses < 0 || (diferenciaMeses === 0 && hoy.getDate() < fechaNac.getDate())) {
        edad--;
    }
    return edad;
}

// Función para solicitar fechas de nacimiento y calcular las edades

function ingresarFechasYCalcularEdades() {

    // Usa un bucle para solicitar fechas de nacimiento al usuario mediante un prompt(). 
    // e puede detener al escribir 'salir'. Las edades calculadas se almacenan en un array de objetos, cada uno con una fecha de nacimiento y su respectiva edad.
    
    let personas = [];
    let continuar = true;

    while (continuar) {
        let fecha = prompt(" Ingrese la fecha de nacimiento (YYYY-MM-DD) o escriba 'salir' para finalizar:");
        
        if (fecha.toLowerCase() === 'salir 😀') {
            continuar = false;
        } else {
            let edad = calcularEdad(fecha);
            personas.push({ fechaNacimiento: fecha, edad: edad });
        }
    }
    
    return personas;
}

// Función para filtrar las personas mayores a cierta edad

function filtrarPorEdadMinima(personas, edadMinima) {
    // Filtra el array de personas para devolver solo aquellas que tienen una edad mayor o igual a la que el usuario indique.
    
    return personas.filter(persona => persona.edad >= edadMinima);
}

// Ejecutar el código

let personasIngresadas = ingresarFechasYCalcularEdades();

let edadMinima = parseInt(prompt("Ingrese la edad mínima para filtrar las personas:"));
let personasFiltradas = filtrarPorEdadMinima(personasIngresadas, edadMinima);

console.log("Personas que cumplen con el criterio:");
console.log(personasFiltradas);