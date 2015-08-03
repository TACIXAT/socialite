var Socialite = Socialite || {};
Socialite.API = {};
Socialite.util = {};
Socialite.util.typeCache = {};

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
    // Socialite.API.getTypeProperties('event');
    // Socialite.API.getTypeProperties('location');
}

