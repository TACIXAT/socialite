<!DOCTYPE html>
<html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        
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
        <script type="text/JavaScript">
            $(document).ready(function(){
<?php
if(isset($_GET["registered"])) {
    echo "                Materialize.toast('Read through this tutorial, then check your email to confirm your account and login!', 5000);\n";
}
?>
            });
        </script>
        <style>
            .insns {
                margin-top: 60px;
            }
        </style>
    </head>
    <body class="red">
        <div class="container">
            <div id="row" class="row s12">
                <div class="col s8 offset-s2 white-text center">
                    <h1>User Guide</h1>
                    <h5>Learn the features so you can get started right away using Socialite!</h5>
                    <div class="insns">
                        <h5>Get started by clicking Add in the sidebar to create a new node.</h5>
                    </div>
                    <div class="card">
                        <div class="card-content center">
                            <span class="card-title grey-text text-darken-2">Create Nodes</span>
                            <img itemprop="screenshot" class="z-depth-2 responsive-img materialboxed" src="/img/screens/tutorial/create.png">
                        </div>
                    </div>

                    <div class="insns">
                        <h5>Nodes that you create or search for are displayed in the lists on the main page. Clicking the nodes in the list displays their info above.</h5>
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
                        <h5>You open the connection interface by then clicking Connect in the side menu.</h5>
                    </div>
                    <div class="card">
                        <div class="card-content center">
                            <span class="card-title grey-text text-darken-2">Connect Nodes</span>
                            <img itemprop="screenshot" class="z-depth-2 responsive-img materialboxed" src="/img/screens/tutorial/connect.png">
                        </div>
                    </div>

                    <div class="insns">
                        <h5>Clicking the CONNECT button in the lower right of the connection interface will add links between the nodes. If all nodes added to the connection interface are linked, you then have the option to disconnect them.</h5>
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
                </div>
            </div>
        </div>
    </body>
</html>