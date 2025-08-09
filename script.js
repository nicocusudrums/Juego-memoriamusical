/*
// Valores de instrumentos musicales (4 pares)
const valoresCartas = ['🎸', '🎹', '🥁', '🎺', '🎸', '🎹', '🥁', '🎺'];

// Mezclar las cartas
const cartasMezcladas = valoresCartas.sort(() => 0.5 - Math.random());

const cartas = document.querySelectorAll('.card');
let cartaSeleccionada1 = null;
let cartaSeleccionada2 = null;
let bloqueo = false;

// Asignar valores a las cartas
cartas.forEach((carta, index) => {
    carta.dataset.valor = cartasMezcladas[index];

    carta.addEventListener('click', () => {
        if (bloqueo || carta === cartaSeleccionada1 || carta.classList.contains('acertada')) return;

        carta.textContent = carta.dataset.valor;

        if (!cartaSeleccionada1) {
            cartaSeleccionada1 = carta;
        } else {
            cartaSeleccionada2 = carta;
            bloqueo = true;

            setTimeout(() => {
                if (cartaSeleccionada1.dataset.valor === cartaSeleccionada2.dataset.valor) {
                    cartaSeleccionada1.classList.add('acertada');
                    cartaSeleccionada2.classList.add('acertada');
                } else {
                    cartaSeleccionada1.textContent = '?';
                    cartaSeleccionada2.textContent = '?';
                }

                cartaSeleccionada1 = null;
                cartaSeleccionada2 = null;
                bloqueo = false;
            }, 1000);
        }
    });
});  */

// Lista de emojis (instrumentos)
    const valoresCartas = ['🎸', '🎹', '🥁', '🎺', '🎸', '🎹', '🥁', '🎺'];

    let cartas = document.querySelectorAll('.card');
    let cartaSeleccionada1 = null;
    let cartaSeleccionada2 = null;
    let bloqueo = false;

    let tiempo = 0;
    let intervaloTiempo = null;

    // Función para mezclar array
    function mezclar(array) {
      return array.sort(() => 0.5 - Math.random());
    }

    // Asignar cartas mezcladas
    function asignarCartas() {
      const cartasMezcladas = mezclar([...valoresCartas]);

      cartas.forEach((carta, index) => {
        carta.textContent = '?';
        carta.classList.remove('acertada');
        carta.dataset.valor = cartasMezcladas[index];
      });
    }

    // Verificar si todas las cartas están adivinadas
    function verificarGanador() {
      const acertadas = document.querySelectorAll('.card.acertada').length;
      if (acertadas === cartas.length) {
        detenerTemporizador();
        setTimeout(() => {
          document.getElementById('mensaje-ganaste').style.display = 'flex';
        }, 500);
      }
    }

    // Lógica de clic
    function manejarClicCarta(carta) {
      if (bloqueo || carta.classList.contains('acertada') || carta === cartaSeleccionada1) return;

      carta.textContent = carta.dataset.valor;

      if (!cartaSeleccionada1) {
        cartaSeleccionada1 = carta;
      } else {
        cartaSeleccionada2 = carta;
        bloqueo = true;

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

    // Añadir eventos a cartas
    cartas.forEach(carta => {
      carta.addEventListener('click', () => manejarClicCarta(carta));
    });

    // Reiniciar juego
    function reiniciarJuego() {
      cartaSeleccionada1 = null;
      cartaSeleccionada2 = null;
      bloqueo = false;
      document.getElementById('mensaje-ganaste').style.display = 'none';
      asignarCartas();
      iniciarTemporizador();
    }

    // Iniciar
    asignarCartas();
    iniciarTemporizador();






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