var Socialite = Socialite || {};
Socialite.Tour = {};
Socialite.Tour['currentStep'] = 0;
Socialite.Tour['arrowSize'] = "20px";

Socialite.Tour['nextStep'] = function() {
    var idx = Socialite.Tour.currentStep;
    var step = Socialite.Tour.steps[idx];

    if(step['showButtons'] !== undefined && !step['showButtons'])
        $("#tour_action").hide();
    else
        $("#tour_action").show();

    if(step['onNext'] !== undefined)
        $("#tour_next_btn").click(step['onNext']);
    else
        $("#tour_next_btn").click(function() {
            Socialite.Tour.nextStep();
        });

    var opposite = {
        "left": "right",
        "right": "left",
        "top": "bottom",
        "bottom": "top",
        "center": "center",
    };

    var sign = {
        "top": "-",
        "left": "-",
        "bottom": "+",
        "right": "+",
        "center": "",
    };

    var placement = step['placement'];
    var offset = placement;
    if(placement != "center")
        offset += sign[placement] + Socialite.Tour.arrowSize;

    console.log("$('#tour_card').position({ my:'" + opposite[placement] + "', at:'" + offset + "', of: $('" + step['target'] + "')});");
    $("#tour_card").show();
    $("#tour_title").text(step['title']);
    $("#tour_content").text(step['content']);
    $("#tour_card").position({ my: opposite[placement], at: offset, of: $(step['target'])});
    $(".arrow").hide();
    $(".arrow-" + opposite[placement]).show();    
    Socialite.Tour.currentStep += 1;
}

Socialite.Tour['highlight'] = function(selector) {
    //
}

Socialite.Tour['steps'] = [
    {
        title: "Welcome to Socialite",
        content: "This guide will walk you through Socialite's functionality.",
        placement: "center",
        target: "body",
        onNext: function() {
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
                    Socialite.Tour.nextStep();
                });

                Socialite.Tour.nextStep();
            });

            Socialite.Tour.nextStep();
        }
    },
    {
        title: "Add Node",
        content: "Let's add a new node.",
        target: "#add_button",
        placement: "right",
        showButtons: false,
    },
    {
        title: "Create Node",
        content: "This is where you add new nodes.",
        target: "#add_modal > .modal-content",
        placement: "left",
        yOffset: "center",
        onNext: function() {
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
            Socialite.Tour.nextStep();
        }
    },
    {
        title: "Your Name",
        content: "Let's start by adding you. Fill in your name.",
        target: "#name_person_createfield",
        placement: "left",
        yOffset: "center",
    },
    {
        title: "Create Node",
        content: "You can fill in the rest later.",
        target: "#create_submit_button",
        placement: "top",
        showButtons: false,
    },
    {
        title: "New Node",
        content: "Newly created nodes appear in these lists.",
        target: "#list_person_div",
        yOffset: "center",
        placement: "right",
    },
    {
        title: "Details",
        content: "Clicking the node will show its details up here.",
        target: "#display_person_div",
        placement: "right",
    },
];