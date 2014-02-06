var Openstack = {};

(function() {
    var data_loaded = false;
    
    function createViz(divid, ds, file, metric, config, show_others, evol) {
        if (evol)
            Viz.displayMetricCompanies(metric, Openstack.companies.evol[ds], divid, config, null, null);
        else
            Viz.displayMetricSubReportStatic(metric, Openstack.companies.global[ds], divid, config);    

//        var div_companies_links = "companies_links";
//        if ($("#"+div_companies_links).length > 0) {
//            var limit = $("#"+div_companies_links).data('limit');
//            var order_by = $("#"+div_companies_links).data('order-by');
//            var DS = null;
//            // scm support only
//            $.each(data_sources, function(i, ds) {
//                if (ds.getName() === "scm") {DS = ds; return false;}
//            });
//            DS.displayCompaniesLinks(div_companies_links, limit, order_by);
//        }
    }
    
    function displayCompaniesSummary(divid, ds, file, metric, config, show_others, evol) {
        config.show_title = false;
        if (data_loaded === true && false) {
            createViz(divid, file, metric, config, show_others, evol);
        }
        var data_dir = Report.getDataDir();
        // var json_file = "data/json/"+file;
        var json_file = data_dir +"/"+file;
        var marks = ['unixtime','week','id','date'];
        $.getJSON(json_file, null, function(data) {
            $.each(data, function(field, values) {
                if ($.inArray(field, marks) == -1) {
                    Openstack.addCompanyEvol(ds, field, metric, values);   
                } 
                else {
                    Openstack.addDatesField(ds, field, values);
                }
            });
            Openstack.addDatesCompanies(ds);
            Openstack.buildCompaniesGlobal(ds, metric);
            createViz(divid, ds, file, metric, config, show_others, evol);
            data_loaded = true;
        });
    }
    
    function convertCompaniesSummary() {
        var div_summary = "CompaniesSummary";
        divs = $("."+div_summary);
        if (divs.length > 0) {
            $.each(divs, function(id, div) {
                ds = $(this).data('data-source');
                if (ds === null) return;
                var evol = $(this).data('evol');
                var metric = $(this).data('metric');
                var config = {};
                div.id = div_summary + "-" + metric + "-" + evol;
                file = $(this).data('file');
                var stacked = false;
                if ($(this).data('graph')) stacked = true;
                if ($(this).data('stacked')) stacked = true;
                config.lines = {stacked : stacked};
                config.graph = $(this).data('graph');
                var show_others = $(this).data('show-others');
                config.show_legend = $(this).data('legend');
                if ($('#'+$(this).data('legend-div')).length>0) {
                    config.legend = {
                    container: $(this).data('legend-div')};
                } else config.legend = {container: null};
                displayCompaniesSummary(div.id, ds, file, metric, config, show_others, evol);
            });
        }
    }
    
    // Sum evolution date to compute total (global) data
    Openstack.buildCompaniesGlobal = function(ds, metric) {
        $.each(Openstack.companies.evol[ds], function(company, values) {
            var total = 0;
            for (var i=0; i<values[metric].length; i++) {
                total += values[metric][i];
            }
            if (!Openstack.companies.global[ds])
                Openstack.companies.global[ds] = {};
            Openstack.companies.global[ds][company] = {};
            Openstack.companies.global[ds][company][metric] = total;
        });    
    };
    
    Openstack.addDatesField = function(ds, field, values) {
        if (!Openstack.dates[ds])
            Openstack.dates[ds] = {};
        Openstack.dates[ds][field] = values;   
    };
    
    Openstack.addCompanyEvol = function(ds, name, field, values) {
        if (!Openstack.companies.evol[ds])
            Openstack.companies.evol[ds] = {};
        Openstack.companies.evol[ds][name] = {};
        Openstack.companies.evol[ds][name][field] = values;
    };
    
    Openstack.addDatesCompanies = function(ds) {
        $.each(Openstack.companies.evol[ds], function(company, values) {
            $.each(Openstack.dates[ds], function(mark, stamps) {
                Openstack.companies.evol[ds][company][mark] = stamps;
            });
        });
    };

    Openstack.build = function() {
        Openstack.companies = {global:{},evol:{}};
        Openstack.dates = {};
        convertCompaniesSummary();
    };
})();

Loader.data_ready_global(function() {
    Openstack.build();
});
