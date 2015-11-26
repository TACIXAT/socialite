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

Socialite.Tour['init'] = function() {
    $("#tour_next_btn").off('click.next');
    $("#tour_next_btn").on('click.next', function() {
        Socialite.Tour.nextStep();
    });

    $("#tour_prev_btn").off('click.prev');
    $("#tour_prev_btn").on('click.prev', function() {
        Socialite.Tour.prevStep();
    });

    $("#tour_skip_btn").off('click.skip');
    $("#tour_skip_btn").on('click.skip', function() {
        Socialite.Tour.done();
    });

    Socialite.Tour.initialized = true;
}

Socialite.Tour['prevStep'] = function() {
    Socialite.Tour.currentStep -= 2;
    if(Socialite.Tour.currentStep < 0)
        Socialite.Tour.currentStep = 0;
    Socialite.Tour.nextStep();
}

Socialite.Tour['nextStep'] = function() {
    if(!Socialite.Tour.initialized) {
        Socialite.Tour.init();
    }

    var idx = Socialite.Tour.currentStep;
    Socialite.Tour.currentStep += 1;
    
    if(idx > 0 && idx < Socialite.Tour.steps.length) {
        var fn = Socialite.Tour.steps[idx-1].onNext;
        if(fn != undefined)
            fn();
    }

    if(idx >= Socialite.Tour.steps.length) {
        Socialite.Tour.done();
        return;
    } else if(idx+1 == Socialite.Tour.steps.length) {
        $("#tour_next_btn").text("Done");
    } else {
        $("#tour_next_btn").text("Next");
    }

    var step = Socialite.Tour.steps[idx];

    if(step['hidden'] !== undefined && step['hidden']) {
        $("#tour_card").hide();
        return;
    }

    if(step['height'] !== undefined)
        $("#tour_card").css('height', step['height']);
    else
        $("#tour_card").css('height', '300px');

    if(step['width'] !== undefined)
        $("#tour_card").css('width', step['width']);
    else
        $("#tour_card").css('width', '300px');

    if(step['showButtons'] !== undefined && !step['showButtons'])
        $("#tour_action").hide();
    else
        $("#tour_action").show();

    if(step['hidePrev'] !== undefined && step['hidePrev'])
        $("#tour_prev_btn").hide();
    else
        $("#tour_prev_btn").show();

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
    if(step['multiLine'] !== undefined && step['multiLine'])
        $("#tour_content").html(step['content']);
    else
        $("#tour_content").text(step['content']);

    $("#tour_card").position({ 
        my: opposite[placement], 
        at: offset, 
        of: $(step['target']), 
        collision: "none"
    });
    $(".arrow").hide();
    $(".arrow-" + opposite[placement]).show();    
}

Socialite.Tour['highlight'] = function(selector) {
    //
}

Socialite.Tour['steps'] = [
    {
        title: "Welcome to Socialite",
        content: "This guide will walk you through Socialite's functionality. This tour takes about 2 minutes to complete.",
        placement: "center",
        target: "body",
        hidePrev: true,
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
        }
    },
    {
        title: "Enjoy!",
        content: "A few more quick things:<br><ul><li>Double clicking a listed node will search for its neighbors.</li><li>In addition to clicking Connect you can also drag a node to the connect button.</li><li>Draggin a node to the search button will allow you to search for neighbors of that node.</li></ul><br>Thanks for taking the time to learn about Socialite. Don't hesitate to contact us with any questions.",
        placement: "center",
        hidePrev: true,
        multiLine: true,
        height: "70%",
        width: "55%",
        target: "body",
    },
    {
        title: "Add Node",
        content: "Let's add a new node.",
        target: "#add_button",
        placement: "right",
        showButtons: false,
    },
    {
        title: "Your Name",
        content: "Let's start by adding you. Fill in your name.",
        target: "#name_person_createfield",
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
        }
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
        placement: "right",
        hidePrev: true,
    },
    {
        title: "Details",
        content: "Clicking the node will show its details up here. If you edit the details you commit them by clicking the UPDATE button. Or you can permenantly delete a node by clicking the DELETE button.",
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
                $("#name_event_createfield").val("Learned how to use Socialite!");
                $("#name_event_createfield").siblings().addClass('active');
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
            $("#create_event_tab").off("click.tab");

            $("#connect_button").off('click.open');
            $("#connect_button").on('click.open', function() {
                Socialite.Tour.nextStep();
                $('#connect_modal').openModal();
                Socialite.Graph.Connect.resize();
                Socialite.UI.checkConnectInterface();
            });

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
    },
    {
        title: "Create Node",
        content: "When you're done adding details, click create.",
        target: "#create_submit_button",
        placement: "top",
        showButtons: false,
        onNext: function() {
            $("#person_list > li > a:eq(1)").off('click.connect');
            $("#person_list > li > a:eq(1)").on('click.connect', function(ev) {
                ev.cancelBubble = true;
                if(ev.stopPropagation) 
                    ev.stopPropagation();
                var vertex = $(this).parent().data('vertex');
                Socialite.Graph.Connect.addNode(vertex);
                $("#connect_button").effect("shake", {'distance': 5, 'times': 2, 'direction': 'right'});
                Socialite.Tour.nextStep();
            });
        }
    },
    {
        title: "Connect Nodes",
        content: "Click Connect on each node to add it to the connection interface.",
        target: "#person_list > li > a:eq(1)",
        placement: "bottom",
        showButtons: false,
        onNext: function() {
            $("#person_list > li > a:eq(1)").off('click.connect');
            $("#person_list > li > a:eq(1)").on('click.connect', function(ev) {
                ev.cancelBubble = true;
                if(ev.stopPropagation) 
                    ev.stopPropagation();
                var vertex = $(this).parent().data('vertex');
                Socialite.Graph.Connect.addNode(vertex);
                $("#connect_button").effect("shake", {'distance': 5, 'times': 2, 'direction': 'right'});
            });

            $("#event_list > li > a:eq(1)").off('click.connect');
            $("#event_list > li > a:eq(1)").on('click.connect', function(ev) {
                ev.cancelBubble = true;
                if(ev.stopPropagation) 
                    ev.stopPropagation();
                var vertex = $(this).parent().data('vertex');
                Socialite.Graph.Connect.addNode(vertex);
                $("#connect_button").effect("shake", {'distance': 5, 'times': 2, 'direction': 'right'});
                Socialite.Tour.nextStep();
            });
        }
    },
    {
        title: "Connect Nodes",
        content: "Click Connect on each node to add it to the connection interface.",
        target: "#event_list > li > a:eq(1)",
        placement: "bottom",
        showButtons: false,
        onNext: function() {
            $("#event_list > li > a:eq(1)").off('click.connect');
            $("#event_list > li > a:eq(1)").on('click.connect', function(ev) {
                ev.cancelBubble = true;
                if(ev.stopPropagation) 
                    ev.stopPropagation();
                var vertex = $(this).parent().data('vertex');
                Socialite.Graph.Connect.addNode(vertex);
                $("#connect_button").effect("shake", {'distance': 5, 'times': 2, 'direction': 'right'});
            });
        }
    },
    {
        title: "Connect Nodes",
        content: "Then click here to open the interface.",
        target: "#connect_button",
        placement: "right",
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
    {
        title: "Connection Interface",
        content: "You can connect people to events, and events to locations. You can create many connections at once through this interface.",
        placement: "center",
        target: "body",
        hidePrev: true,
    },
    {
        title: "Connection Interface",
        content: "If any nodes in this interface are disconnected you will see the CONNECT button.",
        placement: "center",
        target: "body",
        onNext: function() {
            var waitForClose = function() {
                if($("#connect_modal").is(":visible"))
                    setTimeout(waitForClose, 300);
                else
                    Socialite.Tour.nextStep();      
            };

            setTimeout(waitForClose, 300);
        }
    },
    {
        title: "Connection Interface",
        content: "If all nodes in this interface are connected you will see the DISCONNECT button.",
        placement: "center",
        target: "body",
    },
    {
        hidden: true
    },
    
];