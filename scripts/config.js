class Config {


    constructor() {
        this.stocksWsServer = "ws://stocks.mnet.website";
    }

    get(key) {
        return localStorage.getItem(key);
    }

    set(key, value) {
        localStorage.setItem(key, value);
    }

    getInt(key) {
        return parseInt(localStorage.getItem(key));
    }
}