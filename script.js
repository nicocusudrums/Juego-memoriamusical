/*
const valoresCartas = ['🎸', '🎹', '🥁', '🎺', '🎸', '🎹', '🥁', '🎺'];

let cartas = document.querySelectorAll('.card');
let cartaSeleccionada1 = null;
let cartaSeleccionada2 = null;
let bloqueo = false;

let tiempo = 0;
let intervaloTiempo = null;
let movimientos = 0;

function mezclar(array) {
  return array.sort(() => 0.5 - Math.random());
}

function asignarCartas() {
  const cartasMezcladas = mezclar([...valoresCartas]);

  cartas.forEach((carta, index) => {
    carta.textContent = '?';
    carta.classList.remove('acertada');
    carta.dataset.valor = cartasMezcladas[index];
  });
}

function verificarGanador() {
  const acertadas = document.querySelectorAll('.card.acertada').length;
  if (acertadas === cartas.length) {
    detenerTemporizador();


    const mensaje = `⏱ Tiempo: ${tiempo} segundos<br>🎯 Movimientos: ${movimientos}`;
    document.getElementById('detalle-ganador').innerHTML = mensaje;

    setTimeout(() => {
      document.getElementById('mensaje-ganaste').style.display = 'flex';
    }, 500);
  }
}

function manejarClicCarta(carta) {
  if (bloqueo || carta.classList.contains('acertada') || carta === cartaSeleccionada1) return;

  carta.textContent = carta.dataset.valor;

  if (!cartaSeleccionada1) {
    cartaSeleccionada1 = carta;
  } else {
    cartaSeleccionada2 = carta;
    bloqueo = true;

    movimientos++;
    actualizarContadorMovimientos();

    setTimeout(() => {
      if (cartaSeleccionada1.dataset.valor === cartaSeleccionada2.dataset.valor) {
        cartaSeleccionada1.classList.add('acertada');
        cartaSeleccionada2.classList.add('acertada');
        verificarGanador();
      } else {
        cartaSeleccionada1.textContent = '?';
        cartaSeleccionada2.textContent = '?';
      }

      cartaSeleccionada1 = null;
      cartaSeleccionada2 = null;
      bloqueo = false;
    }, 800);
  }
}

cartas.forEach(carta => {
  carta.addEventListener('click', () => manejarClicCarta(carta));
});

function reiniciarJuego() {
  cartaSeleccionada1 = null;
  cartaSeleccionada2 = null;
  bloqueo = false;
  document.getElementById('mensaje-ganaste').style.display = 'none';
  asignarCartas();
  iniciarTemporizador();
  movimientos = 0;
  actualizarContadorMovimientos();
}

function actualizarContadorMovimientos() {
  document.getElementById('movimientos').textContent = `Movimientos: ${movimientos}`;
}

function actualizarTemporizador() {
  tiempo++;
  document.getElementById('temporizador').textContent = `Tiempo: ${tiempo} s`;
}

function iniciarTemporizador() {
  tiempo = 0;
  document.getElementById('temporizador').textContent = `Tiempo: 0 s`;
  if (intervaloTiempo) clearInterval(intervaloTiempo);
  intervaloTiempo = setInterval(actualizarTemporizador, 1000);
}

function detenerTemporizador() {
  clearInterval(intervaloTiempo);
}

document.getElementById('mensaje-ganaste').style.display = 'none';
asignarCartas();
iniciarTemporizador();
movimientos = 0;
actualizarContadorMovimientos();
*/

const valoresCartas = ['🎸', '🎹', '🥁', '🎺', '🎸', '🎹', '🥁', '🎺'];

let cartas = document.querySelectorAll('.card');
let cartaSeleccionada1 = null;
let cartaSeleccionada2 = null;
let bloqueo = false;

let tiempo = 0;
let intervaloTiempo = null;
let movimientos = 0;

function mezclar(array) {
  return array.sort(() => 0.5 - Math.random());
}

function asignarCartas() {
  const cartasMezcladas = mezclar([...valoresCartas]);

  cartas.forEach((carta, index) => {
    carta.textContent = '?';
    carta.classList.remove('acertada');
    carta.dataset.valor = cartasMezcladas[index];
  });
}

function verificarGanador() {
  const acertadas = document.querySelectorAll('.card.acertada').length;
  if (acertadas === cartas.length) {
    detenerTemporizador();

    // Mostrar mensaje con tiempo y movimientos actuales
    const mensaje = `⏱ Tiempo: ${tiempo} segundos<br>🎯 Movimientos: ${movimientos}`;
    document.getElementById('detalle-ganador').innerHTML = mensaje;

    // Guardar mejor resultado con localStorage
    guardarMejorResultado();

    setTimeout(() => {
      document.getElementById('mensaje-ganaste').style.display = 'flex';
    }, 500);
  }
}

function manejarClicCarta(carta) {
  if (bloqueo || carta.classList.contains('acertada') || carta === cartaSeleccionada1) return;

  carta.textContent = carta.dataset.valor;

  if (!cartaSeleccionada1) {
    cartaSeleccionada1 = carta;
  } else {
    cartaSeleccionada2 = carta;
    bloqueo = true;

    // Aumentar movimientos y actualizar contador
    movimientos++;
    actualizarContadorMovimientos();

    setTimeout(() => {
      if (cartaSeleccionada1.dataset.valor === cartaSeleccionada2.dataset.valor) {
        cartaSeleccionada1.classList.add('acertada');
        cartaSeleccionada2.classList.add('acertada');
        verificarGanador();
      } else {
        cartaSeleccionada1.textContent = '?';
        cartaSeleccionada2.textContent = '?';
      }

      cartaSeleccionada1 = null;
      cartaSeleccionada2 = null;
      bloqueo = false;
    }, 800);
  }
}

cartas.forEach(carta => {
  carta.addEventListener('click', () => manejarClicCarta(carta));
});

function reiniciarJuego() {
  cartaSeleccionada1 = null;
  cartaSeleccionada2 = null;
  bloqueo = false;
  document.getElementById('mensaje-ganaste').style.display = 'none';
  asignarCartas();
  iniciarTemporizador();
  movimientos = 0;
  actualizarContadorMovimientos();
}

function actualizarContadorMovimientos() {
  document.getElementById('movimientos').textContent = `Movimientos: ${movimientos}`;
}

function actualizarTemporizador() {
  tiempo++;
  document.getElementById('temporizador').textContent = `Tiempo: ${tiempo} s`;
}

function iniciarTemporizador() {
  tiempo = 0;
  document.getElementById('temporizador').textContent = `Tiempo: 0 s`;
  if (intervaloTiempo) clearInterval(intervaloTiempo);
  intervaloTiempo = setInterval(actualizarTemporizador, 1000);
}

function detenerTemporizador() {
  clearInterval(intervaloTiempo);
}

// 🧠 Guardar el mejor resultado en localStorage
function guardarMejorResultado() {
  const mejor = JSON.parse(localStorage.getItem('mejorResultado'));
  const resultadoActual = { tiempo, movimientos };

  if (
    !mejor ||
    tiempo < mejor.tiempo || 
    (tiempo === mejor.tiempo && movimientos < mejor.movimientos)
  ) {
    localStorage.setItem('mejorResultado', JSON.stringify(resultadoActual));
  }

  mostrarMejorResultado();
}

// 📋 Mostrar el mejor resultado guardado
function mostrarMejorResultado() {
  const mejor = JSON.parse(localStorage.getItem('mejorResultado'));
  if (mejor) {
    const texto = `🏆 Mejor resultado: ${mejor.tiempo} s, ${mejor.movimientos} movimientos`;
    document.getElementById('mejor-resultado').innerHTML = texto;
  }
}

// 🔁 Inicialización
document.getElementById('mensaje-ganaste').style.display = 'none';
asignarCartas();
iniciarTemporizador();
movimientos = 0;
actualizarContadorMovimientos();
mostrarMejorResultado();
