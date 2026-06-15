/* =========================================================
   CURSO DE PYTHON — JAVASCRIPT
   Organizado por módulos: navegación, tema, animaciones,
   "ejecución" simulada de código, simuladores, ejercicios
   y quiz interactivo.
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {

  /* =======================================================
     1. NAVEGACIÓN: menú móvil, resaltado de sección activa
     ======================================================= */
  const nav = document.getElementById('nav');
  const navBurger = document.getElementById('navBurger');
  const navLinks = document.getElementById('navLinks');
  const navLinkItems = document.querySelectorAll('.nav__link');
  const sections = document.querySelectorAll('main section[id]');

  // Abrir / cerrar menú en móviles
  navBurger.addEventListener('click', () => {
    navLinks.classList.toggle('is-open');
    navBurger.classList.toggle('is-active');
  });

  // Cerrar el menú móvil al hacer clic en un enlace
  navLinkItems.forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('is-open');
      navBurger.classList.remove('is-active');
    });
  });

  // Botón "Comenzar Curso": desplaza suavemente a la primera lección
  const startCourseBtn = document.getElementById('startCourseBtn');
  startCourseBtn.addEventListener('click', () => {
    document.getElementById('que-es-python').scrollIntoView({ behavior: 'smooth' });
  });

  /* =======================================================
     2. MODO OSCURO / MODO CLARO
     ======================================================= */
  const themeToggle = document.getElementById('themeToggle');
  const themeIcon = document.getElementById('themeIcon');
  const root = document.documentElement;

  // Recuperamos preferencia guardada (si existe) o usamos modo claro por defecto
  let currentTheme = 'light';
  try {
    const saved = window.localStorage ? window.localStorage.getItem('curso-python-theme') : null;
    if (saved) currentTheme = saved;
  } catch (e) {
    // Si localStorage no está disponible, seguimos con el valor por defecto
  }

  applyTheme(currentTheme);

  themeToggle.addEventListener('click', () => {
    currentTheme = currentTheme === 'light' ? 'dark' : 'light';
    applyTheme(currentTheme);
    try {
      if (window.localStorage) window.localStorage.setItem('curso-python-theme', currentTheme);
    } catch (e) { /* sin almacenamiento disponible, no pasa nada */ }
  });

  function applyTheme(theme) {
    if (theme === 'dark') {
      root.setAttribute('data-theme', 'dark');
      themeIcon.textContent = '🌙';
    } else {
      root.removeAttribute('data-theme');
      themeIcon.textContent = '☀️';
    }
  }

  /* =======================================================
     3. ANIMACIÓN FADE-IN AL HACER SCROLL (IntersectionObserver)
     ======================================================= */
  const fadeEls = document.querySelectorAll('.fade-in');

  const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        fadeObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  fadeEls.forEach(el => fadeObserver.observe(el));

  /* =======================================================
     4. RESALTAR ENLACE DE NAVEGACIÓN SEGÚN SECCIÓN VISIBLE
        + BARRA DE PROGRESO DEL CURSO
     ======================================================= */
  const progressFill = document.getElementById('progressFill');
  const progressLabel = document.getElementById('progressLabel');

  // Lecciones que cuentan para el progreso (excluye hero y contacto)
  const lessonIds = [
    'que-es-python', 'variables', 'operadores', 'condicionales',
    'ciclos', 'funciones', 'listas', 'diccionarios', 'ejercicios', 'quiz'
  ];

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');

        // Resaltar el enlace correspondiente
        navLinkItems.forEach(link => {
          link.classList.toggle('is-active', link.getAttribute('href') === '#' + id);
        });

        // Actualizar barra de progreso si es una lección
        const lessonIndex = lessonIds.indexOf(id);
        if (lessonIndex !== -1) {
          const completedCount = lessonIndex + 1;
          const percent = Math.round((completedCount / lessonIds.length) * 100);
          progressFill.style.width = percent + '%';
          progressLabel.textContent =
            percent + '% completado · Lección actual: ' + sectionTitle(id);
        }
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(section => sectionObserver.observe(section));

  function sectionTitle(id) {
    const titles = {
      'inicio': 'Inicio',
      'que-es-python': '¿Qué es Python?',
      'variables': 'Variables',
      'operadores': 'Operadores',
      'condicionales': 'Condicionales',
      'ciclos': 'Ciclos',
      'funciones': 'Funciones',
      'listas': 'Listas',
      'diccionarios': 'Diccionarios',
      'ejercicios': 'Ejercicios',
      'quiz': 'Quiz',
      'contacto': 'Contacto'
    };
    return titles[id] || id;
  }

  /* =======================================================
     5. BOTÓN "VOLVER ARRIBA"
     ======================================================= */
  const backToTop = document.getElementById('backToTop');

  window.addEventListener('scroll', () => {
    backToTop.classList.toggle('is-visible', window.scrollY > 600);
  });

  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* =======================================================
     6. TERMINAL ANIMADA EN EL HERO (efecto de "escritura")
     ======================================================= */
  const terminalCode = document.getElementById('terminalCode');

  const terminalProgram =
`# Tu primer programa en Python
nombre = "Estudiante"
print("¡Hola, " + nombre + "!")
print("Bienvenido al curso de Python")

for i in range(1, 4):
    print("Paso", i, "completado ✔")`;

  typeWriter(terminalCode, terminalProgram, 28);

  function typeWriter(element, text, speed) {
    let index = 0;
    function step() {
      if (index <= text.length) {
        element.textContent = text.slice(0, index);
        index++;
        setTimeout(step, speed);
      } else {
        // Al terminar, esperamos un momento y reiniciamos
        setTimeout(() => {
          element.textContent = '';
          index = 0;
          step();
        }, 4000);
      }
    }
    step();
  }

  /* =======================================================
     7. "EJECUTOR" DE CÓDIGO PYTHON SIMULADO
        Cada bloque de código tiene una salida ya calculada
        que se muestra con un pequeño efecto de tipeo.
     ======================================================= */
  const codeOutputs = {
    codeVariables: 'Juan\n20\n1.75\nTrue',
    codeAritmeticos: '13\n30\n3',
    codeRelacionales: 'False\nTrue\nTrue\nFalse',
    codeCondicionales: 'Eres mayor de edad',
    codeFor: '0\n1\n2\n3\n4',
    codeWhile: '0\n1\n2\n3\n4',
    codeFuncion: '8'
  };

  document.querySelectorAll('[data-run]').forEach(button => {
    button.addEventListener('click', () => {
      const codeId = button.getAttribute('data-run');
      const outputId = button.getAttribute('data-output');
      const outputEl = document.getElementById(outputId);
      const result = codeOutputs[codeId] || '';

      outputEl.innerHTML = '';
      outputEl.classList.remove('code-output__placeholder');

      // Efecto de tipeo simple para la salida
      let i = 0;
      function typeOutput() {
        if (i <= result.length) {
          outputEl.textContent = result.slice(0, i);
          i++;
          requestAnimationFrame(() => setTimeout(typeOutput, 18));
        }
      }
      typeOutput();
    });
  });

  /* =======================================================
     8. EXPLICACIÓN AL PASAR EL CURSOR (Sección Funciones)
     ======================================================= */
  const hoverExplanation = document.getElementById('hoverExplanation');
  const hoverLines = document.querySelectorAll('.hoverline');

  hoverLines.forEach(line => {
    line.addEventListener('mouseenter', () => {
      hoverExplanation.textContent = line.getAttribute('data-explain');
    });
  });

  /* =======================================================
     9. SIMULADOR DE LA FUNCIÓN suma(a, b)
     ======================================================= */
  const simA = document.getElementById('simA');
  const simB = document.getElementById('simB');
  const simRun = document.getElementById('simRun');
  const simResult = document.getElementById('simResult');

  simRun.addEventListener('click', () => {
    const a = Number(simA.value);
    const b = Number(simB.value);

    if (Number.isNaN(a) || Number.isNaN(b)) {
      simResult.innerHTML = '⚠️ Por favor ingresa dos números válidos para <code class="inline-code">a</code> y <code class="inline-code">b</code>.';
      return;
    }

    const resultado = a + b;
    simResult.innerHTML =
      '<code class="inline-code">def suma(a,b): return a+b</code><br>' +
      'suma(' + a + ', ' + b + ') → <strong>resultado = ' + resultado + '</strong><br>' +
      '<code class="inline-code">print(resultado)</code> mostraría: <strong>' + resultado + '</strong>';
  });

  /* =======================================================
     10. SIMULADOR DE LISTA (frutas)
     ======================================================= */
  const listVisual = document.getElementById('listVisual');
  const listLen = document.getElementById('listLen');
  const listResult = document.getElementById('listResult');

  const initialFruits = ['"manzana"', '"pera"', '"uva"'];
  let fruits = [...initialFruits];

  function renderList() {
    listVisual.innerHTML = '';
    fruits.forEach(item => {
      const div = document.createElement('div');
      div.className = 'list-visual__item';
      div.textContent = item;
      listVisual.appendChild(div);
    });
    listLen.textContent = fruits.length;
  }

  document.querySelectorAll('[data-list-action]').forEach(button => {
    button.addEventListener('click', () => {
      const action = button.getAttribute('data-list-action');
      let message = '';

      switch (action) {
        case 'append':
          fruits.push('"mango"');
          message = 'Se agregó <code class="inline-code">"mango"</code> al final de la lista.';
          break;
        case 'insert':
          fruits.splice(1, 0, '"kiwi"');
          message = 'Se insertó <code class="inline-code">"kiwi"</code> en la posición 1 (segundo lugar).';
          break;
        case 'remove':
          if (fruits.includes('"pera"')) {
            fruits.splice(fruits.indexOf('"pera"'), 1);
            message = 'Se eliminó la primera coincidencia de <code class="inline-code">"pera"</code>.';
          } else {
            message = '<code class="inline-code">"pera"</code> ya no está en la lista.';
          }
          break;
        case 'pop':
          if (fruits.length > 0) {
            const removed = fruits.pop();
            message = 'Se eliminó y devolvió el último elemento: <code class="inline-code">' + removed + '</code>.';
          } else {
            message = 'La lista está vacía, no hay nada que eliminar.';
          }
          break;
        case 'reset':
          fruits = [...initialFruits];
          message = 'La lista volvió a su estado original.';
          break;
      }

      renderList();
      listResult.innerHTML =
        '<code class="inline-code">len(frutas)</code> = <strong>' + fruits.length + '</strong><br>' + message;
    });
  });

  renderList();

  /* =======================================================
     11. TABLA INTERACTIVA DE DICCIONARIO (persona)
     ======================================================= */
  const dictTable = document.getElementById('dictTable').querySelector('tbody');
  const dictAdd = document.getElementById('dictAdd');
  const dictReset = document.getElementById('dictReset');

  const initialDictHTML = dictTable.innerHTML;

  dictTable.addEventListener('click', (e) => {
    const button = e.target.closest('[data-dict-action="delete"]');
    if (!button) return;
    const row = button.closest('tr');
    row.style.transition = 'opacity 0.25s ease';
    row.style.opacity = '0';
    setTimeout(() => row.remove(), 220);
  });

  dictAdd.addEventListener('click', () => {
    // Evitar agregar la fila más de una vez
    if (dictTable.querySelector('tr[data-key="pais"]')) return;

    const row = document.createElement('tr');
    row.setAttribute('data-key', 'pais');
    row.innerHTML = '<td>"pais"</td><td>"México"</td><td></td>';
    row.style.opacity = '0';
    dictTable.appendChild(row);
    requestAnimationFrame(() => {
      row.style.transition = 'opacity 0.25s ease';
      row.style.opacity = '1';
    });
  });

  dictReset.addEventListener('click', () => {
    dictTable.innerHTML = initialDictHTML;
  });

  /* =======================================================
     12. EJERCICIOS (20 ejercicios generados dinámicamente)
     ======================================================= */
  const exercisesData = [
    {
      statement: '1. Crea un programa que determine si un número es par o impar.',
      hint: 'Usa el operador módulo (%). Si el resto de dividir entre 2 es 0, el número es par.',
      solution: `numero = 8
if numero % 2 == 0:
    print("Es par")
else:
    print("Es impar")`,
      explanation: 'Se calcula el resto de dividir "numero" entre 2 con %. Si el resto es 0, el número se puede dividir exactamente entre 2, por lo que es par; en cualquier otro caso, es impar.'
    },
    {
      statement: '2. Pide al usuario su nombre (puedes usar una variable fija) y muestra un saludo personalizado.',
      hint: 'Usa una variable de tipo string y la función print() concatenando texto con +.',
      solution: `nombre = "Ana"
print("Hola, " + nombre + ". ¡Bienvenida!")`,
      explanation: 'Guardamos el nombre en una variable de texto y luego usamos print() para mostrar un mensaje combinando texto fijo con el valor de la variable mediante el operador +.'
    },
    {
      statement: '3. Calcula el área de un rectángulo cuya base es 8 y altura es 5.',
      hint: 'El área de un rectángulo es base * altura.',
      solution: `base = 8
altura = 5
area = base * altura
print("El área es:", area)`,
      explanation: 'Guardamos los valores de base y altura en variables, multiplicamos para obtener el área y la mostramos con print(). La coma en print() separa el texto del valor numérico.'
    },
    {
      statement: '4. Determina si un número es positivo, negativo o cero.',
      hint: 'Necesitarás if, elif y else para cubrir los tres casos.',
      solution: `numero = -5
if numero > 0:
    print("Es positivo")
elif numero < 0:
    print("Es negativo")
else:
    print("Es cero")`,
      explanation: 'Primero verificamos si el número es mayor que 0 (positivo). Si no, verificamos con elif si es menor que 0 (negativo). Si ninguna de las anteriores se cumple, solo queda la posibilidad de que sea 0.'
    },
    {
      statement: '5. Imprime los números del 1 al 10 usando un ciclo for.',
      hint: 'Recuerda que range(1, 11) genera números del 1 al 10 (el límite superior no se incluye).',
      solution: `for numero in range(1, 11):
    print(numero)`,
      explanation: 'range(1, 11) genera una secuencia desde 1 hasta 10 (sin incluir el 11). El ciclo for recorre esa secuencia y print() muestra cada número en una línea distinta.'
    },
    {
      statement: '6. Calcula la suma de los números del 1 al 100 usando un ciclo.',
      hint: 'Crea una variable "suma" en 0 y ve sumando cada número del ciclo a esa variable.',
      solution: `suma = 0
for numero in range(1, 101):
    suma += numero
print("La suma es:", suma)`,
      explanation: 'Iniciamos "suma" en 0. En cada repetición del ciclo, sumamos el valor actual de "numero" a "suma" usando +=. Al terminar el ciclo, "suma" contiene el total de 1 + 2 + ... + 100.'
    },
    {
      statement: '7. Crea un programa que muestre la tabla de multiplicar del 5 (del 1 al 10).',
      hint: 'Usa un ciclo for con range(1, 11) y multiplica 5 por cada valor.',
      solution: `for i in range(1, 11):
    print("5 x", i, "=", 5 * i)`,
      explanation: 'El ciclo recorre los números del 1 al 10. En cada repetición, multiplicamos 5 por el número actual (i) y mostramos la operación completa junto con su resultado.'
    },
    {
      statement: '8. Crea una función que reciba un número y devuelva su cuadrado.',
      hint: 'Usa def para definir la función, un parámetro y return para devolver el resultado.',
      solution: `def cuadrado(numero):
    return numero ** 2

print(cuadrado(4))`,
      explanation: 'La función "cuadrado" recibe un parámetro llamado "numero" y devuelve ese número elevado a la 2 (su cuadrado) usando el operador **. Al llamarla con cuadrado(4), obtenemos 16.'
    },
    {
      statement: '9. Crea una función que reciba dos números y devuelva el mayor de los dos.',
      hint: 'Puedes usar un condicional if/else dentro de la función para comparar los dos valores.',
      solution: `def mayor(a, b):
    if a > b:
        return a
    else:
        return b

print(mayor(10, 7))`,
      explanation: 'La función compara "a" y "b" con el operador >. Si "a" es mayor, lo devuelve; si no, devuelve "b". Al llamarla con mayor(10, 7), como 10 > 7, la función devuelve 10.'
    },
    {
      statement: '10. Crea una lista con tus 3 colores favoritos y muéstrala completa.',
      hint: 'Recuerda que las listas se crean con corchetes [ ] y los elementos van separados por comas.',
      solution: `colores = ["azul", "verde", "amarillo"]
print(colores)`,
      explanation: 'Se crea una lista llamada "colores" con tres elementos de texto. print(colores) muestra la lista completa, con sus corchetes y comillas, tal como se almacena en memoria.'
    },
    {
      statement: '11. Agrega un nuevo color a la lista del ejercicio anterior usando append().',
      hint: 'append() siempre agrega el elemento al final de la lista.',
      solution: `colores = ["azul", "verde", "amarillo"]
colores.append("rojo")
print(colores)`,
      explanation: 'append("rojo") agrega el elemento "rojo" al final de la lista "colores". Después de esta línea, la lista contiene cuatro elementos en lugar de tres.'
    },
    {
      statement: '12. Recorre una lista de números e imprime solo los que son pares.',
      hint: 'Combina un ciclo for con un condicional if que use el operador % (módulo).',
      solution: `numeros = [1, 2, 3, 4, 5, 6, 7, 8]

for numero in numeros:
    if numero % 2 == 0:
        print(numero)`,
      explanation: 'El ciclo for recorre cada elemento de la lista "numeros", uno por uno. Dentro del ciclo, el if comprueba si el número es divisible entre 2 (par); si lo es, se imprime.'
    },
    {
      statement: '13. Crea un diccionario que represente un libro con título, autor y año, y muestra cada dato.',
      hint: 'Un diccionario usa llaves { } con pares clave: valor. Accede a cada valor con su clave entre corchetes.',
      solution: `libro = {
    "titulo": "Cien años de soledad",
    "autor": "Gabriel García Márquez",
    "año": 1967
}

print(libro["titulo"])
print(libro["autor"])
print(libro["año"])`,
      explanation: 'Se crea un diccionario "libro" con tres claves: "titulo", "autor" y "año". Cada valor se accede escribiendo el nombre del diccionario seguido de la clave entre corchetes, como libro["titulo"].'
    },
    {
      statement: '14. Recorre un diccionario e imprime todas sus claves junto con sus valores.',
      hint: 'Usa el método .items() dentro de un ciclo for para obtener clave y valor al mismo tiempo.',
      solution: `persona = {"nombre": "Carlos", "edad": 20, "ciudad": "México"}

for clave, valor in persona.items():
    print(clave, ":", valor)`,
      explanation: '.items() devuelve pares de clave y valor. El ciclo for asigna en cada repetición la clave a la variable "clave" y el valor correspondiente a la variable "valor", permitiendo imprimir ambos juntos.'
    },
    {
      statement: '15. Pide (o define) la edad de una persona y muestra un mensaje distinto según si es niño, adolescente o adulto.',
      hint: 'Puedes usar varios elif: por ejemplo, menor de 13, entre 13 y 17, y 18 o más.',
      solution: `edad = 15

if edad < 13:
    print("Eres un niño/a")
elif edad < 18:
    print("Eres un adolescente")
else:
    print("Eres un adulto")`,
      explanation: 'Python evalúa las condiciones en orden. Si "edad" es menor a 13 cae en el primer caso. Si no, pero es menor a 18, cae en el elif. Si ninguna condición anterior se cumple, se ejecuta el else (18 o más).'
    },
    {
      statement: '16. Crea un programa que cuente cuántos números de una lista son mayores a 10.',
      hint: 'Usa una variable contador inicializada en 0 y suma 1 cada vez que se cumpla la condición.',
      solution: `numeros = [4, 12, 7, 25, 9, 15]
contador = 0

for numero in numeros:
    if numero > 10:
        contador += 1

print("Números mayores a 10:", contador)`,
      explanation: 'Iniciamos "contador" en 0. El ciclo recorre cada número de la lista; si es mayor a 10, sumamos 1 a "contador" con +=. Al final, "contador" tiene el total de números que cumplieron la condición.'
    },
    {
      statement: '17. Crea una función que reciba una lista de números y devuelva el promedio.',
      hint: 'El promedio es la suma de todos los elementos dividida entre la cantidad de elementos (len).',
      solution: `def promedio(numeros):
    return sum(numeros) / len(numeros)

print(promedio([10, 20, 30]))`,
      explanation: 'sum(numeros) suma todos los elementos de la lista, y len(numeros) cuenta cuántos elementos tiene. Al dividir la suma entre la cantidad, obtenemos el promedio. Con [10, 20, 30], el resultado es 20.0.'
    },
    {
      statement: '18. Crea un programa que invierta el orden de una lista sin usar funciones especiales (usa un ciclo).',
      hint: 'Crea una lista vacía y, recorriendo la original desde el final, usa append() para construir la nueva lista.',
      solution: `original = [1, 2, 3, 4, 5]
invertida = []

for i in range(len(original) - 1, -1, -1):
    invertida.append(original[i])

print(invertida)`,
      explanation: 'range(len(original) - 1, -1, -1) genera índices desde el último hasta el 0, en orden descendente. En cada paso, tomamos el elemento en esa posición de "original" y lo agregamos a "invertida" con append().'
    },
    {
      statement: '19. Crea un programa que combine dos diccionarios en uno solo.',
      hint: 'Puedes usar el método .update() para agregar las claves y valores de un diccionario a otro.',
      solution: `datos_personales = {"nombre": "Luisa", "edad": 22}
datos_contacto = {"correo": "luisa@correo.com", "ciudad": "Bogotá"}

datos_personales.update(datos_contacto)
print(datos_personales)`,
      explanation: '.update() toma todas las claves y valores de "datos_contacto" y los agrega a "datos_personales". Si alguna clave ya existiera en ambos, el valor del diccionario usado en update() sobrescribiría al original.'
    },
    {
      statement: '20. Crea un programa final que combine variables, condicionales, ciclos, funciones, listas y diccionarios: un mini "registro de notas" que calcule el promedio de un estudiante y diga si aprobó.',
      hint: 'Define una función que reciba una lista de notas, calcule el promedio con sum() y len(), y luego usa un if para comparar el promedio con la nota mínima de aprobación (por ejemplo, 6).',
      solution: `def calcular_promedio(notas):
    return sum(notas) / len(notas)

estudiante = {
    "nombre": "Pedro",
    "notas": [8, 6, 9, 7]
}

promedio = calcular_promedio(estudiante["notas"])
print("Promedio de", estudiante["nombre"] + ":", promedio)

if promedio >= 6:
    print("¡Aprobado!")
else:
    print("No aprobado")`,
      explanation: 'Este programa combina todo lo aprendido: un diccionario guarda los datos del estudiante (incluyendo una lista de notas), una función calcula el promedio usando sum() y len(), y un condicional compara ese promedio con la nota mínima para decidir el mensaje final.'
    }
  ];

  const exercisesContainer = document.getElementById('exercisesContainer');

  exercisesData.forEach((ex, index) => {
    const exerciseEl = document.createElement('article');
    exerciseEl.className = 'exercise fade-in';

    exerciseEl.innerHTML = `
      <span class="exercise__number">Ejercicio ${index + 1} de ${exercisesData.length}</span>
      <h3 class="exercise__statement">${ex.statement}</h3>
      <div class="exercise__actions">
        <button class="btn btn--small btn--ghost" data-toggle="hint">Mostrar pista</button>
        <button class="btn btn--small btn--primary" data-toggle="solution">Mostrar solución</button>
      </div>
      <div class="exercise__panel exercise__panel--hint">💡 <strong>Pista:</strong> ${ex.hint}</div>
      <div class="exercise__panel exercise__panel--solution">
        <strong>✅ Solución:</strong>
        <pre>${ex.solution}</pre>
        <p>${ex.explanation}</p>
      </div>
    `;

    exercisesContainer.appendChild(exerciseEl);

    // Re-observar para el efecto fade-in (se creó después de la observación inicial)
    fadeObserver.observe(exerciseEl);

    const hintBtn = exerciseEl.querySelector('[data-toggle="hint"]');
    const solutionBtn = exerciseEl.querySelector('[data-toggle="solution"]');
    const hintPanel = exerciseEl.querySelector('.exercise__panel--hint');
    const solutionPanel = exerciseEl.querySelector('.exercise__panel--solution');

    hintBtn.addEventListener('click', () => {
      const isOpen = hintPanel.classList.toggle('is-open');
      hintBtn.textContent = isOpen ? 'Ocultar pista' : 'Mostrar pista';
    });

    solutionBtn.addEventListener('click', () => {
      const isOpen = solutionPanel.classList.toggle('is-open');
      solutionBtn.textContent = isOpen ? 'Ocultar solución' : 'Mostrar solución';
    });
  });

  /* =======================================================
     13. QUIZ INTERACTIVO (15 PREGUNTAS)
     ======================================================= */
  const quizData = [
    { question: '¿En qué año se publicó la primera versión de Python?', options: ['1985', '1991', '2000', '2010'], correct: 1 },
    { question: '¿Quién creó el lenguaje Python?', options: ['Linus Torvalds', 'Guido van Rossum', 'Dennis Ritchie', 'James Gosling'], correct: 1 },
    { question: '¿Cuál de los siguientes es un tipo de dato de Python para texto?', options: ['int', 'bool', 'string', 'float'], correct: 2 },
    { question: '¿Qué símbolo se usa para asignar un valor a una variable?', options: ['==', ':', '=', '=>'], correct: 2 },
    { question: '¿Qué operador se usa para obtener el resto de una división?', options: ['/', '//', '%', '**'], correct: 2 },
    { question: '¿Qué devuelve la expresión 10 // 3?', options: ['3.33', '1', '3', '0'], correct: 2 },
    { question: '¿Cuál de estos operadores es relacional?', options: ['and', '==', 'not', '+='], correct: 1 },
    { question: '¿Qué palabra clave se usa para "y" lógico en Python?', options: ['and', '&&', 'AND', '+'], correct: 0 },
    { question: '¿Qué estructura se usa para tomar decisiones según una condición?', options: ['for', 'while', 'if / else', 'def'], correct: 2 },
    { question: '¿Qué hace range(5)?', options: ['Genera números del 1 al 5', 'Genera números del 0 al 4', 'Genera el número 5', 'Genera una lista vacía'], correct: 1 },
    { question: '¿Qué ciclo se repite mientras una condición sea verdadera?', options: ['for', 'while', 'if', 'def'], correct: 1 },
    { question: '¿Qué palabra clave se usa para crear una función en Python?', options: ['function', 'def', 'func', 'lambda'], correct: 1 },
    { question: '¿Qué función agrega un elemento al final de una lista?', options: ['insert()', 'append()', 'remove()', 'pop()'], correct: 1 },
    { question: '¿Cómo se accede al valor de la clave "nombre" en un diccionario llamado persona?', options: ['persona.nombre', 'persona["nombre"]', 'persona(nombre)', 'persona->nombre'], correct: 1 },
    { question: '¿Qué función devuelve la cantidad de elementos de una lista?', options: ['size()', 'count()', 'len()', 'total()'], correct: 2 }
  ];

  const quizIntro = document.getElementById('quizIntro');
  const quizQuestionScreen = document.getElementById('quizQuestionScreen');
  const quizResultsScreen = document.getElementById('quizResultsScreen');
  const quizStartBtn = document.getElementById('quizStartBtn');
  const quizRetryBtn = document.getElementById('quizRetryBtn');
  const quizQuestionText = document.getElementById('quizQuestionText');
  const quizOptions = document.getElementById('quizOptions');
  const quizCounter = document.getElementById('quizCounter');
  const quizTimer = document.getElementById('quizTimer');
  const quizProgressFill = document.getElementById('quizProgressFill');
  const quizScore = document.getElementById('quizScore');
  const quizPercentage = document.getElementById('quizPercentage');
  const quizMessage = document.getElementById('quizMessage');
  const quizResultsIcon = document.getElementById('quizResultsIcon');

  let currentQuestion = 0;
  let score = 0;
  let timeLeft = 30;
  let timerInterval = null;
  let answered = false;

  quizStartBtn.addEventListener('click', startQuiz);
  quizRetryBtn.addEventListener('click', startQuiz);

  function startQuiz() {
    currentQuestion = 0;
    score = 0;
    quizIntro.hidden = true;
    quizResultsScreen.hidden = true;
    quizQuestionScreen.hidden = false;
    showQuestion();
  }

  function showQuestion() {
    answered = false;
    const data = quizData[currentQuestion];

    quizCounter.textContent = `Pregunta ${currentQuestion + 1} de ${quizData.length}`;
    quizQuestionText.textContent = data.question;
    quizProgressFill.style.width = ((currentQuestion) / quizData.length * 100) + '%';

    quizOptions.innerHTML = '';
    data.options.forEach((option, i) => {
      const btn = document.createElement('button');
      btn.className = 'quiz__option';
      btn.textContent = option;
      btn.addEventListener('click', () => selectAnswer(i));
      quizOptions.appendChild(btn);
    });

    startTimer();
  }

  function startTimer() {
    clearInterval(timerInterval);
    timeLeft = 30;
    updateTimerDisplay();

    timerInterval = setInterval(() => {
      timeLeft--;
      updateTimerDisplay();
      if (timeLeft <= 0) {
        clearInterval(timerInterval);
        if (!answered) {
          selectAnswer(-1); // tiempo agotado, sin respuesta seleccionada
        }
      }
    }, 1000);
  }

  function updateTimerDisplay() {
    quizTimer.textContent = '⏱ ' + timeLeft;
    quizTimer.classList.toggle('is-low', timeLeft <= 10);
  }

  function selectAnswer(selectedIndex) {
    if (answered) return;
    answered = true;
    clearInterval(timerInterval);

    const data = quizData[currentQuestion];
    const optionButtons = quizOptions.querySelectorAll('.quiz__option');

    optionButtons.forEach((btn, i) => {
      btn.disabled = true;
      if (i === data.correct) {
        btn.classList.add('is-correct');
      } else if (i === selectedIndex) {
        btn.classList.add('is-incorrect');
      }
    });

    if (selectedIndex === data.correct) {
      score++;
    }

    // Avanzar a la siguiente pregunta tras una breve pausa
    setTimeout(() => {
      currentQuestion++;
      if (currentQuestion < quizData.length) {
        showQuestion();
      } else {
        showResults();
      }
    }, 1200);
  }

  function showResults() {
    quizQuestionScreen.hidden = true;
    quizResultsScreen.hidden = false;
    quizProgressFill.style.width = '100%';

    const percentage = Math.round((score / quizData.length) * 100);
    quizScore.textContent = `${score} / ${quizData.length}`;
    quizPercentage.textContent = percentage + '%';

    let message, icon;
    if (percentage >= 80) {
      message = '¡Excelente trabajo! Dominas muy bien estos conceptos básicos de Python. 🎉';
      icon = '🏆';
    } else if (percentage >= 50) {
      message = '¡Buen intento! Vas por buen camino, repasa las lecciones donde tuviste dudas y vuelve a intentarlo. 💪';
      icon = '🙂';
    } else {
      message = 'Sigue practicando. Repasa las lecciones del curso con calma; cada repaso te acerca más a dominar Python. 🌱';
      icon = '📘';
    }

    quizMessage.textContent = message;
    quizResultsIcon.textContent = icon;
  }

  /* =======================================================
     14. ANIMACIÓN DEL "TRACE" DEL CICLO WHILE
         Recorre automáticamente cada paso cuando es visible
     ======================================================= */
  const whileTrace = document.getElementById('whileTrace');
  if (whileTrace) {
    const steps = whileTrace.querySelectorAll('.trace__step');
    let activeStep = 0;
    let traceInterval = null;

    const traceObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !traceInterval) {
          traceInterval = setInterval(() => {
            steps.forEach(s => s.classList.remove('active'));
            steps[activeStep].classList.add('active');
            activeStep = (activeStep + 1) % steps.length;
          }, 1400);
        }
      });
    }, { threshold: 0.5 });

    traceObserver.observe(whileTrace);
  }

});
