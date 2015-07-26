
typeCache = {};

$(document).ready(function() {
    getVertexTypes();
});

function arraymove(arr, fromIndex, toIndex) {
    var element = arr[fromIndex]
    arr.splice(fromIndex, 1);
    arr.splice(toIndex, 0, element);
}

function getVertexTypes() {
    getTypeProperties('person');
    getTypeProperties('event');
    getTypeProperties('location');
}

function propertiesSuccessInit(type) {
    var callback;
    switch(type) {
        case 'person':
            callback = buildPersonForms;
            break;
        case 'event':
            callback = buildEventForms;
            break;
        case 'location':
            callback = buildLocationForms;
            break;
    }

    return function(data, status, xhr) {
        var properties = $.parseJSON(data);
        if(properties['ERROR'] !== undefined) {
            alert(properties['ERROR']);
        } else {
            typeCache[type] = properties;
            callback();
        }
    }
}

function getTypeProperties(type) {
    var data = {"action": "get_type_properties", "apiKey": apiKey, "type": type};
    var propertiesSuccess = propertiesSuccessInit(type);
    $.ajax({
        'type': 'POST',
        'url': 'api/proxy.php',
        'data': $.param(data),
        'success': propertiesSuccess,
        'error': genericError });
}

function genericError(xhr, status, error) {

}

function searchSuccess(data, status, xhr) {
    var vertices = $.parseJSON(data);
    if(vertices.length == 1 && vertices[0]['_id'] == -1) {
        alert(vertices[0]['properties']['error']);
    } else {
        listVertices(vertices);
    }
}

function searchVertices(form) {
    if(form[0]['connected_to'].value != '') {
        searchNeighbors(form);
        return false;
    }

    var type = form[0]['type'].value;
    var data = {"action":"search_vertices", "apiKey": apiKey, "type":type};
    mixpanel.track("Search (" + type + ")");

    var schema = typeCache[type];
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
    $.ajax({
        'type': 'POST',
        'url': 'api/proxy.php',
        'data': $.param(data),
        'success': searchSuccess,
        'error': genericError });
}

function searchNeighborsSuccess(data, status, xhr) {
    console.log($.parseJSON(data));
}

function searchNeighbors(form) {
    var type = form[0]['type'].value;
    var vertex = form[0]['connected_to'].value;
    var data = {"action":"search_neighbors", "apiKey": apiKey, "type":type, "vertex": vertex};
    mixpanel.track("SearchNeighbors (" + type + ")");

    var schema = typeCache[type];
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

    $.ajax({
        'type': 'POST',
        'url': 'api/proxy.php',
        'data': $.param(data),
        'success': searchSuccess,
        'error': genericError });
}

function updateSuccess(data, status, xhr) {
    var vertex = $.parseJSON(data);
    if(vertex['_id'] == -1) {
        alert(vertex['properties']['error']);
    } else {
        listVertices([vertex]);
    }
}

function updateVertex(form) {
    var id = form[0]['id'].value;
    var type = form[0]['type'].value;
    var data = {"action":"update_vertex", "apiKey": apiKey, "vertex": id};
    mixpanel.track("Update");

    if(type === undefined || id === undefined) {
        return false;
    }

    var schema = typeCache[type];
    var schemaKeys = Object.keys(schema);
    for(var idx in schemaKeys) {
        var key = schemaKeys[idx];
        var value = form[0][key].value;
        if((key == 'date' || key == 'born') && value.split('-').length == 3) {
            var split = value.split('-');
            value = Date.UTC(split[0], split[1]-1, split[2]);
        }
        console.log(key + ": " + value);
        data[key] = value;
    }

    $.ajax({
        'type': 'POST',
        'url': 'api/proxy.php',
        'data': $.param(data),
        'success': updateSuccess,
        'error': genericError });
}

// DELETE VERTEX
function deleteSuccess(data, status, xhr) {
    data = $.parseJSON(data);
    if(data['status'] == 'SUCCESS') {
        var id = data['vertex'];
        var type = data['type'];
        //var item = $('#' + type + '_' + id);
        instance.remove(type + '_' + id);
        resetForm(type, 'display'); 
    } else {
        alert(data['ERROR']);
    } 
}

function deleteVertex(form) {
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
        'success': deleteSuccess,
        'error': genericError });

    return false;
}

function createSuccess(data, status, xhr) {
    var vertex = $.parseJSON(data);
    if(vertex['_id'] == -1) {
        alert(vertex['properties']['error']);
    } else {
        resetForm(vertex['properties']['type'], 'create'); 
        listVertices([vertex]);
    }
}

function createVertex(form) {
    console.log('Called create!');
    var type = form[0]['type'].value;
    var data = {"action":"create_vertex", "apiKey": apiKey, "type":type};
    mixpanel.track("Create (" + type + ")");

    var schema = typeCache[type];
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
        'success': createSuccess,
        'error': genericError });
    
    return false; 
 }

// GET NEIGHBORS
function neighborsInSuccess(data, status, xhr) {
    var vertices = $.parseJSON(data);
    console.log(vertices);
    if(vertices.length == 1 && vertices[0]['_id'] == -1) {
        alert(vertices[0]['properties']['error']);
    } else {
        var vertex = vertices.pop();
        for(var idx in vertices) {
            var neighbor = vertices[idx];
            addLink(neighbor, vertex);
        }
    }
}

function neighborsOutSuccess(data, status, xhr) {
    var vertices = $.parseJSON(data);
    console.log(vertices);
    if(vertices.length == 1 && vertices[0]['_id'] == -1) {
        alert(vertices[0]['properties']['error']);
    } else {
        var vertex = vertices.pop();
        for(var idx in vertices) {
            var neighbor = vertices[idx];
            addLink(vertex, neighbor);
        }
    }
}

function neighborsDisplaySuccess(data, status, xhr) {
    mixpanel.track("Neighbors");
    var vertices = $.parseJSON(data);
    console.log(vertices);
    if(vertices.length == 1 && vertices[0]['_id'] == -1) {
        alert(vertices[0]['properties']['error']);
    } else {
        var vertex = vertices.pop();
        listVertices(vertices);
    }
}

function getNeighbors(vertexId, direction, success) {
    var data = {"action": "get_neighbors", "apiKey": apiKey, "vertex": vertexId, "direction": direction};

    $.ajax({
        'type': 'POST',
        'url': 'api/proxy.php', //'https://opendao.org:8443/IntelligenceGraph/api/utility/create_vertex/',
        'data': $.param(data),
        'success': success,
        'error': genericError });

    return false;
}

function getConnectionsFromVertex(vertex) {
    var id = getIdFromVertex(vertex);
    return getConnectionIds(id);
}

function getConnectionIds(id) {
    var connections = instance.getConnections();
    var connectionList = [];
    for(var idx in connections) {
        var connection = connections[idx];
        if(connection.sourceId == id) {
            connectionList.push(connection.targetId);
        } else if(connection.targetId == id) {
            connectionList.push(connection.sourceId);
        }
    }
    return connectionList;
}

function getConnections(id) {
    var connections = instance.getConnections();
    var connectionList = [];
    for(var idx in connections) {
        var connection = connections[idx];
        if(connection.sourceId == id) {
            connectionList.push(connection);
        } else if(connection.targetId == id) {
            connectionList.push(connection);
        }
    }
    return connectionList;
}

function checkConnection(idA, idB) {
    var connections = instance.getConnections();
    for(var idx in connections) {
        var connection = connections[idx];
        if(connection.sourceId == idA && connection.targetId == idB)
            return true;
    }
    return false;
}

function getIdFromVertex(vertex) {
    return vertex['properties']['type'] + '_' + vertex['_id'];
}

function getConnection(idA, idB) {
    var connections = instance.getConnections();

    for(var idx in connections) {
        var connection = connections[idx];
        if(connection.sourceId == idA && connection.targetId == idB)
            return connection;
    }

    return undefined;
}

function getConnectionByVertices(vertexA, vertexB) {
    var connections = instance.getConnections();
    var idA = getIdFromVertex(vertexA);
    var idB = getIdFromVertex(vertexB);

    for(var idx in connections) {
        var connection = connections[idx];
        if(connection.sourceId == idA && connection.targetId == idB)
            return connection;
    }

    return undefined;
}

function createEdgeSuccess(data, status, xhr) {
    data = $.parseJSON(data);
    if(data['status'] == 'SUCCESS') {
        selected = [];
        $('li').removeClass('list_selected');

        var idA = data['vertexA'];
        var typeA = data['typeA'];

        var idB = data['vertexB'];
        var typeB = data['typeB'];
        
        var vertexA = $('#' + typeA + '_' + idA).data('vertex');
        var vertexB = $('#' + typeB + '_' + idB).data('vertex');
        
        addLink(vertexA, vertexB);
        console.log(data['SUCCESS']);
    } else {
        selected = [];
        $('li').removeClass('list_selected');

        alert(data['ERROR']);
    }

}

function createEdge(idA, idB) {
    var data = {"action": "create_edge", "apiKey": apiKey, "vertexA": idA, "vertexB": idB};
    mixpanel.track("Create edge");
    $.ajax({
        'type': 'POST',
        'url': 'api/proxy.php',
        'data': $.param(data),
        'success': createEdgeSuccess,
        'error': genericError });

    return false;
}

// delete_edge
function deleteEdgeSuccess(data, status, xhr) {
    data = $.parseJSON(data);
    if(data['status'] == 'SUCCESS') {
        selected = [];
        $('li').removeClass('list_selected');

        var idA = data['vertexA'];
        var typeA = data['typeA'];
        var parentIdA = typeA + '_' + idA;

        var idB = data['vertexB'];
        var typeB = data['typeB'];
        var parentIdB = typeB + '_' + idB;
        
        // var vertexA = $('#' + parentIdA).data('vertex');
        // var vertexB = $('#' + parentIdB).data('vertex');
        
        var connection = getConnection(parentIdA, parentIdB);
        instance.detach(connection);
        console.log(data['SUCCESS']);
    } else {
        selected = [];
        $('li').removeClass('list_selected');

        alert(data['ERROR']);
    }

}

function deleteEdge(idA, idB) {
    mixpanel.track("Delete edge");
    var data = {"action": "delete_edge", "apiKey": apiKey, "vertexA": idA, "vertexB": idB};

    $.ajax({
        'type': 'POST',
        'url': 'api/proxy.php',
        'data': $.param(data),
        'success': deleteEdgeSuccess,
        'error': genericError });

    return false;
}