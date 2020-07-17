const URL = "http://localhost:8000";
var listHeroes = null;

function getAll(pagination){
    axios.get(URL + "/heroes")
    .then(heroes => displayAll(heroes.data, pagination))
    .catch(err => console.error(err));
}


getAll();


function displayAll(heroes, pagination) {
    if (pagination === undefined) pagination = [0, 50]
    const all = document.getElementById("all");
    listHeroes = heroes
    all.innerHTML = "";
    const test = heroes.sort(function(a, b) {
        return b.id - a.id;
    })
    console.log("Test -> ", test);
    heroes.forEach((heroe, index) => {
        if (index >= pagination[0] && index <= pagination[1]) {
            all.innerHTML += `
        <div data-u-id="${heroe.id}" class="card">
        
        <figure><img src='${heroe.image.url}' onerror="this.onerror=null; this.src=''"></figure>
        <p>${heroe.name}</p>
        <div class="buttons">
        <button class="details btn" data-id="${heroe.id}">Details</button>
        <button class="supprimer btn" data-id="${heroe.id}">Delete</button>
        </div>
        </div>
        `;
        }

    });

    // heroes.some(function(heroe, index) {
    //     if (you_want_to_break) return false
    //     else return true
    // })

    const buttons = document.querySelectorAll(".details");

    buttons.forEach(button => {
        button.onclick = openModale
    })

    const buttonsDelete = document.querySelectorAll(".supprimer");

    buttonsDelete.forEach(button => {
        button.onclick = suppimerHeroe
    })


    
    const buttonsEdit = document.querySelectorAll(".edit");

    buttonsEdit.forEach(button => {
        button.onclick = editrHeroe
    })

    // RECHERCHE SUGGESTIONS
    const search = document.getElementById("search");
    search.oninput = (evt) => {
        suggestions(evt, heroes)
    }

    //RESET
    document.getElementById("reset").onclick = () => {
        search.value = "";
        getAll(pagination);
    };
}


function suppimerHeroe (evt){
    const id = evt.target.getAttribute("data-id");
    console.log(URL + "/heroes/" + id)
    axios.delete(URL + "/heroes/" + id) 
    .then(res => {
        getAll();
        removeUserFromDocument(id);
    })
    .catch(error => console.error(error))

    
    
}



function openModale(evt, findedHeroeID) {

    const id = (evt == null) ? findedHeroeID : evt.target.getAttribute("data-id");
    const heroe = listHeroes.find(heroe => heroe.id == id);
    const modale = document.createElement("div");
    modale.classList.add("modale");
    console.log("freofjoirejf")
    const body = document.querySelector("body");
    body.appendChild(modale)
    modale.innerHTML = `
    <div>
        <img id="image" src= "${heroe.image.url}">
        <ul>
            <li><p>Name : ${heroe.name} ${heroe.biography["full-name"]}</li>
            <li><p>Gender :  ${heroe.appearance.gender}</li>
            <li><p>Combats :  ${heroe.powerstats.combat}</li>
            <li><p>Alignement :  ${heroe.biography.alignment}</li>
            <li><p>Race : ${heroe.appearance.race}</li>
            <li><p>Publisher : ${heroe.biography.publisher}</li>
        </ul>
        <p id="close">X<p/>
     </div>
    `;
    
    const close = document.getElementById("close");
    fermerModale(close, modale);

}

function fermerModale(closeElement, modale)
{
    closeElement.onclick = () => {
        modale.remove();
    }

    window.onclick = (evt) => {
        const html = document.querySelector("html");
        if (evt.target == html) modale.remove();
    }
}

function editrHeroe(evt){
    const id = evt.target.getAttribute("data-id");
}

const createButton = document.getElementById("create").onclick = modaleCreateHeroe;
function modaleCreateHeroe(){
    
    const modale = document.createElement("div");
    modale.classList.add("modaleCreate");
    const body = document.querySelector("body");
    body.appendChild(modale)
    modale.innerHTML = `
    <div id="form">
    <input id="name" type="text" name="name" placeholder="name">
    <input  id="fullname" type="text" name="full-name" placeholder="Full Name">
    <input  id="gender" type="text" name="gender" placeholder="Gender">
    <input  id="combat" type="text" name="combat" placeholder="Combat">
    <input  id="alignment" type="text" name="alignment" placeholder="Alignement">
    <input  id="race" type="text" name="race" placeholder="Race">
    <input  id="publisher" type="text" name="publisher" placeholder="Publisher">
    <button id="valider" name="valider">créer</button>
    </div>
    `;

    const valider = document.getElementById("valider");
    valider.onclick = createHeroe;

}
function createHeroe(){
    // const form =  document.querySelectorAll("#form input");
    // console.log(form)
    // var newHeroe = {};
    // form.forEach(data => Object.defineProperty(newHeroe, data.getAttribute("name"), {value: data.value}));
    // Object.defineProperty(newHeroe, "image", {value: {url : "default.png"}})
    // console.log(newHeroe)
   const name = document.getElementById("name").value
   const fullName = document.getElementById("fullname").value
   const gender = document.getElementById("gender").value
   const combat = document.getElementById("combat").value
   const alignment = document.getElementById("alignment").value
   const race = document.getElementById("race").value
   const publisher = document.getElementById("publisher").value
    
   axios.post(URL + "/heroes/", { 
        name,
        fullName,
        gender,
        combat,
        alignment,
        race,
        publisher,
        image : {url: "default.png"}
    })
    .then(res => getAll())
    .catch(err => console.error(err))
   
}
function removeUserFromDocument(idUser) {
    // https://developer.mozilla.org/fr/docs/Web/CSS/S%C3%A9lecteurs_d_attribut
    const cardToRemove = document.querySelector(`[data-u-id="${idUser}"]`);
    cardToRemove.remove();
  }
  

function suggestions(evt, heroes){
    const block = document.getElementById("block");
    const suggestsBlock = document.getElementById("suggests-block");
    const button = document.getElementById("find");
    suggestsBlock.innerHTML = "";
    const filteredHeroes = heroes.filter(heroe => {
        let name = heroe.name.toLocaleLowerCase();
        return name.includes(evt.target.value)
    })
    if (evt.target.value != "")
    {
        filteredHeroes.forEach((heroe, index) => {
            if (index < 11)
            {
                const row = document.createElement("div");
                row.setAttribute("class", "row")
                row.textContent = heroe.name
                suggestsBlock.appendChild(row);
                row.onclick = () => {
                    evt.target.value = row.textContent;
                    suggestsBlock.innerHTML = "";
                }
            }
        });
    }

    button.onclick = () => searchHeroe(evt.target.value);
}

function searchHeroe(heroeNameToFind){
    axios.get(URL + "/heroes")
    .then(heroes => {
        let heroe = heroes.data.find(heroe => heroe.name == heroeNameToFind)
        if (heroe) openModale(null, heroe.id)
    })
    .catch(err => console.error(err));
}

//PAGINATION

document.querySelectorAll(".pagination button")
.forEach(button => button.onclick = pagination)

function pagination(evt){
    let from = evt.target.getAttribute("data-id-from");
    let to = evt.target.getAttribute("data-id-to");
    getAll([from, to]);
}