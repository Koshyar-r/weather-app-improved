const container = document.querySelector(".container"),
inputPart = document.querySelector(".input-part"),
infoTxt = inputPart.querySelector(".info-txt"),
inputField = inputPart.querySelector("input"),
locationBtn = inputPart.querySelector("button"),
weatherPart = container.querySelector(".weather-part"),
wIcon = weatherPart.querySelector("img"),
arrowBack = container.querySelector("header i")

const textHour = document.getElementById('text-hour'),
      textMinutes = document.getElementById('text-minutes'),
      textAmPm = document.getElementById('text-ampm'),
      dateWeek = document.getElementById('date-day-week'),
      dateDay = document.getElementById('date-day'),
      dateMonth = document.getElementById('date-month'),
      dateYear = document.getElementById('date-year')


const clockText = () => {
    let date = new Date()

    let hh = date.getHours(),
        ampm,
        mm = date.getMinutes(),
        day = date.getDate(),
        dayweek = date.getDay(),
        month = date.getMonth(),
        year = date.getFullYear()

    if(hh >= 12) {
        hh -= 12
        ampm = 'PM'
    } else {
        ampm = 'AM'
    }

    if(hh == 0) {hh = 12}

    if(hh < 10) {hh = `0${hh}`}

    if(mm < 10) {mm = `0${mm}`}

    textHour.innerHTML = `${hh}:`

    textMinutes.innerHTML = mm

    textAmPm.innerHTML = ampm

    let week = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

    let months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

    dateDay.innerHTML = day
    dateWeek.innerHTML = `${week[dayweek]}`
    dateMonth.innerHTML = `${months[month]},`
    dateYear.innerHTML = year
}
setInterval(clockText, 1000)

let Weather = {
    api: "",
    apiKey : "3396ed7b89e138f7899a7a6fab93ac03",
    fetchData: function(city) {
        this.api = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=metric&appid=" + this.apiKey
        infoTxt.innerText = "Getting weather details..."
        infoTxt.classList.add("pending")
        fetch(this.api).then(res => res.json()).then(result => this.weatherDetails(result)).catch(() => {
            infoTxt.innerText = "Something went wrong"
            infoTxt.classList.replace("pending", "error")
        })
    },
    weatherDetails: function(result) {
        if(result.cod == "404") {
            infoTxt.classList.replace("pending", "error")
            infoTxt.innerText = `${inputField.value} isn't a valid city name`
        } else {
            const city = result.name
            const country = result.sys.country
            const {description, id} = result.weather[0]
            const {temp, feels_like, humidity} = result.main

            if(id == 800) {
                wIcon.src = "icons/clear.svg"
            } else if(id >= 200 && id <= 232) {
                wIcon.src = "icons/storm.svg" 
            } else if(id >= 600 && id <= 622) {
                wIcon.src = "icons/snow.svg"
            } else if(id >= 701 && id <= 781) {
                wIcon.src = "icons/haze.svg"
            } else if(id >= 801 && id <= 804) {
                wIcon.src = "icons/cloud.svg"
            } else if((id >= 500 && id <= 531) || (id >= 300 && id <= 321)) {
                wIcon.src = "icons/rain.svg"
            }
            
            weatherPart.querySelector(".temp .numb").innerText = Math.floor(temp)
            weatherPart.querySelector(".weather").innerText = description
            weatherPart.querySelector(".location span").innerText = `${city}, ${country}`
            weatherPart.querySelector(".temp .numb-2").innerText = Math.floor(feels_like)
            weatherPart.querySelector(".humidity span").innerText = `${humidity}%`
            infoTxt.classList.remove("pending", "error")
            infoTxt.innerText = ""
            inputField.value = ""
            container.classList.add("active")
        }
    },
    Search: function() {
        this.fetchData(document.querySelector(".search__bar").value)
    }
}

inputField.addEventListener("keyup", e => {
    if(e.key == "Enter" && inputField.value != "") {
        Weather.fetchData(inputField.value)
    }
})

locationBtn.addEventListener("click", (e) => {
    if(navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(onSuccess, onError)
    } else {
        alert("Your browser doesn't support geolocation API")
    }

    e.preventDefault()
    locationBtn.classList.add("animate")

    setTimeout(() => {
        locationBtn.classList.remove("animate")
    }, 600)
})

let api = ""
let apiKey = "3396ed7b89e138f7899a7a6fab93ac03"

function RequestApi(city){
    api = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`
    FetchUserLoaction()
}

function onSuccess(position) {
    const {latitude, longitude} = position.coords
    api = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`
    FetchUserLoaction()
}

function onError(error) {
    infoTxt.innerText = error.message
    infoTxt.classList.add("error")
}

function FetchUserLoaction() {
    infoTxt.innerText = "Getting weather details..."
    infoTxt.classList.add("pending")
    fetch(api).then(res => res.json()).then(result => Weather.weatherDetails(result)).catch(() => {
        infoTxt.innerText = "Something went wrong"
        infoTxt.classList.replace("pending", "error")
    })
}

document.querySelector(".search__input i").addEventListener("click", function() {
    Weather.Search()
})

arrowBack.addEventListener("click", () => {
    container.classList.remove("active")
})

const themeButton = document.getElementById('theme-btn')
const darkTheme = 'dark-theme'
const iconTheme = 'bxs-sun'

const selectedTheme = localStorage.getItem('selected-theme')
const selectedIcon = localStorage.getItem('selected-icon')

const getCurrentTheme = () => document.body.classList.contains(darkTheme) ? 'dark' : 'light'
const getCurrentIcon = () => themeButton.classList.contains(iconTheme) ? 'bxs-moon' : 'bxs-sun'

if (selectedTheme) {
    document.body.classList[selectedTheme === 'dark' ? 'add' : 'remove'](darkTheme)
    themeButton.classList[selectedIcon === 'bxs-moon' ? 'add' : 'remove'](iconTheme)
}

themeButton.addEventListener('click', () => {
    document.body.classList.toggle(darkTheme)
    themeButton.classList.toggle(iconTheme)
    localStorage.setItem('selected-theme', getCurrentTheme())
    localStorage.setItem('selected-icon', getCurrentIcon())
})