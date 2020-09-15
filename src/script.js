
// Creating list of episodes in the dropdown menu
$(window).on("load", function () {
    createEpisodesList('https://rickandmortyapi.com/api/episode/')
})

// Making menu a dropdown
$("#episodes__menu").on("click", function() {
    toggleHeight('#episodes__list')
})

////// Funtions//////

// Height toggle function (for menu)
function toggleHeight (element) {
    $(element).animate({
        height: 'toggle'
    })
}
 
// Function creating list of episode for the menu
function createEpisodesList (url) {
    axios.get(url).then((data) => {
        let episodes = data.data.results;
        for (let episode of episodes) {
            let link = `<div class="episode__link" id="episode__${episode.id}">${episode.episode} - ${episode.name}</div>`
            $('#episodes__list').append(link)

            // Ading event listeners to menu list elements using showEpisodeInfo and showCharactersForEpisode functions
            $(`#episode__${episode.id}`).on("click", function () {
                showEpisodeInfo(`https://rickandmortyapi.com/api/episode/${episode.id}`)
                showCharactersForEpisode (`https://rickandmortyapi.com/api/episode/${episode.id}`)
            })
        }  

        //Adding a button to load more episodes to the list if next page exist in the response (pagination)
        if (data.data.info.next !== null) {
            $('#episodes__list').append(`<button class="load" data-set=${data.data.info.next}>Load More</button>`)
        }
        $('.load').on("click", function(event) {
            createEpisodesList(data.data.info.next)
            $(event.target).hide()
        })

  })
}

// Function to show name, date and code for episodes on top of the episodes container
function showEpisodeInfo(url) {
   
        axios.get(url).then((data) => {
            $(".episode__info").text(`Episode Name: ${data.data.name},  Air date: ${data.data.air_date}, Code: ${data.data.episode}`)
        })   
}

// Creating cards for each character of the episode using createCharacterCard function
function showCharactersForEpisode (url) {

        $(".episode__characters").empty()
        axios.get(url).then((data) => {

            $(".episode__name").text(`${data.name}`)
            
            let episodeCharactersLinks  = data.data.characters

            episodeCharactersLinks.forEach((link) => createCharacterCard(link))
        })
}

// Function to create caharacte card for each character making reqiest to a particular URL
function createCharacterCard (url) {
    axios.get(url).then((data) => {
        let info = $(`<div class="character__card">
        <img src="${data.data.image}" id="img__${data.data.id}" class="character__image">
        <p class="character__name">${data.data.name}</p>
        <p>Status: ${data.data.status}</p> <p>Species: ${data.data.species}</p>               
        </div>`)
        $(".episode__characters").append(info) 
        
        //Adding event listener to image of the card - when clicked the Individual card of the character will be shown in episode container
        $(`#img__${data.data.id}`).on("click", function (){
            showCharacter(url)
        })
    })
}

// Function to create individual card for character with more deatils
function showCharacter(url) {
    axios.get(url).then((data) => {

        //Epmtying the container
        $(".episode__characters").empty()
        $(".episode__info").empty()

        //Creating contect of the individual card
        let info = $(`<div class="character__ind">
        <p class="character__name ind">${data.data.name}</p>
        <img src="${data.data.image}" id="img__${data.data.id}" class="character__image__ind">
        <p>Status: ${data.data.status} | Species: ${data.data.species} | Gender: ${data.data.gender}</p> 
        <p>Origin: ${data.data.origin.name} | Current Location: ${data.data.location.name}</p>
        
        <p class="show__location">Show Origin Location</p>
        <p id="episodes__char">Episodes: </p>              
        </div>`)
        $(".episode__characters").append(info) 

        let locationUrl = data.data.origin.url

        //Adding Event listener to Show location button which will use showLocation function with specific URL of location for request
        $('.show__location').on("click", function() {
            $(".episode__characters").empty()
            showLocation(locationUrl)
        })

        let episodes = data.data.episode

        // Creating list of episodes where character is present with event listeners same as in menu list (showEpisodeInfo and showCharactersForEpisode functions to show characters of episode)
        for (let episode of episodes) {

            axios.get(episode).then((data) => {
                $('#episodes__char').append(`<p id="episodes__char__${data.data.id}" class="episodes__char">${data.data.episode} -${data.data.name}</p>`)
                $(`#episodes__char__${data.data.id}`).on("click", function () {
                    showCharactersForEpisode (`https://rickandmortyapi.com/api/episode/${data.data.id}`)
                    showEpisodeInfo(`https://rickandmortyapi.com/api/episode/${data.data.id}`)
                })
            })
        }
    })
}

// Function to show info about location and all charcters which are residents of this location (using createCharacterCard function as before)
function showLocation(url) {
    axios.get(url).then((data) => {
        let residents = data.data.residents
        let info = $(`<div class="location__card">
                    <p class="location__name">${data.data.name} | Type: ${data.data.type} |  Dimension: ${data.data.dimension}</p>
                    <p>Current Residents:</p>               
                    </div>`)
                    $(".episode__info").empty()
                    $(".episode__info").append(info) 

        residents.forEach((res) => createCharacterCard(res))
    })
}

