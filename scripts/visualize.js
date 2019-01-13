class TimeSeries {

    constructor(canvasId) {
        this.canvasId = canvasId;
    }

    __getConfig__(x_axis, y_axis, dataLabel, color) {
        return {
            type: 'line',
            data: {
                labels: x_axis,
                datasets: [{
                    label: dataLabel,
                    // backgroundColor: !!color ? color : 'rgb(255, 99, 132)',
                    borderColor: !!color ? color : 'rgb(255, 99, 132)',
                    data: y_axis,
                    pointHoverRadius: 4,
                    pointRadius: 3
                }]
            },
            options: {
                scales: {
                    xAxes: [{
                        type: 'time',
                        time: {
                            unit: 'second'
                        }
                    }]
                }
            }
        };
    }

    generateTimeSeries(x_axis, y_axis, dataLabel, color) {
        if (x_axis.length !== y_axis.length) {
            console.error("Length of elements in X-axis (%d) does not match that of elements in Y-axis (%d)", x_axis.length, y_axis.length);
            alert("Error occurred while trying to visualize trend");
            return;
        }
        // let chartData = [];
        // for (let i = 0; i < x_axis.length; i++) {
        //     chartData.push({
        //         x: x_axis[i],
        //         y: y_axis[i]
        //     });
        // }
        // console.log('Chart data : ' + JSON.stringify(chartData));
        this.chartConfig = this.__getConfig__(x_axis, y_axis, dataLabel, color);
        this.__initChart__(this.chartConfig);
    }

    __initChart__(chartConfig) {
        let canvas = document.getElementById(this.canvasId);
        if (!!canvas) {
            let cntx = canvas.getContext('2d');
            if (this.chart != undefined && !!this.chart)
                this.chart.destroy();
            this.chart = new Chart(cntx, this.chartConfig);
        } else {
            console.error("Canvas element with id [%s] could not be located", this.canvasId);
        }
    }

    destroy() {
        if (!!this.chart) {
            this.chart.clear();
            this.chart.destroy();
        }
    }

    regenerate() {
        this.destroy();
        this.regenerate(this.chartConfig);
    }

}