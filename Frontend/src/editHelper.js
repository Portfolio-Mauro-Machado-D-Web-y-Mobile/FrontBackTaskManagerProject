let currentCard;

function findCardById(cards, id) {

  console.log(cards);

  for (const state in cards) {
    if (cards[state].length > 0) {
      console.log(cards[state], id);
      const card = cards[state].find(card => card.id === id);

      if (card) {
        return card;
      }
    }
  }

  return null;
}


function clickCard(card) {
  const modal = document.getElementById("edit-card");
  modal.classList.add("is-active");

  const title = document.getElementById("edit-title");
  const description = document.getElementById("edit-description");
  const assigned = document.getElementById("edit-assigned");
  const priority = document.getElementById("edit-priority");
  const state = document.getElementById("edit-state");
  const deadline = document.getElementById("edit-deadline");

  currentCard = findCardById(cards, card.id);

  title.value = currentCard.title;
  description.value = currentCard.description;
  assigned.value = currentCard.assigned;
  priority.value = currentCard.priority;
  state.value = currentCard.state;
  deadline.value = currentCard.deadline;
}

const handleCardSaveEdit = () => {
  const title = document.getElementById("edit-title");
  const description = document.getElementById("edit-description");
  const assigned = document.getElementById("edit-assigned");
  const priority = document.getElementById("edit-priority");
  const state = document.getElementById("edit-state");
  const deadline = document.getElementById("edit-deadline");

  const esValidoTitle = validarTitleModal(title.value);
  const esValidoDescription = validarDescriptionModal(description.value);
  const esValidoDeadLine = validarDeadLineModal(deadline.value);

  if (!esValidoTitle || !esValidoDescription || !esValidoDeadLine) {
    return;
  }

  const previousCard = { ...currentCard };

  currentCard.title = title.value;
  currentCard.description = description.value;
  currentCard.assigned = assigned.value;
  currentCard.priority = priority.value;
  currentCard.state = state.value;
  currentCard.deadline = deadline.value;

  cards[previousCard.state] = cards[previousCard.state].filter(card => card.id !== previousCard.id);
  cards[state.value].push(currentCard);

  updateCards(Object.keys(cards).indexOf(previousCard.state) + 1, cards[previousCard.state]);
  updateCards(Object.keys(cards).indexOf(state.value) + 1, cards[state.value]);

  title.value = "";
  description.value = "";
  assigned.value = "";
  priority.value = "Alta";
  state.value = "backlog";
  deadline.value = "";

  closeAllModals();
}

const handleCardDelete = () => {
  cards[currentCard.state] = cards[currentCard.state].filter(card => card.id !== currentCard.id);

  updateCards(Object.keys(cards).indexOf(currentCard.state) + 1, cards[currentCard.state]);

  closeAllModals();
}
