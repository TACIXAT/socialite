<?php
    include_once '/var/www/php/include/db_connect.php';
    include_once '/var/www/php/include/functions.php';
    include_once '/var/www/php/include/register.inc.php';

    sec_session_start();
     
    if (login_check($mysqli) == true) {
        $logged = 'in';
        // redirect
        $useragent=$_SERVER['HTTP_USER_AGENT'];
        if(preg_match('/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i',$useragent)||preg_match('/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i',substr($useragent,0,4)))
            header('Location: https://socialite.ooo/mobile.php');
        else
            header('Location: lifegraph.php');
    } 
?>

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
        <script type="text/JavaScript" src="/js/sha512.js"></script> 
        <script type="text/JavaScript" src="/js/forms.js"></script> 
        <script type="text/JavaScript" src="/js/reset.js"></script> 
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
                echo "            mixpanel.track('Visited Login');\n";
            } else {
                echo "<script type=\"text/javascript\">\n";
                echo "            useMixpanel = false;\n";
            }
                echo "        </script>\n";
        ?>
        <script type="text/JavaScript">
            $(document).ready(function(){
<?php
if(isset($_GET["invite"]) && ctype_alnum($_GET["invite"])) {
    echo "                $('ul.tabs').tabs('select_tab', 'registrationDiv');\n";
    printf("                $('#registration_invite').val('%s');\n", $_GET["invite"]);
    echo "                $('#registration_invite').siblings().addClass('active');\n";
} else {
    echo "                $('ul.tabs').tabs();\n";
}
if(isset($_GET["confirmed"])) {
    echo "                Materialize.toast('Account confirmed! You may now log in!', 5000);\n";
}
?>
                regClick = false;
                $("#regTabLink").click(function() {
                    if(!regClick)
                        Materialize.toast('No invite? Signup for the waiting list at https://socialite.ooo', 6000);
                    regClick = true;
                });
            });
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
            #login_tabs {
                overflow: hidden;
            }
        </style>
    </head>
    <body class="red">
        <div class="container">
            <div id="row" class="row s12">
                <div class="col white l6 offset-l3 s12">
                    <div id="card" class="card white s12">
                        <div>
                            <div class="col s12">
                                <ul id="login_tabs" class="tabs">
                                    <li class="tab col l6"><a class="active" href="#loginDiv">Login</a></li>
                                    <li class="tab col l6"><a id="regTabLink" href="#registrationDiv">Register</a></li>
                                    <li class="tab col l6"><a href="#resetDiv">Reset</a></li>
                                </ul>
                            </div>
                            <div id='loginDiv' class="content_div col s12">
                                <form action="process_login.php" method="post" name="login_form" onKeyPress="return checkSubmit(this, event)">
                                    <div class="input-field">
                                        <input type="text" name="email" id="login_email"/>
                                        <label for="login_email">Email</label>
                                    </div>
                                    <div class="input-field">
                                        <input type="password" name="password" id="login_password"/>
                                        <label for="login_password">Password</label>
                                    </div>
                                    <input type="button" class="btn right_btn" value="Login" onclick="formhash(this.form, this.form.password);" /> 
                                </form>
                            </div>
                            <div id='registrationDiv' class="content_div col s12">
                                <form action="<?php echo esc_url($_SERVER['PHP_SELF']); ?>" method="post" name="registration_form">
                                    <div class="input-field">
                                        <input type='text' name='username' id='registration_username' />
                                        <label for="registration_username">Username</label>
                                    </div>
                                    <div class="input-field">
                                        <input type="text" name="email" id="registration_email" />
                                        <label for="registration_email">Email</label>
                                    </div>
                                    <div class="input-field">
                                        <input type="password" name="password" id="registration_password"/>
                                        <label for="registration_password">Password</label>
                                    </div>
                                    <div class="input-field">
                                        <input type="password" name="confirmpwd"  id="registration_confirmpwd" />
                                        <label for="registration_confirmpwd">Confirm</label>
                                    </div>
                                    <div class="input-field">
                                        <input type='text' name='invite' id='registration_invite' />
                                        <label for="registration_invite">Invite</label>
                                    </div>
                                    <input type="button" class="btn right_btn" value="Register" onclick="return regformhash(this.form, this.form.username, this.form.email, this.form.password, this.form.confirmpwd, this.form.invite);" /> 
                                </form>
                            </div>
                            <div id='resetDiv' class="content_div col s12">
                                <form action="reset.php" method="post" name="reset_form">
                                    <div class="input-field">
                                        <input type='text' name='username' id='reset_username' />
                                        <label for="reset_username">Username</label>
                                    </div>
                                    <div class="input-field">
                                        <input type="text" name="email" id="reset_email" />
                                        <label for="reset_email">Email</label>
                                    </div>
                                    <input type="button" class="btn right_btn" value="Reset" onclick="requestReset(this.form, this.form.username, this.form.email);" /> 
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </body>
</html>
