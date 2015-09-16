var Socialite = Socialite || {};
Socialite.API = {};
Socialite.util = {};
Socialite.util.typeCache = {};

$(document).ready(function() {
    Socialite.API.getVertexTypes();
    $('ul.tabs').tabs();
    
    $("#add_button").click(function() {
        $('#add_modal').openModal();
        $('ul.tabs').tabs();
        if($("#create_location_tab").hasClass('active'))
            Socialite.UI.refreshCreateMap();
    });

    $("#search_button").click(function() {
        $('#search_modal').openModal();
        $('ul.tabs').tabs();
        if($("#search_location_tab").hasClass('active'))
            Socialite.UI.refreshSearchMap();
    });
    
    $("#create_location_tab").click(function() {
        Socialite.UI.refreshCreateMap();
    });

    $("#search_location_tab").click(function() {
        Socialite.UI.refreshSearchMap();
    });

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

Socialite.util['genericError'] = function(xhr, status, error) {
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
            alert(properties['ERROR']);
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
        alert(vertices[0]['properties']['error']);
    } else {
        Socialite.UI.resetForm(vertices[0]['properties']['type'], 'search'); 
        Socialite.UI.listVertices(vertices);
    }
}

Socialite.API['createSuccess'] = function(data, status, xhr) {
    var vertex = $.parseJSON(data);
    // console.log(vertex);
    if(vertex['_id'] == -1) {
        alert(vertex['properties']['error']);
    } else {
        Socialite.UI.resetForm(vertex['properties']['type'], 'create'); 
        Socialite.UI.listVertices([vertex]);
    }
}