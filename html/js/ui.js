/* WHAT'S NEXT?
**  - reminders
**  - email confirmation
**  - error reporting
**  - payments
**  - TOS / PP
**  - register company (clerky)
**  - more fields
**  - date range search
**  - layout / design
**  - instant search (names)
**  - clear list
**
** FINISHED !!!
**  - new domain / hosting
**  - waiting list sign up
**  - getVertex with neighbors
**  - image buttons
**  - fix dates
**  - vertex search
**  - notes 
**  - analytics (mixpanel?)
**  - connect button 
**  - lock button
**  - remove button
**  - remove edge
*/

$(document).ready(function() {

    // jsPlumb initilization 
    jsPlumb.ready(function() {
        instance = jsPlumb.getInstance();

        // link two vertices
        addLink = function(vertexA, vertexB) {
            // build ids (this should be a function)
            var idA = vertexA['properties']['type'] + '_' + vertexA['_id'];
            var idB = vertexB['properties']['type'] + '_' + vertexB['_id'];
            
            // if connection exists, return
            if(checkConnection(idA, idB))
                return;

            // get elements
            var a = $('#' + idA);
            var b = $('#' + idB);
            if(a[0] === undefined || b[0] === undefined)
                return;

            // revalidate in case it moved
            instance.revalidate(idA);
            instance.revalidate(idB);

            // source and target + how things will look
            var struct = { source:a, target:b,
                connector: [ "Bezier", { curviness:30 } ],
                paintStyle: { lineWidth: 1, strokeStyle:'black' },
                endpoints: ['Blank', 'Blank'],
                anchors:["Right", "Left"],
                detachable: true };

            // create connection
            var connection = instance.connect(struct, instance);
            redrawEverything();
        };

        // TODO: replace with jsPlumb empty()
        emptyParent = function(parentId) {
            var children = $('#' + parentId).children();
            $(children).each(function() {
                if(!$(this).find('input:checkbox').is(':checked'))
                    instance.remove($(this).attr('id'));
            });
        };

        // make sure the jsPlumb lines keep up with window size changes
        $(window).resize(function() {
            instance.repaintEverything();
        });
    });
    
    $('#person_list').parent().scroll(scrollFunction);

    $('#event_list').parent().scroll(scrollFunction);

    $("#location_list").parent().scroll(scrollFunction);

});

function onMovedFunction(listId) {
    var children = $('#' + listId).children();
    // console.log(children);
    $(children).each(function() {
        var id = $(this).attr('id');
        var connections = getConnections(id);

        if(connections.length > 0) {
            instance.repaint(id, $(this).offset());
            // instance.revalidate(id);
        }

        $(connections).each(function() {
            var sourceId = this.sourceId;
            var targetId = this.targetId;

            if(!isVisible($('#' + sourceId)) || !isVisible($('#' + targetId))) {
                this.setPaintStyle({lineWidth:0, strokeStyle:"white"});
                this.addClass('hidden_connector');
            } else {
                this.setPaintStyle({lineWidth:1, strokeStyle:"black"});
                this.removeClass('hidden_connector');
            }
        });
    });
}

function scrollFunction() {
    var child = $(this).children();
    var children = $(child[0]).children();
    // console.log(children);
    $(children).each(function() {
        var id = $(this).attr('id');
        var connections = getConnections(id);

        if(connections.length > 0) {
            instance.repaint(id, $(this).offset());
            // instance.revalidate(id);
        }

        $(connections).each(function() {
            var sourceId = this.sourceId;
            var targetId = this.targetId;

            if(!isVisible($('#' + sourceId)) || !isVisible($('#' + targetId))) {
                this.setPaintStyle({lineWidth:0, strokeStyle:"white"});
                this.addClass('hidden_connector');
            } else {
                this.setPaintStyle({lineWidth:1, strokeStyle:"black"});
                this.removeClass('hidden_connector');
            }
        });
    });
}  

function isVisible(item) {
    var div = item.parent().parent();
    var itemHeight = item.height();
    var itemQuarterHeight = itemHeight / 4;
    var itemMid = item.position().top + itemHeight / 2;

    var divHeight = div.height();
    var divTop = div.position().top;
    var divBottom = divTop + divHeight;

    if(itemMid - itemQuarterHeight < divTop) 
        return false;
    else if(itemMid + itemQuarterHeight > divBottom)
        return false;
    else
        return true;
}

// connections = {};
selected = [];
maps = [];

function linkNeighbors(vertex) {
    var neighbors = vertex['neighbors'];
    var order = ['person', 'event', 'location'];
    for(var idx in neighbors) {
        neighborId = neighbors[idx];
        var neighborElement = $('#' + neighborId);
        if(neighborElement.length == 0)
            continue;

        var neighborVertex = neighborElement.data('vertex');
        var args = [];
        if(order.indexOf(vertex['properties']['type']) < order.indexOf(neighborVertex['properties']['type'])) {
            args.push(vertex);
            args.push(neighborVertex);
        } else {
            args.push(neighborVertex);
            args.push(vertex);
        }

        addLink.apply(window, args);
        // p e
        // e l
    }
    // getNeighbors(vertexId, "in", neighborsInSuccess);
    // getNeighbors(vertexId, "out", neighborsOutSuccess);
}

function buildEventForms() {
    var searchForm = buildSearchForm('event');
    var displayForm = buildDisplayForm('event');
    var createForm = buildCreateForm('event');
}

function buildLocationForms() {
    var searchForm = buildSearchForm('location');
    var displayForm = buildDisplayForm('location');
    var createForm = buildCreateForm('location');
    navigator.geolocation.getCurrentPosition(centerMaps);
}

function buildPersonForms() {
    var searchForm = buildSearchForm('person');
    var displayForm = buildDisplayForm('person');
    var createForm = buildCreateForm('person');
}

function onClickSearchInit(form) {
    return function(event) {
        event.preventDefault();
        searchVertices(form);
    }
}

function buildSearchForm(vertexType) {
    var searchForm = $('<form></form>');
    var formId = vertexType + '_search_form';
    searchForm.attr('id', formId);
    searchForm.addClass('table_display');

    var submit = onClickSearchInit(searchForm);
    searchForm.submit(submit);
    $('#' + vertexType + '_search_div').append(searchForm);

    var properties = typeCache[vertexType];
    var keys = Object.keys(properties);
        
    var nameIndex = keys.indexOf("name");
    if(nameIndex != -1)
        arraymove(keys, nameIndex, 0);

    var submitButton = $('<button></button>');
    submitButton.attr('type', 'submit');
    submitButton.addClass('td_display');
    submitButton.html('SUBMIT');

    var buttonRow = $('<div></div>');
    buttonRow.addClass('tr_display');
    buttonRow.append(submitButton);
    searchForm.append(buttonRow);

    var typeInput = $('<input></input>');
    typeInput.attr('type', 'hidden');
    typeInput.attr('name', 'type');
    typeInput.val(vertexType);
    searchForm.append(typeInput);


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
        var slider;
        if(type == 'geopoint') {
            input.attr("type", "hidden");
            input.attr("id", vertexType + "_map_search_input");
            div = $('<div></div>');
            div.addClass('td_display');

            mapDiv = $('<div></div>');
            mapDiv.attr('id', 'search_map');
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

        row.append(label); 
        row.append(input); 
        buttonRow.before(row);
        
        if(type == 'geopoint') {
            row.append(div);
            input.data('div', div);
            addMap(mapDiv, input.attr("id"), slider);

            label.click(labelClickInit(input, div));
        }
    }

    var row = $('<div></div>');
    row.addClass('tr_display');

    var label = $('<label></label>');
    label.addClass('td_display');
    label.text('connected to');

    var input = $('<input></input>');
    input.addClass('td_display');
    input.attr('type', 'number');
    input.attr('name', 'connected_to');
    input.attr('id', vertexType + '_connected_search_input');

    row.append(label);
    row.append(input);
    buttonRow.before(row);

    return searchForm;
}

function addMap(div, inputId, slider) {
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

    maps.push(map);
    input.data('map', map);
    input.data('marker', marker);

    var dragendFunction = mapFunctionInit("#" + inputId);
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
        slider.on('input', sliderFunctionInit(circle, inputId, slider));
    }
}

function sliderFunctionInit(circle, inputId, slider) {
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

function mapFunctionInit(id) {
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

function itemDoubleClick(event) {
    var vertex = $(event.target).data('vertex');
    getNeighbors(vertex['_id'], 'in', neighborsDisplaySuccess);
    getNeighbors(vertex['_id'], 'out', neighborsDisplaySuccess);
}

function itemClick(event) {
    if(event.shiftKey) {
        handleSelect($(this));
    } else {
        var vertex = $(this).data('vertex');
        console.log(vertex);
        toggleForm(vertex['properties']['type'], 'display');
        resetForm(vertex['properties']['type'], 'display');
        displayVertex(vertex);
    }
    
}

function handleSelect(item) {
    if(!item.hasClass('list_selected')) {
        if(selected.length == 2) {
            return;        
        } else if (selected.length == 1) {
            item.addClass('list_selected');  
            selected.push(item);

            var elementA = $(selected[0]);
            var elementB = $(selected[1]);
            var vertexA = elementA.data('vertex');
            var vertexB = elementB.data('vertex');
            var idA = vertexA['_id'];
            var idB = vertexB['_id'];

            if(checkConnection(elementA.attr('id'), elementB.attr('id')))
                deleteEdge(idA, idB);
            else
                createEdge(idA, idB);
        } else {
            item.addClass('list_selected');  
            selected = [];
            selected.push(item);
        }
    } else {
        item.removeClass('list_selected');    
        selected = [];
    }
}

function handleReminder(item) {
    console.log(item);
}

function listVertices(vertices) {
    if(vertices.length == 0) {
        // alert('No vertices found!');
        return; 
    }

    var vertexType = vertices[0]['properties']['type'];
    var list = $("#" + vertexType + '_list');

    // var children = list.children();
    // $(children).each(function() {
    //     var childId = $(this).attr('id');
    //     unlink(childId);
    // });

    emptyParent(list.attr('id'));
    // list.empty();

    for(var idx in vertices) {
        var vertex = vertices[idx];
        var properties = vertex['properties'];
        
        var id = vertex['_id'];
        var type = properties['type'];
        var checked = false;
        if($("#" + type + "_" + id).length != 0) {
            instance.remove(type + "_" + id);
            checked = true;
        }
        
        var item = $('<li></li>');
        item.attr('id', type + '_' + id);
        item.attr('draggable', true);
        item.on('dragstart', dragStart);
        item.addClass('list_element');
        item.text(id + ':' + properties['name']);
        item.data('vertex', vertex);
        item.click(itemClick);
        item.dblclick(itemDoubleClick);
        item.mouseover(listMouseover);
        item.mouseout(listMouseout);

        var removeButton = $('<button></button>');
        removeButton.html('X');
        removeButton.addClass('control_left');
        removeButton.click(function() {
            var item = $(this).parent();
            // var parent = item.parent();
            instance.remove(item.attr('id'));
            // var children = parent.children();

            redrawEverything();
            $('.list_mouseover').each(function() { $(this).removeClass('list_mouseover'); });
            // instance.repaintEverything();
        });

        var lockCheckbox = $('<input></input>');
        lockCheckbox.attr('type', 'checkbox');
        lockCheckbox.addClass('control_right');
        lockCheckbox.prop('checked', checked);

        var selectButton = $('<button></button>');
        selectButton.html('S');
        selectButton.addClass('control_right');
        selectButton.click(function() {
            handleSelect($(this).parent());
        });

        item.append(removeButton);
        item.append(lockCheckbox);
        item.append(selectButton);

        if(type == 'event') {
            var reminderButton = $('<button></button>');
            reminderButton.html('R');
            reminderButton.addClass('control_right');
            reminderButton.click(function() {
                handleReminder($(this).parent());
            });
            item.append(reminderButton);
        }

        list.append(item);
    }

    for(var idx in vertices) {
        var vertex = vertices[idx];
        var id = vertex['_id'];
        linkNeighbors(vertex);
    }

    // jsPlumb.repaintEverything();
}

function redrawEverything() {
    var lists = ['person_list', 'event_list', 'location_list'];
    for(var idx in lists) {
        var target = lists[idx];
        onMovedFunction(target);
    }
}

function listMouseover() {
    var vertex = $(this).data('vertex');
    $(this).addClass('list_mouseover');
    var connections = getConnectionsFromVertex(vertex);
    for(var idx in connections) {
        var connection = connections[idx];
        $('#' + connection).addClass('list_mouseover');
    }
}

function listMouseout() {
    var vertex = $(this).data('vertex');
    $(this).removeClass('list_mouseover');
    var connections = getConnectionsFromVertex(vertex);
    for(var idx in connections) {
        var connection = connections[idx];
        $('#' + connection).removeClass('list_mouseover');
    }
}

function togglePersonForm(show) {
    toggleForm('person', show);
}

function toggleEventForm(show) {
    toggleForm('event', show);
}

function toggleLocationForm(show) {
    toggleForm('location', show);
}

function toggleForm(id, show) {
    switch(show) {
        case 'search':
            $("#" + id + "_display_div").hide();
            $("#" + id + "_create_div").hide();
            $("#" + id + "_search_div").show();
            break;
        case 'display':
            $("#" + id + "_create_div").hide();
            $("#" + id + "_search_div").hide();
            $("#" + id + "_display_div").show();
            break;
        case 'create':
            $("#" + id + "_display_div").hide();
            $("#" + id + "_search_div").hide();
            $("#" + id + "_create_div").show();
            break;
    } 

    if(id === 'location') {
        for(var idx in maps) {
            var map = maps[idx];
            var center = map.getCenter();
            google.maps.event.trigger(map, 'resize');
            map.setCenter(center);
        }
    }
}

function getVisibleFormType(type) {
    var idBase = ['display', 'create', 'search'];
    for(var idx in idBase) {
        var id = '#' + type + '_' + idBase[idx] + '_div';
        if($(id).is(':visible')) {
            return idBase[idx];
        }
    }
}

function resetForm(id, show) {
    console.log("#" + id + "_" + show + "_form");
    $("#" + id + "_" + show + "_form")[0].reset();
}

function onClickDisplayInit(form) {
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

// TODO: when sending date value to the server convert YYYY-MM-DD to timestamp
function getYYYYMMDD(date) {
    var yyyy = date.getUTCFullYear().toString();                                    
    var mm = (date.getUTCMonth()+1).toString(); //getMonth() is zero-based         
    var dd  = date.getUTCDate().toString();             
                            
    return yyyy + '-' + (mm[1]?mm:"0"+mm[0]) + '-' + (dd[1]?dd:"0"+dd[0]);
}

function displayVertex(vertex) {
    mixpanel.track("Display");
    var properties = vertex['properties'];
    var keys = Object.keys(properties);
    var type = properties['type'];
    var typeProperties = typeCache[type];

    var idDisplay = $('#id_' + type + '_attribute');
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
            }
        } 
    }

    for(var idx in keys) {
        var key = keys[idx];
        var value = properties[key];
        var dataType = typeProperties[key];
        var element = $('#' + key + '_' + type + '_attribute');

        if(dataType == 'date') {
            value = getYYYYMMDD(new Date(parseInt(value)));
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

        element.val(value);
    }   
}

function buildDisplayForm(vertexType) {
    var displayForm = $('<form></form>');
    var formId = vertexType + '_display_form';
    displayForm.attr('id', formId);
    displayForm.addClass('table_display');
    
    var submit = onClickDisplayInit(displayForm);
    displayForm.submit(submit);
    $('#' + vertexType + '_display_div').append(displayForm);

    var properties = typeCache[vertexType];
    var keys = Object.keys(properties);
        
    var nameIndex = keys.indexOf("name");
    if(nameIndex != -1)
        arraymove(keys, nameIndex, 0);

    var updateButton = $('<button></button>');
    updateButton.attr('type', 'submit');
    updateButton.addClass('td_display');
    updateButton.html('UPDATE');
    updateButton.attr('name', 'update');
    updateButton.click(function() {
        displayForm.data('clicked', this.name);
    });

    var deleteButton = $('<button></button>');
    deleteButton.attr('type', 'submit');
    deleteButton.addClass('td_display');
    deleteButton.html('DELETE');
    deleteButton.attr('name', 'delete');
    deleteButton.click(function() {
        displayForm.data('clicked', this.name);
    });

    var buttonRow = $('<div></div>');
    buttonRow.addClass('tr_display');
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

    idLabel.text('id');
    idRow.addClass('tr_display');
    idLabel.addClass('td_display');
    idDisplay.addClass('td_display');
    idDisplay.attr('id', 'id_' + vertexType + '_attribute');
    idDisplay.attr('readonly', true);
    idDisplay.attr('name', 'id');

    idRow.append(idLabel);
    idRow.append(idDisplay);
    buttonRow.before(idRow);

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
        input.attr('id', key + '_' + vertexType + '_attribute');

        var div;
        var mapDiv;
        if(type == 'geopoint') {
            input.attr("type", "hidden");
            input.attr("id", key + '_' + vertexType + "_attribute");
            div = $('<div></div>');
            div.addClass('td_display');

            mapDiv = $('<div></div>');
            mapDiv.attr('id', vertexType + '_display_map');
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

    return displayForm;
}

/******** 
    TODO:
        remove input data when updated, when vertices change
********/

function onClickCreateInit(form) {
    return function(event) {
        event.preventDefault();
        createVertex(form);
    }
}

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
}

function labelClickInit(input, div) {
    return function() {
        var map = input.data('map');
        if(input.hasClass('map_hidden')) {
            input.removeClass('map_hidden');
            var center = input.data('center');
            var value = input.data('value');
            div.show();
            google.maps.event.trigger(map, 'resize');
            map.setCenter(center);
            input.val(value);
        } else {
            var val = input.val();
            input.val('');
            input.data('center', map.getCenter());
            input.data('value', val);
            div.hide();
            input.addClass('map_hidden');
        }
    };
}

function centerMaps(position) {
    var lat = position.coords.latitude;
    var lng = position.coords.longitude;
    var latLng = new google.maps.LatLng(lat, lng);

    var map = $('#location_map_search_input').data('map');
    var marker = $('#location_map_search_input').data('marker');
    marker.setPosition(latLng);
    map.setCenter(latLng);
    google.maps.event.trigger(marker, 'dragend', {latLng: latLng});
    // google.maps.event.trigger(map, 'resize');

    map = $('#location_map_create_input').data('map');
    marker = $('#location_map_create_input').data('marker');
    marker.setPosition(latLng);
    map.setCenter(latLng);
    google.maps.event.trigger(marker, 'dragend', {latLng: latLng});
}

function dragStart(ev) {
    console.log(ev);
    console.log(ev.target.id);
    ev.originalEvent.dataTransfer.setData("targetId", ev.target.id);
}

function allowDrop(ev) {
    ev.preventDefault();
}

function eventDrop(ev) {
    ev.preventDefault();

    var targetId = ev.dataTransfer.getData("targetId");
    var visibleFormType = getVisibleFormType('event');
    var vertex = $('#' + targetId).data('vertex');
    var vertexType = vertex['properties']['type'];

    if(vertexType == 'event') {
        if(visibleFormType != 'display')
            toggleForm(vertexType, 'display');
        resetForm(vertexType, 'display');
        displayVertex(vertex);
    } else {
        if(visibleFormType != 'search')
            toggleForm('event', 'search');
        $('#event_connected_search_input').val(vertex['_id']);
    }
}

function personDrop(ev) {
    ev.preventDefault();

    var targetId = ev.dataTransfer.getData("targetId");
    var visibleFormType = getVisibleFormType('person');
    var vertex = $('#' + targetId).data('vertex');
    var vertexType = vertex['properties']['type'];

    if(vertexType == 'person') {
        if(visibleFormType != 'display')
            toggleForm(vertexType, 'display');
        resetForm(vertexType, 'display');
        displayVertex(vertex);
    } else {
        if(visibleFormType != 'search')
            toggleForm('person', 'search');
        $('#person_connected_search_input').val(vertex['_id']);
    }
}

function locationDrop(ev) {
    ev.preventDefault();

    var targetId = ev.dataTransfer.getData("targetId");
    var visibleFormType = getVisibleFormType('location');
    var vertex = $('#' + targetId).data('vertex');
    var vertexType = vertex['properties']['type'];

    if(vertexType == 'location') {
        if(visibleFormType != 'display')
            toggleForm(vertexType, 'display');
        resetForm(vertexType, 'display');
        displayVertex(vertex);
    } else {
        if(visibleFormType != 'search')
            toggleForm('location', 'search');
        $('#location_connected_search_input').val(vertex['_id']);
    }
}
