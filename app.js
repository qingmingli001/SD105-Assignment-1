
//side search pane
const form = document.querySelector("form")
const searchInput = document.querySelector("input")
const streets = document.querySelector(".streets")

function searchViaStreetName(streetName){
  fetch(`https://api.winnipegtransit.com/v3/streets.json?api-key=oavqfxDk4stbDI8v0v5f&name=${streetName}&usage=long`)
  .then(response => {
    if (response.status == 200) {
      return response.json();
    } else {
      Promise.reject(response.statusText);
    }
  })
  .then(data => {
    console.log(data.streets);
    data.streets.forEach(item => createList(item));
  })
  .catch(error => {
    alert(`Error: "${error}"`);
  })
}

function createList(objectArg){
  streets.insertAdjacentHTML('beforeend',`<a href="#" data-street-key="${objectArg.key}" name="${objectArg.name}">${objectArg.name}</a>`)
}

form.addEventListener('submit',() => {
  if(searchInput.value !== ""){
    console.log(searchInput.value);
    streets.innerHTML="";
    searchViaStreetName(searchInput.value);
  }else{alert("You input is invalid")};
})

// the main table part
const stopInformation=[];
const detailInformation=[];

const titlebar = document.querySelector("#street-name")
const tableBody = document.querySelector("tbody")


function searchViaStreetKey(streetKey){
  fetch(`https://api.winnipegtransit.com/v3/stops.json?api-key=oavqfxDk4stbDI8v0v5f&street=${streetKey}`)
  .then(response => {
    if (response.status == 200) {
      return response.json();
    } else {
      Promise.reject(response.statusText);
    }
  })
  .then(data =>{
    console.log(data);
    data.stops.forEach(item => stopInformation.push(item.key));
    return stopInformation;
  }).then(data=>{
    console.log(data);
    data.forEach(item => {
      addRouteInformation(item);
    });
    return detailInformation;
  }).then(data => {
    console.log(data); 
    createTable(data);
  })
  .catch(error => {
    alert(`Error: "${error}"`);
  })
}

function createTable(arrayArg){
  arrayArg.forEach(item=>{
    let tr = document.createElement("tr");
    tr.innerHTML = `<td>${item.stop_name}</td>
    <td>${item.cross_street}</td>
    <td>${item.direction}</td>
    <td>${item.route_number}</td>
    <td>${item.bus_number}</td>
    <td>${item.arrive_time}</td>
    </tr>`
    tableBody.prepend(tr);
  })
}

function addRouteInformation(stop_key){
  fetch(`https://api.winnipegtransit.com/v3/stops/${stop_key}/schedule.json?api-key=oavqfxDk4stbDI8v0v5f`)
  .then(response => {
    if (response.status == 200) {
      return response.json();
    } else {
      Promise.reject(response.statusText);
    }
  })
  .then(data =>{
    if(data['stop-schedule']['route-schedules'].length!==0){
      console.log(data);
      const k = data['stop-schedule']['stop'].key;
      const n = data['stop-schedule']['stop'].name;
      const c = data['stop-schedule']['stop']["cross-street"].name;
      const d = data['stop-schedule']['stop'].direction;

      data['stop-schedule']['route-schedules'].forEach(item => {
        console.log(item.route.key);
        let iterationNumber = 2;
        if(item['scheduled-stops'].length<2){
          iterationNumber = item['scheduled-stops'].length
        };
        for(let i=0;i<iterationNumber;i++){
          const tableData = {};
          tableData.bus_number = item['scheduled-stops'][i].bus.key;
          tableData.arrive_time = item['scheduled-stops'][i].times.arrival.scheduled || item['scheduled-stops'][i].times.departure.scheduled;
          tableData.stop_key = k;
          tableData.stop_name = n;
          tableData.cross_street = c;
          tableData.direction = d;
          tableData.route_number = item.route.key;
          detailInformation.push(tableData);
        }
      });
    }
  })
  .catch(error => {
    alert(`Error: "${error}"`);
  })
}


document.addEventListener('click',(event)=>{
  if (event.target.nodeName === "A") {
    console.log("yes, you hit it");
    console.log(event.target.getAttribute("data-street-key"));
    titlebar.innerHTML ="";
    tableBody.innerHTML="";
    let k = event.target.getAttribute("data-street-key");
    searchViaStreetKey(k);
    
    let n = event.target.getAttribute("name");
    titlebar.innerHTML = `Displaying results for ${n}`;
    

  }
})




