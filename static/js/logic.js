const url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson"

d3.json(url).then(function(rawData){

    
    for(let i = 0; i < rawData.length; i++){
        
    }

    console.log(rawData);

    let myMap = L.map("map", {
        center: [37.09, -95.71],
        zoom: 5
      });
      
      // Add a tile layer.
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(myMap);

      coor = [];
      for (let x = 0; x< rawData["features"].length; x++){
	coor.push(rawData["features"][x]["geometry"]["coordinates"][2]);
      }
  bin_vals = 0;    
  function colorVal(data, current){
	  let co_max = Math.max(...data);
	  let co_min = Math.min(...data);
	  let bins = 5;
	  bin_vals = (Math.abs(co_max) + Math.abs(co_min))/ bins;
	
	  if (current <= bin_vals){
		  return "#00FF00";		
	  }
	  else if (current <= (bin_vals * 2)){
		  return "#009D99";
	  }
	  else if (current <= (bin_vals * 3)){
		  return "#999B00";
	  }
	  else if (current <= (bin_vals * 4)){
		  return "#996400";
	  }
	  else return "#994000"
      }	
      
      for (let i = 0; i < rawData["features"].length; i++) {
        L.circle([rawData["features"][i]["geometry"]["coordinates"][1],rawData["features"][i]["geometry"]["coordinates"][0]],{
          fillOpacity: 0.75,
	        color: "white",
          fillColor: colorVal(coor, rawData["features"][i]["geometry"]["coordinates"][2]),
          

          radius: rawData["features"][i]["properties"]["mag"] * 15000

        }).bindPopup(`<h1>${rawData["features"][i]["properties"]["place"]}</h1> <hr> <h3>Magnitude: ${rawData["features"][i]["properties"]["mag"]}</h3>
        <h3>Location: ${rawData["features"][i]["geometry"]["coordinates"].slice(0, 2)}</h3>
        <h3>Depth: ${rawData["features"][i]["geometry"]["coordinates"][2]}`).addTo(myMap);
      }
      
 // Set up the legend.
 let legend = L.control({ position: "bottomright" });
 legend.onAdd = function() {
   let div = L.DomUtil.create("div", "info legend");
   let limits = [[bin_vals, "#00FF00"], [bin_vals*2, "#009D99"], [bin_vals*3, "#999B00"], [bin_vals*4, "#996400"], [bin_vals*5, "#994000"]];
  //  let colors = geojson.options.colors;
   let labels = [];

   // Add the minimum and maximum.
   let legendInfo = "<h1>Legend</h1>" +
     "<div class=\"labels\">" +
       "<div class=\depth\">" + "Depth" + "</div>" +
     "</div>";

   div.innerHTML = legendInfo;

   limits.forEach(function(limit, index) {
     labels.push("<li style=\"background-color: " + limits[index][1] + "\"> " + "< "+limits[index][0] + " </li>");
   });

   div.innerHTML += "<ul>" + labels.join("") + "</ul>";
   return div;
 };

 // Adding the legend to the map
 legend.addTo(myMap);     
      
});
