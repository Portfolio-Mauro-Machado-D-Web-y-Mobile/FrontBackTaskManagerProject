let currentCard;



async function clickCard(card) {
  const modal = document.getElementById("edit-card");
  modal.classList.add("is-active");

  const title = document.getElementById("edit-title");
  const description = document.getElementById("edit-description");
  const assigned = document.getElementById("edit-assigned");
  const priority = document.getElementById("edit-priority");
  const status = document.getElementById("edit-state");
  const deadline = document.getElementById("edit-deadline");

  currentCard = await getCardById(card.id);
  title.value = currentCard.title;
  description.value = currentCard.description;
  assigned.value = currentCard.assignedTo;
  priority.value = currentCard.priority;
  status.value = currentCard.status;

  deadline.value = currentCard.endDate;
}

const handleCardSaveEdit = async () => {
  const title = document.getElementById("edit-title");
  const description = document.getElementById("edit-description");
  const assigned = document.getElementById("edit-assigned");
  const priority = document.getElementById("edit-priority");
  const status = document.getElementById("edit-state");
  const deadline = document.getElementById("edit-deadline");

  const esValidoTitle = validarTitleModal(title.value);
  const esValidoDescription = validarDescriptionModal(description.value);
  const esValidoDeadLine = validarDeadLineModal(deadline.value);

  if (!esValidoTitle || !esValidoDescription || !esValidoDeadLine) {
    return;
  }

  const previousCard = { ...currentCard };

  currentCard.id = previousCard.id;
  currentCard.title = title.value;
  currentCard.description = description.value;
  currentCard.assigned = assigned.value;
  currentCard.priority = priority.value;
  currentCard.status = status.value;
  currentCard.deadline = deadline.value;

  await putCard(currentCard);
  console.log(previousCard.status);
  console.log(currentCard.status);

  updateCards(columnNames.indexOf(previousCard.status));
  updateCards(columnNames.indexOf(currentCard.status));
  
  

  title.value = "";
  description.value = "";
  assigned.value = "";
  priority.value = "High";
  status.value = "backlog";
  deadline.value = "";

  closeAllModals();
}

const handleCardDelete = () => {
  cards[currentCard.state] = cards[currentCard.state].filter(card => card.id !== currentCard.id);

  updateCards(Object.keys(cards).indexOf(currentCard.state) + 1, cards[currentCard.state]);

  closeAllModals();
}
