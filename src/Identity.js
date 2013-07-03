/* 
 * Copyright (C) 2012 Bitergia
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 59 Temple Place - Suite 330, Boston, MA 02111-1307, USA.
 *
 * This file is a part of the VizGrimoireJS package
 *
 * Authors:
 *   Alvaro del Castillo San Felix <acs@bitergia.com>
 */

var Identity = {};

(function() {
    var unique_list = "unique-sortable";
    
    function sortSelList(list_divid, list, name) {
        var connect = "";
        if (list_divid === unique_list) connect = ""; 
        else connect = unique_list;
        $('#'+name).sortable({
            handle: ".handle",
            connectWith: "#"+connect,
            start: function(e, info) {
                info.item.siblings(".ui-selected").appendTo(info.item);
            },
            stop: function(e, info) {
                if (info.item.parent()[0].id === unique_list)
                    info.item.find('.handle').remove();
                    info.item.parent().append(info.item.find("li"));
                    info.item.parent().find("li")
                        .addClass("mjs-nestedSortable-leaf");
                // TODO remove from data source filtering data
            }            
        }).selectable()
        .find('li')
            .prepend( "<div class='handle'></div>" );        
    }

    Identity.showListNested = function(list_divid, ds) {
        list ='<ol id='+unique_list+' class="nested_sortable" '; 
        list += 'style="padding: 5px; background: #eee;"></ol>';
        $('#'+list_divid).append(list);
        $('#'+unique_list).nestedSortable({
            forcePlaceholderSize: true,
            handle: 'div',
            helper: 'clone',
            items: 'li',
            tolerance: 'pointer',
            toleranceElement: '> div',
            maxLevels: 2,
            isTree: true,
            expandOnHover: 700,
            startCollapsed: true
        });
        $('.disclose').on('click', function() {
            $(this).closest('li').toggleClass('mjs-nestedSortable-collapsed')
                .toggleClass('mjs-nestedSortable-expanded');
        });
    };

    function showFilter (ds, filter_data) {
        $('#'+ds.getName()+'filter').autocomplete({
            source: filter_data,
            select: function( event, ui ) {
                $("#"+ds.getName()+"filter").val('');
                $("#"+ds.getName()+"_people_"+ui.item.value).addClass('ui-selected');
                return false;
            }
        });            
    }
    
    Identity.showList = function(list_divid, ds) {
        var list ="";
        var people = ds.getPeopleData();
        var filter_data = [];            
        list ='<ol id="'+ds.getName()+'-sortable" class="sortable">';            
        for (var i=0; i<people.id.length; i++) {
            var value = people.id[i];
            if (typeof value === "string") {
                value = value.replace("@", "_at_").replace(".","_");
            }
            filter_data.push({value:value, label:people.name[i]});
            
            list += '<li id="'+ds.getName()+'_people_'+value+'" ';
            list += 'class="ui-widget-content ui-selectee">';
            list += '<div><span class="disclose"><span></span></span>';
            list += people.id[i] +' ' + people.name[i];
            list += '</div></li>';
        }
        list += '</ol>';
        
        $('#'+list_divid).append("<input id='"+ds.getName()+"filter'>");
        showFilter(ds, filter_data);
        
        $('#'+list_divid).append(list);
        sortSelList(list_divid, list, ds.getName()+"-sortable");
    };
})();