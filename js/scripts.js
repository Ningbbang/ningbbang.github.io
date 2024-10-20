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

function addItem(item){
    let category = item.parentElement.querySelector("select")
    let placeName = item.parentElement.querySelector(".place")
    
    item.parentElement.parentElement.querySelector(".card-inner-list").innerHTML +=
    `<div class="card-item"><span class="cat">${category.value}</span><span class="place">${placeName.value}</span><span class="add-btn"><button class="delete-btn" onclick=deleteItem(this)>` +
    `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/></svg></div>`
    placeName.value = ""
}

function deleteItem(item){
    item.parentElement.parentElement.remove()
}