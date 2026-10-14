/* ============================================================
   CONFIGURACIÓN DE LA RULETA
   Edita solo lo que está entre comillas. Guarda el archivo
   y recarga index.html en el navegador para ver los cambios.
   ============================================================ */
window.CONFIG = {

  // ---- Textos ----
  titulo: "EL CIRCO DEL DESIGN THINKING",
  subtitulo: "Gira la ruleta y que el show comience",
  textoBoton: "¡GIRAR!",

  // ---- Integrantes (puedes poner más o menos nombres) ----
  integrantes: ["Integrante 1", "Integrante 2", "Integrante 3", "Integrante 4", "Integrante 5"],

  // ---- Imagen de fondo de cada sector ----
  // Pon aquí el nombre del archivo que guardaste en la carpeta "imagenes",
  // en el mismo orden que los integrantes. Deja "" para usar solo el color.
  // Ejemplo: ["imagenes/integrante1.jpg", "", "imagenes/equipo.png", "", ""]
  imagenesFondo: ["imagenes/integrante1.jpg", "imagenes/integrante2.jpg", "imagenes/integrante3.jpg", "imagenes/integrante4.jpg", "imagenes/integrante5.jpg"],

  // ---- Sectores sorpresa ----
  // Quitados: la ruleta tiene solo los integrantes.
  // Para volver a agregar uno, escribe dentro de los corchetes, por ejemplo:
  // { nombre: "Comodín", tipo: "wild", emoji: "🎭", fondo: "" }
  // (tipo "wild" = comodín, "double" = doble puntos)
  sorpresas: [],

  // ---- Juego ----
  noRepetir: true,     // true = cada integrante sale una sola vez
  sonido: true,        // false = sin sonido

  // ---- Colores de la ruleta ----
  // Un color por sector (integrantes primero, luego sorpresas).
  // Si hay más sectores que colores, se repiten desde el inicio.
  coloresRuleta: ["#E4233B", "#2D5BFF", "#FFD23F", "#FF3D9A", "#12B886", "#7B2CFF", "#FF8A1F"],
  bordeRuleta: "#1B1033",   // color de las líneas y contornos
  textoRuleta: "#FFFFFF",   // color de los nombres en la ruleta

  // ---- Colores de la página ----
  // Pon null para que cambie sola entre modo claro y oscuro.
  colores: {
    rojo: "#E4233B",      // botón girar y franjas de carpa
    azul: "#2D5BFF",      // color de apoyo
    amarillo: "#FFD23F",  // botones
    rosa: "#FF3D9A",      // etiqueta "doble puntos"
    menta: "#12B886",     // color de apoyo
    fondo: null,          // ejemplo: "#FFF3D6"
    texto: null,          // ejemplo: "#1B1033"
    tarjeta: null         // ejemplo: "#FFFFFF"
  }
};
