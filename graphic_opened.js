var mymap = L.map("mapid").setView([40.708, -74.01], 15);

L.tileLayer(
  "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}",
  {
    attribution:
      'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: "mapbox/streets-v11",
    tileSize: 512,
    zoomOffset: -1,
    accessToken:
      "pk.eyJ1IjoiYW5uaWVlZnUiLCJhIjoiY2t1aWZ6Nm1kMDd6MjJucDh0NWtvMGI5diJ9.3i9JmnvFio6863IOOxI1_g",
  }
).addTo(mymap);

// d3.csv("assets/all_retail.csv", function(data){
//     console.log(data);
// });

d3.csv("assets/opened2.csv").then(function (opened) {
  

var count = 0


// NEW HEATMAP

for (var i in opened) {
  var row = opened[i];
  var markercolor;
  
      let omarkers = L.circleMarker([row.Latitude, row.Longitude], {radius: row.Count * 5, color: "green", fillColor: markercolor, fillOpacity: .4})
      .addTo(mymap)
      .bindPopup("<b>"+ row.Businesses+"</b><br/>"+row['Address']+"<br/>"+row.Count);

      omarkers.on("mouseover", function(e){
          this.openPopup();
      });
  
  count +=1;
    }


// OLD CODE
// for (var i in data) {
//     var row = data[i];
//     var markercolor;
//     if (row.openclosed ==="opened"){
//         if (row['Record Type'] ==="Restaurant/Bar"){
//             markercolor = "green"
//         }
//         else if (row['Record Type'] === "Hotel"){
//             markercolor = "purple"
//         }
//         else if (row['Record Type'] === "Local Resources"){
//             markercolor = "orange"
//         }
//         else if (row['Record Type'] === "Personal/Business Services"){
//             markercolor = "blue"
//         }
//         else if (row['Record Type'] === "Shopping"){
//             markercolor = "red"
//         }
//         else{
//             markercolor = "grey"
//         }
//         let omarkers = L.circleMarker([row.Latitude, row.Longitude], {radius: 6, color: markercolor, fillColor: markercolor, fillOpacity: .6})
//         .addTo(mymap)
//         .bindPopup("<b>"+ row["Tenant Name"]+"</b><br/>"+row['Address']+"<br/>"+row['Record Type']);

//         omarkers.on("mouseover", function(e){
//             this.openPopup();
//         });

//     count +=1;
//       }
    // else if (row.openclosed === "closed"){
    // let marker = L.circleMarker([row.Latitude, row.Longitude], {radius: 5, color:'red', fillOpacity: .7})
    //   .addTo(mymap)
    //   .bindPopup(row["Tenant Name"]);
    // //   .openPopup();
    // }

// }

console.log(count)
});

