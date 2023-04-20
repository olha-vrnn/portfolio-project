window.addEventListener('load', () => {
    if ("serviceWorker" in navigator) {
        navigator.serviceWorker
            .register("/sw.js")
            .then(serviceWorker => {
                console.log("Service Worker registered: ", serviceWorker);
            })
            .catch(error => {
                console.log("Error registering the Service Worker: ", error);
            });
    }
});

document.addEventListener('DOMContentLoaded', () => {

    //Ex.1

    let visits = localStorage.getItem('visits');

    if (visits) {
        visits = parseInt(visits) + 1;
        console.log(`Number of visits: ${visits}`);
    } else {
        visits = 1;
        console.log(`Welcome, you are visiting my website for the first time!`);
    }
    localStorage.setItem('visits', visits);



    // Ex.2

    let timeBefore = localStorage.getItem('previousVisit');
    let timeAfter = localStorage.getItem('closeWebsite');
    let openWebsite = new Date().getTime();
    localStorage.setItem('openWebsite', openWebsite);

    if (timeBefore && timeAfter) {
        let timeDifference = Math.round((parseInt(timeAfter) - parseInt(timeBefore)) / 1000);
        let timeVisited = parseInt(localStorage.getItem('timeSpent')) || 0;
        let timeSpent = timeVisited + timeDifference;
        localStorage.setItem('timeSpent', timeSpent);
        console.log(`You spent a total of ${timeSpent} seconds or ${(timeSpent / 60).toFixed(2)} minutes on the website.`);
    } else {
        console.log('Your first visit! Welcome!');
    }

    window.addEventListener('beforeunload', () => {
        let closeWebsite = new Date().getTime();
        localStorage.setItem('closeWebsite', closeWebsite);
        localStorage.setItem('previousVisit', openWebsite);
    });

})
