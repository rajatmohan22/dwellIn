mapboxgl.accessToken = 'pk.eyJ1IjoibGtyMjIiLCJhIjoiY2wzc2Z4Z3RqMDV2eTNmbnlxeXVkaW9iYyJ9.jV1uJTq5xlaW4rPz3-MBXw';
const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/streets-v11', // style URL
    center: foundCamp.geometry.coordinates, // starting position [lng, lat]
    zoom: 8// starting zoom
});
const marker1 = new mapboxgl.Marker()
.setLngLat(foundCamp.geometry.coordinates)
.setPopup(
    new mapboxgl.Popup({ offset: 25 }) // add popups
      .setHTML(
        `<h4>${foundCamp.name}</h4> <P>${foundCamp.location}</p>`
      )
  ).addTo(map)
  const nav = new mapboxgl.NavigationControl({
    showCompass:true,
    showZoom: true,
    visualizePitch: true
    });
  map.addControl(nav, 'bottom-right');