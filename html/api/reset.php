<?php
include_once '/var/www/php/include/db_connect.php';
include_once '/var/www/php/include/functions.php';
include_once '/var/www/php/include/composer/include.php';

use SparkPost\SparkPost;
use SparkPost\Transmission;

function is_ajax() {
    return isset($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) == 'xmlhttprequest';
}

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
        $form = "<html>\n";
        $form .= "  <head>\n";
        $form .= "    <link type='text/css' rel='stylesheet' href='/css/materialize.min.css'  media='screen,projection'/>\n";
        $form .= "    <script type='text/javascript' src='/js/lib/jquery-2.1.3.min.js'></script>\n";
        $form .= "    <script type='text/javascript' src='/js/sha512.js'></script>\n";
        $form .= "    <script type='text/javascript' src='/js/reset.js'></script>\n";
        $form .= "    <script type='text/javascript' src='/js/materialize.min.js'></script>\n";
        $form .= "    <style>\n";
        $form .= "      body {\n";
        $form .= "        height: 100vh;\n";
        $form .= "      }\n";
        $form .= "      #container {\n";
        $form .= "        height: 100%;\n";
        $form .= "        width: 100%;\n";
        $form .= "      }\n";
        $form .= "    </style>\n";
        $form .= "  </head>\n";
        $form .= "  <body class='red'>\n";
        $form .= "    <div class='container'>\n";
        $form .= "      <div id='row' class='row s12'>\n";
        $form .= "        <div class='valign-wrapper'>\n";
        $form .= "          <div id='card' class='card valign center-align white l12'>\n";
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
        $form .= "                <input type='hidden' name='reset_key' value='" . $_GET["reset_key"] . "'/><br/>\n";
        $form .= "                <input type='button' onclick='return resetformhash(this.form, this.form.password, this.form.repeat, this.form.reset_key)' value='Reset'/>\n";
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

    $reset_key = secure_random_string();
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
        $html = "<body>";
        $html .= "<p><a href='https://socialite.ooo/api/reset.php?reset_key=" . urlencode(base64_encode($reset_key));
        $html .= "'>Follow this link to reset your password.</a></p>";
        $html .= "<br/>";
        $html .= "</body>";
        $html .= "<footer>";
        $html .= "</footer>";
        $text = "Follow this link to reset your password:\n";
        $text .= "https://socialite.ooo/api/reset.php?reset_key=" . urlencode(base64_encode($reset_key));
        $results = Transmission::send(array(
            "from"=>"Socialite <donutreply@socialite.ooo>",
            "html"=>$html,
            "text"=>$text,
            "subject"=>"Socialite - Password Reset",
            "recipients"=>array(
                array(
                    "address"=>array(
                        "email"=>$email
                    )
                )
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