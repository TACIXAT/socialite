<?php
include_once '/var/www/php/include/db_connect.php';
include_once '/var/www/php/include/functions.php';
 
sec_session_start();
$logged_in = login_check($mysqli);
if (!$logged_in) {
    header('Location: /'); 
    exit();
}

?>
<!doctype html>
<html>
    <head>
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
        <script type="text/javascript" src="/js/materialize.min.js"></script>
        <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
        <link rel="stylesheet" href="/css/lifegraph.css" />
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
                echo "        </script>\n";
                echo "        <script type=\"text/javascript\" src=\"/js/api.js\"></script>\n";
                echo "        <script type=\"text/javascript\" src=\"/js/graph.js\"></script>\n";
                echo "        <script type=\"text/javascript\" src=\"/js/ui.js\"></script>\n";
                echo "        <script type=\"text/javascript\" src=\"/js/tour.js\"></script>\n";
            } 
        ?>
    </head>
    <body class="red">
        <?php if (!$logged_in) : ?>
            <p><span class="error">You are not authorized to access this page.</span> Please <a href="/secret.php">login</a>.</p>
        <?php else : ?>
            <header class="white">
                <nav>
                    <a href="#" data-activates="nav-mobile" class="button-collapse" style="top:25%;"><i class="mdi-navigation-menu"></i></a>
                    <div class="top-nav">
                        <div class="container">
                            <div class="nav-wrapper">
                                <a href="https://socialite.ooo" class="page-title">Socialite</a>
                            </div>
                        </div>
                    </div>
                </nav>
                <div class="nav-wrapper">
                    <ul id="nav-mobile" class="side-nav fixed" style="left: 0px;">
                        <li class="logo">
                            <a href="https://socialite.ooo" class="btn-flat"><img src="/icon/SocialiteLogoFill.svg" style="width:100%" name="Socialite Logo"></img></a>
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
                        <li class="no-padding">
                            <ul class="collapsible collapsible-accordion">
                                <li>
                                    <a class="collapsible-header menu_item">Legalities</a>
                                    <div class="collapsible-body">
                                        <ul>
                                            <li><a href="/legal/tos.txt" target="_blank">Terms of Service</a></li>
                                            <li><a href="/legal/privacy.txt" target="_blank">Privacy Policy</a></li>
                                        </ul>
                                    </div>
                                </li>
                            </ul>
                        </li>
                        <li class="bold">
                            <a id="signout_button" href="/logout.php">Sign Out</a>
                        </li>
                    </ul>
                </div>
            </header>
            <div id="page_container">
                <!--upper row-->
                <div id="upper_row" class="row">
                    <div class="col s4 center card_col">
                        <div id= "display_person_div" class="card upper_card">
                            
                        </div>
                    </div> 
                    <div class="col s4 center card_col">
                        <div id= "display_event_div" class="card upper_card">
                            
                        </div>
                    </div> 
                    <div class="col s4 center card_col">
                        <div id= "display_location_div" class="card upper_card">
                            
                        </div>
                    </div> 
                </div>
                <!--lower row-->
                <div id="lower_row" class="row">
                    <div class="col s4 center card_col">
                        <div id="list_person_div" class="card lower_card">
                            <ul id="person_list" class="collection list_collection">

                            </ul>
                        </div>
                    </div> 
                    <div class="col s4 center card_col">
                        <div id="list_event_div" class="card lower_card">
                            <ul id="event_list" class="collection list_collection">
                                
                            </ul>
                        </div>
                    </div> 
                    <div class="col s4 center card_col">
                        <div id="list_location_div" class="card lower_card">
                            <ul id="location_list" class="collection list_collection">

                            </ul>
                        </div>
                    </div> 
                </div>
            </div>
            <div id="add_modal" class="modal modal-fixed-footer">
                <div class="modal-content">
                    <div class="row">
                        <h4>Create Node</h4>
                    </div>
                    <div class="row">
                        <div class="col s12">
                            <ul class="tabs">
                                <li class="tab col s3"><a href="#create_person_div" id="create_person_tab" class="active">Person</a></li>
                                <li class="tab col s3"><a href="#create_event_div" id="create_event_tab">Event</a></li>
                                <li class="tab col s3"><a href="#create_location_div" id="create_location_tab">Location</a></li>
                            </ul>
                        </div>
                        <div id="create_person_div" class="col s12">
                        </div>
                        <div id="create_event_div" class="col s12">
                        </div>
                        <div id="create_location_div" class="col s12">
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <a id="create_clear_button" class="modal-action waves-effect waves-green btn-flat modal_left_button">Clear</a>
                    <button id="create_submit_button" class="modal-action modal-close waves-effect waves-green btn modal_right_button">Create</button>
                    <a id="create_cancel_button" class="modal-action modal-close waves-effect waves-green btn-flat modal_right_button">Cancel</a>
                </div>
            </div>
            <div id="search_modal" class="modal modal-fixed-footer">
                <div class="modal-content">
                    <div class="row">
                        <h4>Search Nodes</h4>
                    </div>
                    <div class="row">
                        <div class="col s12">
                            <ul class="tabs">
                                <li class="tab col s3"><a href="#search_person_div" id="search_person_tab" class="active">Person</a></li>
                                <li class="tab col s3"><a href="#search_event_div" id="search_event_tab">Event</a></li>
                                <li class="tab col s3"><a href="#search_location_div" id="search_location_tab">Location</a></li>
                            </ul>
                        </div>
                        <div id="search_person_div" class="col s12">
                        </div>
                        <div id="search_event_div" class="col s12">
                        </div>
                        <div id="search_location_div" class="col s12">
                        </div>
                    </div>
                    <div class="row" id="search_connected_to_div">
                        <ul id="connected_to_list" class="collection">
                            <li id="title_row" class="collection-item">
                              <div><b>Connected To</b></div>
                            </li>
                        </ul>
                    </div>
                </div>
                <div class="modal-footer">
                    <a id="search_clear_button" class="modal-action waves-effect waves-green btn-flat modal_left_button">Clear</a>
                    <button id="search_submit_button" class="modal-action modal-close waves-effect waves-green btn modal_right_button">Search</button>
                    <a id="search_cancel_button" class="modal-action modal-close waves-effect waves-green btn-flat modal_right_button">Cancel</a>
                </div>
            </div>
            <div id="connect_modal" class="modal modal-fixed-footer">
                <div class="modal-content">
                    <div class="row">
                        <h4>Mangage Connections</h4>
                    </div>
                    <div id="connect_div" class="row">
                       
                    </div>
                </div>
                <div class="modal-footer">
                    <a id="connect_clear_button" class="modal-action waves-effect waves-green btn-flat modal_left_button">Clear</a>
                    <button id="connect_submit_button" class="modal-action modal-close waves-effect waves-green btn modal_right_button">Connect</button>
                    <a id="connect_cancel_button" class="modal-action modal-close waves-effect waves-green btn-flat modal_right_button">Cancel</a>
                </div>
            </div>
            <div id="tour_card" class="card small">
                <div id="tour_content" class="card-content">
                    <span id="tour_title" class="card-title">Title</span>
                    Words words words!
                </div>
                <div id="tour_action" class="card-action">
                    <a class="waves-effect waves-green btn-flat modal_right_button">Next</a>
                </div>
            </div>


           

        <?php endif; ?>
    </body>
</html>
