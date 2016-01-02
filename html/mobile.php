<?php
include_once '/var/www/php/include/db_connect.php';
include_once '/var/www/php/include/functions.php';
 
sec_session_start();
$logged_in = login_check($mysqli);
if (!$logged_in) {
    header('Location: /'); 
    exit();
}

$first_login = first_login($mysqli);

?>
<!doctype html>
<html>
    <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta charset="UTF-8">
        <title>Socialite.ooo</title>
        <?php
            if(!isset($_SERVER['HTTP_DNT']) || $_SERVER['HTTP_DNT'] != 1) {
                echo "<!-- start Mixpanel -->\n";
                echo "        <script type=\"text/javascript\">\n";
                echo "            (function(f,b){if(!b.__SV){var a,e,i,g;window.mixpanel=b;b._i=[];b.init=function(a,e,d){function f(b,h){var a=h.split(\".\");2==a.length&&(b=b[a[0]],h=a[1]);b[h]=function(){b.push([h].concat(Array.prototype.slice.call(arguments,0)))}}var c=b;\"undefined\"!==typeof d?c=b[d]=[]:d=\"mixpanel\";c.people=c.people||[];c.toString=function(b){var a=\"mixpanel\";\"mixpanel\"!==d&&(a+=\".\"+d);b||(a+=\" (stub)\");return a};c.people.toString=function(){return c.toString(1)+\".people (stub)\"};i=\"disable track track_pageview track_links track_forms register register_once alias unregister identify name_tag set_config people.set people.set_once people.increment people.append people.track_charge people.clear_charges people.delete_user\".split(\" \");\n";
                echo "            for(g=0;g<i.length;g++)f(c,i[g]);b._i.push([a,e,d])};b.__SV=1.2;a=f.createElement(\"script\");a.type=\"text/javascript\";a.async=!0;a.src=\"//cdn.mxpnl.com/libs/mixpanel-2-latest.min.js\";e=f.getElementsByTagName(\"script\")[0];e.parentNode.insertBefore(a,e)}})(document,window.mixpanel||[]);\n";
                echo "            mixpanel.init(\"3cfcfcdc33cbc6693645f79e38e9a292\");\n";
                echo "        </script>\n";
                echo "        <!-- end Mixpanel -->\n";
            }
        ?>

        <link rel="apple-touch-icon" sizes="57x57" href="/icon/favicon/apple-touch-icon-57x57.png">
        <link rel="apple-touch-icon" sizes="60x60" href="/icon/favicon/apple-touch-icon-60x60.png">
        <link rel="apple-touch-icon" sizes="72x72" href="/icon/favicon/apple-touch-icon-72x72.png">
        <link rel="apple-touch-icon" sizes="76x76" href="/icon/favicon/apple-touch-icon-76x76.png">
        <link rel="apple-touch-icon" sizes="114x114" href="/icon/favicon/apple-touch-icon-114x114.png">
        <link rel="apple-touch-icon" sizes="120x120" href="/icon/favicon/apple-touch-icon-120x120.png">
        <link rel="apple-touch-icon" sizes="144x144" href="/icon/favicon/apple-touch-icon-144x144.png">
        <link rel="apple-touch-icon" sizes="152x152" href="/icon/favicon/apple-touch-icon-152x152.png">
        <link rel="apple-touch-icon" sizes="180x180" href="/icon/favicon/apple-touch-icon-180x180.png">
        <link rel="icon" type="image/png" href="/icon/favicon/favicon-32x32.png" sizes="32x32">
        <link rel="icon" type="image/png" href="/icon/favicon/android-chrome-192x192.png" sizes="192x192">
        <link rel="icon" type="image/png" href="/icon/favicon/favicon-96x96.png" sizes="96x96">
        <link rel="icon" type="image/png" href="/icon/favicon/favicon-16x16.png" sizes="16x16">
        <link rel="manifest" href="/icon/favicon/manifest.json">
        <link rel="shortcut icon" href="/icon/favicon/favicon.ico">
        <meta name="msapplication-TileColor" content="#da532c">
        <meta name="msapplication-TileImage" content="/icon/favicon/mstile-144x144.png">
        <meta name="msapplication-config" content="/icon/favicon/browserconfig.xml">
        
        <script type="text/javascript" src="https://maps.googleapis.com/maps/api/js?key=AIzaSyD5Sh0t7Zp9DeZOfbOfE2-KBgEe9YUoryM"></script>
        <script type="text/javascript" src="/js/lib/jquery-2.1.3.min.js"></script>
        <script type="text/javascript" src="/js/lib/jquery-ui-1.11.3/jquery-ui.min.js"></script>
        <script type="text/javascript" src="/js/lib/d3.v3.min.js"></script>
        <script type="text/javascript" src="/js/lib/underscore-min.js"></script>
        <script type="text/javascript" src="/js/materialize.js"></script>
        <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
        <link rel="stylesheet" href="/css/mobile.css" />
        <link type="text/css" rel="stylesheet" href="/css/materialize.min.css"  media="screen,projection"/>
        <link type="text/css" rel="stylesheet" href="/js/lib/jquery-ui-1.11.3/jquery-ui.min.css"  media="screen,projection"/>
        <!--link rel="stylesheet" href="styles/d3.css" /-->
        <!--script type="text/javascript" src="/js/lib/hopscotch.min.js"></script-->
        <!-- <link type="text/css" rel="stylesheet" href="/css/hopscotch.min.css"  media="screen,projection"/> -->

        <?php
            if($logged_in) {
                echo "<script type=\"text/javascript\">\n";
                if(isset($_SERVER['HTTP_DNT']) && $_SERVER['HTTP_DNT'] == 1) {
                    echo "            useMixpanel = false;\n";
                } else {
                    echo "            mixpanel.identify(" . $_SESSION['user_id'] . ");\n";
                    echo "            useMixpanel = true;\n";
                }
                echo "            seasurf = '" . $_SESSION['csrf_token'] . "';\n";
                if($first_login) {
                    echo "            first_login = true;\n";
                } else {
                    echo "            first_login = false;\n";
                }
                echo "        </script>\n";
                echo "        <script type=\"text/javascript\" src=\"/js/api.js\"></script>\n";
                echo "        <script type=\"text/javascript\" src=\"/js/graph.js\"></script>\n";
                echo "        <script type=\"text/javascript\" src=\"/js/ui.m.js\"></script>\n";
                echo "        <script type=\"text/javascript\" src=\"/js/tour.js\"></script>\n";
            } 
        ?>
        <script type="text/javascript">
            $(document).ready(function() {
                $(".view").hide();
                $("#search_view").show();

                setTimeout(function() {
                    $("#add_button").off("click");
                    $("#search_button").off("click");
                    $("#connect_button").off("click");
                    $("#list_button").off("click");
                    $("#details_button").off("click");

                    // if this is changed update tour.js
                    // use a namespace (open) so we can remove this specific fn
                    $("#add_button").on('click.open', function() {
                        $(".view").hide();
                        $("#create_view").show();
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

                        $(".drag-target").trigger('click');
                    });

                    $("#search_button").on('click.open', function() {
                        $(".view").hide();
                        $("#search_view").show();
                        // $('ul.tabs').tabs();
                        if($("#search_location_tab").hasClass('active'))
                            Socialite.UI.refreshSearchMap();

                        $("#search_submit_button").off('click.submit');
                        $("#search_submit_button").on('click.submit', function() {
                            var visibleType = undefined;
                            if($("#search_person_tab").hasClass("active")) {
                                visibleType = "person";
                            } else if($("#search_event_tab").hasClass("active")) {
                                visibleType = "event";
                            } else if($("#search_location_tab").hasClass("active")) {
                                visibleType = "location";
                            } 

                            if(visibleType == undefined) {
                                return;
                            }

                            var formId = "#search_" + visibleType + "_form";
                            $(formId).submit();
                        });

                        $(".drag-target").trigger('click');
                    });

                    $("#connect_button").on('click.open', function() {
                        $(".view").hide();
                        $("#connect_view").show();
                        Socialite.Graph.Connect.resize();
                        Socialite.UI.checkConnectInterface();
                        $(".drag-target").trigger('click');
                    });

                    $("#list_button").click(function() {
                        $(".view").hide();
                        $("#list_view").show();
                        $(".drag-target").trigger('click');
                    });

                    $("#details_button").click(function() {
                        $(".view").hide();
                        $("#details_view").show();
                        $(".display_div").hide();
                        $("#display_person_div").show();
                        $(".drag-target").trigger('click');
                    });

                    $(".display_div").removeClass("card");
                    $(".display_form").removeClass("card");
                    $(".display_div").hide();
                    $("#display_person_div").show();
                }, 1000);
            });
        </script>
    </head>
    <body class="red">
        <?php if (!$logged_in) : ?>
            <p><span class="error">You are not authorized to access this page.</span> Please <a href="/login.php">login</a>.</p>
        <?php else : ?>
            <header class="white">
                <nav>
                    <a href="#" data-activates="nav-mobile" class="button-collapse" style="top:25%;"><i class="material-icons" id="menu_button">menu</i></a>
                    <div class="top-nav">
                        <div class="container">
                            <div class="nav-wrapper" id="title_container">
                                <a href="https://socialite.ooo" class="page-title">Socialite</a>
                            </div>
                        </div>
                    </div>
                </nav>
                <div class="nav-wrapper">
                    <ul id="nav-mobile" class="side-nav fixed" style="left: 0px;">
                        <li class="logo">
                            <a href="https://socialite.ooo" class="btn-flat"><img src="/icon/SocialiteLogoFill.svg" name="Socialite Logo" class="logo_img"></img></a>
                            <!-- Logo designed by @mlgs -->
                        </li>
                        <li class="bold">
                            <a id="add_button">Add</a>
                        </li>
                        <li class="bold" ondrop="Socialite.UI.searchDrop(event)" ondragover="Socialite.UI.allowDrop(event)">
                            <a id="search_button">Search</a>
                        </li>
                        <li class="bold" ondrop="Socialite.UI.connectDrop(event)" ondragover="Socialite.UI.allowDrop(event)">
                            <a id="connect_button">Connections</a>
                        </li>
                        <li class="bold">
                            <a id="list_button">List</a>
                        </li>
                        <li class="bold">
                            <a id="details_button">Details</a>
                        </li>
                        <li class="bold">
                            <a href="mailto:feedback@socialite.ooo">Contact</a>
                        </li>
                        <li class="bold">
                            <a id="signout_button" href="/logout.php">Sign Out</a>
                        </li>
                    </ul>
                </div>
            </header>
            <div id="page_container">
                <!-- node details -->
                <div id="details_view" class="row view h100">
                    <div class="col s12 center card_col container_div h100">
                        <div class="card h100 display_card">
                            <div class="row">
                                <h5>Details</h5>
                            </div>
                            <div class="row">
                                <div class="col s12">
                                    <ul id="display_tabs" class="tabs">
                                        <li class="tab col s3"><a href="#display_person_div" id="display_person_tab" class="active tab_link">Person</a></li>
                                        <li class="tab col s3"><a href="#display_event_div" id="display_event_tab" class="tab_link">Event</a></li>
                                        <li class="tab col s3"><a href="#display_location_div" id="display_location_tab" class="tab_link">Location</a></li>
                                    </ul>
                                </div>
                                <div id= "display_person_div" class="card display_div">
                                    
                                </div>
                                <div id= "display_event_div" class="card display_div">
                                    
                                </div>
                                <div id= "display_location_div" class="card display_div">
                                    
                                </div>
                            </div>
                        </div>
                    </div> 
                </div>
                <!-- node list -->
                <div id="list_view" class="row view">
                    <div class="col s12 center card_col h100">
                        <div id="list_person_div" class="card h100">
                            <ul id="node_list" class="collection list_collection h100">
                                <li class="collection-item title_row">
                                  <div><b>Listed Nodes</b></div>
                                </li>
                            </ul>
                            <div class="row list_footer">
                                <a id="list_clear_button" class="modal-action waves-effect waves-green btn-flat modal_left_button">Clear</a>
                            </div>
                        </div>
                    </div> 
                </div>
                <!-- node create -->
                <div id="create_view" class="row h100 view">
                    <div class="col s12 center card_col h100">
                        <div id="create_card" class="card h100">
                            <div class="row">
                                <h5>Create Node</h5>
                            </div>
                            <div class="row">
                                <div class="col s12">
                                    <ul class="tabs">
                                        <li class="tab col s3"><a href="#create_person_div" id="create_person_tab" class="active tab_link">Person</a></li>
                                        <li class="tab col s3"><a href="#create_event_div" id="create_event_tab" class="tab_link">Event</a></li>
                                        <li class="tab col s3"><a href="#create_location_div" id="create_location_tab" class="tab_link">Location</a></li>
                                    </ul>
                                </div>
                                <div id="create_person_div" class="col s12 create_div">

                                </div>
                                <div id="create_event_div" class="col s12 create_div">

                                </div>
                                <div id="create_location_div" class="col s12 create_div">

                                </div>
                            </div>
                            <div class="row create_footer">
                                <a id="create_clear_button" class="modal-action waves-effect waves-green btn-flat modal_left_button">Clear</a>
                                <button id="create_submit_button" class="modal-action modal-close waves-effect waves-green btn modal_right_button">Create</button>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- node search -->
                <div id="search_view" class="row h100 view">
                    <div class="col s12 center card_col h100">
                        <div id="search_card" class="card h100">
                            <div class="row">
                                <h5>Search Nodes</h5>
                            </div>
                            <div class="row">
                                <div class="col s12">
                                    <ul class="tabs view_tabs">
                                        <li class="tab col s3"><a href="#search_person_div" id="search_person_tab" class="active tab_link">Person</a></li>
                                        <li class="tab col s3"><a href="#search_event_div" id="search_event_tab" class="tab_link">Event</a></li>
                                        <li class="tab col s3"><a href="#search_location_div" id="search_location_tab" class="tab_link">Location</a></li>
                                    </ul>
                                </div>
                                <div id="search_person_div" class="col s12 search_div">

                                </div>
                                <div id="search_event_div" class="col s12 search_div">

                                </div>
                                <div id="search_location_div" class="col s12 search_div">

                                </div>
                            </div>
                            <div class="row search_footer">
                                <a id="search_clear_button" class="modal-action waves-effect waves-green btn-flat modal_left_button">Clear</a>
                                <button id="search_submit_button" class="modal-action modal-close waves-effect waves-green btn modal_right_button">Search</button>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- node connect -->
                <div id="connect_view" class="row h100 view">
                    <div class="col s12 center card_col h100">
                        <div id="connect_card" class="card h100">
                            <div class="row">
                                <h5>Mangage Connections</h5>
                            </div>
                            <div id="connect_div" class="row">
                               
                            </div>
                            <div id="connect_footer" class="row">
                                <a id="connect_clear_button" class="modal-action waves-effect waves-green btn-flat modal_left_button">Clear</a>
                                <button id="connect_submit_button" class="modal-action modal-close waves-effect waves-green btn modal_right_button">Connect</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        <?php endif; ?>
    </body>
</html>
