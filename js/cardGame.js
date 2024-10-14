let cartaRobadaElement = document.getElementById('imgCartaRobada');

// Función que devuelve el path de una imagen de una carta dependiendo de su tipo
function cogerImagenCarta(carta) {
    cartaRobadaElement.src = "./img/card/robot_" + String(Math.floor(Math.random() * 20) + 1).padStart(2, '0') + ".png";

    if (carta.tipo === tipos.DESACTIVADOR) {
        cartaRobadaElement.src = `./img/herramienta/herramienta.png`;
    } else if (carta.tipo === tipos.BOMBA) {
        cartaRobadaElement.src = `./img/bomba/bomba.png`;
    } else if (carta.tipo === tipos.SALTARTURNO) {
        cartaRobadaElement.src = `./img/pasarTurno/pasarTurno.png`;
    }

    console.log("Ruta de la imagen seleccionada:", cartaRobadaElement.src);
    return cartaRobadaElement.src;
}

//Hago la clase Carta
class Card {
    constructor(tipo, puntos = 0) {
        this.tipo = tipo;
        this.img = '';
        this.puntos = puntos;
    }
}

//Defino los tipos de cartas
const tipos = {
    BOMBA: 'BOMBA',
    DESACTIVADOR: 'DESACTIVADOR',
    SALTARTURNO: 'SALTARTURNO',
    PUNTOS: 'PUNTOS'
};

//Hago la clase Baraja
class Baraja {
    constructor() {
        this.cards = [];
    }

    //Creo una baraja
    crearBaraja() {
        let baraja = [];
        for (let i = 0; i < 33; i++) {
            baraja.push(new Card(tipos.PUNTOS, Math.floor(Math.random() * 10) + 1));
        }
        for (let i = 0; i < 10; i++) {
            baraja.push(new Card(tipos.SALTARTURNO));
        }
        for (let i = 0; i < 6; i++) {
            baraja.push(new Card(tipos.DESACTIVADOR));
        }
        for (let i = 0; i < 6; i++) {
            baraja.push(new Card(tipos.BOMBA));
        }
        return baraja;
    }

    //Mezclo la baraja ya creada
    mezclar(barajaCartas) {
        for (let i = barajaCartas.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [barajaCartas[i], barajaCartas[j]] = [barajaCartas[j], barajaCartas[i]];
        }
        return barajaCartas;
    }

    //Robo una carta de la baraja
    robarCarta(jugador) {
        if (this.cards.length > 0) {
            const carta = this.cards.pop();
            jugador.addCarta(carta);
            const imgCarta = cogerImagenCarta(carta);
            return { carta, imgCarta };
        } else {
            alert('No hay cartas en la baraja');
            console.log('No hay más cartas en la baraja');
            return null;
        }
    }
}

//Hago la clase Jugador
class Jugador {
    constructor(nombre) {
        this.nombre = nombre;
        this.cartas = [];
        this.puntosTotales = 0;
        this.eliminado = false; // Jugador no eliminado por defecto
    }

    //Añado una carta al jugador
    addCarta(carta) {
        this.cartas.push(carta);
        if (carta.tipo === tipos.PUNTOS) {
            this.puntosTotales += carta.puntos;
        }
    }

    //Cuento las cartas del jugador
    contarCartas() {
        return this.cartas.length;
    }

    //Cuenta las cartas de un tipo especifico
    contarCartasTipo(tipo) {
        return this.cartas.filter(carta => carta.tipo === tipo).length;
    }

    //Elimina las cartas de un tipo especifico
    eliminarCartaTipo(tipo) {
        const indice = this.cartas.findIndex(carta => carta.tipo === tipo);
        if (indice !== -1) {
            this.cartas.splice(indice, 1); // Eliminar una carta de ese tipo
        }
    }
    //Calcula los puntos totales del jugador
    calcularPuntosTotales() {
        return this.puntosTotales;
    }
    //Comprueba si el jugador ha sido eliminado
    estaEliminado() {
        return this.eliminado;
    }
}

// Creo la baraja
let baraja = new Baraja();
baraja.cards = baraja.mezclar(baraja.crearBaraja());
console.log("Baraja de cartas:", baraja.cards);
// Creo los jugadores
let jugador1 = new Jugador("Jugador 1");
let jugador2 = new Jugador("Jugador 2");
let jugador3 = new Jugador("Jugador 3");

let jugadores = [jugador1, jugador2, jugador3];
let jugadorActual = 0;

//Hago una función para actualizar las estadísticas de los jugadores
function actualizarEstadisticasJugador(jugador, idJugador) {
    if (!jugador.estaEliminado()) {//Compruebo si ha sido eliminado
        document.getElementById(`J${idJugador}NumCartas`).innerText = `⚪️ Número de cartas: ${jugador.contarCartas()}`;
        document.getElementById(`J${idJugador}Puntos`).innerText = `⚪️ Puntos totales: ${jugador.calcularPuntosTotales()}`;
        document.getElementById(`J${idJugador}saltoTurno`).innerText = `⚪️ Cartas salto turno: ${jugador.contarCartasTipo(tipos.SALTARTURNO)}`;
        document.getElementById(`J${idJugador}Desactivacion`).innerText = `⚪️ Cartas desactivación: ${jugador.contarCartasTipo(tipos.DESACTIVADOR)}`;
     
    } else {
        document.getElementById(`J${idJugador}Status`).innerText = `⚠️ ELIMINADO`;
        document.getElementById(`J${idJugador}NumCartas`).innerText = ``; // Vacía la info de cartas
        document.getElementById(`J${idJugador}Puntos`).innerText = ``;   // Vacía la info de puntos
        document.getElementById(`J${idJugador}saltoTurno`).innerText = ``;
        document.getElementById(`J${idJugador}Desactivacion`).innerText = ``;
    }
}

//Hago una funcion para cambiar al siguiente jugador
function siguienteJugador() {
    let jugadoresActivos = jugadores.filter(jugador => !jugador.estaEliminado());
    
    if (jugadoresActivos.length <= 1) {
        console.log(`El juego ha terminado. ${jugadoresActivos[0].nombre} es el ganador.`);
        alert(`${jugadoresActivos[0].nombre} ha ganado el juego.`);
        return; // Salir del juego
    }
    
    do {
        jugadorActual = (jugadorActual + 1) % jugadores.length;
    } while (jugadores[jugadorActual].estaEliminado());
}

//Le añado un evento al botón robar
document.getElementById('btnRobar').addEventListener('click', function () {
    if (jugadores[jugadorActual].estaEliminado()) {
        console.log(`El jugador actual (${jugadores[jugadorActual].nombre}) ha sido eliminado y no puede robar.`);
        siguienteJugador();
        return;
    }

    let resultado = baraja.robarCarta(jugadores[jugadorActual]);
    if (resultado) {
        const { carta, imgCarta } = resultado;
        cartaRobadaElement.src = imgCarta;
        actualizarEstadisticasJugador(jugadores[jugadorActual], jugadorActual + 1);

        if (carta.tipo === tipos.BOMBA) {
            if (jugadores[jugadorActual].contarCartasTipo(tipos.DESACTIVADOR) > 0) {
                console.log(`${jugadores[jugadorActual].nombre} desactiva la BOMBA con una carta DESACTIVADOR.`);
                jugadores[jugadorActual].eliminarCartaTipo(tipos.DESACTIVADOR); // Elimino 1 carta de desactivación
                actualizarEstadisticasJugador(jugadores[jugadorActual], jugadorActual + 1);
            } else {
                console.log(`${jugadores[jugadorActual].nombre} ha sido eliminado por la carta BOMBA.`);
                jugadores[jugadorActual].eliminado = true;
                actualizarEstadisticasJugador(jugadores[jugadorActual], jugadorActual + 1);
            }
        }

        siguienteJugador(); // Pasa de turno al siguiente jugador que no esté eliminado
        console.log(`Es el turno del Jugador ${jugadorActual + 1}.`);
    }
});

//Le añado un evento al botón Saltar Turno
document.getElementById('btnSaltarTurno').addEventListener('click', function () {
    if (jugadores[jugadorActual].contarCartasTipo(tipos.SALTARTURNO) > 0) {
        let indiceSaltarTurno = jugadores[jugadorActual].cartas.findIndex(carta => carta.tipo === tipos.SALTARTURNO);
        if (indiceSaltarTurno !== -1) {
            jugadores[jugadorActual].cartas.splice(indiceSaltarTurno, 1);
            actualizarEstadisticasJugador(jugadores[jugadorActual], jugadorActual + 1);
            siguienteJugador();
        }
    } else {
        alert("No tienes cartas para saltar el turno.");
    }
});
