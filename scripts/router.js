stocksApp.config(function($routeProvider, $locationProvider) {
    let templatesDir = 'templates/';
    $routeProvider
        .when("/", {
            templateUrl: templatesDir + "home-page.html",
            controller: 'homeController'
        })
        .when("/track", {
            templateUrl: templatesDir + "stock-tracker.html",
            controller: 'trackerController'
        })
        .when("/about", {
            templateUrl: templatesDir + "about-us.html",
            controller: 'aboutController'
        })
        .when("/not-found", {
            templateUrl: templatesDir + "lost.html",
            controller: 'lostController'
        })
        .otherwise({
            redirectTo: "/not-found"
        });

    $locationProvider.html5Mode(false);
    // $locationProvider.hashPrefix('!');
});