var Socialite = Socialite || {};
Socialite.API = {};
Socialite.util = {};
Socialite.util.typeCache = {};
Socialite.util.connections = {};

$(document).ready(function() {
    Socialite.API.getVertexTypes();
    $('ul.tabs').tabs();
    $(".button-collapse").sideNav();
    
    $("#connect_button").on('click.open', function() {
        $('#connect_modal').openModal();
        Socialite.Graph.Connect.resize();
        Socialite.UI.checkConnectInterface();
    });

    // if this is changed update tour.js
    // use a namespace (open) so we can remove this specific fn
    $("#add_button").on('click.open', function() {
        $('#add_modal').openModal();
        $('ul.tabs').tabs();
        if($("#create_location_tab").hasClass('active'))
            Socialite.UI.refreshCreateMap();

        $("#create_submit_button").on('click.submit', function() {
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

    $("#tutorial_btn").off('click.tour');
    $("#tutorial_btn").on('click.tour', function() {
        Socialite.Tour.nextStep();
        $("#help_li > ul > li > div").slideToggle(200, function() {
            $("#help_li > ul > li").removeClass("active");
            $("#help_li > ul > li > a").removeClass("active");
        });
    });

    $("#search_button").click(function() {
        $('#search_modal').openModal();
        $('ul.tabs').tabs();
        if($("#search_location_tab").hasClass('active'))
            Socialite.UI.refreshSearchMap();

        $("#search_submit_button").click(function() {
            var visibleType = undefined;
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

    $("#create_clear_button").click(function() {
        Socialite.UI.resetActiveTab('create'); 
    });

    $("#search_clear_button").click(function() {
        Socialite.UI.resetActiveTab('search'); 
    });

    $("#connect_clear_button").click(function() {
        Socialite.Graph.Connect.removeAll();
    });

    $("#create_location_tab").click(function() {
        Socialite.UI.refreshCreateMap();
    });

    $("#search_location_tab").click(function() {
        Socialite.UI.refreshSearchMap();
    });

    Socialite.Graph.init();
    Socialite.UI.connectInterface();
    // $.getScript('js/tour.js');
});

Socialite.util['dateToUTC'] = function(date) {
    var months = {
        'January': 0,
        'February': 1,
        'March': 2,
        'April': 3,
        'May': 4,
        'June': 5,
        'July': 6,
        'August': 7,
        'September': 8,
        'October': 9,
        'November': 10,
        'December': 11
    };
    date = date.replace(',', '').split(' ');
    var day = date[0];
    var month = months[date[1]];
    var year = date[2];
    return Date.UTC(year, month, day);
}

Socialite.API['genericError'] = function(xhr, status, error) {
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
    var data = {"action": "get_type_properties", "type": type, "seasurf": seasurf};
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
    var data = {"action":"create_vertex", "type":type, "seasurf": seasurf};
    if(useMixpanel)
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
        Socialite.API.searchConnectedTo(form);
        return false;
    }

    var type = form[0]['type'].value;
    var data = {"action":"search_vertices", "type":type, "seasurf": seasurf};
    if(useMixpanel)
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

Socialite.API['searchConnectedTo'] = function(form) {
    var type = form[0]['type'].value;
    var vertices = form[0]['connected_to'].value;
    var data = {"action":"search_connected_to", "type":type, "vertices": vertices, "seasurf": seasurf};
    if(useMixpanel)
        mixpanel.track("SearchConnectedTo (" + type + ")");

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

Socialite.API['searchSuccess'] = function(data, status, xhr) {
    var vertices = $.parseJSON(data);
    if(vertices.length == 1 && vertices[0]['_id'] == -1) {
        Materialize.toast(vertices[0]['properties']['error'], 3000);;
    } else if(vertices.length > 0) {
        Socialite.UI.resetForm(vertices[0]['properties']['type'], 'search'); 
        Socialite.UI.listVertices(vertices);
    }
}

Socialite.API['createSuccess'] = function(data, status, xhr) {
    var vertex = $.parseJSON(data);
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
        Materialize.toast(vertex['properties']['error'], 3000);
    } else {
        Socialite.UI.listVertices([vertex]);
    }
}

Socialite.API['updateVertex'] = function(form) {
    var id = form[0]['id'].value;
    var type = form[0]['type'].value;
    var data = {"action":"update_vertex", "vertex": id, "seasurf": seasurf};
    if(useMixpanel)
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

    if(useMixpanel)
        mixpanel.track("Delete");
    var data = {"action":"delete_vertex", "vertex":id, "seasurf": seasurf};

    $.ajax({
        'type': 'POST',
        'url': 'api/proxy.php',
        'data': $.param(data),
        'success': Socialite.API.deleteSuccess,
        'error': Socialite.API.genericError });

    return false;
}

Socialite.API['getNeighbors'] = function(vertexId, direction, success) {
    var data = {"action": "get_neighbors", "vertex": vertexId, "direction": direction, "seasurf": seasurf};

    $.ajax({
        'type': 'POST',
        'url': 'api/proxy.php',
        'data': $.param(data),
        'success': success,
        'error': Socialite.API.genericError });

    return false;
}

Socialite.API['neighborsDisplaySuccess'] = function(data, status, xhr) {
    if(useMixpanel)
        mixpanel.track("Neighbors");
    var vertices = $.parseJSON(data);
    if(vertices.length == 1 && vertices[0]['_id'] == -1) {
        alert(vertices[0]['properties']['error']);
    } else {
        var vertex = vertices.pop();
        Socialite.UI.listVertices(vertices);
        if($(".selected_item").length > 0 && $(".selected_item").data("vertex")._id == vertex._id)
            Socialite.UI.highlightItems($(".selected_item").attr("id"));
    }
}

Socialite.API['createEdge'] = function(idA, idB) {
    var data = {"action": "create_edge", "vertexA": idA, "vertexB": idB, "seasurf": seasurf};
    if(useMixpanel)
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

    if(data['status'] === "ERROR") {
        if(data['ERROR'] != "Edge already exists between these vertices!")
            Materialize.toast(data['ERROR'], 3000);
        else 
            console.log(data['ERROR'])
        return;
    }

    var vertexA = data['vertexA'];
    var vertexB = data['vertexB'];
    var typeA = data['typeA'];
    var typeB = data['typeB'];
    var idLongA = typeA + "_" + vertexA;
    var idLongB = typeB + "_" + vertexB;

    if($("#" + idLongA).length > 0) {
        $("#" + idLongA).data('vertex').neighbors.push(idLongB);
    } else {
        var nodeA = Socialite.Graph.Connect.findNode(vertexA);
        if(nodeA !== undefined)
            nodeA.neighbors.push(idLongB);
    }

    if($("#" + idLongB).length > 0) {
        $("#" + idLongB).data('vertex').neighbors.push(idLongA);
    } else {
        var nodeB = Socialite.Graph.Connect.findNode(vertexB);
        if(nodeB !== undefined)
            nodeB.neighbors.push(idLongA);
    }

    Socialite.Graph.Connect.addLink(vertexA, vertexB);
    Socialite.UI.checkConnectInterface();
    Socialite.UI.highlightItems($(".selected_item").attr("id"));
}

Socialite.API['deleteEdgeSuccess'] = function(data, status, xhr) {
    data = $.parseJSON(data);

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

    if($("#" + idLongA).length > 0) {
        $("#" + idLongA).data('vertex').neighbors = _.filter($("#" + idLongA).data("vertex").neighbors, function(ea) { return ea != idLongB });
    } else {
    var nodeA = Socialite.Graph.Connect.findNode(vertexA);
    if(nodeA !== undefined)
        nodeA.neighbors = _.filter(nodeA.neighbors, function(ea) { return ea != idLongB });
    }
    
    if($("#" + idLongB).length > 0) {
        $("#" + idLongB).data('vertex').neighbors = _.filter($("#" + idLongB).data("vertex").neighbors, function(ea) { return ea != idLongA });
    } else {
        var nodeB = Socialite.Graph.Connect.findNode(vertexB);
        if(nodeB !== undefined)
            nodeB.neighbors = _.filter(nodeB.neighbors, function(ea) { return ea != idLongA });
    }

    Socialite.Graph.Connect.removeLink(vertexA, vertexB);
    Socialite.UI.checkConnectInterface();
    Socialite.UI.highlightItems($(".selected_item").attr("id"));
}

Socialite.API['deleteEdge'] = function(idA, idB) {
    if(useMixpanel)
        mixpanel.track("Delete edge");
    var data = {"action": "delete_edge", "vertexA": idA, "vertexB": idB, "seasurf": seasurf};

    $.ajax({
        'type': 'POST',
        'url': 'api/proxy.php',
        'data': $.param(data),
        'success': Socialite.API.deleteEdgeSuccess,
        'error': Socialite.API.genericError });

    return false;
}