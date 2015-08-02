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
        
        <!--script type="text/javascript" src="js/graph.js"></script-->
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
                            <a href="https://socialite.ooo" class="btn-flat"><img src="icon/SocialiteLogoFill.svg" style="width:100%" name="Socialite"></img></a>
                            <!-- Logo designed by @mlgs -->
                        </li>
                        <li class="bold">
                            <a id="signup_button">Sign Up</a>
                        </li>
                        <li class="bold">
                            <a id="about_button">About</a>
                        </li>
                    </ul>
                </div>
            </header>
            <div id="page_container">
                <!--upper row-->
                <div id="upper_row" class="row">
                    <div class="col l4 s12 center card_col">
                        <div id= "#person_display_div" class="card upper_card">
                            
                        </div>
                    </div> 
                    <div class="col l4 s0 center card_col">
                        <div id= "#event_display_div" class="card upper_card">
                            
                        </div>
                    </div> 
                    <div class="col l4 s0 center card_col">
                        <div id= "#location_display_div" class="card upper_card">
                            
                        </div>
                    </div> 
                </div>
                <!--lower row-->
                <div id="lower_row" class="row">
                    <div class="col l4 s12 center card_col">
                        <div id="person_list_div" class="card lower_card">
                            
                        </div>
                    </div> 
                    <div class="col l4 s0 center card_col">
                        <div id="event_list_div" class="card lower_card">
                            
                        </div>
                    </div> 
                    <div class="col l4 s0 center card_col">
                        <div id="location_list_div" class="card lower_card">
                            
                        </div>
                    </div> 
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
                                <div id="person_search_div"></div>
                                <div id="person_create_div"></div>
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
                                <div id="event_search_div"></div>
                                <div id="event_create_div"></div>
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
                                <div id="location_search_div"></div>
                                <div id="location_create_div"></div>
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
