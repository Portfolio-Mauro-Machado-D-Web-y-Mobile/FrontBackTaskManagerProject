const cards = {
  backlog: [],
  todo: [],
  inProgress: [],
  blocked: [],
  done: [],
}

function saveStateToLocalStorage() {
  localStorage.setItem('cardsState', JSON.stringify(cards));
}

function loadStateFromLocalStorage() {
  const savedState = localStorage.getItem('cardsState');
  if (savedState) {
    Object.assign(cards, JSON.parse(savedState));
    Object.keys(cards).forEach((columnKey, index) => {
      updateCards(index + 1, cards[columnKey]);
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  loadStateFromLocalStorage();
});

const columns = [document.getElementById("backlog"),
document.getElementById("todo"),
document.getElementById("inProgress"),
document.getElementById("blocked"),
document.getElementById("done"),
]

const backgroundColors = ['has-background-dark',
  'has-background-info',
  'has-background-warning',
  'has-background-danger',
  'has-background-success'
]

const fontColors = ["has-text-white",
  "has-text-white",
  "has-text-white",
  "has-text-white",
  "has-text-white"
]

function openModal($el) {
  $el.classList.add('is-active');
}

function closeModal($el) {
  $el.classList.remove('is-active');
}

function closeAllModals() {
  (document.querySelectorAll('.modal') || []).forEach(($modal) => {
    closeModal($modal);
  });
}

const $target = document.querySelector(".js-modal-trigger");
const $modal = document.querySelector('#addcard');

$target.addEventListener('click', () => {
  openModal($modal);
});

document.addEventListener('keydown', (event) => {
  if (event.key === "Escape") {
    closeAllModals();
  }
});

function createCard({ title, description, assigned, priority, state, deadline }) {
  const id = crypto.randomUUID();

  const column = Object.keys(cards).indexOf(state) + 1;

  cards[state].push({ id, title, description, assigned, priority, state, deadline });

  updateCards(column, cards[state]);
}

function updateCards(columnIndex, cards) {
  console.log(columnIndex, cards);

  const col = columns[columnIndex - 1];
  const previousCards = col.querySelectorAll(".draggable");
  previousCards.forEach(element => element.remove());

  cards.forEach((card) => {
    const cardTemplate = document.querySelector("#card");

    const h = cardTemplate.content.querySelector("h5");
    const p = cardTemplate.content.querySelector("p");
    const editIcon = cardTemplate.content.querySelector("figure");
    const prioritySpan = cardTemplate.content.querySelector(".priority");
    const deadlineSpan = cardTemplate.content.querySelector(".deadline");

    const translatedPriority = card.priority;

    h.textContent = card.title;
    p.textContent = card.description;

    // Configurar el texto y el ícono de prioridad
    prioritySpan.innerHTML = `
      Prioridad: ${translatedPriority}
      <img src="assets/Icon-Flag.png" alt="Priority flag icon">`;

    // Configurar el texto y el ícono de fecha límite
    deadlineSpan.innerHTML = `
      Fecha: ${card.deadline}
      <img src="assets/Icon-Calendar.png" alt="Calendar icon">`;

    const clone = document.importNode(cardTemplate.content, true);

    const div = clone.querySelector("div");
    const h5 = div.querySelector("h5");
    const paragraph = div.querySelector("p");

    div.classList.add(backgroundColors[columnIndex - 1]);
    h5.classList.add(fontColors[columnIndex - 1]);
    paragraph.classList.add(fontColors[columnIndex - 1]);

    div.draggable = true;
    div.id = card.id;

    editIcon.id = "edit" + card.id;

    col.appendChild(clone);
  });

  reAddEvents();
  saveStateToLocalStorage();
}

const handleCardSave = () => {
  const title = document.getElementById("title");
  const description = document.getElementById("description");
  const assigned = document.getElementById("assigned");
  const priority = document.getElementById("priority");
  const state = document.getElementById("state");
  const deadline = document.getElementById("deadline");

  const esValidoTitle = validarTitleModal(title.value);
  const esValidoDescription = validarDescriptionModal(description.value);
  const esValidoDeadLine = validarDeadLineModal(deadline.value);

  if (!esValidoTitle || !esValidoDescription || !esValidoDeadLine) {
    return;
  }

  createCard({
    title: title.value,
    description: description.value,
    assigned: assigned.value,
    priority: priority.value,
    state: state.value,
    deadline: deadline.value,
  });

  title.value = "";
  description.value = "";
  assigned.value = "";
  priority.value = "Alta";
  state.value = "backlog";
  deadline.value = "";

  closeAllModals();
}

const handleCardCancel = () => {
  closeAllModals();
}

const errorTitle = document.getElementById("errorTitle");
const errorDescription = document.getElementById("errorDescription");
const errorDeadLine = document.getElementById("errorDeadLine");

function moveCard(cardId, targetColumnId, targetCardId, isAfter) {
  const card = Object.values(cards).flat().find(card => card.id === cardId);
  const cardToReplace = Object.values(cards).flat().find(card => card.id === targetCardId);

  const previousColumnId = card.state;

  const previousColumn = cards[previousColumnId];

  previousColumn.splice(previousColumn.indexOf(card), 1);

  card.state = targetColumnId;

  const targetColumn = cards[targetColumnId];

  const targetCardIndex = targetColumn.indexOf(cardToReplace);

  if (isAfter) {
    targetColumn.splice(targetCardIndex + 1, 0, card);
  } else {
    targetColumn.splice(targetCardIndex, 0, card);
  }

  updateCards(Object.keys(cards).indexOf(previousColumnId) + 1, previousColumn);
  updateCards(Object.keys(cards).indexOf(targetColumnId) + 1, targetColumn);

  saveStateToLocalStorage();
}

function validarTitleModal(title) {
  if (title.trim() === "") {
    errorTitle.textContent = "Debe escribir el nombre de la tarea.";
    return false;
  } else {
    errorTitle.textContent = "";
    return true;
  }
}

function validarDescriptionModal(description) {
  if (description.trim() === "") {
    errorDescription.textContent = "Debe escribir una breve descripcion de la tarea.";
    return false;
  } else {
    errorDescription.textContent = "";
    return true;
  }
}

function validarDeadLineModal(deadLine) {
  if (deadLine === "") {
    errorDeadLine.textContent = "Debe seleccionar una fecha.";
    return false;
  } else {
    errorDeadLine.textContent = "";
    return true;
  }
}
