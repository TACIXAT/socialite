<html>
    <head>
        <title>Socialite</title>
        <meta name="description" content="Keep notes about the social events in your life, who you saw, when and where you saw them. Search your data. Pivot from a location to an event, then from an event to a person, or in the opposite direction. Leverage these notes to be a better friend and forge stronger business relationships.">
        <META NAME="ROBOTS" CONTENT="INDEX, FOLLOW">
        <meta property="og:title" content="Socialite" />
        <meta property="og:url" content="https://socialite.ooo" />
        <meta property="og:image" content="https://socialite.ooo/icon/socialitefb.png" />
        <meta property="og:description" content="Keep notes about the social events in your life, who you saw, when and where you saw them. Leverage these notes to be a better friend and to forge stronger business relationships." />
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
        <meta name="theme-color" content="#ffffff">
        <?php
            if(!isset($_SERVER['HTTP_DNT']) || $_SERVER['HTTP_DNT'] != 1) {
                echo "<!-- start Mixpanel -->\n";
                echo "        <script type=\"text/javascript\">\n";
                echo "            (function(f,b){if(!b.__SV){var a,e,i,g;window.mixpanel=b;b._i=[];b.init=function(a,e,d){function f(b,h){var a=h.split(\".\");2==a.length&&(b=b[a[0]],h=a[1]);b[h]=function(){b.push([h].concat(Array.prototype.slice.call(arguments,0)))}}var c=b;\"undefined\"!==typeof d?c=b[d]=[]:d=\"mixpanel\";c.people=c.people||[];c.toString=function(b){var a=\"mixpanel\";\"mixpanel\"!==d&&(a+=\".\"+d);b||(a+=\" (stub)\");return a};c.people.toString=function(){return c.toString(1)+\".people (stub)\"};i=\"disable track track_pageview track_links track_forms register register_once alias unregister identify name_tag set_config people.set people.set_once people.increment people.append people.track_charge people.clear_charges people.delete_user\".split(\" \");\n";
                echo "            for(g=0;g<i.length;g++)f(c,i[g]);b._i.push([a,e,d])};b.__SV=1.2;a=f.createElement(\"script\");a.type=\"text/javascript\";a.async=!0;a.src=\"//cdn.mxpnl.com/libs/mixpanel-2-latest.min.js\";e=f.getElementsByTagName(\"script\")[0];e.parentNode.insertBefore(a,e)}})(document,window.mixpanel||[]);\n";
                echo "            mixpanel.init(\"3cfcfcdc33cbc6693645f79e38e9a292\");\n";
                echo "        </script>\n";
                echo "        <!-- end Mixpanel -->\n";
                echo "        <script type=\"text/javascript\">\n";
                echo "            useMixpanel = true;\n";
                echo "            mixpanel.track('Visited Home');\n";
            } else {
                echo "<script type=\"text/javascript\">\n";
                echo "            useMixpanel = false;\n";
            }
                echo "        </script>\n";
        ?>

        <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
        <link type="text/css" rel="stylesheet" href="/css/materialize.min.css"  media="screen,projection"/>
        <!-- Optimized for mobile-->
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"/>
        <script type="text/javascript" src="/js/lib/jquery-2.1.3.min.js"></script>
        <script type="text/javascript" src="/js/materialize.min.js"></script>
        <style>
            body {
                color: #1d1d1d;
                letter-spacing: 1px;
            }

            p {
                letter-spacing: 1px;
            }

            .logo:hover {
                background-color:#fff !important;
            }

            .logo {
                height: 310px;
                margin-bottom: 0px;
                border-bottom: 1px solid #ddd;
            }

            .waiting_list_div {
                background-color: #fdf9db;
                padding: 10px;
            }
            
            .page-title {
                font-size: 48px;
                line-height: 128px;
            }

            nav {
                height: 128px;
            }

            @media screen and (min-width: 993px) {
                #title_container {
                    position: absolute;
                    left: 280px;
                }
            }

            .logo_img {
                width: 100%;
            }

            @media screen and (max-height: 768px) {
                .logo_img {
                    width: 80%;
                    margin-left:18%;
                }

                .logo {
                    height: 245px;
                    margin-bottom: 0px;
                    border-bottom: 1px solid #ddd;
                }
            }

            @media screen and (max-height: 768px) and (min-width: 1200px) {
                .container {
                    width: 85%;
                }
            }

            #nav-mobile a:hover {
                cursor:pointer;
            }

            .hidden {
                display: none;
            }

            .menu_item {
                font-size: 1rem !important;
                height: 64px !important;
                line-height: 64px !important;
            }

            .icon-top-pad {
                padding-top:15%;
            }
        </style>
        <script type='text/javascript'>
            function signupSuccess(data, status, xhr) {
                if(useMixpanel)
                    mixpanel.track('Signup Success');
                Materialize.toast('Success signing up!', 3000);
                $('#waiting_list_input').val('');
                $('#waiting_list_input_2').val('');
            }

            function genericError(xhr, status, error) {
                console.log(xhr);
                var error = $.parseJSON(xhr.responseText);
                if(error['status'] != 'error') {
                    Materialize.toast('An error occured! Please contact us directly!', 3000);
                } else {
                    Materialize.toast(error['msg'], 3000);
                }
            }

            $(document).ready(function() {
                $(".button-collapse").sideNav();
                $("#waiting_list_button").click(function() {
                    if(useMixpanel)
                        mixpanel.track('Waitlist Signup');
                    var email = $('#waiting_list_input').val();
                    if(email == undefined || email == "")
                        return false;
                    console.log(email);
                    var data = {"email": email, "action":"add"};
                    $.ajax({
                        'type': 'POST',
                        'url': '/api/waitlist.php',
                        'data': $.param(data),
                        'success': signupSuccess,
                        'error': genericError });
                });

                $("#waiting_list_button_2").click(function() {
                    if(useMixpanel)
                        mixpanel.track('Waitlist Signup 2');
                    var email = $('#waiting_list_input_2').val();
                    if(email == undefined || email == "")
                        return false;
                    console.log(email);
                    var data = {"email": email, "action":"add"};
                    $.ajax({
                        'type': 'POST',
                        'url': '/api/waitlist.php',
                        'data': $.param(data),
                        'success': signupSuccess,
                        'error': genericError });
                });

                $("#signup_button").click(function() {
                    $("html, body").animate({scrollTop:$("#waiting_list_div").offset().top-20}, 'slow');
                     if(useMixpanel) 
                        mixpanel.track('Menu Signup');
                });
                $("#about_button").click(function() {
                    $("html, body").animate({scrollTop:$("#about_div").offset().top}, 'slow'); 
                    if(useMixpanel) 
                        mixpanel.track('Menu About');
                });
                $("#features_button").click(function() {
                    $("html, body").animate({scrollTop:$("#features_div").offset().top}, 'slow'); 
                    if(useMixpanel) 
                        mixpanel.track('Menu Features');
                }); 
                $("#pricing_button").click(function() {
                    $("html, body").animate({scrollTop:$("#pricing_div").offset().top}, 'slow'); 
                    if(useMixpanel) 
                        mixpanel.track('Menu Pricing');
                });
                $("#contact_button").click(function() {
                    $("html, body").animate({scrollTop:$("#contact_div").offset().top}, 'slow'); 
                    if(useMixpanel) 
                        mixpanel.track('Menu Contact');
                });
                
                $("#email_link").attr("href", "mailto:feedback@socialite.ooo"); 
                $("#email_link").text("feedback@socialite.ooo");
                
                var vframew = $("#video_iframe").width();
                var vcardw = $("#video_card").width();
                $("#video_iframe").width(vcardw);
                var vframeh = (vcardw / 16) * 9;
                $("#video_iframe").height(vframeh);

                $('.materialboxed').materialbox();
            });    
        </script>
    </head>
    <body class="red" itemscope itemtype="http://schema.org/SoftwareApplication">
        <header class="white">
            <nav>
                <a href="#" data-activates="nav-mobile" class="button-collapse" style="top:25%;"><i class="material-icons">menu</i></a>
                <div class="top-nav">
                    <div class="container">
                        <div class="nav-wrapper" id="title_container">
                            <a href="https://socialite.ooo" class="page-title" id="page_title" itemprop="name">Socialite</a>
                            <link itemprop="applicationCategory" href="http://schema.org/WebApplication"/>
                        </div>
                    </div>
                </div>
            </nav>
            <div class="nav-wrapper">
                <ul id="nav-mobile" class="side-nav fixed" style="left: 0px;">
                    <li class="logo">
                        <a href="https://socialite.ooo" class="btn-flat"><img itemprop="image" src="/icon/SocialiteLogoFill.svg" class="logo_img" name="Socialite"></img></a>
                        <!-- Logo designed by @mlgs -->
                    </li>
                    <li class="bold">
                        <a id="login_button" href="/login.php">Login</a>
                    </li>
                    <li class="bold">
                        <a id="signup_button">Sign Up</a>
                    </li>
                    <li class="bold">
                        <a id="about_button">About</a>
                    </li>
                    <li class="bold">
                        <a id="features_button">Features</a>
                    </li>
                    <li class="bold">
                        <a id="pricing_button">Pricing</a>
                    </li>
                    <li class="bold">
                        <a id="contact_button">Contact</a>
                    </li>
                </ul>
            </div>
        </header>
        <div class="container">
            <!--div class="row white-text">
                <div class="col l12 s12 center">
                    <h1>Socialite</h1>
                </div>
            </div-->

            <div class="row white-text">
                <div class="col l2 offset-l3 s4 center">
                    <i class="large material-icons icon-top-pad">person</i>
                    <br />
                    People
                </div> 
                <div class="col l2 s4 center">
                    <i class="large material-icons icon-top-pad">schedule</i>
                    <br />
                    Events
                </div> 
                <div class="col l2 s4 center">
                    <i class="large material-icons icon-top-pad">place</i>
                    <br />
                    Locations
                </div> 
            </div>
            <div class="row white-text">
                <div class="col l6 offset-l3 s12 center">
                    <h4>Personal Relationship Management</h4>
                </div>
            </div>
            <div class="row">
                <div class="col l6 offset-l3 s12">
                    <div id="waiting_list_div" class="card waiting_list_div">
                        <div class="card-content">
                            <span class="card-title black-text">Waiting List Signup</span>
                            <div class="input-field">
                                <input type="email" id="waiting_list_input"/>
                                <label for="waiting_list_input">Email Address</label>
                            </div>
                            <button id="waiting_list_button" class="btn waves-effect waves-light right">
                                Submit
                                <i class="material-icons right">send</i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div id="about_div" class="row white-text">
                <div class="col l8 offset-l2 s12 flow-text">
                    <h4>About</h4>
                    <div itemprop="description">
                        Keep notes about the social events in your life, who you saw, when and where you saw them.
                        Search your data. Pivot from a location to an event, then from an event to a person, or in the opposite direction.
                        Leverage these notes to be a better friend and forge stronger business relationships. Sign up today and we'll let you know
                        as soon as you can start managing the data in your life.
                    </div>
                    <div class="row">
                        <div class="col offset-l1 l10 s12">
                            <div class="card">
                                <div id="video_card" class="card-content center">
                                    <iframe id="video_iframe" height="400" width="630" frameborder="0" src="https://www.youtube.com/embed/vN9XxMInOnA?rel=0&showinfo=0"></iframe>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div id="features_div" class="row white-text">
                <div class="col l8 offset-l2 s12 flow-text">
                    <h4>Features</h4>
                    <div class="row">
                        <div class="col offset-l1 l10 s12">
                            <div class="card">
                                <div class="card-content center">
                                    <span class="screen_shot_title card-title grey-text text-darken-2">Pivot quickly between nodes to recall information.</span>
                                    <img itemprop="screenshot" class="z-depth-2 responsive-img materialboxed" src="/img/screens/view.png" onclick="if(useMixpanel) mixpanel.track('Screenshot Clicked (view)');">
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col offset-l1 l10 s12">
                            <div class="card">
                                <div class="card-content center">
                                    <span class="screen_shot_title card-title grey-text text-darken-2">Geo-search over an area to find a location.</span>
                                    <img itemprop="screenshot" class="responsive-img materialboxed" src="/img/screens/geo.png" onclick="if(useMixpanel) mixpanel.track('Screenshot Clicked (geo)');">
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col offset-l1 l10 s12">
                            <div class="card">
                                <div class="card-content center">
                                    <span class="screen_shot_title card-title grey-text text-darken-2">Link nodes together with the connection interface.</span>
                                    <img itemprop="screenshot" class="responsive-img materialboxed" src="/img/screens/connect.png" onclick="if(useMixpanel) mixpanel.track('Screenshot Clicked (connect)');">
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div id="pricing_div" class="row white-text">
                <div class="col l8 offset-l2 s12 flow-text">
                    <h4>Pricing</h4>
                    <div itemprop="offers" itemscope itemtype="http://schema.org/Offer">
                        Socialite is a paid application. We made this choice in 
                        order to give you peace of mind. With no advertisers 
                        involved, you won't have to worry about who is getting their 
                        hands on your information. Pricing will be targeted at $<span itemprop="price">10</span>/year. 
                        Don't worry though, we won't charge you until you're making use 
                        of the application.
                        <meta itemprop="priceCurrency" content="USD" />
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col l6 offset-l3 s12">
                    <div id="waiting_list_div" class="card waiting_list_div">
                        <div class="card-content">
                            <span class="card-title black-text">Waiting List Signup</span>
                            <div class="input-field">
                                <input type="email" id="waiting_list_input_2"/>
                                <label for="waiting_list_input_2">Email Address</label>
                            </div>
                            <button id="waiting_list_button_2" class="btn waves-effect waves-light right">
                                Submit
                                <i class="material-icons right">send</i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div id="contact_div" class="row white-text">
                <div class="col l8 offset-l2 s12 flow-text">
                    <h4>Contact</h4>
                    We love customer feedback. If you have any questions or comments
                    feel free to reach out to 
                    <a id="email_link" style="color: #fff">feedback [at] socialite [dot] ooo</a>.
                </div>
            </div>
        </div>
    </body>
</html>
