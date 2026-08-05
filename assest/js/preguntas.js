// Preguntas 
const quizForm = document.getElementById("quiz-form");
const resultsDiv = document.getElementById("results");

// Detectar el idioma del documento
const language = document.documentElement.lang; // Obtenemos el idioma del HTML, por ejemplo, "es" o "en"

// Mensajes en ambos idiomas
const messages = {
  correct: {
    es: "¡Respuesta correcta!",
    en: "Correct answer!"
  },
  incorrect: {
    es: "Respuesta incorrecta",
    en: "Incorrect answer"
  }
};

// Función para verificar la respuesta
function verificarRespuesta(pregunta, respuestaCorrecta, resultDivId) {
  const selectedAnswer = quizForm.elements[pregunta].value;
  const isCorrect = selectedAnswer === respuestaCorrecta;

  // Escoge los mensajes según el idioma detectado
  const resultMessage = isCorrect 
    ? messages.correct[language] 
    : messages.incorrect[language];

  const resultDiv = document.getElementById(resultDivId);

  // Limpiar las clases anteriores
  resultDiv.classList.remove('show-result', 'result-correct', 'result-incorrect');

  // Establecer el mensaje y agregar la clase correspondiente
  resultDiv.textContent = resultMessage;
  resultDiv.classList.add(isCorrect ? 'result-correct' : 'result-incorrect');
  
  // Usar un timeout para agregar la animación después de una pequeña pausa
  setTimeout(() => {
    resultDiv.classList.add('show-result');
  }, 100);
}


