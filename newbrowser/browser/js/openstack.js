var Openstack = {};

(function() {
    var data_loaded = false;
    
    function createViz(divid, file, metric, config, show_others, evol) {
        if (evol)
            Viz.displayBasicMetricCompaniesHTML(metric, 
                    Openstack.companies.evol, divid, config);
        else
            Viz.displayBasicMetricSubReportStatic(metric, 
                    Openstack.companies.global, divid, config, 
                    null, null, show_others);    
    }
    
    function displayCompaniesSummary(divid, file, metric, config, show_others, evol) {
        if (data_loaded === true) {
            createViz(divid, file, metric, config, show_others, evol);
        }
        var json_file = "data/json/"+file;
        var marks = ['unixtime','week','id','date'];
        $.getJSON(json_file, null, function(data) {
            $.each(data, function(field, values) {
                if ($.inArray(field, marks) == -1) {
                    Openstack.addCompanyEvol(field, metric, values);   
                } 
                else {
                    Openstack.addDatesField(field, values);
                }
            });
            Openstack.addDatesCompanies();
            Openstack.buildCompaniesGlobal(metric);
            createViz(divid, file, metric, config, show_others, evol);
            data_loaded = true;
        });
    }
    
    function convertCompaniesSummary() {
        var div_summary = "CompaniesSummary";
        divs = $("."+div_summary);
        if (divs.length > 0) {
            $.each(divs, function(id, div) {                
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
                displayCompaniesSummary(div.id, file, metric, config, show_others, evol);
            });
        }
    }
    
    // Sum evolution date to compute total (global) data
    Openstack.buildCompaniesGlobal = function(metric) {
        $.each(Openstack.companies.evol, function(company, values) {
            var total = 0;
            for (var i=0; i<values[metric].length; i++) {
                total += values[metric][i];
            }
            Openstack.companies.global[company] = {};
            Openstack.companies.global[company][metric] = total;
        });    
    };
    
    Openstack.addDatesField = function(field, values) {
        Openstack.dates[field] = values;   
    };
    
    Openstack.addCompanyEvol = function(name, field, values) {
        Openstack.companies.evol[name] = {};
        Openstack.companies.evol[name][field] = values;
    };
    
    Openstack.addDatesCompanies = function() {
        $.each(Openstack.companies.evol, function(company, values) {
            $.each(Openstack.dates, function(mark, stamps) {
                Openstack.companies.evol[company][mark] = stamps;
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
