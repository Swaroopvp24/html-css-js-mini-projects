let weather = {
    apiKey: "67b92f0af5416edbfe58458f502b0a31",
    fetchWeather: function (city) {
      fetch(
        "https://api.openweathermap.org/data/2.5/weather?q=" +
          city +
          "&units=metric&appid=" +
          this.apiKey
      )
        .then((response) => {
          if (!response.ok) {
            alert("No weather found.");
            throw new Error("No weather found.");
          }
          return response.json();
        })
        .then((data) => this.displayWeather(data));
    },
    displayWeather: function (data) {
        const { name } = data;
        const { icon, description } = data.weather[0];
        const { temp, humidity } = data.main;
        const { speed } = data.wind;
        document.querySelector("#city").innerText = name;
        document.querySelector("#temp").innerText = temp + "°C";
        document.querySelector("#hum").innerText = humidity + "%";
        document.querySelector("#winds").innerText = speed +"km/h";
        document.querySelector(".card").classList.remove("loading");
    },
    search: function(){
        this.fetchWeather(document.querySelector("#searchb").value);
    },
};

document.querySelector("#searchbtn").addEventListener("click", ()=>{
    weather.search();
});

document
.querySelector("#searchb")
.addEventListener("keyup", function (event) {
  if (event.key == "Enter") {
    weather.search();
  }
});

weather.fetchWeather("Bengaluru");

