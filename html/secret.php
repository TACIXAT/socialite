<?php
    include_once '/var/www/php/include/db_connect.php';
    include_once '/var/www/php/include/functions.php';
    include_once '/var/www/php/include/register.inc.php';

    sec_session_start();
     
    if (login_check($mysqli) == true) {
        $logged = 'in';
        // redirect
        header('Location: lifegraph.php');
    } 
?>

<!DOCTYPE html>
<html>
    <head>
        <meta charset="UTF-8">
        
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

        <link type="text/css" rel="stylesheet" href="css/materialize.min.css"  media="screen,projection"/>
        <script type="text/javascript" src="js/lib/jquery-2.1.3.min.js"></script>
        <script type="text/javascript" src="js/materialize.min.js"></script>
        <script type="text/JavaScript" src="js/sha512.js"></script> 
        <script type="text/JavaScript" src="js/forms.js"></script> 
        <script type="text/JavaScript" src="js/reset.js"></script> 
        <script type="text/JavaScript">
            $(document).ready(function(){
                $('ul.tabs').tabs();
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
                height: 70%;
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
        <?php
            if (!empty($error_msg)) {
                echo $error_msg;
            }
        ?>
        <?php
            if (isset($_GET['error'])) {
                echo '<p class="error">Error Logging In!</p>';
            }
        ?> 
        <div id="container" class="valign-wrapper">
            <div id="row" class="row l12 s12">
                <div id="card" class="card valign center-align white l12">
                    <div class="card-content">
                        <div class="col l12">
                            <ul class="tabs">
                                <li class="tab col l6"><a class="active" href="#loginDiv">Login</a></li>
                                <li class="tab col l6"><a href="#registrationDiv">Register</a></li>
                                <li class="tab col l6"><a href="#resetDiv">Reset</a></li>
                            </ul>
                        </div>
                        <div id='loginDiv' class="content_div col l12">
                            <form action="process_login.php" method="post" name="login_form">
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
                        <div id='registrationDiv' class="content_div col l12">
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
                                    <input type="button" class="btn right_btn" value="Register" onclick="return regformhash(this.form, this.form.username, this.form.email, this.form.password, this.form.confirmpwd);" /> 
                            </form>
                        </div>
                        <div id='resetDiv' class="content_div col l12">
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
    </body>
</html>
