var Socialite = Socialite || {};
Socialite.Tour = {};
Socialite.Tour['currentStep'] = 0;
Socialite.Tour['arrowSize'] = "20px";

Socialite.Tour['done'] = function() {
    $("#tour_card").hide();
    Socialite.Tour.currentStep = 0;

    $("#create_event_tab").off("click.tab");
    $("#add_button").off('click.open');
    $("#add_button").on('click.open', function() {
        $('#add_modal').openModal();
        $('ul.tabs').tabs();
        if($("#create_location_tab").hasClass('active'))
            Socialite.UI.refreshCreateMap();

        $("#create_submit_button").off('click.submit');
        $("#create_submit_button").on('click.submit', function() {
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

Socialite.Tour['nextStep'] = function() {
    var idx = Socialite.Tour.currentStep;
    if(idx >= Socialite.Tour.steps.length) {
        Socialite.Tour.done();
        return;
    } else if(idx+1 == Socialite.Tour.steps.length) {
        $("#tour_next_btn").text("Done");
    } else {
        $("#tour_next_btn").text("Next");
    }

    var step = Socialite.Tour.steps[idx];

    if(step['showButtons'] !== undefined && !step['showButtons'])
        $("#tour_action").hide();
    else
        $("#tour_action").show();

    $("#tour_next_btn").off('click.next');
    if(step['onNext'] !== undefined)
        $("#tour_next_btn").on('click.next', step['onNext']);
    else
        $("#tour_next_btn").on('click.next', function() {
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
    $("#tour_card").position({ 
        my: opposite[placement], 
        at: offset, 
        of: $(step['target']), 
        collision: "none"
    });
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
            var waitForAddModal = function() {
                if($("#add_modal").css("opacity") != 1 || $("#add_modal")[0].style.top != "10%")
                    setTimeout(waitForAddModal, 100);
                else
                    Socialite.Tour.nextStep();
            }

            $("#add_button").off('click.open');
            $("#add_button").on('click.open', function() {
                $('#add_modal').openModal();
                $('ul.tabs').tabs();
                if($("#create_location_tab").hasClass('active'))
                    Socialite.UI.refreshCreateMap();
    
                $("#create_submit_button").off('click.submit');
                $("#create_submit_button").on('click.submit', function() {
                    Socialite.Tour.nextStep();
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

                setTimeout(waitForAddModal, 100);
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
        onNext: function() {
            $("#add_button").off('click.open');
            $("#add_button").on('click.open', function() {
                $('#add_modal').openModal();
                $('ul.tabs').tabs();
                if($("#create_location_tab").hasClass('active'))
                    Socialite.UI.refreshCreateMap();

                $("#create_submit_button").off('click.submit');
                $("#create_submit_button").on('click.submit', function() {
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
        content: "When you're done adding details, click create.",
        target: "#create_submit_button",
        placement: "top",
        showButtons: false,
    },
    {
        title: "New Node",
        content: "Newly created nodes appear in the lower lists. People in the first column, events in the second, and locations in the third.",
        target: "#list_person_div",
        yOffset: "center",
        placement: "right",
    },
    {
        title: "Details",
        content: "Clicking the node will show its details up here. If you edit the details you commit them by clicking the update button. Or you can permenantly delete a node by clicking the delete button.",
        target: "#display_person_div",
        placement: "right",
        onNext: function() {
            var waitForAddModal = function() {
                if($("#add_modal").css("opacity") != 1 || $("#add_modal")[0].style.top != "10%")
                    setTimeout(waitForAddModal, 100);
                else
                    Socialite.Tour.nextStep();
            }

            $("#create_event_tab").on("click.tab", function() {
                Socialite.Tour.nextStep();
            });

            $("#add_button").off('click.open');
            $("#add_button").on('click.open', function() {
                $('#add_modal').openModal();
                $('ul.tabs').tabs();
                if($("#create_location_tab").hasClass('active'))
                    Socialite.UI.refreshCreateMap();
    
                $("#create_submit_button").off('click.submit');
                $("#create_submit_button").on('click.submit', function() {
                    Socialite.Tour.nextStep();
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
                setTimeout(waitForAddModal, 100);
            });

            Socialite.Tour.nextStep();
        }
    },
    {
        title: "Create an Event",
        content: "Go ahead and create an event so we can learn about connections.",
        target: "#add_button",
        placement: "right",
        showButtons: false,
    },
    {
        title: "Event Tab",
        content: "Click the event tab to create an event. Events help you keep track of when you interacted with someone.",
        target: "#create_event_tab",
        placement: "bottom",
        showButtons: false,
        onNext: function() {
            $("#name_event_createfield").val("Learned how to use Socialite!");
            $("#name_event_createfield").siblings().addClass('active');

            $("#create_event_tab").off("click.tab");

            $("#add_button").off('click.open');
            $("#add_button").on('click.open', function() {
                $('#add_modal').openModal();
                $('ul.tabs').tabs();
                if($("#create_location_tab").hasClass('active'))
                    Socialite.UI.refreshCreateMap();

                $("#create_submit_button").off('click.submit');
                $("#create_submit_button").on('click.submit', function() {
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
        title: "Create Node",
        content: "When you're done adding details, click create.",
        target: "#create_submit_button",
        placement: "top",
        showButtons: false,
        onNext: function() {
            $("#connect_button").off('click.open');
            $("#connect_button").on('click.open', function() {
                $('#connect_modal').openModal();
                Socialite.Graph.Connect.resize();
                Socialite.UI.checkConnectInterface();
                Socialite.Tour.nextStep();
            });
        }
    },
    {
        title: "Connect Nodes",
        content: "Click connect on each node to add it to the connection interface. Then click here to open the interface.",
        target: "#connect_button",
        placement: "top",
        showButtons: false,
        onNext: function() {
            $("#connect_button").off('click.open');
            $("#connect_button").on('click.open', function() {
                $('#connect_modal').openModal();
                Socialite.Graph.Connect.resize();
                Socialite.UI.checkConnectInterface();
            });
        }
    },
];