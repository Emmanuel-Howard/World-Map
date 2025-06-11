/* Connecting required elements */
const map = document.querySelector("svg");
const countries = document.querySelectorAll("path");
const sidePanel = document.querySelector(".side-panel");
const container = document.querySelector(".side-panel .container");
const closeBtn = document.querySelector(".close-btn");
const loading = document.querySelector(".loading");
const zoomInBtn = document.querySelector(".zoom-in");
const zoomOutBtn = document.querySelector(".zoom-out");
const zoomValueOutput = document.querySelector(".zoom-value");

/* Data Outputs */
const countryNameOutput = document.querySelector(".country.name");
const countryFlagOutput = document.querySelector(".country.flag");
const cityOutput = document.querySelector(".city");
const areaOutput = document.querySelector(".area");
const currencyOutput = document.querySelector(".currency");
const languageOutput = document.querySelector(".language");

// Loop through all countries
countries.forEach(country => {
    // Adds mouse enter event to each country (on cursor hover)
    country.addEventListener ("mouseenter", function() {
        // Get all classes of the country
        const classList = [...this.classList].join('.');
        console.log(classList);
        // Create a selector for matching classes
        const selector = '.' + classList;
        // Select all territories (svg paths) from the same country
        const matchingElements = document.querySelectorAll(selector);
        // Add hover class to all matching elements
        matchingElements.forEach(el => el.computedStyleMap.fill = "#c99aff");
    });

    // Adds mouse leave event to each country (on cursor leave)
    country.addEventListener ("mouseout", function() {
        const classList = [...this.classList].join('.');
        const selector = '.' + classList;
        const matchingElements = document.querySelectorAll(selector);
        matchingElements.forEach(el => el.computedStyleMap.fill = "#443d4b");
    });

    // Adds click event to each country
    country.addEventListener("click", function(e) {
        // Set loading text
        loading.innerText = "Loading...";
        // Hide country data container
        container.classList.add("hide");
        // Show loading screen
        loading.classList.remove("hide");
        // Variable to hold country name
        let clickedCountryName;
        // If the clicked svg path has a name attribute
        if(e.target.hasAttribute("name")) {
            // Get the name of the country
            clickedCountryName = e.target.getAttribute("name");
            // Else no name attribute
        } else {
            // Get the class (country) name
            clickedCountryName = e.target.classList.value
        }
        // Open the side panel
        sidePanel.classList.add("open");
        // Fetch country data from the API
        fetch(`https://restcountries.com/v3.1/name/${clickedCountryName}?fullText=true`)
        .then(response => {
            // Check if the response is ok
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            // Parse the response as JSON
            return response.json();
        })
        .then(data => {
            console.log(data);
            setTimeout(() =>{
                // Extract data and output to the side panel
                countryNameOutput.innerText = data[0].name.common;
                // Flag image
                countryFlagOutput.src = data[0].flags.png;
                // Capital city
                cityOutput.innerText = data[0].capital;
                // Area
                // Changing number format to include dots in big numbers
                const formatedNumber = data[0].area.toLocaleString('en-US');
                areaOutput.innerHTML = formatedNumber + 'km<sup>2</sup>'
                // Currency
                // Get the currency object
                const currencies = data[0].currencies;
                /* Set currency output to empty string */
                currencyOutput.innerText = '';
                // Loop through each onject key in the currencies object
                Object.keys(currencies).forEach(key => {
                    // Output name of each currency from selected country
                    currencyOutput.innerHTML += `<li>${currencies[key].name}</li>`;
                });
                // Language (Like currency)
                const language = data[0].language;
                languageOutput.innerText = '';
                Object.keys(language).forEach(key => {
                    languageOutput.innerHTML += `<li>${language[key]}</li>`;
                });
                // Wait for new flag image to load
                countryFlagOutput.onload = () => {
                    // Show container with country data
                    container.classList.remove("hide");
                    loading.classList.add("hide");
                };
            }, 500);
        })
        // Handle Errors
        .catch(error => {
            loading.innerText = "No data found";
            console.error("There was a problem with the fetch operation:", error);
        });
    });
});

