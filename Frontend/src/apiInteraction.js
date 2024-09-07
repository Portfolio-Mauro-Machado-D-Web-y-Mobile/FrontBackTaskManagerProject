const API_URL = "http://localhost:3000/api";

async function getAllCards() {

    const response = await fetch(`${API_URL}/tasks`);

    return response.json();

}

async function getCardsByStatus(status) {
    const response = await fetch(`${API_URL}/tasks/${status}`);
    return response.json();
}

async function getCardById(id) {
    const response = await fetch(`${API_URL}/tasks/id/${id}`);
    return response.json();
}
    

async function postCard(card) {


    const response = await fetch(`${API_URL}/tasks`, {
        method: "POST",
        headers: {
        'Content-Type': 'application/json',
        },
        body: JSON.stringify(card)
    });

    return response.json();
}

async function putCard(card) {
    const response = await fetch(`${API_URL}/tasks/${card.id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(card)
    });


    return response.json();
}

async function deleteCardById(id) {
    const response = await fetch(`${API_URL}/tasks/${id}`, {
        method: `DELETE`
    });

    return response;
}