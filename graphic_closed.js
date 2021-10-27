var mymap2 = L.map("mapid2").setView([40.708, -74.01], 15);

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
).addTo(mymap2);

// d3.csv("assets/all_retail.csv", function(data){
//     console.log(data);
// });

d3.csv("assets/closed.csv").then(function (closed) {
//   console.log(closed);


var count = 0



for (var i in closed) {
    var row = closed[i];
    var markercolor;
    
        let omarkers = L.circleMarker([row.Latitude, row.Longitude], {radius: row.Count * 3, color: "red", fillColor: markercolor, fillOpacity: .4})
        .addTo(mymap2)
        .bindPopup("<b>"+ row.Businesses+"</b><br/>"+row['Address']+"<br/>"+row.Count);
  
        omarkers.on("mouseover", function(e){
            this.openPopup();
        });
    
    count +=1;
      }
  
  


// for (var i in data) {
//     var row = data[i];
//     var markercolor;
//     if (row.openclosed ==="closed"){
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
//         let omarkers = L.circleMarker([row.Latitude, row.Longitude], {radius: 6, color: markercolor, fillColor: markercolor, fillOpacity: .5})
//         .addTo(mymap2)
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



});

