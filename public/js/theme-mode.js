document.addEventListener('DOMContentLoaded', () => {
    const themeToggleButton = document.getElementById('theme-toggle');
    const themeIcon = document.getElementById('theme-icon');

    // Function to set the dark theme
    function setDarkTheme() {
        document.documentElement.classList.add("dark");
        document.getElementById("theme-toggle").title = "Toggle Light Mode";
        localStorage.theme = 'dark';
        themeIcon.className = 'fal fa-sun text-white sun-drop';
    }

    // Function to set the light theme
    function setLightTheme() {
        document.documentElement.classList.remove("dark");
        document.getElementById("theme-toggle").title = "Toggle Dark Mode";
        localStorage.theme = 'light';
        themeIcon.className = 'fal fa-moon text-black moon-rise';
    }

    // Function to initialize the theme
    function initializeTheme() {
        if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            setDarkTheme();
        } else {
            setLightTheme();
        }

        var version = getUrlParameter('version');
        if (version) {
            if (version == 'dark') {
                setDarkTheme();
            } else if (version == 'light') {
                setLightTheme();
            }
        }
    }

    // Function to get URL parameters
    function getUrlParameter(sParam) {
        var sPageURL = window.location.search.substring(1),
            sURLVariables = sPageURL.split('&'),
            sParameterName,
            i;

        for (i = 0; i < sURLVariables.length; i++) {
            sParameterName = sURLVariables[i].split('=');

            if (sParameterName[0] === sParam) {
                return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
            }
        }
        return false;
    }

    // Add click event listener to the theme toggle button
    themeToggleButton.addEventListener('click', () => {
        if (document.documentElement.classList.contains('dark')) {
            setLightTheme();
        } else {
            setDarkTheme();
        }
    });

    // Add mouseover event listener to reapply animations
    themeIcon.addEventListener('mouseover', () => {
        if (document.documentElement.classList.contains('dark')) {
            themeIcon.classList.remove('sun-drop');
            void themeIcon.offsetWidth;  // Trigger reflow
            themeIcon.classList.add('sun-drop');
        } else {
            themeIcon.classList.remove('moon-rise');
            void themeIcon.offsetWidth;  // Trigger reflow
            themeIcon.classList.add('moon-rise');
        }
    });

    // Initialize the theme on page load
    initializeTheme();
});
