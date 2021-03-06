var movies = null;
var indexArray = 1;
var textSearch = '2020';
var totalR = 0


document.addEventListener('DOMContentLoaded', () => {
    if (window.location.pathname.indexOf("movie/") === -1) {
        const url = "http://www.omdbapi.com/?apikey=a784252&s=" + textSearch;
        listmovies(url);
    } else {
        const link = window.location.pathname
        const id = link.substring(7, link.length);
        const url = "http://www.omdbapi.com/?apikey=a784252&i=" + id + "&plot=full";
        movieSearch(url)
    }

    const searchForm = document.querySelector("#form-search")
    searchForm.addEventListener('submit', search)
})

function search(e) {
    e.preventDefault();
    const text = document.querySelector("#form-search input[type=search]")
    textSearch = text.value
    indexArray = 1
    url = "http://www.omdbapi.com/?apikey=a784252&s=" + text.value;
    listmovies(url);
}


function listmovies(url) {
    if (window.XMLHttpRequest) {
        xmlhttp = new XMLHttpRequest()
    } else {
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP")
    }
    xmlhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            const response = JSON.parse(this.responseText)
            totalR = response.totalResults;
            movies = response.Search;
            let img = null
            let HTML = ''
            movies.forEach(movie => {
                if (movie.Poster === 'N/A') {
                    img = "/img/movie.png";
                } else {
                    img = movie.Poster;
                }
                console.log(img)
                HTML += `
                        <div class="col-sm-5 col-md-3 mb-3">
                            <div class="card">
                                <img src="${img}" class="card-img-top" alt="..">
                                <div class="card-body">
                                    <h5 class="card-title">${movie.Title}</h5>
                                    <p class="card-text">${movie.Year}</p>
                                    <a href="/movie/${movie.imdbID}" class="btn btn-primary">Detalle</a>
                                </div>
                            </div>
                        </div>
                    `
            });

            if (!document.getElementById('idx')) {
                document.getElementById('pagination-items').innerHTML = `
                <li class="page-item disabled" id="next" style="cursor: pointer;">
                <a class="page-link" onclick="pagination(-1)">Atras</a>
            </li>
            <li class="page-item disabled" id="idx">
                <a class="page-link">1</a>
            </li>
            <li class="page-item" id="back" style="cursor: pointer;">
                <a class="page-link" onclick="pagination(1)">Siguiente</a>
            </li>
                `
                if (totalR <= 10) {
                    document.getElementById('back').classList.add("disabled");
                } else {
                    document.getElementById('back').classList.remove("disabled");
                }
            }
            
            document.querySelector('#content-movies').innerHTML = HTML
            document.getElementById('idx').innerHTML = `<a class="page-link">${indexArray}/${totalR}</a>`

        } else {
            document.querySelector('#content-movies').innerHTML = "<h2>No existe la pelicula.</h2>"
        }
    };
    xmlhttp.open("GET", url, true)
    xmlhttp.send()
}

function movieSearch(url) {
    if (window.XMLHttpRequest) {
        xmlhttp = new XMLHttpRequest()
    } else {
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP")
    }
    xmlhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            const movie = JSON.parse(this.responseText)
            var HTML = '';
            let img = null
            if (movie.Poster === 'N/A') {
                img = "/img/movie.png";
            } else {
                img = movie.Poster;
            }
            if (movie.Title) {
                HTML = `
                <div class="col">
                <img src="${img}" alt="...">
            </div>

            <div class="col">
                <h2>${movie.Title}</h2>
                <p><strong>Director:</strong> <span>${movie.Director}</span></p>
                <p><strong>Descripción:</strong> ${movie.Plot}</p>
                <p><strong>Actores:</strong> ${movie.Actors}</p>
                <p><strong>Año:</strong> ${movie.Year}</p>
                <p><strong>Lenguaje:</strong> ${movie.Language}</p>
                <p><strong>Pais:</strong> ${movie.Country}</p>
                <p><strong>Genero:</strong> ${movie.Genre}</p>
                <p><strong>Tipo:</strong>  ${movie.Type}</p>
                
            </div>
                `
            } else {
                HTML = "<h2>No existe la pelicula.</h2>"
            }
            document.querySelector('#content-movies').innerHTML = HTML

        }
    };
    xmlhttp.open("GET", url, true)
    xmlhttp.send()
};


function pagination(index) {
    indexArray = indexArray + (index);
    if (indexArray <= 1) {
        indexArray = 1
        document.getElementById('next').classList.add("disabled");

    } else {
        document.getElementById('next').classList.remove("disabled");
    }

    if (indexArray === totalR || totalR <= 10) {
        document.getElementById('back').classList.add("disabled");
    } else {
        document.getElementById('back').classList.remove("disabled");
    }
    let url = "http://www.omdbapi.com/?apikey=a784252&s=" + textSearch + "&page=" + indexArray;
    listmovies(url);
};

