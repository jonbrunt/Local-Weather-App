var farenheit = false, globalTemp = undefined;

init(); //calls init function on page load
//function that initializes the program on page load
function init() {
	let body = document.querySelector('body');
	fadeIn(body, 2000); //fades in body over 2000ms
	locate();
	button();
}
//function passing arguments of targeted element and time in milliseconds for fade in
function fadeIn(element, time) {
	let milli = new Date().getTime();
	//function that brings opacity from 0 - 1 based on time argument
	let animate = function() {
		element.style.opacity = +element.style.opacity + (new Date() - milli) / time;
		milli = new Date().getTime();
		if (+element.style.opacity < 1) {
		  (window.requestAnimationFrame && requestAnimationFrame(animate)) || setTimeout(animate, 10);
		}
	};
	//calls function for fade in animation
	animate();
}
//function to convert temperature between fahrenheit and celsius
function tempConvert(temp) {
	let newTemp = undefined, letter = undefined;
	if(!farenheit) {
		newTemp = Math.round(1.8 * temp + 32); farenheit = true; letter = 'F';
	} 
	else if(farenheit) {
		newTemp = Math.round((5/9) * (temp - 32)); farenheit = false; letter = 'C';
	}
	globalTemp = newTemp;
	//chages temperature HTML (uses innerHTML to allow for code for degree character)
	let temperatureDisplay = document.querySelector('#temperature').innerHTML = newTemp + '&deg; ' + letter + ' ';
	document.querySelector('p:nth-of-type(1)').style.display = 'block';
}
//function that fetches data from FCC API
function receive(lat, lon) {
	//assigns url variable for fetch function, concatenating latitude and longitude coordinates from geolocation
	let urlFCC = 'https://fcc-weather-api.glitch.me/api/current?lat=' + lat + '&lon=' + lon;
	fetch(urlFCC)
	.then(res => res.json())
	.then(function(data) {
		//assigns values from data from JSON
		let main = data.weather[0].main;
		let description = data.weather[0].description;
		let icon = data.weather[0].icon;
		let temp = data.main.temp;
		let pressure = data.main.pressure;
		//changes page HTML to reflect local weather
		document.querySelector('#conditions').innerText = main + ' ';
		document.querySelector('img').setAttribute('src', icon);
		tempConvert(temp); // calls tempConvert to change initial temperature display to farenheit
		document.querySelector('#button').style.display = 'initial'; //unhides temperature conversion button
		document.querySelector('#pressure').innerText = pressure + ' mbar';
	})
	.catch(function(error) { //error alert backup
		alert('An error ocurred while trying to load weather. Please try again.');
	})
}
//function that fetches specific location data from Google Maps API
function geo(lat, lon) {
	//assigns url variable for fetch concatenates
	let urlGoogle = 'https://maps.googleapis.com/maps/api/geocode/json?latlng=' + lat + ',' + lon + '&key=AIzaSyBamZhOtiUoBeKC9PwqQzblWBMZpMvtHEo';
	fetch(urlGoogle)
	.then(res => res.json())
	.then(function(data) {
		//assigns location name based on JSON data, and changes location information on page
		let name = data.results[0].address_components[2].long_name;
		document.querySelector('#location').innerText = name;
	})
	.catch(function(error) { //error alert backup
		alert('An error ocurred while trying to load weather. Please try again.');
	})
}
//function that attempts to receive current longitude and latitude of user
function locate() {
	navigator.geolocation.getCurrentPosition(function(position) {
		receive(position.coords.latitude, position.coords.longitude);
  		geo(position.coords.latitude, position.coords.longitude);
	});
}
//function that gives functionality to temperature change button
function button() {
	document.querySelector('#button').addEventListener('click', function() {
		tempConvert(globalTemp);
	});
}