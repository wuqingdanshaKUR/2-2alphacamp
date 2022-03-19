const Base_URL = "https://movie-list.alphacamp.io";
const Index_URL = Base_URL + "/api/v1/movies/";
const Poster_URL = Base_URL + "/posters/";

const movies = JSON.parse(localStorage.getItem("favoriteMovies")) || []
const dataPanel = document.querySelector('#data-panel')
const searchForm = document.querySelector('#search-form')
const searchInput = document.querySelector('#search-input')

function renderMovieList(data) {
  let rawHTML = ""

  data.forEach((item) => {
    //title image
    rawHTML += `<div class="col-sm-3">
        <div class="mb-2">
          <div class="card">
            <img src="${Poster_URL + item.image
      }" class="card-img-top" alt="MoviePoster">
            <div class="card-body">
              <h5 class="Movie-title">${item.title}</h5>
            </div>
            <div class="card-footer text-muted">
              <button class="btn btn-primary btn-show-movie" data-bs-toggle="modal" data-bs-target="#movie-modal" data-id="${item.id
      }">More</button>
              <button class="btn btn-danger btn-remove-favorite" data-id="${item.id
      }">X</button>
            </div>
          </div>
        </div>
      </div>`
  });
  dataPanel.innerHTML = rawHTML
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

function removeFromFavorite(id) {
  const movieIndex = movies.findIndex((movie) => movie.id === id)
  movies.splice(movieIndex, 1)

  localStorage.setItem("favoriteMovies", JSON.stringify(movies))
  renderMovieList(movies)
}

dataPanel.addEventListener('click', function onPanelClicked(event) {
  if (event.target.matches(".btn-show-movie")) {
    showMovieModal(Number(event.target.dataset.id));
  } else if (event.target.matches(".btn-remove-favorite")) {
    removeFromFavorite(Number(event.target.dataset.id))
  }
})

renderMovieList(movies)