fetch(`http://www.omdbapi.com/?s=fire&apikey=e12d294b`)
.then(response => {
  if (response.status == 200) {
    return response.json();
  } else {
    Promise.reject(response.statusText);
  }
})
.then(data =>{
  console.log(data);
})
.catch(error => {
  alert(`Error: "${error}"`);
})

function searchViaStreetName(streetName){
  fetch(`https://api.winnipegtransit.com/v3/streets.json?api-key=oavqfxDk4stbDI8v0v5f&name=${streetName}&usage=long`)
  .then(response => {
    if (response.status == 200) {
      return response.json();
    } else {
      Promise.reject(response.statusText);
    }
  })
  .then(data =>{
    console.log(data.streets);
    data.streets.forEach(item=>createList(item));
  })
  .catch(error => {
    alert(`Error: "${error}"`);
  })
}


const form = document.querySelector("form")
const searchInput = document.querySelector("input")
const streets = document.querySelector(".streets")
const titlebar = document.querySelector(".titlebar")
const tableBody = document.querySelector("tbody")

form.addEventListener('submit',()=>{
  if(searchInput.value!==""){
searchViaStreetName(searchInput.value);
  }
})

document.addEventListener('click',(event)=>{
  if (event.target.nodeName==="A") {
    console.log("yes, you hit it");
    console.log(event.target.getAttribute("data-street-key"));
  }
})

function createList(objectArg){
streets.insertAdjacentHTML('beforeend',`<a href="#" data-street-key="${objectArg.key}">${objectArg.name}</a>`)
}


