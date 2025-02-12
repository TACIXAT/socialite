<?php
include_once '/var/www/php/include/db_connect.php';
include_once '/var/www/php/include/functions.php';
include_once '/var/www/php/include/composer/include.php';

use SparkPost\SparkPost;
use SparkPost\Transmission;

if (is_ajax()) {
    if (!empty($_POST["username"]) && !empty($_POST["email"])) {
        get_key($mysqli, $_POST["username"], $_POST["email"]);
    } else {
        header('HTTP/1.0 400');
        die('{"error":"Missing parameters!"}');
    }
} else {
    if(!empty($_POST["p"]) && !empty($_POST["reset_key"])) {
        reset_password($mysqli, $_POST["p"], $_POST["reset_key"]);
    } else if(!empty($_GET["reset_key"])) {
        // this has gotten a little out of hand and I feel bad
        $form = "<html>\n";
        $form .= "  <head>\n";
        $form .= "    <meta charset='UTF-8'>\n";
        $form .= "    <link rel='apple-touch-icon' sizes='57x57' href='/icon/favicon/apple-touch-icon-57x57.png'>\n";
        $form .= "    <link rel='apple-touch-icon' sizes='60x60' href='/icon/favicon/apple-touch-icon-60x60.png'>\n";
        $form .= "    <link rel='apple-touch-icon' sizes='72x72' href='/icon/favicon/apple-touch-icon-72x72.png'>\n";
        $form .= "    <link rel='apple-touch-icon' sizes='76x76' href='/icon/favicon/apple-touch-icon-76x76.png'>\n";
        $form .= "    <link rel='apple-touch-icon' sizes='114x114' href='/icon/favicon/apple-touch-icon-114x114.png'>\n";
        $form .= "    <link rel='apple-touch-icon' sizes='120x120' href='/icon/favicon/apple-touch-icon-120x120.png'>\n";
        $form .= "    <link rel='apple-touch-icon' sizes='144x144' href='/icon/favicon/apple-touch-icon-144x144.png'>\n";
        $form .= "    <link rel='apple-touch-icon' sizes='152x152' href='/icon/favicon/apple-touch-icon-152x152.png'>\n";
        $form .= "    <link rel='apple-touch-icon' sizes='180x180' href='/icon/favicon/apple-touch-icon-180x180.png'>\n";
        $form .= "    <link rel='icon' type='image/png' href='/icon/favicon/favicon-32x32.png' sizes='32x32'>\n";
        $form .= "    <link rel='icon' type='image/png' href='/icon/favicon/android-chrome-192x192.png' sizes='192x192'>\n";
        $form .= "    <link rel='icon' type='image/png' href='/icon/favicon/favicon-96x96.png' sizes='96x96'>\n";
        $form .= "    <link rel='icon' type='image/png' href='/icon/favicon/favicon-16x16.png' sizes='16x16'>\n";
        $form .= "    <link rel='manifest' href='/icon/favicon/manifest.json'>\n";
        $form .= "    <link rel='shortcut icon' href='/icon/favicon/favicon.ico'>\n";
        $form .= "    <meta name='msapplication-TileColor' content='#da532c'>\n";
        $form .= "    <meta name='msapplication-TileImage' content='/icon/favicon/mstile-144x144.png'>\n";
        $form .= "    <meta name='msapplication-config' content='/icon/favicon/browserconfig.xml'>\n";
        $form .= "    <link type='text/css' rel='stylesheet' href='/css/materialize.min.css'  media='screen,projection'/>\n";
        $form .= "    <script type='text/javascript' src='/js/lib/jquery-2.1.3.min.js'></script>\n";
        $form .= "    <script type='text/javascript' src='/js/sha512.js'></script>\n";
        $form .= "    <script type='text/javascript' src='/js/reset.js'></script>\n";
        $form .= "    <script type='text/javascript' src='/js/materialize.min.js'></script>\n";
        $form .= "    <style>\n";
        $form .= "      body {\n";
        $form .= "        height: 100vh;\n";
        $form .= "      }\n";
        $form .= "      #row {\n";
        $form .= "        padding-top: 10%;\n";
        $form .= "      }\n";
        $form .= "      .right_btn {\n";
        $form .= "        float: right;\n";
        $form .= "        margin: 15px;\n";
        $form .= "      }\n";
        $form .= "    </style>\n";
        $form .= "  </head>\n";
        $form .= "  <body class='red'>\n";
        $form .= "    <div class='container'>\n";
        $form .= "      <div id='row' class='row s12'>\n";
        $form .= "        <div class='col l6 offset-l3 s12'>\n";
        $form .= "          <div id='card' class='card center-align white s12'>\n";
        $form .= "            <div class='card-content'>\n";
        $form .= "              <span class='card-title black-text'>Password Reset</span>\n";
        $form .= "              <form action='" . esc_url($_SERVER['PHP_SELF']) . "' method='post'>\n";
        $form .= "                <div class='input-field'>\n";
        $form .= "                  <input type='password' name='password'></input><br/>\n";
        $form .= "                  <label for='password_input'>Password</label>\n";
        $form .= "                </div>\n";
        $form .= "                <div class='input-field'>\n";
        $form .= "                  <input type='password' name='repeat'/>\n";
        $form .= "                  <label for='repeat_input'>Repeat</label>\n";
        $form .= "                </div>\n";
        $form .= "                <input type='button' class='btn right_btn' onclick='return resetformhash(this.form, this.form.password, this.form.repeat, this.form.reset_key)' value='Reset'/>\n";
        $form .= "                <input type='hidden' name='reset_key' value='" . $_GET["reset_key"] . "'/><br/>\n";
        $form .= "              </form>\n";
        $form .= "            </div>\n";
        $form .= "          </div>\n";
        $form .= "        </div>\n";
        $form .= "      </div>\n";
        $form .= "    </div>\n";
        $form .= "  </body>\n";
        $form .= "</html>\n";
        echo($form);
    } else {
        echo("You're missing something.");
    }
}

function reset_password($mysqli, $password, $reset_key) {
    $random_salt = hash('sha512', uniqid(mt_rand(1, mt_getrandmax()), true));
    $password = hash('sha512', $password . $random_salt);
    
    $reset_key = base64_decode($reset_key);

    $date = new DateTime();
    $timestamp = $date->getTimestamp();
    $tsminus6h = $timestamp - 60 * 60 * 6;

    $query = "SELECT user_id FROM reset_keys WHERE reset_key = ? and timestamp > ?";
    $stmt = $mysqli->prepare($query);
    if(!$stmt) {
        header('HTTP/1.0 500');
        die('{"error":"Trouble making statement in reset password (1)!"}');
    }

    $stmt->bind_param("si", $reset_key, $tsminus6h);
    if(!$stmt->execute()) {
        header('HTTP/1.0 500');
        die('{"error":"Trouble executing statement in reset password (1)!"}');
    }

    $result = $stmt->get_result();
    $stmt->close();
    if($result->num_rows == "1") {
        $row = $result->fetch_array(MYSQLI_ASSOC);
        $user_id = $row["user_id"];
    } else {
        header('HTTP/1.0 400');
        die('{"error":"Reset key not valid!"}');
    }

    $query = "UPDATE members SET password = ?, salt = ? WHERE id = ?";
    $stmt = $mysqli->prepare($query);
    if(!$stmt) {
        header('HTTP/1.0 500');
        die('{"error":"Trouble making statement in reset password (2)!"}');
    }

    $stmt->bind_param("ssi", $password, $random_salt, $user_id);
    if(!$stmt->execute()) {
        header('HTTP/1.0 500');
        die('{"error":"Trouble executing statement in reset password (2)!"}');
    }

    $stmt->close();

    $query = "DELETE FROM reset_keys WHERE reset_key = ?";
    $stmt = $mysqli->prepare($query);
    if(!$stmt) {
        // error_log($mysqli->errno);
        // error_log($mysqli->error);
        header('HTTP/1.0 500');
        die('{"error":"Trouble making statement in reset password (3)!"}');
    }

    $stmt->bind_param("s", $reset_key);
    if(!$stmt->execute()) {
        header('HTTP/1.0 500');
        die('{"error":"Trouble executing statement in reset password (3)!"}');
    }

    header("Location: /");
    exit();
    #die('"{"success": "Password successfully updated!"}');

}

function get_key($mysqli, $username, $email) {
    $query = "SELECT id FROM members WHERE username = ? AND email = ?";
    $stmt = $mysqli->prepare($query);
    if(!$stmt) {
        header('HTTP/1.0 500');
        die('{"error":"Trouble making statement in password reset!"}');
    }

    $stmt->bind_param("ss", $username, $email);
    if(!$stmt->execute()) {
        header('HTTP/1.0 500');
        die('{"error":"Trouble executing statement in password reset!"}');
    }
    
    $result = $stmt->get_result();
    if($result->num_rows != "1") {
        header('HTTP/1.0 400');
        die('{"error":"Could not find user!"}');
    }

    $row = $result->fetch_array(MYSQLI_ASSOC);
    $user_id = $row["id"];
    $stmt->close();

    $date = new DateTime();
    $timestamp = $date->getTimestamp();
    $tsminus6h = $timestamp - 60 * 60 * 6;

    $query = "DELETE FROM reset_keys WHERE user_id = ?";
    $stmt = $mysqli->prepare($query);
    if(!$stmt) {
        header('HTTP/1.0 500');
        die('{"error":"Trouble making statement in password reset (2)!"}');
    }

    $stmt->bind_param("i", $user_id);
    if(!$stmt->execute()) {
        header('HTTP/1.0 500');
        die('{"error":"Trouble executing statement in password reset (2)!"}');
    }
    $stmt->close();

    $reset_key = secure_random_string(64);
    $query = "INSERT INTO reset_keys VALUES (?, ?, ?)";
    $stmt = $mysqli->prepare($query);
    
    if(!$stmt) {
        header('HTTP/1.0 500');
        die('{"error":"Trouble making statement in password reset (3)!"}');
    }
    
    $stmt->bind_param('isi', $user_id, $reset_key, $timestamp);
    if(!$stmt->execute()) {
        header('HTTP/1.0 500');
        die('{"error":"Trouble executing statement in password reset (3)!"}');
    }
    $stmt->close();

    $key = "a0a8326c9a551bebd7beb3d2331275634e2a82ea";
    SparkPost::setConfig(array('key'=>$key));
    try {
        $results = Transmission::send(array(
            "recipients"=>array(
                array(
                    "address"=>array(
                        "email"=>$email
                    )
                )
            ),
            "template"=>"reset",
            "substitutionData"=>array(
                "RESET_KEY"=>base64_encode($reset_key)
            ),
            "trackClicks"=>false,
            "campaign"=>"password_reset"
        ));
    } catch (\Exception $exception) {
        http_response_code(500);
        die('{"error":"Problem sending email.", "exception":"' . $exception->getMessage() . '"}');
    }

    die('{"success":"Password reset link sent. Please check your email."}');


}
