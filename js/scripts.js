//page controller

function memo(item) {
    item.parentElement.querySelector(".card-add").classList.toggle("show")
    item.parentElement.querySelector(".card-inner-list").classList.toggle("show")
}

let map;
let coord = {lat: 41.009349440730496, lng: 28.976461983141945}
function initMap() {
    map = new google.maps.Map(
        document.getElementById("map-container"), 
        {center: coord, zoom: 8}
    )

    map.addListener("click", function (event) {
        // Get the latitude and longitude from the click event
        const lat = event.latLng.lat();
        const lng = event.latLng.lng();

        addMarker({ coordinates: event.latLng });
    });
}

function addMarker(prop) {
    const marker = new google.maps.Marker(
        {
            position: prop.coordinates,
            map: map
        }
    )

    marker.addListener('click', function() {
        marker.setMap(null);  // Remove marker from the map
    });
}

function addItem(item) {
    // Get the button ID or a unique identifier from the button
    const buttonId = item.id || item.getAttribute('id');

    // Gather the necessary data for the item
    const category = item.parentElement.querySelector("select").value;
    const place = item.parentElement.querySelector(".place").value;

    // Construct the item object to send to the backend, including buttonId
    const itemData = {
        category: category,
        place: place,
        button_id: buttonId  // Include the button ID here
    };

    // Send the data to the backend
    fetch('/add-item', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(itemData)
    })
    .then(response => response.json())
    .then(data => {
        console.log("Item added:", data);

    // Optionally: Append the item to the appropriate card-inner-list without reloading
    // const listContainer = document.querySelector(`#${buttonId} .card-inner-list`);
    listContainer = document.getElementById(buttonId).parentElement.parentElement.querySelector('.card-inner-list');
    if (listContainer) {
        listContainer.innerHTML += `
        <div class="card-item" data-id="${data.id}">
            <span class="cat">${data.category}</span>
            <span class="place">${data.place}</span>
            <span class="add-btn">
                <button class="delete-btn" onclick="deleteItem(this, ${data.id})">
                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#FFFFFF"><path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/></svg>
                </button>
            </span>
        </div>`;
    }
    })
    .catch(error => console.error('Error adding item:', error));
}   

function deleteItem(item, id) {
    item.parentElement.parentElement.remove(); // Remove from UI

    // Remove from server
    fetch(`/items/${id}`, {
        method: 'DELETE'
    }).then(response => response.json())
      .then(data => console.log('Item deleted', data))
      .catch(error => console.error('Error deleting item:', error));
}


document.addEventListener('DOMContentLoaded', function() {
    fetch('/items', {
        method: 'GET',
    })
    .then(response => response.json())
    .then(items => {
        items.forEach(item => {
            // Use the button ID or another identifier to find the correct list
            listContainer = document.getElementById(item.button_id).parentElement.parentElement.querySelector('.card-inner-list');
            if (listContainer) {
                listContainer.innerHTML += `
                <div class="card-item" data-id="${item.id}">
                    <span class="cat">${item.category}</span>
                    <span class="place">${item.place}</span>
                    <span class="add-btn">
                        <button class="delete-btn" onclick="deleteItem(this, ${item.id})">
                            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#FFFFFF"><path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/></svg>
                        </button>
                    </span>
                </div>`;
            }
            console.log(listContainer)
        });
    })
    .catch(error => console.error('Error loading items:', error));
});

// // Get Items
// function getItems() {
//     // // Get the button ID or a unique identifier from the button
//     // const buttonId = item.id || item.getAttribute('id');

//     // // Gather the necessary data for the item
//     // const category = item.parentElement.querySelector("select").value;
//     // const place = item.parentElement.querySelector(".place").value;

//     // Send the data to the backend
//     fetch('/items', {
//         method: 'GET',
//     })
//     .then(response => response.json())
//     .then(data => {
//         const items = data;
//         items.forEach(function(row) {
//             console.log(row["id"], row["button_id"])
//         })
//     })
// };