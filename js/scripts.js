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
    let category = item.parentElement.querySelector("select").value;
    let placeName = item.parentElement.querySelector(".place").value;

    // Add the item to the UI
    item.parentElement.parentElement.querySelector(".card-inner-list").innerHTML += `
    <div class="card-item">
        <span class="cat">${category}</span>
        <span class="place">${placeName}</span>
        <span class="add-btn">
            <button class="delete-btn" onclick="deleteItem(this)">
                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed">
                    <path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/>
                </svg>
            </button>
        </span>
    </div>`;
    
    // Clear the input fields
    item.parentElement.querySelector(".place").value = "";

    // Save the item to the server
    fetch('https://port-0-ningbbang-m31kz4ncdbfb44cf.sel4.cloudtype.app/items', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ category, place: placeName })
    }).then(response => response.json())
      .then(data => console.log('Item saved', data))
      .catch(error => console.error('Error saving item:', error));
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
                document.querySelector(".card-inner-list").innerHTML += `
                <div class="card-item" data-id="${item.id}">
                    <span class="cat">${item.category}</span>
                    <span class="place">${item.place}</span>
                    <span class="add-btn">
                        <button class="delete-btn" onclick="deleteItem(this, ${item.id})">
                            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed">
                                <path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/>
                            </svg>
                        </button>
                    </span>
                </div>`;
            });
        })
        .catch(error => console.error('Error loading items:', error));
});
