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
            content: "This is where you add new people, events, and locations to Socialite. ",
            target: document.querySelector("#add_modal > .modal-content > .row > h4"),
            placement: "left",
            yOffset: "center"
        }
    ]
};