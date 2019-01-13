// var mutexTicker = null;
stocksApp.controller('trackerController', function($scope, $interval) {
    changeActiveTab('track');
    $scope.stocksInfo = {};
    var timeInterval = null;
    var chart = new TimeSeries('chart-container-canvas');
    var defaultDecimalDigits = 2;


    function updateReadableTime() {
        Object.keys($scope.stocksInfo).forEach((ticker) => {
            $scope.stocksInfo[ticker].lastUpdatedReadable = readableTime($scope.stocksInfo[ticker].lastUpdated);
        });
    }
    timeInterval = $interval(updateReadableTime, 5000);

    function receiveStocks(stocksObj) {
        stocksObj.forEach((stock, idx) => {
            let ticker = stock[0].toUpperCase();
            // if (!!mutexTicker && mutexTicker === ticker)
            //     return;
            let price = stock[1];
            if ($scope.stocksInfo.hasOwnProperty(ticker)) {
                let stock = $scope.stocksInfo[ticker];
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
                $scope.stocksInfo[ticker] = {
                    'ticker': ticker,
                    'price': price,
                    'lastUpdated': d,
                    'lastUpdatedReadable': readableTime(d),
                    'timeTrend': [],
                    'priceTrend': [],
                    'status': ''
                };
            }
            $scope.$apply();
        });
    }


    var webSocket = new WebSocket(config.stocksWsServer);
    webSocket.onopen = function() {
        // console.log('Stocks WebSocket server connected');
    };

    webSocket.onerror = function(evt) {
        console.error("WebSocket error : " + evt);
        alert("Connection to server Failed");
    };

    webSocket.onmessage = function(msgEvt) {
        if (angular.isDefined(timeInterval) && timeInterval != null) {
            $interval.cancel(timeInterval);
            timeInterval = null;
        }
        let data = JSON.parse(msgEvt.data);
        receiveStocks(data);
        updateReadableTime();
        timeInterval = $interval(updateReadableTime, 5000);
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

        // $('div#canvas-container').append('<canvas id="chart-container-canvas"></canvas>');
        // mutexTicker = ticker;
        // let timeTrend = [],
        //     priceTrend = [];
        // for (let i = 0; i < $scope.stocksInfo[ticker].timeTrend.length; i++) {
        //     timeTrend.push($scope.stocksInfo[ticker].timeTrend[i]);
        //     priceTrend.push($scope.stocksInfo[ticker].priceTrend[i]);
        // }
        // mutexTicker = null;
        $('#chart-modal').on('shown.bs.modal', function(e) {
            chart.generateTimeSeries($scope.stocksInfo[ticker].timeTrend.slice(0), $scope.stocksInfo[ticker].priceTrend.slice(0), ticker + " stock price", $scope.stocksInfo[ticker].status === 'stock-rise' ? 'lightgreen' : null);
        });
    };

    $('#chart-modal').on('hidden.bs.modal', function(e) {
        // mutexTicker = null;
        chart.destroy();
        // document.getElementById('chart-container-canvas').remove();
    });

});