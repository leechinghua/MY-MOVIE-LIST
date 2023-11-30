const BASE_URL = 'https://webdev.alphacamp.io'
const INDEX_URL = BASE_URL + '/api/movies/'
const POSTER_URL = BASE_URL + '/posters/'
const MOVIE_PER_PAGE = 12
 
const movies = []
let filteredMovies = []//給搜尋出來的質一個物件存放位置

const dataPanel = document.querySelector('#data-panel')
const searchForm = document.querySelector('#search-form')
const searchInput = document.querySelector('#search-input')
const paginator = document.querySelector('#paginator')
const renderButtonCards = document.querySelector('#render-button-cards')
const renderButtonLists = document.querySelector('#render-button-lists')

function renderMovieCards(data){
  let rawHTML = ''
  data.forEach(item => {
    //title, image
    rawHTML +=`
    <div class="col-sm-3">
          <div class="mb-2">
            <div class="card">
              <img 
                src="${POSTER_URL + item.image}" 
                class="card-img-top" alt="Movie Poster"
                />
              <div class="card-body">
                <h5 class="card-title">${item.title}</h5>
              </div>
              <div class="card-footer">
                <button class="btn btn-primary btn-show-movie" data-bs-toggle="modal" data-bs-target="#movie-modal" data-id="${item.id}">More</button>
                <button class="btn btn-info btn-add-favorite" data-id="${item.id}">+</button>
              </div>
            </div>
          </div>
        </div>
`
  });
  dataPanel.innerHTML = rawHTML
}
function renderMovieLists(data) {
  let rawHTML = ''
  data.forEach(item => {
    //title, image
    rawHTML += `
    <div class="col-sm-3">
          <div class="mb-2">
            <div class="card">
              <img 
                src="${POSTER_URL + item.image}" 
                class="card-img-top" alt="Movie Poster"
                />
              <div class="card-body">
                <h5 class="card-title">${item.title}</h5>
              </div>
              <div class="card-footer">
                <button class="btn btn-primary btn-show-movie" data-bs-toggle="modal" data-bs-target="#movie-modal" data-id="${item.id}">More</button>
                <button class="btn btn-info btn-add-favorite" data-id="${item.id}">+</button>
              </div>
            </div>
          </div>
        </div>
`
  });
  dataPanel.innerHTML = rawHTML
}
function renderPaginator(amount){
  //80 / 12 = 6...8
  const numberOfPages = Math.ceil(amount / MOVIE_PER_PAGE ) 
  let rawHTML = ''
  for (let page = 1; page <= numberOfPages; page++){
    rawHTML += `
    <li class="page-item"><a class="page-link" href="#" data-page="${page}">${page}</a></li> `
  }
  paginator.innerHTML = rawHTML
}
paginator.addEventListener('click', function onPaginatorClicked(event){
  if(event.target.tagName !== 'A')return
  const page = Number(event.target.dataset.page) 
  renderMovieCards(getMoviesByPage(page)) 
})

function getMoviesByPage(page){
  //filteredMovies.length大於0就用 如無用movies 
  //page -> movies 0-11
  //page -> movies 12-23以此類推
  const data = filteredMovies.length ? filteredMovies : movies
  const startIndex = (page - 1) * MOVIE_PER_PAGE
  return data.slice(startIndex, startIndex + MOVIE_PER_PAGE)
}

function showMovieModal(id){
  const modalTitle = document.querySelector('#movie-modal-title')
  const modalImage = document.querySelector('#movie-modal-image')
  const modalData = document.querySelector('#movie-modal-data')
  const modalDescription = document.querySelector('#movie-modal-description')

  axios.get(INDEX_URL + id).then(response => {
    //response.data.results
    const data = response.data.results
    modalTitle.innerText = data.title
    modalData.innerText ='Release date:' + data.release_date
    modalDescription.innerText = data.description
    modalImage.innerHTML = `<img src="${POSTER_URL + data.image}" alt="movie poster" class="img-fluid">`
  })
}
function addToFavorite(id){
  const list = JSON.parse(localStorage.getItem('favoriteMovies') )|| []
  const movie = movies.find(movie => movie.id === id)
  if(list.some((movie) => movie.id===id)){
    return alert('此電影此電影已經在收藏清單中！')
  }
  list.push(movie)
  localStorage.setItem('favoriteMovies', JSON.stringify(list))
  // console.log(list)
}

dataPanel.addEventListener('click',function onPanelClicked(event){
  if (event.target.matches('.btn-show-movie')){
    showMovieModal(Number(event.target.dataset.id))
  } else if (event.target.matches('.btn-add-favorite')) {
    addToFavorite(Number(event.target.dataset.id))
  }
})
searchForm.addEventListener('submit', function onSearchFormSubmitted(event)  {
    event.preventDefault() //請瀏覽器終止元件的預設行為
  const keyword = searchInput.value.trim().toLowerCase()//將前後空格消除並將輸入字體都變小寫
    
  //   if (!keyword.length) {
  //   return alert('請輸入有效字串！')
  // }
  filteredMovies = movies.filter((movie)=>
  movie.title.toLowerCase().includes(keyword)
  )
  if(filteredMovies.length === 0){
    return alert('Cannot find movie with keyword:' + keyword)
  } 
  renderPaginator(filteredMovies.length)
  renderMovieCards(getMoviesByPage(1))
})
renderButtonCards.addEventListener('click', function onButtonCardsClicked (event){
  console.log(111)
})
renderButtonLists.addEventListener('click', function onButtonCardsClicked(event) {
  console.log(222)
})

axios
  .get(INDEX_URL)
  .then((response)=>{
    movies.push(...response.data.results)
    renderPaginator(movies.length)
    renderMovieCards(getMoviesByPage(1))
  })
  
