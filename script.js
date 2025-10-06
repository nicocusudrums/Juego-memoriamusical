let valoresCartas = [];

let cartas = document.querySelectorAll('.card');
let cartaSeleccionada1 = null;
let cartaSeleccionada2 = null;
let bloqueo = false;

let tiempo = 0;
let intervaloTiempo = null;
let movimientos = 0;
let nombreJugador = '';

// Cargar las cartas desde cartas.json
fetch('cartas.json')
  .then(response => response.json())
  .then(data => {
    valoresCartas = [...data.cartas, ...data.cartas].map(carta => carta.simbolo);
    habilitarBotonComenzar();
  })
  .catch(error => {
    console.error('Error al cargar cartas:', error);
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'No se pudieron cargar las cartas. Intenta recargar la página.',
    });
  });

function habilitarBotonComenzar() {
  const btn = document.getElementById('btn-nombre');
  btn.disabled = false;
  btn.addEventListener('click', () => {
    const entrada = document.getElementById('entrada-nombre').value.trim();
    if (entrada) {
      nombreJugador = entrada;
      document.getElementById('campo-nombre').style.display = 'none';

      reiniciarJuego();
      mostrarMejorResultadoJugador();
      mostrarRanking();
    }
  });
}

function mezclar(array) {
  return array.sort(() => 0.5 - Math.random());
}

function asignarCartas() {
  const cartasMezcladas = mezclar([...valoresCartas]);
  cartas.forEach((carta, index) => {
    carta.classList.remove('acertada', 'volteada');
    carta.dataset.valor = cartasMezcladas[index];

    const back = carta.querySelector('.card-back');
    if (back) back.textContent = cartasMezcladas[index];

    const front = carta.querySelector('.card-front');
    if (front) front.textContent = '?';
  });
}

function manejarClicCarta(carta) {
  if (bloqueo || carta.classList.contains('acertada') || carta === cartaSeleccionada1) return;

  carta.classList.add('volteada');

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
        cartaSeleccionada1.classList.remove('volteada');
        cartaSeleccionada2.classList.remove('volteada');
      }
      cartaSeleccionada1 = null;
      cartaSeleccionada2 = null;
      bloqueo = false;
    }, 800);
  }
}

function asignarEventosCartas() {
  cartas.forEach(carta => {
    carta.addEventListener('click', () => manejarClicCarta(carta));
  });
}

asignarEventosCartas();

function reiniciarJuego() {
  cartaSeleccionada1 = null;
  cartaSeleccionada2 = null;
  bloqueo = false;
  tiempo = 0;
  movimientos = 0;
  actualizarTemporizador();
  actualizarContadorMovimientos();
  asignarCartas();
  iniciarTemporizador();
}

function verificarGanador() {
  const acertadas = document.querySelectorAll('.card.acertada').length;
  if (acertadas === cartas.length) {
    detenerTemporizador();

    guardarMejorResultadoJugador();

    setTimeout(() => {
      mostrarMejorResultadoJugador();
      mostrarRanking();

      Swal.fire({
        title: '🎉 ¡Ganaste! 🎉',
        html: `⏱ <strong>Tiempo:</strong> ${tiempo} segundos<br>
               🎯 <strong>Movimientos:</strong> ${movimientos}`,
        icon: 'success',
        confirmButtonText: '🔁 Jugar de nuevo',
        allowOutsideClick: false,
        allowEscapeKey: false,
        background: '#fffbe7',
      }).then(() => {
        reiniciarJuego();
      });
    }, 500);
  }
}

function actualizarTemporizador() {
  document.getElementById('temporizador').textContent = `Tiempo: ${tiempo} s`;
}

function iniciarTemporizador() {
  clearInterval(intervaloTiempo);
  intervaloTiempo = setInterval(() => {
    tiempo++;
    actualizarTemporizador();
  }, 1000);
}

function detenerTemporizador() {
  clearInterval(intervaloTiempo);
}

function actualizarContadorMovimientos() {
  document.getElementById('movimientos').textContent = `Movimientos: ${movimientos}`;
}

function guardarMejorResultadoJugador() {
  if (!nombreJugador) return;
  const todos = JSON.parse(localStorage.getItem('todosJugadores') || '{}');
  const actual = { tiempo, movimientos };

  if (!todos[nombreJugador] ||
    actual.tiempo < todos[nombreJugador].tiempo ||
    (actual.tiempo === todos[nombreJugador].tiempo && actual.movimientos < todos[nombreJugador].movimientos)) {
    todos[nombreJugador] = actual;
    localStorage.setItem('todosJugadores', JSON.stringify(todos));
  }
}

function mostrarMejorResultadoJugador() {
  const todos = JSON.parse(localStorage.getItem('todosJugadores') || '{}');
  if (todos[nombreJugador]) {
    const best = todos[nombreJugador];
    const texto = `🏆 Tu récord: ${best.tiempo}s, ${best.movimientos} movimientos`;
    document.getElementById('mejor-resultado').textContent = texto;
  } else {
    document.getElementById('mejor-resultado').textContent = `🏆 Tu récord: —`;
  }
}

function mostrarRanking() {
  const todos = JSON.parse(localStorage.getItem('todosJugadores') || '{}');
  const arr = Object.entries(todos);
  arr.sort((a, b) => {
    if (a[1].tiempo !== b[1].tiempo) return a[1].tiempo - b[1].tiempo;
    return a[1].movimientos - b[1].movimientos;
  });

  const ul = document.getElementById('lista-ranking');
  ul.innerHTML = '';
  arr.forEach(([nombre, res]) => {
    const li = document.createElement('li');
    li.textContent = `${nombre}: ${res.tiempo}s, ${res.movimientos} movimientos`;
    ul.appendChild(li);
  });
}

window.addEventListener('load', () => {
  const mensaje = document.getElementById('mensaje-bienvenida');
  mensaje.addEventListener('animationend', (e) => {
    if (e.animationName === 'fadeOut') {
      mensaje.style.display = 'none';
    }
  });
});
