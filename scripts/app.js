// declaring angular App module, and required dependencies, e.g. ngRoute
var stocksApp = angular.module('stocks-app', ["ngRoute"]);
var config = new Config();

function onPageLoad() {
    let body = document.getElementsByTagName('body')[0];
    let nav = document.getElementById('navbar');
    body.style.paddingTop = nav.clientHeight + 'px';
}

function readableTime(timeMillis) {
    let d = new Date();
    let diffSeconds = (d.getTime() - timeMillis) / 1000;
    // console.log(timeMillis);
    if (diffSeconds < 60)
        return 'Few seconds ago';
    else if ((diffSeconds / 60) <= 3)
        return 'Few minutes ago';
    else if ((diffSeconds / 60) < 60)
        return ((diffSeconds / 60) + '').split('.')[0] + ' minutes ago';
    else
        return new Date(timeMillis).toLocaleString();
};

stocksApp.filter('readableTime', function() {
    return readableTime;
});

stocksApp.filter('roundNum', function() {
    return (num, digits) => {
        let n = Math.pow(10, digits);
        return Math.round(num * n) / n;
    };
});

function changeActiveTab(tabID) {
    var t1 = document.querySelector('ul.navbar-nav>li.active');
    var t2 = document.getElementById('nav-' + tabID);
    t1.classList.remove('active');
    t2.classList.add('active');
}