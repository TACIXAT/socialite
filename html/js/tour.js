var Socialite = Socialite || {};
Socialite.Tour = {};
Socialite.Tour['currentStep'] = 0;
Socialite.Tour['arrowSize'] = "+20px";

Socialite.Tour['nextStep'] = function() {
    var idx = Socialite.Tour.currentStep;
    var step = Socialite.Tour.steps[idx];

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
    };

    var placement = step['placement'];
    var offset = sign[placement] + plaement;

    $("#tour_card").hide();
    $("#tour_card").position({ my: opposite[placement], at: offset, of: $(step[target])});
    $("#tour_title").text(step['title']);
    $("#tour_content").text(step['content']);
    $(".arrow").hide();
    $("#tour_card").show();
    $("." + opposite[placement] + "-arrow").show();    
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
                });

                Socialite.Tour.nextStep();
            });
        }
    },
    {
        title: "Add Node",
        content: "Let's add a new node.",
        target: "#add_button",
        placement: "right",
        showNextButton: false,
        onShow: function() {
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
            });
        }
    },
    {
        title: "Create Node",
        content: "This is where you add new nodes.",
        target: "#add_modal > .modal-content",
        placement: "left",
        yOffset: "center",
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
        showNextButton: false,
    },
    {
        title: "New Node",
        content: "Newly created nodes appear in these lists.",
        target: "#list_person_div",
        yOffset: "center",
        placement: "left",
    },
    {
        title: "Details",
        content: "Clicking the node will show its details up here.",
        target: "#display_person_div",
        placement: "left",
    },
];