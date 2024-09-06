


const columnNames = ["backlog", "todo", "inProgress", "blocked", "done"]

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

async function createCard({ title, description, assigned, priority, status, deadline }) {

  const column = columnNames.indexOf(status);
  console.log(title);

  await postCard({title, description, assigned, priority, status, deadline });

  updateCards(column);
}

function sortByOrder(tasksArray) {
  return tasksArray.sort((a, b) => a.order - b.order);
}

async function updateCards(columnIndex) {
  console.log(columnIndex);
  const col = columns[columnIndex];
  const previousCards = col.querySelectorAll(".draggable");
  previousCards.forEach(element => element.remove());

  let currentCards = await getCardsByStatus(columnNames[columnIndex]);
  //currentCards = sortByOrder(tasksArray);

  if (currentCards && typeof currentCards[Symbol.iterator] === 'function') {
    currentCards = sortByOrder(currentCards);
    currentCards.forEach((card) => {
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
        Fecha: ${card.endDate}
        <img src="assets/Icon-Calendar.png" alt="Calendar icon">`;

      const clone = document.importNode(cardTemplate.content, true);

      const div = clone.querySelector("div");
      const h5 = div.querySelector("h5");
      const paragraph = div.querySelector("p");

      div.classList.add(backgroundColors[columnIndex]);
      h5.classList.add(fontColors[columnIndex]);
      paragraph.classList.add(fontColors[columnIndex]);

      div.draggable = true;
      div.id = card.id;

      editIcon.id = "edit" + card.id;

      col.appendChild(clone);
    });
  }

  reAddEvents();
}

const handleCardSave = () => {
  const title = document.getElementById("title");
  const description = document.getElementById("description");
  const assigned = document.getElementById("assigned");
  const priority = document.getElementById("priority");
  const status = document.getElementById("state");
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
    status: status.value,
    deadline: deadline.value,
  });

  title.value = "";
  description.value = "";
  assigned.value = "";
  priority.value = "Alta";
  status.value = "backlog";
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

updateCards(0);
updateCards(1);
updateCards(2);
updateCards(3);
updateCards(4);