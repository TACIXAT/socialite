var Socialite = Socialite || {};
Socialite.API = {};
Socialite.util = {};
Socialite.util.typeCache = {};
Socialite.util.connections = {};

$(document).ready(function() {
    Socialite.API.getVertexTypes();
    $('ul.tabs').tabs();
    
    $("#connect_button").click(function() {
        $('#connect_modal').openModal();
        Socialite.Graph.Connect.resize();
        Socialite.UI.checkConnectInterface();
    });

    $("#add_button").click(function() {
        $('#add_modal').openModal();
        $('ul.tabs').tabs();
        if($("#create_location_tab").hasClass('active'))
            Socialite.UI.refreshCreateMap();

        $("#create_submit_button").click(function() {
            var visibleType = undefined;
            if($("#create_person_tab").hasClass("active")) {
                visibleType = "person";
            } else if($("#create_event_tab").hasClass("active")) {
                visibleType = "event";
            } else if($("#create_location_tab").hasClass("active")) {
                visibleType = "location";
            } 

            if(visibleType == undefined) {
                return;
            }

            var formId = "#create_" + visibleType + "_form";
            $(formId).submit();
        });
    });

    $("#search_button").click(function() {
        $('#search_modal').openModal();
        $('ul.tabs').tabs();
        if($("#search_location_tab").hasClass('active'))
            Socialite.UI.refreshSearchMap();

        $("#search_submit_button").click(function() {
            var visibleType = undefined;
            console.log("search submit");
            if($("#search_person_tab").hasClass("active")) {
                visibleType = "person";
            } else if($("#search_event_tab").hasClass("active")) {
                visibleType = "event";
            } else if($("#search_location_tab").hasClass("active")) {
                visibleType = "location";
            } 

            if(visibleType == undefined) {
                return;
            }

            var formId = "#search_" + visibleType + "_form";
            $(formId).submit();
        });
    });

    $("#create_location_tab").click(function() {
        Socialite.UI.refreshCreateMap();
    });

    $("#search_location_tab").click(function() {
        Socialite.UI.refreshSearchMap();
    });

    Socialite.Graph.init();
    Socialite.UI.connectInterface();
});

Socialite.util['dateToUTC'] = function(date) {
    console.log(date);
    date = date.split('-');
    var day = date[2];
    var month = date[1];
    var year = date[0];
    return Date.UTC(year, month, day);
}

Socialite.API['genericError'] = function(xhr, status, error) {
    console.log(xhr);
    var error = $.parseJSON(xhr.responseText);
    if(error['status'] != 'error') {
        Materialize.toast('An error occured! Please contact us directly!', 3000);
    } else {
        Materialize.toast(error['msg'], 3000);
    }
}

Socialite.util['arrayMove'] = function(arr, fromIndex, toIndex) {
    var element = arr[fromIndex]
    arr.splice(fromIndex, 1);
    arr.splice(toIndex, 0, element);
}


Socialite.API['propertiesSuccessInit'] = function(type) {
    var callback;
    switch(type) {
        case 'person':
            callback = Socialite.UI.buildPersonForms;
            break;
        case 'event':
            callback = Socialite.UI.buildEventForms;
            break;
        case 'location':
            callback = Socialite.UI.buildLocationForms;
            break;
    }

    return function(data, status, xhr) {
        var properties = $.parseJSON(data);
        if(properties['ERROR'] !== undefined) {
            Materialize.toast(properties['ERROR'], 3000);;
        } else {
            Socialite.util.typeCache[type] = properties;
            callback();
        }
    }
}

Socialite.API['getTypeProperties'] = function(type) {
    var data = {"action": "get_type_properties", "apiKey": apiKey, "type": type};
    var propertiesSuccess = Socialite.API.propertiesSuccessInit(type);
    $.ajax({
        'type': 'POST',
        'url': 'api/proxy.php',
        'data': $.param(data),
        'success': propertiesSuccess,
        'error': Socialite.API.genericError });
};

Socialite.API['getVertexTypes'] = function() {
    Socialite.API.getTypeProperties('person');
    Socialite.API.getTypeProperties('event');
    Socialite.API.getTypeProperties('location');
}

Socialite.API['createVertex'] = function(form) {
    var type = form[0]['type'].value;
    var data = {"action":"create_vertex", "apiKey": apiKey, "type":type};
    mixpanel.track("Create (" + type + ")");

    var schema = Socialite.util.typeCache[type];
    var schemaKeys = Object.keys(schema);
    for(var idx in schemaKeys) {
        var key = schemaKeys[idx];
        var value = form[0][key].value;

        if((key == 'date' || key == 'born') && value.split(' ').length == 3) {
            value = Socialite.util.dateToUTC(value);
        }

        if(value !== '')
            data[key] = value;
    }
    
    console.log($.param(data));
    $.ajax({
        'type': 'POST',
        'url': 'api/proxy.php', 
        'data': $.param(data),
        'success': Socialite.API.createSuccess,
        'error': Socialite.API.genericError });
    
    return false; 
}

Socialite.API['searchVertices'] = function(form) {
    if(form[0]['connected_to'].value != '') {
        Socialite.API.searchNeighbors(form);
        return false;
    }

    var type = form[0]['type'].value;
    var data = {"action":"search_vertices", "apiKey": apiKey, "type":type};
    mixpanel.track("Search (" + type + ")");

    var schema = Socialite.util.typeCache[type];
    var schemaKeys = Object.keys(schema);
    for(var idx in schemaKeys) {
        var key = schemaKeys[idx];
        var value = form[0][key].value;
        
        if((key == 'date' || key == 'born') && value.split(' ').length == 3) {
            value = Socialite.util.dateToUTC(value);
        }

        if(value !== '')
            data[key] = value;
    }

    $.ajax({
        'type': 'POST',
        'url': 'api/proxy.php',
        'data': $.param(data),
        'success': Socialite.API.searchSuccess,
        'error': Socialite.API.genericError });
}

Socialite.API['searchNeighbors'] = function(form) {
    var type = form[0]['type'].value;
    var vertex = form[0]['connected_to'].value;
    var data = {"action":"search_neighbors", "apiKey": apiKey, "type":type, "vertex": vertex};
    mixpanel.track("SearchNeighbors (" + type + ")");

    var schema = typeCache[type];
    var schemaKeys = Object.keys(schema);
    for(var idx in schemaKeys) {
        var key = schemaKeys[idx];
        var value = form[0][key].value;
        
        if((key == 'date' || key == 'born') && value.split(' ').length == 3) {
            value = Socialite.util.dateToUTC(value);
        }

        if(value !== '')
            data[key] = value;
    }

    $.ajax({
        'type': 'POST',
        'url': 'api/proxy.php',
        'data': $.param(data),
        'success': Socialite.API.searchSuccess,
        'error': Socialite.API.genericError });
}

Socialite.API['searchSuccess'] = function(data, status, xhr) {
    var vertices = $.parseJSON(data);
    if(vertices.length == 1 && vertices[0]['_id'] == -1) {
        Materialize.toast(vertices[0]['properties']['error'], 3000);;
    } else {
        Socialite.UI.resetForm(vertices[0]['properties']['type'], 'search'); 
        Socialite.UI.listVertices(vertices);
    }
}

Socialite.API['createSuccess'] = function(data, status, xhr) {
    var vertex = $.parseJSON(data);
    // console.log(vertex);
    if(vertex['_id'] == -1) {
        Materialize.toast(vertex['properties']['error'], 3000);;
    } else {
        Socialite.UI.resetForm(vertex['properties']['type'], 'create'); 
        Socialite.UI.listVertices([vertex]);
    }
}

Socialite.API['updateSuccess'] = function(data, status, xhr) {
    var vertex = $.parseJSON(data);
    if(vertex['_id'] == -1) {
        Materialize.toast(vertex['properties']['error'], 3000);;
    } else {
        Socialite.UI.listVertices([vertex]);
    }
}

Socialite.API['updateVertex'] = function(form) {
    var id = form[0]['id'].value;
    var type = form[0]['type'].value;
    var data = {"action":"update_vertex", "apiKey": apiKey, "vertex": id};
    mixpanel.track("Update");

    if(type === undefined || id === undefined) {
        return false;
    }

    var schema = Socialite.util.typeCache[type];
    var schemaKeys = Object.keys(schema);
    for(var idx in schemaKeys) {
        var key = schemaKeys[idx];
        var value = form[0][key].value;
        
        if((key == 'date' || key == 'born') && value.split(' ').length == 3) {
            value = Socialite.util.dateToUTC(value);
        }

        console.log(key + ": " + value);
        data[key] = value;
    }

    $.ajax({
        'type': 'POST',
        'url': 'api/proxy.php',
        'data': $.param(data),
        'success': Socialite.API.updateSuccess,
        'error': Socialite.API.genericError });
}

Socialite.API['deleteSuccess'] = function(data, status, xhr) {
    data = $.parseJSON(data);
    if(data['status'] == 'SUCCESS') {
        var id = data['vertex'];
        var type = data['type'];
        //var item = $('#' + type + '_' + id);
        // instance.remove(type + '_' + id);
        $("#" + type + "_" + id).remove();
        Socialite.UI.resetForm(type, 'display'); 
    } else {
        Materialize.toast(data['ERROR'], 3000);;
    } 
}

Socialite.API['deleteVertex'] = function(form) {
    var id = form[0]['id'].value;
    if(id === undefined)
        return false;

    if(!confirm("Are you sure you wish to delete this node?"))
        return false;

    mixpanel.track("Delete");
    var data = {"action":"delete_vertex", "apiKey": apiKey, "vertex":id};

    $.ajax({
        'type': 'POST',
        'url': 'api/proxy.php', //'https://opendao.org:8443/IntelligenceGraph/api/utility/create_vertex/',
        'data': $.param(data),
        'success': Socialite.API.deleteSuccess,
        'error': Socialite.API.genericError });

    return false;
}

Socialite.API['getNeighbors'] = function(vertexId, direction, success) {
    var data = {"action": "get_neighbors", "apiKey": apiKey, "vertex": vertexId, "direction": direction};

    $.ajax({
        'type': 'POST',
        'url': 'api/proxy.php', //'https://opendao.org:8443/IntelligenceGraph/api/utility/create_vertex/',
        'data': $.param(data),
        'success': success,
        'error': Socialite.API.genericError });

    return false;
}

Socialite.API['neighborsDisplaySuccess'] = function(data, status, xhr) {
    mixpanel.track("Neighbors");
    var vertices = $.parseJSON(data);
    console.log(vertices);
    if(vertices.length == 1 && vertices[0]['_id'] == -1) {
        alert(vertices[0]['properties']['error']);
    } else {
        var vertex = vertices.pop();
        Socialite.UI.listVertices(vertices);
    }
}

Socialite.API['createEdge'] = function(idA, idB) {
    var data = {"action": "create_edge", "apiKey": apiKey, "vertexA": idA, "vertexB": idB};
    mixpanel.track("Create edge");
    $.ajax({
        'type': 'POST',
        'url': 'api/proxy.php',
        'data': $.param(data),
        'success': Socialite.API.createEdgeSuccess,
        'error': Socialite.API.genericError });

    return false;
}

Socialite.API['createEdgeSuccess'] = function(data, status, xhr) {
    data = $.parseJSON(data);
    console.log(data);

    if(data['status'] === "ERROR") {
        Materialize.toast(data['ERROR'], 3000);
        return;
    }

    var vertexA = data['vertexA'];
    var vertexB = data['vertexB'];
    var typeA = data['typeA'];
    var typeB = data['typeB'];
    var idLongA = typeA + "_" + vertexA;
    var idLongB = typeB + "_" + vertexB;

    $("#" + idLongA).data('vertex').neighbors.push(idLongB);
    $("#" + idLongB).data('vertex').neighbors.push(idLongA);

    Socialite.Graph.Connect.addLink(vertexA, vertexB);
    Socialite.UI.checkConnectInterface();
    Socialite.UI.highlightItems($(".selected_item").attr("id"));
}

Socialite.API['deleteEdgeSuccess'] = function(data, status, xhr) {
    data = $.parseJSON(data);
    console.log(data);

    if(data['status'] === "ERROR") {
        Materialize.toast(data['ERROR'], 3000);
        return;
    }

    var vertexA = data['vertexA'];
    var vertexB = data['vertexB'];
    var typeA = data['typeA'];
    var typeB = data['typeB'];
    var idLongA = typeA + "_" + vertexA;
    var idLongB = typeB + "_" + vertexB;

    $("#" + idLongA).data('vertex').neighbors = _.filter($("#" + idLongA).data("vertex").neighbors, function(ea) { return ea != idLongB });
    $("#" + idLongB).data('vertex').neighbors = _.filter($("#" + idLongB).data("vertex").neighbors, function(ea) { return ea != idLongA });

    Socialite.Graph.Connect.removeLink(vertexA, vertexB);
    Socialite.UI.checkConnectInterface();
    Socialite.UI.highlightItems($(".selected_item").attr("id"));
}

Socialite.API['deleteEdge'] = function(idA, idB) {
    mixpanel.track("Delete edge");
    var data = {"action": "delete_edge", "apiKey": apiKey, "vertexA": idA, "vertexB": idB};

    $.ajax({
        'type': 'POST',
        'url': 'api/proxy.php',
        'data': $.param(data),
        'success': Socialite.API.deleteEdgeSuccess,
        'error': Socialite.API.genericError });

    return false;
}