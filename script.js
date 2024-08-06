const TAG_CLOCK = document.getElementById('clock');
const INPUT = document.createElement('input');
const BTN_PLAY = document.getElementById('btn-play')
const INPUT_SECTION = document.querySelector('div.input-section');
const TAG_HIT = document.querySelector('p.pokedex-progression');
const TAG_REMAINING = document.querySelector('p.pokedex-remaining');

let idInterval;
let globalTime;
let globalHit;
let globalGame = 1;

function stopwatch(){
    let timeInSeconds = 0;
    idInterval = setInterval(() => {
        timeInSeconds++;
        updateTime(timeInSeconds);
    }, 1000)
}

function updateTime(timeInSeconds){
    let stringFormatTime = calculateTimeFormat(timeInSeconds);
    globalTime = stringFormatTime;
    TAG_CLOCK.textContent = stringFormatTime;
}

function calculateTimeFormat(timeInSeconds){
    let numberHour = Math.floor(timeInSeconds / 3600);
    let numberMinute = Math.floor((timeInSeconds % 3600) / 60);
    let numberSecond = Math.floor((timeInSeconds % 60));

    let formatHour = String(numberHour).padStart(2,'0');
    let formatMinute = String(numberMinute).padStart(2,'0');
    let formatSecond = String(numberSecond).padStart(2,'0');

    return `${formatHour}:${formatMinute}:${formatSecond}`;
}

organizeBlocks()

function giveUp(){
    if(!globalGame){
        clearInterval(idInterval);
        if(globalHit < 151){
            alertGiveUp();
        } else {
            alertCongratulations();
        }
        revealPokedex();
        INPUT.remove();
        INPUT_SECTION.appendChild(BTN_PLAY);
        globalGame = 1;
    }
}

function alertGiveUp(){
    alert(`You didn't complete 100% of the Pokedex, but congratulations! You completed in ${Math.floor((100 * globalHit) / 151)}% and found ${globalHit} species of Pokemon.\n\n Your time was ${globalTime}`);
}

function alertCongratulations(){
    alert(`Congratulations! You complete 100% and found all pokemon species. \n Your time was: ${globalTime}`)
}

function organizeBlocks(){
    const TAG_LIST_POKEMON = document.querySelector('.list-pokedex')
    let count = 1;

    if (window.innerWidth < 1200){
        TAG_LIST_POKEMON.appendChild(createElementHeaderPokemon());

        while(count < 152){
            TAG_LIST_POKEMON.appendChild(createElementPokemon(count));
            count++;
        }
    } else {
        while((document.querySelectorAll('div.pokemon').length) < 6){
            TAG_LIST_POKEMON.appendChild(createElementHeaderPokemon());
        }

        let auxCounter = 149;

        while(count < 152){
            TAG_LIST_POKEMON.appendChild(createElementPokemon(count))
            if (count < 26){
                count = count + 26;
            } else if(count == 26) {
                count = 152;
            } else {
                count = count + 25;
            }
            
            if(count > 151){
                count = 151;
                count = count - auxCounter;
                auxCounter--;
                if(((document.querySelectorAll('div.pokemon').length)) == 157) {
                    count = 152;
                }
            }
        }
    }
}

function createElementHeaderPokemon(){
    const TAG_HEADER_PK = document.createElement('div');
    const TAG_ICON_BALL = document.createElement('div')
    const TAG_IMG = document.createElement('img');
    const TAG_PK_CODE = document.createElement('p');
    const TAG_HEADER_PK_NAME = document.createElement('p');

    TAG_HEADER_PK.className = 'pokemon';
    TAG_ICON_BALL.className = 'pk-icon-ball';
    TAG_IMG.src = 'https://www.serebii.net/itemdex/sprites/pokeball.png'
    TAG_PK_CODE.className = 'pk-code';
    TAG_HEADER_PK_NAME.id = 'header-pk-name';
    TAG_PK_CODE.innerText = 'No.'
    TAG_HEADER_PK_NAME.innerText = 'Pokemon'

    TAG_HEADER_PK.appendChild(TAG_ICON_BALL)
    TAG_ICON_BALL.appendChild(TAG_IMG)
    TAG_HEADER_PK.appendChild(TAG_PK_CODE)
    TAG_HEADER_PK.appendChild(TAG_HEADER_PK_NAME)

    return TAG_HEADER_PK
}

function createElementPokemon(count){
    const TAG_POKEMON = document.createElement('div')
    const TAG_PK_ICON = document.createElement('div')
    const TAG_IMG = document.createElement('img')
    const TAG_PK_CODE = document.createElement('p')
    const TAG_PK_NAME = document.createElement('p')
    
    TAG_POKEMON.className = 'pokemon'
    TAG_PK_ICON.className = 'pk-icon'
    TAG_IMG.src = 'https://archives.bulbagarden.net/media/upload/a/ab/000MS.png'
    TAG_PK_CODE.className = 'pk-code'
    TAG_PK_NAME.className = 'pk-name'
    let auxString = String(count).padStart(3,'0');
    TAG_PK_CODE.innerText = `#${auxString}`
    TAG_IMG.id = `i${auxString}`
    TAG_PK_NAME.id = `n${auxString}`
    TAG_PK_NAME.innerText = '---'

    TAG_POKEMON.appendChild(TAG_PK_ICON)
    TAG_POKEMON.appendChild(TAG_PK_CODE)
    TAG_POKEMON.appendChild(TAG_PK_NAME)
    TAG_PK_ICON.appendChild(TAG_IMG)

    return TAG_POKEMON;
}

const URL = 'https://pokeapi.co/api/v2/pokemon-species/?limit=151'

let pokedex = []

async function fetchPokedex(){
    try {
        const RESPONSE = await fetch(URL);
        const DATA = await RESPONSE.json();
        pokedex = DATA.results.map(pokemon => pokemon.name);
        pokedex[28] = pokedex[28].split('-')[0];
        pokedex[31] = pokedex[31].split('-')[0];
        pokedex[121] = pokedex[121].replace('-','');
    } catch(error) {
        pokedex = []
    }
}

async function processPokedex() {
    const TAG_INPUT = document.querySelector('input#input-pokemon')
    await fetchPokedex();

    setInterval(() => {
        let stringInput = (TAG_INPUT.value).toLowerCase();
        stringInput = stringInput.trim();

        let indexPokedex = pokedex.indexOf(stringInput);
        const PK_IMG = document.getElementById(`i${String(indexPokedex + 1).padStart(3,'0')}`);
        const PK_NAME = document.getElementById(`n${String(indexPokedex + 1).padStart(3,'0')}`);

        if(indexPokedex != 28 && (pokedex[indexPokedex] == stringInput)){  

            PK_IMG.src = `https://www.serebii.net/pokedex-xy/icon/${String(indexPokedex + 1).padStart(3,'0')}.png`;
            PK_NAME.innerText = pokedex[indexPokedex];
            TAG_INPUT.value = '';
            pokedex[indexPokedex] = `#c${pokedex[indexPokedex]}`
            countPokedex(pokedex);

        } else if(indexPokedex == 28) {
                
            PK_IMG.src = `https://www.serebii.net/pokedex-xy/icon/${String(indexPokedex + 1).padStart(3,'0')}.png`;
            PK_NAME.innerText = pokedex[indexPokedex];
            TAG_INPUT.value = '';
            pokedex[indexPokedex] = `#c${pokedex[indexPokedex]}`
            countPokedex(pokedex);

            indexPokedex = 31;
            const PK_IMGM = document.getElementById(`i${String(indexPokedex + 1).padStart(3,'0')}`);
            const PK_NAMEM = document.getElementById(`n${String(indexPokedex + 1).padStart(3,'0')}`);

            PK_IMGM.src = `https://www.serebii.net/pokedex-xy/icon/${String(indexPokedex + 1).padStart(3,'0')}.png`;
            PK_NAMEM.innerText = pokedex[indexPokedex];
            console.log(pokedex[indexPokedex]);
            pokedex[indexPokedex] = `#c${pokedex[indexPokedex]}`
            countPokedex(pokedex);
        }
        
    })
}

function countPokedex(){
    count = 0;
    for(i = 0; i < 151; i++){
        if(pokedex[i].includes('#c')){
            count++;
        }
    }

    TAG_HIT.innerText = `Hits: ${count}`;
    globalHit = count;
    TAG_REMAINING.innerText = `Missing: ${151 - count}`;
}

function startGame(){
    INPUT.type = 'text'
    INPUT.id = 'input-pokemon'
    INPUT.placeholder = 'name'
    INPUT.autocomplete = 'off'

    BTN_PLAY.remove();
    INPUT_SECTION.appendChild(INPUT)
    TAG_CLOCK.textContent = "00:00:00";
    stopwatch();
    processPokedex();

    for(i = 0; i < 151; i++){
        const PK_IMG = document.getElementById(`i${String(i + 1).padStart(3,'0')}`);
        const PK_NAME = document.getElementById(`n${String(i + 1).padStart(3,'0')}`);
        PK_IMG.src = "https://archives.bulbagarden.net/media/upload/a/ab/000MS.png";
        PK_NAME.innerText = "---";
        PK_NAME.className = "pk-name"; 
    }
    TAG_HIT.innerText = `Hits: 0`;
    globalHit = 0;
    TAG_REMAINING.innerText = `Missing: 151`;
    globalGame = 0;
}

function revealPokedex(){
    for(i = 0; i < 151; i++){
        const PK_IMG = document.getElementById(`i${String(i + 1).padStart(3,'0')}`);
        const PK_NAME = document.getElementById(`n${String(i + 1).padStart(3,'0')}`);
        
        if(!(pokedex[i].includes('#c'))){
            PK_IMG.src = `https://www.serebii.net/pokedex-xy/icon/${String(i + 1).padStart(3,'0')}.png`;
            PK_NAME.innerText = pokedex[i];
            PK_NAME.className = "pk-name pokedex-remaining";
                
        } else {
            PK_NAME.className = "pk-name pokedex-progression";       
        }
    }
}

idCongratulations = setInterval(()=>{
    if(globalHit == 151){
        giveUp();
        clearInterval(idCongratulations);
    }
})
