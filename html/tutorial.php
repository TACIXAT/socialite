<!DOCTYPE html>
<html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta property="og:title" content="Socialite User Guide" />
        <meta property="og:url" content="https://socialite.ooo/tutorial.php" />
        <meta property="og:image" content="https://socialite.ooo/icon/socialitefb.png" />
        <meta property="og:description" content="A quick overview Socialite's functionality." />

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

        <link type="text/css" rel="stylesheet" href="/css/materialize.min.css"  media="screen,projection"/>
        <script type="text/javascript" src="/js/lib/jquery-2.1.3.min.js"></script>
        <script type="text/javascript" src="/js/materialize.min.js"></script>
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
                echo "            mixpanel.track('Viewed Tutorial');\n";
            } else {
                echo "<script type=\"text/javascript\">\n";
                echo "            useMixpanel = false;\n";
            }
            echo "        </script>\n";
        ?>
        <style>
            .insns {
                margin-top: 60px;
            }
        </style>
    </head>
    <body class="red">
        <div class="container">
            <div id="row" class="row s12">
                <div class="col s12 m8 offset-m2 white-text center">
                    <h1>User Guide</h1>
<?php
if(isset($_GET["registered"])) {
    echo "                    <h5>We're sending you an email to confirm your account! In the meantime learn about Socialite so you can get started right away!</h5>";
} else {
    echo "                    <h5>Learn about Socialite's features so you can get started right away!</h5>";
}
?>
                    <div class="insns">
                        <h5>Get started by clicking Add in the sidebar to create a person, event, or location.</h5>
                    </div>
                    <div class="card">
                        <div class="card-content center">
                            <span class="card-title grey-text text-darken-2">Create Nodes</span>
                            <img itemprop="screenshot" class="z-depth-2 responsive-img materialboxed" src="/img/screens/tutorial/create.png">
                        </div>
                    </div>

                    <div class="insns">
                        <h5>Nodes (people, events, and locations) that you create or search for are displayed in the lists on the main page. Clicking the nodes in the list displays their info above.</h5>
                    </div>
                    <div class="card">
                        <div class="card-content center">
                            <span class="card-title grey-text text-darken-2">View Nodes</span>
                            <img itemprop="screenshot" class="z-depth-2 responsive-img materialboxed" src="/img/screens/tutorial/view.png">
                        </div>
                    </div>

                    <div class="insns">
                        <h5>Once you create nodes you must connect them. You do this by clicking Connect on the node in the list. Clicking Connect adds them to the connection interface.</h5>
                    </div>
                    <div class="card">
                        <div class="card-content center">
                            <span class="card-title grey-text text-darken-2">Connect Nodes</span>
                            <img itemprop="screenshot" class="z-depth-2 responsive-img materialboxed" src="/img/screens/tutorial/view_all.png">
                        </div>
                    </div>

                    <div class="insns">
                        <h5>You open the connection interface by then clicking Connect in the side menu. Clicking the CONNECT button will add links between the nodes. </h5>
                    </div>
                    <div class="card">
                        <div class="card-content center">
                            <span class="card-title grey-text text-darken-2">Connect Nodes</span>
                            <img itemprop="screenshot" class="z-depth-2 responsive-img materialboxed" src="/img/screens/tutorial/connect.png">
                        </div>
                    </div>

                    <div class="insns">
                        <h5>If all nodes added to the connection interface are linked, you then have the option to disconnect them.</h5>
                    </div>
                    <div class="card">
                        <div class="card-content center">
                            <span class="card-title grey-text text-darken-2">Connect Nodes</span>
                            <img itemprop="screenshot" class="z-depth-2 responsive-img materialboxed" src="/img/screens/tutorial/connected.png">
                        </div>
                    </div>

                    <div class="insns">
                        <h5>Once connected, clicking one node will highlight its neighbors. Double clicking a node will search for and list its neighbors.</h5>
                    </div>
                    <div class="card">
                        <div class="card-content center">
                            <span class="card-title grey-text text-darken-2">View Nodes</span>
                            <img itemprop="screenshot" class="z-depth-2 responsive-img materialboxed" src="/img/screens/tutorial/view_final.png">
                        </div>
                    </div>

                    <div class="insns">
                        <h5>Thanks for taking the time to learn about Socialite! Reach out to dgoddard@socialite.ooo if anything is unclear!</h5>
                    </div>
                </div>
            </div>
        </div>
    </body>
</html>