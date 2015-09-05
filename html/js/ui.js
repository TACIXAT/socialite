var Socialite = Socialite || {};
Socialite.UI = {};
Socialite.UI.maps = [];

Socialite.UI['buildEventForms'] = function() {
    // var searchForm = buildSearchForm('event');
    var displayForm = Socialite.UI.buildDisplayForm('event');
    var createForm = Socialite.UI.buildCreateForm('event');
}

Socialite.UI['buildLocationForms'] = function() {
    // var searchForm = buildSearchForm('location');
    var displayForm = Socialite.UI.buildDisplayForm('location');
    var createForm = Socialite.UI.buildCreateForm('location');
    navigator.geolocation.getCurrentPosition(Socialite.UI.centerMaps);
}

Socialite.UI['buildPersonForms'] = function() {
    // var searchForm = buildSearchForm('person');
    var displayForm = Socialite.UI.buildDisplayForm('person');
    var createForm = Socialite.UI.buildCreateForm('person');
}

Socialite.UI['onClickDisplayInit'] = function(form) {
    return function(event) {
        event.preventDefault();
        var clicked = form.data('clicked');
        switch(clicked) {
            case 'update':
                updateVertex(form);
                break;
            case 'delete':
                deleteVertex(form);
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

Socialite.UI['buildCreateForm'] = function(vertexType) {
    var createForm = $('<form></form>');
    var formId = vertexType + '_create_form';
    createForm.attr('id', formId);
    createForm.addClass('create_form');
    
    var submit = Socialite.UI.onClickCreateInit(createForm);
    createForm.submit(submit);
    $('#' + vertexType + '_create_div').append(createForm);

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
            input.pickadate({
                selectMonths: true,
                selectYears: 150,
                onClose: function() {
                    $("#create_button").focus();
                },
            });
        }

        row.append(input); 
        row.append(label); 
        typeInput.before(row);
        
        if(type == 'geopoint') {
            row.append(div);
            input.data('div', div);
            Socialite.UI.addMap(mapDiv, input.attr("id"));

            // label.click(labelClickInit(input, div));
        }
    }
    
    return createForm;
}

/*
function buildCreateForm(vertexType) {
    var createForm = $('<form></form>');
    var formId = vertexType + '_create_form';
    createForm.attr('id', formId);
    createForm.addClass('table_display');

    var submit = onClickCreateInit(createForm);
    createForm.submit(submit);
    $('#' + vertexType + '_create_div').append(createForm);

    var properties = typeCache[vertexType];
    var keys = Object.keys(properties);
        
    var nameIndex = keys.indexOf("name");
    if(nameIndex != -1)
        arraymove(keys, nameIndex, 0);

    var submitButton = $('<button></button>');
    submitButton.attr('type', 'submit');
    submitButton.addClass('td_display');
    submitButton.html('CREATE');

    var buttonRow = $('<div></div>');
    buttonRow.addClass('tr_display');
    buttonRow.append(submitButton);
    createForm.append(buttonRow);

    var typeInput = $('<input></input>');
    typeInput.attr('type', 'hidden');
    typeInput.attr('name', 'type');
    typeInput.val(vertexType);
    createForm.append(typeInput);


    for(var idx in keys) {
        var key = keys[idx];
        var row = $('<div></div>');
        row.addClass('tr_display');

        var label = $('<label></label>');
        label.addClass('td_display');
        label.text(key);

        var input = key == 'notes' ? $('<textarea rows=5></textarea>') : $('<input></input>');
        input.addClass('td_display');
        var type = properties[key];
        input.attr('type', type);
        input.attr('name', key);

        var div;
        var mapDiv;
        if(type == 'geopoint') {
            input.attr("type", "hidden");
            input.attr("id", vertexType + "_map_create_input");
            div = $('<div></div>');
            div.addClass('td_display');

            mapDiv = $('<div></div>');
            mapDiv.attr('id', 'create_map');
            mapDiv.height(150);
            div.append(mapDiv);
        }

        row.append(label); 
        row.append(input); 
        buttonRow.before(row);
        
        if(type == 'geopoint') {
            row.append(div);
            input.data('div', div);
            addMap(mapDiv, input.attr("id"));

            label.click(labelClickInit(input, div));
        }
    }

    return createForm;
} */

Socialite.UI['buildDisplayForm'] = function(vertexType) {
    var displayForm = $('<form></form>');
    var formId = vertexType + '_display_form';
    displayForm.attr('id', formId);
    displayForm.addClass('display_form');
    
    var submit = Socialite.UI.onClickDisplayInit(displayForm);
    displayForm.submit(submit);
    $('#' + vertexType + '_display_div').append(displayForm);

    var properties = Socialite.util.typeCache[vertexType];
    var keys = Object.keys(properties);
        
    var nameIndex = keys.indexOf("name");
    if(nameIndex != -1)
        Socialite.util.arrayMove(keys, nameIndex, 0);

    var updateButton = $('<button></button>');
    updateButton.attr('type', 'submit');
    updateButton.html('UPDATE');
    updateButton.attr('name', 'update');
    updateButton.attr("id", vertexType + '_update_button');
    updateButton.click(function() {
        displayForm.data('clicked', this.name);
    });

    var deleteButton = $('<button></button>');
    deleteButton.attr('type', 'submit');
    deleteButton.html('DELETE');
    deleteButton.attr('name', 'delete');
    deleteButton.click(function() {
        displayForm.data('clicked', this.name);
    });

    var buttonRow = $('<div></div>');
    buttonRow.append(updateButton);
    buttonRow.append(deleteButton);
    displayForm.append(buttonRow);

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
    buttonRow.before(idRow);

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
            .pickadate({
                selectMonths: true,
                selectYears: 150,
                onClose: function() {
                    $("#" + vertexType + "_update_button").focus();
                },
            });
        }

        row.append(input); 
        row.append(label); 
        buttonRow.before(row);
        
        if(type == 'geopoint') {
            row.append(div);
            input.data('div', div);
            Socialite.UI.addMap(mapDiv, input.attr("id"));

            // label.click(labelClickInit(input, div));
        }
    }
    
    // $(".datepicker").pickadate({
    //     selectMonths: true,
    //     selectYears: 150,
    //     onClose: function() {
    //         $("#" + vertexType + "_update_button").focus();
    //     },
    // });

    return displayForm;
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

    // var map = $('#location_map_search_input').data('map');
    // var marker = $('#location_map_search_input').data('marker');
    // marker.setPosition(latLng);
    // map.setCenter(latLng);
    // google.maps.event.trigger(marker, 'dragend', {latLng: latLng});
    // // google.maps.event.trigger(map, 'resize');

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