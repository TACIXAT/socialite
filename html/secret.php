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

        <script type="text/JavaScript" src="js/sha512.js"></script> 
        <script type="text/JavaScript" src="js/forms.js"></script> 
    </head>
    <body>
        <div id='loginDiv'>
            <?php
                if (isset($_GET['error'])) {
                    echo '<p class="error">Error Logging In!</p>';
                }
            ?> 
            
            <form action="process_login.php" method="post" name="login_form">                      
                Email:&nbsp&nbsp&nbsp&nbsp<input type="text" name="email" /><br>
                Password: <input type="password" name="password" id="password"/><br>
                <input type="button" value="Login" onclick="formhash(this.form, this.form.password);" /> 
            </form>
        </div>
	<br>
        <div id='registrationDiv'>
            <?php
                if (!empty($error_msg)) {
                    echo $error_msg;
                }
            ?>

            <form action="<?php echo esc_url($_SERVER['PHP_SELF']); ?>" method="post" name="registration_form">
                Username: <input type='text' name='username' id='username' /><br>
                Email:&nbsp;&nbsp;&nbsp;&nbsp;<input type="text" name="email" id="email" /><br>
                Password: <input type="password" name="password" id="password"/><br>
                Confirm:&nbsp;&nbsp;<input type="password" name="confirmpwd"  id="confirmpwd" /><br>
                Invite:&nbsp;&nbsp;&nbsp;<input type='text' name='invite' id='invite' /><br>
                <input type="button" value="Register" onclick="return regformhash(this.form, this.form.username, this.form.email, this.form.password, this.form.confirmpwd);" /> 
            </form>
        </div>
    </body>
</html>
