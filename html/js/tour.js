var Socialite = Socialite || {};
Socialite.Tour = {
    id: "tour",
    steps: [
        {
            title: "Welcome to Socialite",
            content: "This guide will walk you through application functionality.",
            target: document.querySelector(".logo"),
            placement: "right"
        },
        {
            title: "Add Node",
            content: "Let's add a new node.",
            target: document.querySelector("#add_button"),
            placement: "right",
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
        // {
        //     title: "My content",
        //     content: "Here is where I put my content.",
        //     target: document.querySelector("#content p"),
        //     placement: "bottom"
        // }
    ]
};