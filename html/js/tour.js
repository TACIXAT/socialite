var Socialite = Socialite || {};
Socialite.Tour = {
    id: "tour",
    steps: [
        {
            title: "Welcome to Socialite",
            content: "This guide will walk you through application functionality.",
            target: document.querySelector(".logo"),
            placement: "right",
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

                    setTimeout(function() {
                        hopscotch.nextStep();
                    }, 500);
                });
            }
        },
        {
            title: "Add Node",
            content: "Let's add a new node.",
            target: document.querySelector("#add_button"),
            placement: "right",
            showNextButton: false,
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
            }
        },
        {
            title: "Create Node",
            content: "This is where you add new nodes. Nodes are People, Events, and Locations.",
            target: document.querySelector("#add_modal > .modal-content"),
            placement: "left",
            yOffset: "center"
        },
        {
            title: "Your Name",
            content: "You're the center of your life, so let's start by adding you.",
            target: document.querySelector("#name_person_createfield"),
            placement: "left",
            yOffset: "center"
        },
        {
            title: "Create Node",
            content: "You can fill in the rest later.",
            target: document.querySelector("#create_submit_button"),
            placement: "top",
            xOffset: "center"
        },
    ]
    
};