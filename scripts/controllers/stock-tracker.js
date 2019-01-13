stocksApp.controller('trackerController', function($scope, $interval) {
    changeActiveTab('track');
    $scope.stocksInfo = {};
    var timeInterval = null;
    var chart = new TimeSeries('chart-container-canvas');
    var defaultDecimalDigits = 2;

    function updateReadableTime() {
        Object.keys($scope.stocksInfo).forEach(function(ticker) {
            $scope.stocksInfo[ticker].lastUpdatedReadable = readableTime($scope.stocksInfo[ticker].lastUpdated);
        });
    }
    timeInterval = $interval(updateReadableTime, 5000);

    function receiveStocks(stocksObj) {
        stocksObj.forEach(function(stock, idx) {
            let ticker = stock[0];
            let price = stock[1];
            // console.log(ticker);
            // console.log(price);
            if ($scope.stocksInfo.hasOwnProperty(ticker.toUpperCase())) {
                let stock = $scope.stocksInfo[ticker.toUpperCase()];
                if (stock.price < price)
                    stock.status = 'stock-rise';
                else if (stock.price > price)
                    stock.status = 'stock-fall';
                stock.price = price;
                let d = new Date().getTime();
                stock.lastUpdated = d;
                stock.timeTrend.push(d);
                stock.priceTrend.push(price);
                $scope.stocksInfo[ticker.toUpperCase()] = stock;
            } else {
                let d = new Date().getTime();
                $scope.stocksInfo[ticker.toUpperCase()] = {
                    'ticker': ticker.toUpperCase(),
                    'price': price,
                    'lastUpdated': d,
                    'lastUpdatedReadable': readableTime(d),
                    'timeTrend': [],
                    'priceTrend': [],
                    'status': ''
                };
            }
            // console.log($scope.stocksInfo);
            $scope.$apply();
        });
    }

    var webSocket = new WebSocket(config.stocksWsServer);
    webSocket.onopen = function() {
        // console.log('Stocks WebSocket server connected');
    };

    webSocket.onerror = function(event) {
        console.error("WebSocket error : " + event);
    };

    webSocket.onmessage = function(msgEvt) {
        if (angular.isDefined(timeInterval) && timeInterval != null) {
            $interval.cancel(timeInterval);
            timeInterval = null;
            // console.log('Readable time interval stopped');
        }
        // console.log(msgEvt);
        let data = JSON.parse(msgEvt.data);
        receiveStocks(data);
        updateReadableTime();
        timeInterval = $interval(updateReadableTime, 5000);
        // console.log('Readable time interval started');
    };

    webSocket.onclose = function() {
        console.log("Connection to Stocks WebSocket server closed.");
        alert("Connection to server was Interrupted. Please make sure you're connected to the internet, and navigate away from and back to this page to reconnect.");
    };

    $scope.getDecimalDigits = function() {
        let num = config.getInt('stockPriceDecimalDigits');
        if (!isNaN(num))
            return num;
        return defaultDecimalDigits;
    }

    $scope.setDecimalDigits = function(numDigits) {
        config.set('stockPriceDecimalDigits', numDigits);
    }

    $scope.getStocks = function() {
        return $scope['stocksInfo'];
    };

    $scope.visualizeTrend = function(ticker) {
        // console.log("Generating chart for [%s] with data:\nX:" + $scope.stocksInfo[ticker].timeTrend + "\nY:" + $scope.stocksInfo[ticker].priceTrend, ticker);
        chart.destroy();
        $('#chart-modal').on('shown.bs.modal', function(e) {
            chart.generateTimeSeries($scope.stocksInfo[ticker].timeTrend, $scope.stocksInfo[ticker].priceTrend, ticker + " stock price", $scope.stocksInfo[ticker].status === 'stock-rise' ? 'lightgreen' : null);
        });
    };

    $('#chart-modal').on('hidden.bs.modal', function(e) {
        chart.destroy();
    });

});