<?php
include_once '/var/www/php/include/db_connect.php';
include_once '/var/www/php/include/functions.php';
include_once '/var/www/php/include/composer/include.php';

use SparkPost\SparkPost;
use SparkPost\Transmission;

if (is_ajax()) {
    confirm($mysqli);
}

function confirm($mysqli) {
    if (isset($_POST["code"])) {
        $confirmation_code = $_POST["code"];
 
        $query = "SELECT user_id FROM confirmations WHERE confirmation_code = ?";
        $stmt = $mysqli->prepare($query);
        if(!$stmt) {
            http_response_code(500);
            die('{"status":"error", "msg":"Error creating statement one in confirm."}');
        }
        
        $stmt->bind_param('s', $confirmation_code);
        if(!$stmt->execute()) {
            http_response_code(500);
            die('{"status":"error", "msg":"Error executing statement one in confirm."}');
        }
        
        $stmt->store_result();
        if($stmt->num_rows != 1) {
            http_response_code(400);
            die('{"status":"error", "msg":"Problem with code."}');
        }     

        $stmt->bind_result($user_id);
        $stmt->fetch();
        $stmt->close();   

        $query = "UPDATE members SET confirmed = TRUE WHERE id = ?";
        $stmt = $mysqli->prepare($query);
        if(!$stmt) {
            http_response_code(500);
            die('{"status":"error", "msg":"Error creating statement two in confirm."}');
        }

        $stmt->bind_param('i', $user_id);
        if(!$stmt->execute()) {
            http_response_code(500);
            die('{"status":"error", "msg":"Error executing statement two in confirm."}');
        }
        $stmt->close();
        

        die('{"status":"success", "msg":"Account confirmed!"}');
    } else {
        http_response_code(400);
        die('{"status":"error", "msg":"Missing required fields."}');
    }
}

?>

<!DOCTYPE html>
<html>
    <head>
        <meta charset="UTF-8">
        
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
                echo "            mixpanel.track('Confirmed Account');\n";
            } else {
                echo "<script type=\"text/javascript\">\n";
                echo "            useMixpanel = false;\n";
            }
            echo "        </script>\n";
        ?>
        <script type="text/JavaScript">
            $(document).ready(function(){
<?php
if(isset($_GET["code"]) && ctype_alnum($_GET["code"])) {
    echo "                $('#confirmation_code').val('" . $_GET["code"] . "');\n";
    echo "                $('#confirmation_code').siblings().addClass('active');\n";
}
?>
            });

            // add confirm function
            // ajax request to self
            function confirm(confirmation) {
                var data = {"code": confirmation.value};
                console.log(data);
                console.log($.param(data));
                $.ajax({
                    'type': 'POST',
                    'url': '/api/confirm.php',
                    'data': $.param(data),
                    'success': confirmSuccess,
                    'error': confirmError }); 
                return false;
            }

            function confirmSuccess(data, status, xhr) {
                var response = $.parseJSON(data);
                if(response['status'] != 'success') {
                     Materialize.toast('An error occured! Please contact us directly!', 3000);
                } else {
                    window.location.href = "/login.php?confirmed=true";
                }
            }

            function confirmError(xhr, status, error) {
                var error = $.parseJSON(xhr.responseText);
                if(error['status'] != 'error') {
                    Materialize.toast('An error occured! Please contact us directly!', 3000);
                } else {
                    Materialize.toast(error['msg'], 3000);
                }
            }
        </script>
        <style>
            body {
                height: 100vh;
            }
            #container {
                height: 100%;
                width: 100%;
            }
            #row {
                padding-top: 10%;
            }
            .content_div {
                padding: 20px !important;
            }
            .right_btn {
                float: right;
            }
        </style>
    </head>
    <body class="red">
        <div class="container">
            <div id="row" class="row s12">
                <div class="col white l6 offset-l3 s12">
                    <div id="card" class="card white s12">
                        <div>
                            <div id='confirmDiv' class="content_div col s12">
                                <form name="reset_form">
                                    <div class="input-field">
                                        <input type="text" name="confirmation" id="confirmation_code" />
                                        <label for="confirmation_code">Confirmation Code</label>
                                    </div>
                                    <input type="button" class="btn right_btn" value="Confirm" onclick="return confirm(this.form.confirmation);" /> 
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </body>
</html>


