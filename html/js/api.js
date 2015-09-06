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
        if($("#location_create_tab").hasClass('active'))
            Socialite.UI.refreshCreateMap();
    });
    
    $("#location_create_tab").click(function() {
        Socialite.UI.refreshCreateMap();
    });

    $("#create_button").click(function() {
        var visibleType = undefined;
        if($("#person_create_tab").hasClass("active")) {
            visibleType = "person";
        } else if($("#event_create_tab").hasClass("active")) {
            visibleType = "event";
        } else if($("#location_create_tab").hasClass("active")) {
            visibleType = "location";
        } 

        if(visibleType == undefined) {
            return;
        }

        var formId = visibleType + "_create_form";
        $("#" + formId).submit();
    });
});

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
        if((key == 'date' || key == 'born') && value.split('-').length == 3) {
            var split = value.split('-');
            value = Date.UTC(split[0], split[1]-1, split[2]);
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