var Socialite = Socialite || {};
Socialite.UI = {};

Socialite.UI['buildEventForms'] = function() {
    // var searchForm = buildSearchForm('event');
    var displayForm = Socialite.UI.buildDisplayForm('event');
    // var createForm = buildCreateForm('event');
}

Socialite.UI['buildLocationForms'] = function() {
    // var searchForm = buildSearchForm('location');
    var displayForm = Socialite.UI.buildDisplayForm('location');
    // var createForm = buildCreateForm('location');
    // navigator.geolocation.getCurrentPosition(centerMaps);
}

Socialite.UI['buildPersonForms'] = function () {
    // var searchForm = buildSearchForm('person');
    var displayForm = Socialite.UI.buildDisplayForm('person');
    // var createForm = buildCreateForm('person');
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
    // updateButton.addClass('td_display');
    updateButton.html('UPDATE');
    updateButton.attr('name', 'update');
    updateButton.click(function() {
        displayForm.data('clicked', this.name);
    });

    var deleteButton = $('<button></button>');
    deleteButton.attr('type', 'submit');
    // deleteButton.addClass('td_display');
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

    idLabel.text('ID ');
    idRow.addClass('tr_display');
    // idLabel.addClass('td_display');
    // idDisplay.addClass('td_display');
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
        row.addClass('input-field');

        var label = $('<label></label>');
        // label.addClass('td_display');
        label.attr('for', key + '_' + vertexType + '_attribute');
        label.text(key);

        var input = key == 'notes' ? $('<textarea rows=5></textarea>') : $('<input></input>');
        // input.addClass('td_display');
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
            // div.addClass('td_display');

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
        buttonRow.before(row);
        
        if(type == 'geopoint') {
            row.append(div);
            input.data('div', div);
            addMap(mapDiv, input.attr("id"));

            label.click(labelClickInit(input, div));
        }
    }
    
    $(".datepicker").pickadate({
        selectMonths: true,
        selectYears: 150,
        onClose: function() {
            $(".datepicker").blur();
        },
    });

    return displayForm;
}