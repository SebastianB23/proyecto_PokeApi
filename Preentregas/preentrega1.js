// Lista de personas con sus fechas de nacimiento

const personasRegistradas = [

    { nombre: "Diego", fechaDeNacimiento: "2019-04-10" },
    { nombre: "Camila", fechaDeNacimiento: "2013-11-21" },
    { nombre: "Wilson", fechaDeNacimiento: "1999-06-23" },
    { nombre: "Angela", fechaDeNacimiento: "2003-01-07" }
];

// Función para calcular la edad a partir de la fecha de nacimiento

function calcularEdad(fechaDeNacimiento) {
    
    const fechaActual = new Date();
    const fechaNacimiento = new Date(fechaDeNacimiento);
    
    let edad = fechaActual.getFullYear() - fechaNacimiento.getFullYear();
    
    const diferenciaMes = fechaActual.getMonth() - fechaNacimiento.getMonth();
    
    if (diferenciaMes < 0 || (diferenciaMes === 0 && fechaActual.getDate() < fechaNacimiento.getDate())) {
        edad--;
    }

    return edad;
}

// Calcular y mostrar la edad de cada persona

personasRegistradas.forEach(persona => {
    
    const edad = calcularEdad(persona.fechaDeNacimiento);
    
    console.log(`${persona.nombre} tiene ${edad} años.`);

});