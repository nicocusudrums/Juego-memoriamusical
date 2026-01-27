import { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Alert, SafeAreaView, TextInput, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// 1. Definimos la estructura de una Carta para que TypeScript no marque error
interface Carta {
  id: number;
  simbolo: string;
  volteada: boolean;
  acertada: boolean;
}

// Estructura para los récords
interface Resultado {
  tiempo: number;
  movimientos: number;
}

type GameState = 'ingresoNombre' | 'jugando' | 'finalizado';

const DATOS_CARTAS = [
  { simbolo: '🎸' }, { simbolo: '🎹' }, { simbolo: '🥁' }, { simbolo: '🎺' },
  { simbolo: '🎻' }, { simbolo: '🎷' }
];

export default function App() {
  // 2. Especificamos los tipos en useState (<Carta[]>, <Carta | null>, etc.)
  // --- Estados del Juego ---
  const [cartas, setCartas] = useState<Carta[]>([]);
  const [seleccionada1, setSeleccionada1] = useState<Carta | null>(null);
  const [bloqueo, setBloqueo] = useState<boolean>(false);
  const [movimientos, setMovimientos] = useState<number>(0);
  const [tiempo, setTiempo] = useState<number>(0);
  const [gameState, setGameState] = useState<GameState>('ingresoNombre');

  // --- Estados del Jugador y Ranking ---
  const [nombreInput, setNombreInput] = useState('');
  const [nombreJugador, setNombreJugador] = useState('');
  const [mejorResultado, setMejorResultado] = useState<Resultado | null>(null);
  const [ranking, setRanking] = useState<[string, Resultado][]>([]);

  useEffect(() => {
    // Lógica del temporizador
    let intervalo: NodeJS.Timeout;
    if (gameState === 'jugando') {
      intervalo = setInterval(() => {
        setTiempo(t => t + 1);
      }, 1000);
    }
    // Limpiamos el intervalo si el juego termina o el componente se desmonta
    return () => clearInterval(intervalo);
  }, [gameState]);

  // 3. Tipamos los argumentos de las funciones
  const mezclar = (array: Carta[]) => {
    return array.sort(() => 0.5 - Math.random());
  };

  const comenzarJuego = async () => {
    if (nombreInput.trim() === '') {
      Alert.alert('¡Un momento!', 'Por favor, ingresa tu nombre para comenzar.');
      return;
    }
    const nombre = nombreInput.trim();
    setNombreJugador(nombre);
    await cargarDatosJugador(nombre);
    reiniciarJuego();
  };

  const reiniciarJuego = () => {
    const baraja: Carta[] = [...DATOS_CARTAS, ...DATOS_CARTAS].map((item, index) => ({
      ...item,
      id: index,
      volteada: false,
      acertada: false
    }));
    
    setCartas(mezclar(baraja));
    setSeleccionada1(null);
    setBloqueo(false);
    setMovimientos(0);
    setTiempo(0);
    setGameState('jugando');
  };

  const manejarClic = (carta: Carta) => {
    if (bloqueo || carta.volteada || carta.acertada) return;

    const nuevasCartas = cartas.map(c => 
      c.id === carta.id ? { ...c, volteada: true } : c
    );
    setCartas(nuevasCartas);

    if (!seleccionada1) {
      setSeleccionada1(carta);
    } else {
      setBloqueo(true);
      setMovimientos(m => m + 1);

      // Guardamos la referencia para usarla dentro del timeout sin errores
      const cartaAnterior = seleccionada1;

      if (cartaAnterior.simbolo === carta.simbolo) {
        const cartasActualizadas = nuevasCartas.map(c => 
          c.simbolo === carta.simbolo ? { ...c, acertada: true } : c
        );
        setCartas(cartasActualizadas);
        resetearTurno();
        setTimeout(() => {
          verificarGanador(cartasActualizadas);
        }, 300);
      } else {
        setTimeout(() => {
          const cartasRestauradas = nuevasCartas.map(c => 
            c.id === carta.id || c.id === cartaAnterior.id ? { ...c, volteada: false } : c
          );
          setCartas(cartasRestauradas);
          resetearTurno();
        }, 800);
      }
    }
  };

  const resetearTurno = () => {
    setSeleccionada1(null);
    setBloqueo(false);
  };

  const verificarGanador = (cartasActuales: Carta[]) => {
    const todasAcertadas = cartasActuales.every(c => c.acertada);
    if (todasAcertadas) {
      Alert.alert(
        "🎉 ¡Ganaste!",
        `Tiempo: ${tiempo} segundos\nMovimientos: ${movimientos + 1}`,
        [{ text: "Jugar de nuevo", onPress: comenzarJuego }]
      );
      setGameState('finalizado');
      guardarMejorResultadoJugador();
    }
  };

  // --- Lógica de Récords y Ranking (como en tu script.js) ---
  const guardarMejorResultadoJugador = async () => {
    if (!nombreJugador) return;
    const resultadoActual = { tiempo, movimientos: movimientos + 1 };
    
    try {
      const jsonValue = await AsyncStorage.getItem('todosJugadores');
      const todos = jsonValue != null ? JSON.parse(jsonValue) : {};
      const recordAnterior = todos[nombreJugador];

      if (!recordAnterior || 
          resultadoActual.tiempo < recordAnterior.tiempo ||
          (resultadoActual.tiempo === recordAnterior.tiempo && resultadoActual.movimientos < recordAnterior.movimientos)) {
        todos[nombreJugador] = resultadoActual;
        await AsyncStorage.setItem('todosJugadores', JSON.stringify(todos));
        setMejorResultado(resultadoActual); // Actualiza el récord en pantalla
        actualizarRanking(todos); // Actualiza el ranking en pantalla
      }
    } catch (e) {
      console.error("Error guardando el resultado:", e);
    }
  };

  const cargarDatosJugador = async (nombre: string) => {
    try {
      const jsonValue = await AsyncStorage.getItem('todosJugadores');
      const todos = jsonValue != null ? JSON.parse(jsonValue) : {};
      if (todos[nombre]) {
        setMejorResultado(todos[nombre]);
      } else {
        setMejorResultado(null);
      }
      actualizarRanking(todos);
    } catch (e) {
      console.error("Error cargando datos:", e);
    }
  };

  const actualizarRanking = (todos: { [key: string]: Resultado }) => {
    const arr = Object.entries(todos);
    arr.sort((a, b) => {
      if (a[1].tiempo !== b[1].tiempo) return a[1].tiempo - b[1].tiempo;
      return a[1].movimientos - b[1].movimientos;
    });
    setRanking(arr.slice(0, 5)); // Mostramos el Top 5
  };

  // --- Renderizado Condicional de Pantallas ---

  if (gameState === 'ingresoNombre') {
    return (
      <SafeAreaView style={styles.contenedor}>
        <View style={styles.contenedorIngreso}>
          <Text style={styles.titulo}>Memoria Musical</Text>
          <TextInput
            style={styles.inputNombre}
            placeholder="Escribe tu nombre"
            placeholderTextColor="#888"
            value={nombreInput}
            onChangeText={setNombreInput}
          />
          <TouchableOpacity onPress={comenzarJuego} style={styles.botonComenzar}>
            <Text style={styles.textoBoton}>Comenzar a Jugar</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.contenedor}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.cabecera}>
          <Text style={styles.textoInfo}>Jugador: {nombreJugador}</Text>
          <View style={styles.statsContainer}>
            <Text style={styles.textoStats}>Tiempo: {tiempo}s</Text>
            <Text style={styles.textoStats}>Movimientos: {movimientos}</Text>
          </View>
        </View>

        <View style={styles.tablero}>
          {cartas.map((carta) => (
            <TouchableOpacity
              key={carta.id}
              style={[
                styles.carta, 
                carta.volteada || carta.acertada ? styles.cartaVolteada : styles.cartaOculta,
                carta.acertada && styles.cartaAcertada
              ]}
              onPress={() => manejarClic(carta)}
              disabled={bloqueo || carta.acertada}
            >
              <Text style={styles.textoCarta}>
                {carta.volteada || carta.acertada ? carta.simbolo : '?'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.rankingContainer}>
          <Text style={styles.rankingTitulo}>🏆 Ranking Top 5 🏆</Text>
          {mejorResultado && (
            <Text style={styles.recordPersonal}>
              Tu récord: {mejorResultado.tiempo}s, {mejorResultado.movimientos} mov.
            </Text>
          )}
          {ranking.length > 0 ? ranking.map(([nombre, res], index) => (
            <Text key={index} style={styles.rankingItem}>
              {index + 1}. {nombre}: {res.tiempo}s, {res.movimientos} mov.
            </Text>
          )) : <Text style={styles.rankingItem}>Aún no hay récords.</Text>}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: '#fffbe7',
  },
  scrollContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },
  cabecera: {
    marginBottom: 20,
    alignItems: 'center',
    width: '90%',
  },
  titulo: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  textoInfo: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  textoStats: {
    fontSize: 18,
    color: '#555',
  },
  tablero: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    width: '100%',
    maxWidth: 350,
    marginBottom: 20,
  },
  carta: {
    width: 75,
    height: 75,
    margin: 5,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#333',
  },
  cartaOculta: {
    backgroundColor: '#2e3d49',
  },
  cartaVolteada: {
    backgroundColor: '#02b3e4',
  },
  cartaAcertada: {
    backgroundColor: '#28a745', // Un color verde para indicar acierto
    borderColor: '#1e7e34',
  },
  textoCarta: {
    fontSize: 36,
    color: 'white',
  },
  // Estilos para la pantalla de ingreso de nombre
  contenedorIngreso: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    width: '100%',
  },
  inputNombre: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    width: '100%',
    maxWidth: 300,
    paddingHorizontal: 15,
    fontSize: 18,
    backgroundColor: '#fff',
    marginBottom: 20,
  },
  botonComenzar: {
    backgroundColor: '#28a745',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  textoBoton: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  },
  // Estilos para el Ranking
  rankingContainer: {
    marginTop: 20,
    width: '90%',
    maxWidth: 350,
    backgroundColor: '#ffffff',
    padding: 15,
    borderRadius: 10,
    borderColor: '#ddd',
    borderWidth: 1,
  },
  rankingTitulo: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  recordPersonal: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#02b3e4',
    textAlign: 'center',
    marginBottom: 10,
  },
  rankingItem: {
    fontSize: 16,
    color: '#333',
    marginBottom: 5,
  },
});
