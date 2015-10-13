(function (global, $) {
    var perfChart = null,
        app = global.app = global.app || {};

    app.perfChart = {
        createPerfChart: function (api) {
            app.perfChart.drawPerfChart(api);
            app.perfChart.bindResizeEvent();
        },

        drawPerfChart: function (api) {
            var $perfChart,
                jsonUrlToLoad,
                metric = api;

            if (perfChart !== null) {
                perfChart.destroy();
            }

            $perfChart = $("#perf-chart").empty();
            jsonUrlToLoad = "data/perf-results.json";

            $perfChart.kendoChart({
                theme: "Material",
                renderAs: "svg",
                dataSource: {
                    transport: {
                        read: {
                            url: "data/perf-results.json",
                            dataType: "json"
                        }
                    },
                    sort: {
                        field: "datetime",
                        dir: "asc"
                    },
                    filter: {
                        "field": "api",
                        "operator": "eq",
                        "value": api
                    }
                },
                valueAxis: {
                    min: 0,
                    title: {
                        text: "Milliseconds"
                    }
                },
                chartArea: {
                    width: $(window).width(),
                    height: $(window).height()
                },
                title: {
                    position: "top",
                    text: api
                },
                legend: {
                    position: "bottom"
                },
                seriesDefaults: {
                    type: "line",
                    style: "normal"
                },
                series: [
                    {
                        field: "duration",
                        name: "Duration"

                    },
                    {
                        field: "ping",
                        name: "Ping"
                    }
                ],
                transitions: true
            });
        },

        bindResizeEvent: function () {
            //as the dataviz-s are complex elements they need redrow after window resize
            //in order to position themselve on the right place and right size
            $(window).on("resize.perfChart", $.proxy(app.perfChart.drawPerfChart, app.perfChart));
        },

        unbindResizeEvent: function () {
            //unbind the "resize event" to prevent redudntant calculations when the tab is not active
            $(window).off("resize.perfChart");
        }
    };

})(window, jQuery);