var Socialite = Socialite || {};
Socialite.UI = {};
Socialite.UI.maps = [];

Socialite.UI['buildEventForms'] = function() {
    var searchForm = Socialite.UI.buildSearchForm('event');
    var displayForm = Socialite.UI.buildDisplayForm('event');
    var createForm = Socialite.UI.buildCreateForm('event');
}

Socialite.UI['buildLocationForms'] = function() {
    var searchForm = Socialite.UI.buildSearchForm('location');
    var displayForm = Socialite.UI.buildDisplayForm('location');
    var createForm = Socialite.UI.buildCreateForm('location');
    navigator.geolocation.getCurrentPosition(Socialite.UI.centerMaps);
}

Socialite.UI['buildPersonForms'] = function() {
    var searchForm = Socialite.UI.buildSearchForm('person');
    var displayForm = Socialite.UI.buildDisplayForm('person');
    var createForm = Socialite.UI.buildCreateForm('person');
}

Socialite.UI['onClickDisplayInit'] = function(form) {
    return function(event) {
        event.preventDefault();
        var clicked = form.data('clicked');
        console.log(clicked);
        switch(clicked) {
            case 'update':
                Socialite.API.updateVertex(form);
                break;
            case 'delete':
                Socialite.API.deleteVertex(form);
                break;
        }
    }
}

Socialite.UI['onClickCreateInit'] = function(form) {
    return function(event) {
        event.preventDefault();
        Socialite.API.createVertex(form);
    }
}

Socialite.util['getYYYYMMDD'] = function(date) {
    var yyyy = date.getUTCFullYear().toString();                                    
    var mm = (date.getUTCMonth()+1).toString(); //getMonth() is zero-based         
    var dd  = date.getUTCDate().toString();             
                            
    return yyyy + '-' + (mm[1]?mm:"0"+mm[0]) + '-' + (dd[1]?dd:"0"+dd[0]);
}

Socialite.UI['buildCreateForm'] = function(vertexType) {
    var createForm = $('<form></form>');
    var formId = 'create_' + vertexType + '_form';
    createForm.attr('id', formId);
    createForm.addClass('create_form');
    
    var submit = Socialite.UI.onClickCreateInit(createForm);
    createForm.submit(submit);
    $('#create_' + vertexType + '_div').append(createForm);

    var properties = Socialite.util.typeCache[vertexType];
    var keys = Object.keys(properties);
        
    var nameIndex = keys.indexOf("name");
    if(nameIndex != -1)
        Socialite.util.arrayMove(keys, nameIndex, 0);

    var typeInput = $('<input></input>');
    typeInput.attr('type', 'hidden');
    typeInput.attr('name', 'type');
    typeInput.val(vertexType);
    createForm.append(typeInput);

    for(var idx in keys) {
        var key = keys[idx];
        var row = $('<div></div>');
        row.addClass('tr_create');
        row.addClass('input-field');

        var label = $('<label></label>');
        label.attr('for', key + '_' + vertexType + '_attribute');
        label.text(key);

        var input = key == 'notes' ? $('<textarea class="materialize-textarea"></textarea>') : $('<input></input>');
        var type = properties[key];
        input.attr('type', type);
        input.attr('name', key);
        input.attr('id', key + '_' + vertexType + '_attribute');

        var div;
        var mapDiv;
        if(type == 'geopoint') {
            label.addClass("active");
            label.css("padding-bottom", "5px");
            input.attr("type", "hidden");
            input.attr("id", vertexType + "_map_create_input");
            div = $('<div></div>');

            mapDiv = $('<div></div>');
            mapDiv.attr('id', vertexType + '_create_map');
            mapDiv.height(150);
            div.append(mapDiv);
        }

        if(type == 'date') {
            input.addClass('datepicker');
        }

        row.append(input); 
        row.append(label); 
        typeInput.before(row);
        
        if(type == 'geopoint') {
            row.append(div);
            input.data('div', div);
            Socialite.UI.addMap(mapDiv, input.attr("id"));

            var addRemoveLink = $("<a></a>");
            addRemoveLink.text("Remove Map");
            addRemoveLink.addClass("remove_link");
            addRemoveLink.click(Socialite.UI.addRemoveMapInit(addRemoveLink, input, div));
            addRemoveLink.attr('id', 'create_add_remove_link');
            row.append(addRemoveLink);
            // label.click(labelClickInit(input, div));
        }

        if(type == 'date') {
            input.pickadate({
                selectMonths: true,
                selectYears: 150,
                container: '#page_container',
                format: 'yyyy-mm-dd',
                onClose: function() {
                    $("#create_button").focus();
                },
            });
        }

    }
    
    return createForm;
}

Socialite.UI['displayVertex'] = function(vertex) {
    mixpanel.track("Display");
    var properties = vertex['properties'];
    var keys = Object.keys(properties);
    var type = properties['type'];
    var typeProperties = Socialite.util.typeCache[type];

    var idDisplay = $('#id_' + type + '_attribute');
    idDisplay.siblings().addClass('active');
    idDisplay.val(vertex['_id']);

    console.log(typeProperties);
    console.log(properties);
    if(typeProperties['geoloc'] !== undefined) {
        var input = $('#geoloc_' + type + '_attribute');
        var map = input.data('map');
        var div = input.data('div');
        if(properties['geoloc'] === undefined) {
            if(!input.hasClass('map_hidden')) {
                var val = input.val();
                input.val('');
                input.data('center', map.getCenter());
                input.data('value', val);
                div.hide();
                input.addClass('map_hidden');
                $('#display_add_remove_link').text('Add Map');
            }
        } else {
            if(input.hasClass('map_hidden')) {
                input.removeClass('map_hidden');
                var center = input.data('center');
                var value = input.data('value');
                div.show();
                google.maps.event.trigger(map, 'resize');
                map.setCenter(center);
                input.val(value);
                $('#display_add_remove_link').text('Remove Map');
            }
        } 
    }

    for(var idx in keys) {
        var key = keys[idx];
        var value = properties[key];
        var dataType = typeProperties[key];
        var element = $('#' + key + '_' + type + '_attribute');

        if(dataType == 'date') {
            value = Socialite.util.getYYYYMMDD(new Date(parseInt(value)));
            console.log('DATE', value);
            element.pickadate('picker').set('select', value, {'format': 'yyyy-mm-dd'});
        } else if(dataType == 'geopoint') {
            var split = value.split(",");
            if(split.length == 2) {
                if(split[0].indexOf("point") != -1) {
                    split[0] = split[0].replace("point[", "");
                    split[1] = split[1].replace("]", "");
                }
                var temp = parseFloat(split[0]);
                if(!isNaN(temp)) {
                    lat = temp;
                }
                
                temp = parseFloat(split[1]);
                if(!isNaN(temp)) {
                    lng = temp;
                }
            }

            value = lat + ',' + lng;
            var latLng = new google.maps.LatLng(lat, lng);
            var map = element.data('map');
            var marker = element.data('marker');
            marker.setPosition(latLng);
            map.setCenter(latLng);
        }

        element.siblings().addClass('active');
        element.val(value);
    }   
}


Socialite.UI['resetForm'] = function(id, show) {
    var selector = "#" + show + "_" + id + "_form";
    console.log(selector);
    // $("#" + show + "_" + id + "_form")[0].reset();
    $(':input', selector)
        .not(':button, :submit, :reset, :hidden')
        .val('')
        .removeAttr('checked')
        .removeAttr('selected');

    $(selector)
        .children()
        .children()
        .not(":contains('geoloc')")
        .removeClass("active");
}

Socialite.UI['itemClick'] = function(event) {
    var vertex = $(this).data('vertex');
    console.log(vertex);
    Socialite.UI.resetForm(vertex['properties']['type'], 'display');
    Socialite.UI.displayVertex(vertex);
    var elementId = vertex['properties']['type'] + "_" + vertex._id;
    Socialite.UI.highlightItems(elementId);
}

Socialite.UI['highlightItems'] = function(elementId) {
    $(".selected_item").removeClass("selected_item");
    $(".secondary_item").removeClass("secondary_item");
    $(".tertiary_item").removeClass("tertiary_item");
    $("#" + elementId).addClass("selected_item");

    var secondary = Socialite.util.connections[elementId];
    var tertiary = [];
    for(var idx in secondary) {
        var secondaryId = secondary[idx];
        $("#" + secondaryId).addClass("secondary_item");
        tertiary.push(Socialite.util.connections[secondaryId]);
    }

    if(elementId.indexOf('event') < 0) {
        for(var idx in tertiary) {
            var tertiaryNeighbors = tertiary[idx];
            for(var jdx in tertiaryNeighbors) {
                $("#" + tertiaryNeighbors[jdx]).addClass("tertiary_item");
            }
        }
    }
}

Socialite.util['addConnections'] = function(vertex) {
    var elementId = vertex['properties']['type'] + "_" + vertex._id;
    var neighbors = vertex['neighbors'];
    Socialite.util.connections[elementId] = neighbors;
}

Socialite.UI['listVertices'] = function(vertices) {
    var emptied = [];
    for(var idx in vertices) {
        console.log(vertices[idx]);
        var vertex = vertices[idx];
        Socialite.util.addConnections(vertex);
        var vertexProperties = vertex['properties'];
        var vertexType = vertexProperties['type'];
        if(emptied.indexOf(vertexType) < 0) {
            $("#" + vertexType + "_list").empty();
            emptied.push(vertexType);
        }
        var id = vertex['_id'];

        var item = $("<li></li>");
        item.attr('id', vertexType + '_' + id);
        item.attr('draggable', true);
        item.addClass('list_item');
        item.addClass('collection-item');
        // item.on('dragstart', dragStart);
        item.text(vertexProperties['name']);
        item.data('vertex', vertex);
        item.click(Socialite.UI.itemClick);

        $("#" + vertexType + "_list").append(item);
    }
}

Socialite.UI['buildDisplayForm'] = function(vertexType) {
    var displayForm = $('<form></form>');
    var formId = "display_" + vertexType + '_form';
    displayForm.attr('id', formId);
    displayForm.addClass('display_form');
    
    var submit = Socialite.UI.onClickDisplayInit(displayForm);
    displayForm.submit(submit);
    $('#display_' + vertexType + '_div').append(displayForm);

    var properties = Socialite.util.typeCache[vertexType];
    var keys = Object.keys(properties);
        
    var nameIndex = keys.indexOf("name");
    if(nameIndex != -1)
        Socialite.util.arrayMove(keys, nameIndex, 0);

    var typeInput = $('<input></input>');
    typeInput.attr('type', 'hidden');
    typeInput.attr('name', 'type');
    typeInput.val(vertexType);
    displayForm.append(typeInput);

    var idRow = $('<div></div>');
    var idLabel = $('<label></label>');
    var idDisplay = $('<input></input>');

    idLabel.text('ID ');
    idLabel.attr('for', 'id_' + vertexType + '_attribute');
    idDisplay.attr('id', 'id_' + vertexType + '_attribute');
    idDisplay.attr('disabled', true);
    idDisplay.attr('type', 'text');
    idDisplay.attr('name', 'id');

    idRow.addClass('input-field');
    idRow.append(idLabel);
    idRow.append(idDisplay);
    displayForm.append(idRow);

    for(var idx in keys) {
        var key = keys[idx];
        var row = $('<div></div>');
        row.addClass('tr_display');
        row.addClass('input-field');

        var label = $('<label></label>');
        label.attr('for', key + '_' + vertexType + '_attribute');
        label.text(key);

        var input = key == 'notes' ? $('<textarea class="materialize-textarea"></textarea>') : $('<input></input>');
        var type = properties[key];
        input.attr('type', type);
        input.attr('name', key);
        input.attr('id', key + '_' + vertexType + '_attribute');

        var div;
        var mapDiv;
        if(type == 'geopoint') {
            label.addClass("active");
            label.css("padding-bottom", "5px");
            input.attr("type", "hidden");
            input.attr("id", key + '_' + vertexType + "_attribute");
            div = $('<div></div>');

            mapDiv = $('<div></div>');
            mapDiv.attr('id', vertexType + '_display_map');
            mapDiv.height(150);
            div.append(mapDiv);
        }

        if(type == 'date') {
            input.addClass('datepicker');
        }

        row.append(input); 
        row.append(label); 
        displayForm.append(row);
        
        if(type == 'geopoint') {
            row.append(div);
            input.data('div', div);
            Socialite.UI.addMap(mapDiv, input.attr("id"));

            var addRemoveLink = $("<a></a>");
            addRemoveLink.text("Remove Map");
            addRemoveLink.addClass("remove_link");
            addRemoveLink.click(Socialite.UI.addRemoveMapInit(addRemoveLink, input, div));
            addRemoveLink.attr('id', 'display_add_remove_link');
            row.append(addRemoveLink);
            // label.click(labelClickInit(input, div));
        }
        if(type == 'date') {
            input.pickadate({
                selectMonths: true,
                selectYears: 150,
                container: '#page_container',
                format: 'yyyy-mm-dd',
                onClose: function() {
                    $("#" + vertexType + "_update_button").focus();
                },
            });
        }
    }

    var updateButton = $('<button></button>');
    updateButton.attr('type', 'submit');
    updateButton.html('Update');
    updateButton.attr('name', 'update');
    updateButton.attr("id", vertexType + '_update_button');
    updateButton.addClass("modal_right_button");
    updateButton.addClass("btn");
    updateButton.css("margin", "10px");
    updateButton.click(function() {
        displayForm.data('clicked', this.name);
        $(this).parent().siblings().submit();
    });

    var deleteButton = $('<a></a>');
    deleteButton.attr('type', 'submit');
    deleteButton.html('Delete');
    deleteButton.attr('name', 'delete');
    deleteButton.addClass("modal_left_button");
    deleteButton.addClass("btn-flat");
    deleteButton.css("margin", "10px");
    deleteButton.click(function() {
        displayForm.data('clicked', this.name);
        $(this).parent().siblings().submit();
    });

    var displayFormFooter = $('<div></div>');
    displayFormFooter.append(deleteButton);
    displayFormFooter.append(updateButton);
    displayFormFooter.addClass('display_form_footer');
    $('#display_' + vertexType + '_div').append(displayFormFooter);

    return displayForm;
}

Socialite.UI['addRemoveMapInit'] = function(addRemoveLink, input, div) {
    return function() {
        var map = input.data('map');
        if(input.hasClass('map_hidden')) {
            addRemoveLink.text("Remove Map");
            input.removeClass('map_hidden');
            var center = input.data('center');
            var value = input.data('value');
            div.show();
            google.maps.event.trigger(map, 'resize');
            map.setCenter(center);
            input.val(value);
        } else {
            addRemoveLink.text("Add Map");
            var val = input.val();
            input.val('');
            input.data('center', map.getCenter());
            input.data('value', val);
            div.hide();
            input.addClass('map_hidden');
        }
    };
}

Socialite.UI['onClickSearchInit'] = function(form) {
    return function(event) {
        event.preventDefault();
        Socialite.API.searchVertices(form);
    }
}

Socialite.UI['buildSearchForm'] = function(vertexType) {
    var searchForm = $('<form></form>');
    var formId = 'search_' + vertexType + '_form';
    searchForm.attr('id', formId);
    searchForm.addClass('search_form');
    
    var submit = Socialite.UI.onClickSearchInit(searchForm);
    searchForm.submit(submit);
    $('#search_' + vertexType + '_div').append(searchForm);

    var properties = Socialite.util.typeCache[vertexType];
    var keys = Object.keys(properties);
        
    var nameIndex = keys.indexOf("name");
    if(nameIndex != -1)
        Socialite.util.arrayMove(keys, nameIndex, 0);

    var typeInput = $('<input></input>');
    typeInput.attr('type', 'hidden');
    typeInput.attr('name', 'type');
    typeInput.val(vertexType);
    searchForm.append(typeInput);

    for(var idx in keys) {
        var key = keys[idx];
        var row = $('<div></div>');
        row.addClass('tr_search');
        row.addClass('input-field');

        var label = $('<label></label>');
        label.attr('for', key + '_' + vertexType + '_attribute');
        label.text(key);

        var input = key == 'notes' ? $('<textarea class="materialize-textarea"></textarea>') : $('<input></input>');
        var type = properties[key];
        input.attr('type', type);
        input.attr('name', key);
        input.attr('id', key + '_' + vertexType + '_attribute');

        var div;
        var mapDiv;
        var slider;
        if(type == 'geopoint') {
            label.addClass("active");
            label.css("padding-bottom", "5px");
            input.attr("type", "hidden");
            input.attr("id", vertexType + "_map_search_input");
            div = $('<div></div>');

            mapDiv = $('<div></div>');
            mapDiv.attr('id', vertexType + '_search_map');
            mapDiv.height(150);
            div.append(mapDiv);

            slider = $('<input></input>');
            slider.attr('type', 'range');
            slider.attr('min', '25');
            slider.attr('max', '25000');
            slider.attr('value', '25');
            slider.attr('id', 'search_map_slider');
            slider.val(100);

            div.append(slider);
        }

        if(type == 'date') {
            input.addClass('datepicker');
        }

        row.append(input); 
        row.append(label); 
        typeInput.before(row);
        
        if(type == 'geopoint') {
            row.append(div);
            input.data('div', div);
            Socialite.UI.addMap(mapDiv, input.attr("id"), slider);

            var addRemoveLink = $("<a></a>");
            addRemoveLink.text("Remove Map");
            addRemoveLink.addClass("remove_link");
            addRemoveLink.click(Socialite.UI.addRemoveMapInit(addRemoveLink, input, div));
            addRemoveLink.attr('id', 'search_add_remove_link');
            row.append(addRemoveLink);
            // label.click(labelClickInit(input, div));
        }

        if(type == 'date') {
            input.pickadate({
                selectMonths: true,
                selectYears: 150,
                container: '#page_container',
                format: 'yyyy-mm-dd',
                onClose: function() {
                    $("#search_button").focus();
                },
            });
        }

    }

    var connectedInput = $('<input></input>');
    connectedInput.addClass('td_display');
    connectedInput.attr('type', 'hidden');
    connectedInput.attr('name', 'connected_to');
    connectedInput.attr('id', vertexType + '_connected_search_input');
    row.append(connectedInput);


    return searchForm;
}

Socialite.UI['refreshCreateMap'] = function() {
    Socialite.UI.refreshMap('#create_location_div');
}

Socialite.UI['refreshSearchMap'] = function() {
    Socialite.UI.refreshMap('#search_location_div');
}

Socialite.UI['refreshMap'] = function(id) {
    var maxTime = 1000; 
    var time = 0;

    var interval = setInterval(function () {
      if($(id).is(':visible')) {
        for(var idx in Socialite.UI.maps) {
            var map = Socialite.UI.maps[idx];
            var center = map.getCenter();
            google.maps.event.trigger(map, 'resize');
            map.setCenter(center);
        }
        clearInterval(interval);
      } else {
        if (time > maxTime) {
          clearInterval(interval);
          return;
        }

        time += 200;
      }
    }, 200);
}

Socialite.UI['addMap'] = function(div, inputId, slider) {
    var searchMap = false;
    var input = $('#' + inputId);

    if(/_map_search_input$/.test(inputId)) {
        searchMap = true;
    }

    var lat = 34.0086;
    var lng = -118.4949;
    var value = input.val();

    if(value != "" && value != undefined) {
        var split = value.split(",");
        if(split.length == 2) {
            if(split[0].indexOf("point") != -1) {
                split[0] = split[0].replace("point[", "");
                split[1] = split[1].replace("]", "");
            }
            var temp = parseFloat(split[0]);
            if(!isNaN(temp)) {
                lat = temp;
            }
            
            temp = parseFloat(split[1]);
            if(!isNaN(temp)) {
                lng = temp;
            }
        }
    }

    var latLng = new google.maps.LatLng(lat, lng);
    var map = new google.maps.Map(div[0], {
        center: latLng,
        zoom: 11,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    });

    var marker = new google.maps.Marker({
        position: latLng,
        map: map,
        title: 'Choose a location',
        draggable: true
    });

    Socialite.UI.maps.push(map);
    input.data('map', map);
    input.data('marker', marker);

    var dragendFunction = Socialite.UI.mapFunctionInit("#" + inputId);
    google.maps.event.addListener(marker, 'dragend', dragendFunction);

    if(searchMap) {
        var radius = parseInt(slider.val());
        input.val(lat + ',' + lng + ',' + radius / 1000);
        var circle = new google.maps.Circle({
                center: latLng,
                map:map,
                radius: radius,
                strokeColor: "red",
                strokeOpacity:0.6,
                strokeWeight: 1,
                fillColor: "red"
            });
        circle.bindTo('center',marker,'position');  
        slider.on('input', Socialite.UI.sliderFunctionInit(circle, inputId, slider));
    }
}

Socialite.UI['centerMaps'] = function(position) {
    var lat = position.coords.latitude;
    var lng = position.coords.longitude;
    var latLng = new google.maps.LatLng(lat, lng);

    var map = $('#location_map_search_input').data('map');
    var marker = $('#location_map_search_input').data('marker');
    marker.setPosition(latLng);
    map.setCenter(latLng);
    google.maps.event.trigger(marker, 'dragend', {latLng: latLng});
    // google.maps.event.trigger(map, 'resize');

    var map = $('#location_map_create_input').data('map');
    var marker = $('#location_map_create_input').data('marker');
    marker.setPosition(latLng);
    map.setCenter(latLng);
    google.maps.event.trigger(marker, 'dragend', {latLng: latLng});
}

Socialite.UI['sliderFunctionInit'] = function(circle, inputId, slider) {
    return function() {
        var radius = parseInt(slider.val());
        circle.setRadius(radius);

        var val = $('#' + inputId).val();
        val = val.split(',');
        if(val.length == 2 || val.length == 3) {
            coords = [val[0], val[1], radius / 1000].join(',');
            $('#' + inputId).val(coords);
        }

    }
}

Socialite.UI['mapFunctionInit'] = function(id) {
    return function (a) {
        var coords = a.latLng.lat().toFixed(4) + ',' + a.latLng.lng().toFixed(4);
        
        if(/_map_search_input$/.test(id)) {
            var val = $(id).val();
            val = val.split(',');
            if(val.length == 3) 
                coords = [coords, val[2]].join(',');
            // move circle?
        }

        $(id).val(coords);
    }
}