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
    fetch('https://port-0-ningbbang-m31kz4ncdbfb44cf.sel4.cloudtype.app/add-item', {
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
        const listContainer = document.querySelector(`#${buttonId} .card-inner-list`);
        if (listContainer) {
            listContainer.innerHTML += `
            <div class="card-item" data-id="${data.id}">
                <span class="cat">${data.category}</span>
                <span class="place">${data.place}</span>
                <span class="add-btn">
                    <button class="delete-btn" onclick="deleteItem(this, ${data.id})">
                        <!-- SVG code here -->
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
    fetch(`https://port-0-ningbbang-m31kz4ncdbfb44cf.sel4.cloudtype.app/items/${id}`, {
        method: 'DELETE'
    }).then(response => response.json())
      .then(data => console.log('Item deleted', data))
      .catch(error => console.error('Error deleting item:', error));
}


document.addEventListener('DOMContentLoaded', function() {
    fetch('https://port-0-ningbbang-m31kz4ncdbfb44cf.sel4.cloudtype.app/items')
        .then(response => response.json())
        .then(items => {
            items.forEach(item => {
                // Use the button ID or another identifier to find the correct list
                const listContainer = document.querySelector(`#${item.button_id} .card-inner-list`);
                if (listContainer) {
                    listContainer.innerHTML += `
                    <div class="card-item" data-id="${item.id}">
                        <span class="cat">${item.category}</span>
                        <span class="place">${item.place}</span>
                        <span class="add-btn">
                            <button class="delete-btn" onclick="deleteItem(this, ${item.id})">
                                <!-- SVG code here -->
                            </button>
                        </span>
                    </div>`;
                }
            });
        })
        .catch(error => console.error('Error loading items:', error));
});
