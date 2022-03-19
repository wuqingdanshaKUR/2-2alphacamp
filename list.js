const Base_URL = "https://movie-list.alphacamp.io";
const Index_URL = Base_URL + "/api/v1/movies/";
const Poster_URL = Base_URL + "/posters/";

const movies = []
let filteredMovies = []
const dataPanel = document.querySelector('#data-panel')
const searchForm = document.querySelector('#search-form')
const searchInput = document.querySelector('#search-input')
const listGroup = document.querySelector('#list')
const paginator = document.querySelector('#paginator')
const movies_Per_Page = 12

function renderMovieList(data) {
  let rawHTML = ""

  data.forEach((item) => {
    //title image
    rawHTML += `<li class="list-group-item d-flex justify-content-between align-items-start">
        <p id="movie-title">${item.title}</p>
        <div>
          <button class="btn btn-primary btn-show-movie" data-bs-toggle="modal" data-bs-target="#movie-modal" data-id="${item.id}">More</button>
          <button class="btn btn-info btn-remove-favorite" data-id="${item.id}">+</button>
        </div>
      </li>`
  });
  listGroup.innerHTML = rawHTML
}

function showMovieModal(id) {
  const modalTitle = document.querySelector('#movie-title-modal')
  const modalImage = document.querySelector('#movie-modal-image')
  const modalDate = document.querySelector('#movie-modal-date')
  const modalDescription = document.querySelector('#movie-modal-description')

  axios.get(Index_URL + id).then((response) => {
    //response.data.results
    const data = response.data.results
    modalTitle.innerText = data.title
    modalImage.innerHTML = `<img src="${Poster_URL + data.image
      }" alt="movie-poster" class="image-fuid">`
    modalDate.innerText = `Release Date ${data.release_date}`
    modalDescription.innerText = data.description

  })
}

function addToFavorite(id) {
  const favoriteList = JSON.parse(localStorage.getItem("favoriteMovies")) || []
  const movie = movies.find((movie) => movie.id === id)

  if (favoriteList.some((movie) => movie.id === id)) {
    return alert("此電影已在於最愛清單中")
  }

  favoriteList.push(movie)
  console.log(favoriteList)
  localStorage.setItem("favoriteMovies", JSON.stringify(favoriteList))
}

function renderPaginator(amount) {
  const totalNumberPages = Math.ceil(amount / movies_Per_Page);
  let rawHtml = "";
  for (let page = 1; page <= totalNumberPages; page++) {
    rawHtml += `<li class="page-item"><a class="page-link" href="#" data-page="${page}">${page}</a></li>`;
  }
  paginator.innerHTML = rawHtml;
}

function getMovieByPage(page) {
  const data = filteredMovies.length ? filteredMovies : movies;
  const startIndex = (page - 1) * movies_Per_Page;
  return data.slice(startIndex, startIndex + movies_Per_Page);
}

paginator.addEventListener('click', function onPaginatorClicked(event) {
  if (event.target.tagName !== "A") return
  const page = Number(event.target.dataset.page)
  renderMovieList(getMovieByPage(page))
})

listGroup.addEventListener('click', function onPanelClicked(event) {
  if (event.target.matches(".btn-show-movie")) {
    showMovieModal(Number(event.target.dataset.id));
  } else if (event.target.matches(".btn-remove-favorite")) {
    removeFromFavorite(Number(event.target.dataset.id))
  }
})

searchForm.addEventListener('submit', function onSearchInputSubmitted(event) {
  event.preventDefault()
  const keyword = searchInput.value.trim().toLowerCase()

  filteredMovies = movies.filter((movie) =>
    movie.title.toLowerCase().includes(keyword)
  );

  if (filteredMovies.length === 0) {
    return alert("Cannot find the movie with:" + keyword)
  }
  renderPaginator(filteredMovies.length)
  renderMovieList(getMovieByPage(1))
})

axios.get(Index_URL).then(function (response) {
  movies.push(...response.data.results)
  renderPaginator(movies.length)
  renderMovieList(getMovieByPage(1))
})