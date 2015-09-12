<?php
include_once '/var/www/php/include/db_connect.php';
include_once '/var/www/php/include/functions.php';
 
sec_session_start();
?>
<!doctype html>
<html>
    <head>
        <meta charset="UTF-8">
        <title>Socialite.ooo</title>
        
        <!-- start Mixpanel -->
        <script type="text/javascript">
            (function(f,b){if(!b.__SV){var a,e,i,g;window.mixpanel=b;b._i=[];b.init=function(a,e,d){function f(b,h){var a=h.split(".");2==a.length&&(b=b[a[0]],h=a[1]);b[h]=function(){b.push([h].concat(Array.prototype.slice.call(arguments,0)))}}var c=b;"undefined"!==typeof d?c=b[d]=[]:d="mixpanel";c.people=c.people||[];c.toString=function(b){var a="mixpanel";"mixpanel"!==d&&(a+="."+d);b||(a+=" (stub)");return a};c.people.toString=function(){return c.toString(1)+".people (stub)"};i="disable track track_pageview track_links track_forms register register_once alias unregister identify name_tag set_config people.set people.set_once people.increment people.append people.track_charge people.clear_charges people.delete_user".split(" ");
            for(g=0;g<i.length;g++)f(c,i[g]);b._i.push([a,e,d])};b.__SV=1.2;a=f.createElement("script");a.type="text/javascript";a.async=!0;a.src="//cdn.mxpnl.com/libs/mixpanel-2-latest.min.js";e=f.getElementsByTagName("script")[0];e.parentNode.insertBefore(a,e)}})(document,window.mixpanel||[]);
            mixpanel.init("3cfcfcdc33cbc6693645f79e38e9a292");
        </script>
        <!-- end Mixpanel -->

        <link rel="apple-touch-icon" sizes="57x57" href="icon/favicon/apple-touch-icon-57x57.png">
        <link rel="apple-touch-icon" sizes="60x60" href="icon/favicon/apple-touch-icon-60x60.png">
        <link rel="apple-touch-icon" sizes="72x72" href="icon/favicon/apple-touch-icon-72x72.png">
        <link rel="apple-touch-icon" sizes="76x76" href="icon/favicon/apple-touch-icon-76x76.png">
        <link rel="apple-touch-icon" sizes="114x114" href="icon/favicon/apple-touch-icon-114x114.png">
        <link rel="apple-touch-icon" sizes="120x120" href="icon/favicon/apple-touch-icon-120x120.png">
        <link rel="apple-touch-icon" sizes="144x144" href="icon/favicon/apple-touch-icon-144x144.png">
        <link rel="apple-touch-icon" sizes="152x152" href="icon/favicon/apple-touch-icon-152x152.png">
        <link rel="apple-touch-icon" sizes="180x180" href="icon/favicon/apple-touch-icon-180x180.png">
        <link rel="icon" type="image/png" href="icon/favicon/favicon-32x32.png" sizes="32x32">
        <link rel="icon" type="image/png" href="icon/favicon/android-chrome-192x192.png" sizes="192x192">
        <link rel="icon" type="image/png" href="icon/favicon/favicon-96x96.png" sizes="96x96">
        <link rel="icon" type="image/png" href="icon/favicon/favicon-16x16.png" sizes="16x16">
        <link rel="manifest" href="icon/favicon/manifest.json">
        <link rel="shortcut icon" href="icon/favicon/favicon.ico">
        <meta name="msapplication-TileColor" content="#da532c">
        <meta name="msapplication-TileImage" content="icon/favicon/mstile-144x144.png">
        <meta name="msapplication-config" content="icon/favicon/browserconfig.xml">
        
        <!--script type="text/javascript" src="js/lifegraph.js"></script-->
        <!--link rel="stylesheet" href="styles/d3.css" /-->
        <script type="text/javascript" src="https://maps.googleapis.com/maps/api/js?key=AIzaSyD5Sh0t7Zp9DeZOfbOfE2-KBgEe9YUoryM"></script>
        <script type="text/javascript" src="js/lib/jquery-2.1.3.min.js"></script>
        <script type="text/javascript" src="js/lib/jquery.jsPlumb-1.7.3-min.js"></script>
        <script type="text/javascript" src="js/lib/jquery-ui-1.11.3/jquery-ui.min.js"></script>
        <script type="text/javascript" src="js/lib/d3.v3.min.js"></script>
        <script type="text/javascript" src="js/lib/underscore-min.js"></script>
        
        <script type="text/javascript" src="js/materialize.min.js"></script>
        <link rel="stylesheet" href="css/lifegraph.css" />
        <link type="text/css" rel="stylesheet" href="css/materialize.min.css"  media="screen,projection"/>

        <?php
            if(isset($_GET['apiKey'])) {
                echo "<script type=\"text/javascript\">\n";
                echo "            apiKey = '" . $_GET['apiKey'] . "';\n";
                echo "            mixpanel.identify(" . $_SESSION['user_id'] . ");\n";
                echo "        </script>\n";
                echo "        <script type=\"text/javascript\" src=\"js/api.js\"></script>\n";
                echo "        <script type=\"text/javascript\" src=\"js/ui.js\"></script>\n";
            } else {
                echo "        <script type=\"text/javascript\" alert(\"ERROR: NO API KEY!\");";
            }
        ?>
    </head>
    <body class="red">
        <?php
            if (isset($_GET['error'])) {
                echo '<p class="error">Error updating your API KEY!</p>';
                echo '<p class="error">' . $_GET['msg'] . '</p>';
            }
        ?>
        <?php if (login_check($mysqli) != true) : ?>
            <p><span class="error">You are not authorized to access this page.</span> Please <a href="index.php">login</a>.</p>
            <?php 
                header('Location: index.html'); 
                exit();
            ?>
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
                            <a href="https://socialite.ooo" class="btn-flat"><img src="icon/SocialiteLogoFill.svg" style="width:100%" name="Socialite Logo"></img></a>
                            <!-- Logo designed by @mlgs -->
                        </li>
                        <li class="bold">
                            <a id="add_button">Add</a>
                        </li>
                        <li class="bold">
                            <a id="search_button">Search</a>
                        </li>
                    </ul>
                </div>
            </header>
            <div id="page_container">
                <!--upper row-->
                <div id="upper_row" class="row">
                    <div class="col l4 s12 center card_col">
                        <div id= "person_display_div" class="card upper_card">
                            
                        </div>
                    </div> 
                    <div class="col l4 s0 center card_col">
                        <div id= "event_display_div" class="card upper_card">
                            
                        </div>
                    </div> 
                    <div class="col l4 s0 center card_col">
                        <div id= "location_display_div" class="card upper_card">
                            
                        </div>
                    </div> 
                </div>
                <!--lower row-->
                <div id="lower_row" class="row">
                    <div class="col l4 s12 center card_col">
                        <div id="person_list_div" class="card lower_card">
                            <ul id="person_list" class="collection">

                            </ul>
                        </div>
                    </div> 
                    <div class="col l4 s0 center card_col">
                        <div id="event_list_div" class="card lower_card">
                            <ul id="event_list" class="collection">
                                
                            </ul>
                        </div>
                    </div> 
                    <div class="col l4 s0 center card_col">
                        <div id="location_list_div" class="card lower_card">
                            <ul id="location_list" class="collection">

                            </ul>
                        </div>
                    </div> 
                </div>
            </div>
            <div id="add_modal" class="modal modal-fixed-footer">
                <div class="modal-content">
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
                    <a id="clear_button" class="modal-action waves-effect waves-green btn-flat modal_left_button">Clear</a>
                    <button id="create_submit_button" class="modal-action modal-close waves-effect waves-green btn modal_right_button">Create</button>
                    <a id="create_cancel_button" class="modal-action modal-close waves-effect waves-green btn-flat modal_right_button">Cancel</a>
                </div>
            </div>
            <div id="search_modal" class="modal modal-fixed-footer">
                <div class="modal-content">
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
                    <div class="row" id="connected_to_div">
                        <ul class="collapsible" data-collapsible="accordion">
                            <li>
                              <div class="collapsible-header">Connected To</div>
                              <div class="collapsible-body">CONNECTED NODES HERE</div>
                            </li>
                        </ul>
                    </div>
                </div>
                <div class="modal-footer">
                    <a id="search_clear_button" class="modal-action waves-effect waves-green btn-flat modal_left_button">Clear</a>
                    <button id="search_submit_button" class="modal-action modal-close waves-effect waves-green btn modal_right_button">Create</button>
                    <a id="search_cancel_button" class="modal-action modal-close waves-effect waves-green btn-flat modal_right_button">Cancel</a>
                </div>
            </div>










            <!--div id="all">
                <div id="header">
                    <p>Welcome <?php echo htmlentities($_SESSION['username']); ?>!</p>
                </div>
                <div id="content">
                    <div id="toprow">
                        <div class="upper">
                            <div class="button_row">
                                <button onclick="togglePersonForm('display');" class='person_button'>
                                    <span class='description_span'>DETAILS</span>
                                </button>
                                <button onclick="togglePersonForm('create');" class='create_button'>
                                    <span class='description_span'>CREATE</span>
                                </button>
                                <button onclick="togglePersonForm('search');" class='search_button'>
                                    <span class='description_span'>SEARCH</span>
                                </button>
                            </div>
                            <div class="form_row" ondrop="personDrop(event)" ondragover="allowDrop(event)">
                                <div id="search_person_div"></div>
                                <div id="create_person_div"></div>
                                <div id="person_display_div"></div>
                            </div>
                        </div>
                        <div class="upper">
                            <div class="button_row">
                                <button onclick="toggleEventForm('display');" class='event_button'>
                                    <span class='description_span'>DETAILS</span>
                                </button>
                                <button onclick="toggleEventForm('create');" class='create_button'>
                                    <span class='description_span'>CREATE</span>
                                </button>
                                <button onclick="toggleEventForm('search');" class='search_button'>
                                    <span class='description_span'>SEARCH</span>
                                </button>
                            </div>
                            <div class="form_row" ondrop="eventDrop(event)" ondragover="allowDrop(event)">
                                <div id="search_event_div"></div>
                                <div id="create_event_div"></div>
                                <div id="event_display_div"></div>
                            </div>
                        </div>
                        <div class="upper">
                            <div class="button_row">
                                <button onclick="toggleLocationForm('display');" class='location_button'>
                                    <span class='description_span'>DETAILS</span>
                                </button>
                                <button onclick="toggleLocationForm('create');" class='create_button'>
                                    <span class='description_span'>CREATE</span>
                                </button>
                                <button onclick="toggleLocationForm('search');" class='search_button'>
                                    <span class='description_span'>SEARCH</span>
                                </button>
                            </div>
                            <div class="form_row" ondrop="locationDrop(event)" ondragover="allowDrop(event)">
                                <div id="search_location_div"></div>
                                <div id="create_location_div"></div>
                                <div id="location_display_div"></div>
                            </div>
                        </div>
                    </div>
                    
                    <div id="bottomrow">
                        <div class="lower">
                            <ul id="person_list">
                            </ul>
                        </div>
                        <div class="lower">
                            <ul id="event_list">
                            </ul>
                        </div>
                        <div class="lower">
                            <ul id="location_list">
                            </ul>
                        </div>
                    </div>
                </div>
                <div id="footer">
                    <p><a href="logout.php">Logout</a></p>
                </div>
            </div-->

        <?php endif; ?>
    </body>
</html>
