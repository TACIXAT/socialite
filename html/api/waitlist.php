<?php
include_once '/var/www/php/include/db_connect.php';
include_once '/var/www/php/include/functions.php';
include_once '/var/www/php/include/composer/include.php';

use SparkPost\SparkPost;
use SparkPost\Transmission;

if (is_ajax()) {
    if(!empty($_POST["action"])) {
        switch($_POST["action"]) {
            case "add":
                add($mysqli);
                exit();
            case "remove":
                remove($mysqli);
                exit();
            default:
                http_response_code(400);
                die('{"status":"error", "msg":"Invalid option."}');
        }
    } else {
        http_response_code(400);
        die('{"status":"error", "msg":"Missing required fields."}');
    }
} else {
    http_response_code(400);
    die('{"status":"error", "msg":"That request is not AJAX."}');
}

function remove($mysqli) {
    if (!empty($_POST["email"]) && !empty($_POST["code"])) {
        $email = $_POST["email"];
        $remove_code = $_POST["code"];
        
        error_log($email);
        error_log($remove_code);

        $query = "SELECT * FROM waiting_list WHERE email = ? AND remove_code = ?";
        $stmt = $mysqli->prepare($query);
        if(!$stmt) {
            http_response_code(500);
            die('{"status":"error", "msg":"Error creating statement one in waiting list remove."}');
        }

        $stmt->bind_param('ss', $email, $remove_code);
        if(!$stmt->execute()) {
            http_response_code(500);
            die('{"status":"error", "msg":"Error executing statement one in waiting list remove."}');
        }

        $result = $stmt->get_result();
        if($result->num_rows != 1) {
            http_response_code(400);
            die('{"status":"error", "msg":"Email or code not found."}');
        }

        $row = $result->fetch_assoc();
        $stmt->close();   

        if($row["invited"] != NULL) {
            http_response_code(400);
            die('{"status":"error", "msg":"Email no longer in waiting list. Please see the email containing your invite code if you wish to unsubscribe from Socialite."}');
        }     

        $query = "DELETE FROM waiting_list WHERE email = ? AND remove_code = ?";
        $stmt = $mysqli->prepare($query);
        if(!$stmt) {
            http_response_code(500);
            die('{"status":"error", "msg":"Error creating statement two in waiting list remove."}');
        }

        $stmt->bind_param('ss', $email, $remove_code);
        if(!$stmt->execute()) {
            http_response_code(500);
            die('{"status":"error", "msg":"Error executing statement two in waiting list remove."}');
        }
        $stmt->close();

        die('{"status":"success", "msg":"Successfully removed from the waiting list."}');
    } else {
        http_response_code(400);
        die('{"status":"error", "msg":"Missing required fields."}');
    }
}

function add($mysqli) {
    if (!empty($_POST["email"])) {
        $email = $_POST["email"];
        $remove_code = base64_encode(secure_random_string(256));

        if(filter_var($email, FILTER_VALIDATE_EMAIL)) {
            $query = "SELECT * FROM waiting_list WHERE email = ?";
            $stmt = $mysqli->prepare($query);

            if(!$stmt) {
                http_response_code(500);
                die('{"status":"error", "msg":"Error creating statement one in waiting list."}');
            }

            $stmt->bind_param('s', $email);
            if(!$stmt->execute()) {
                http_response_code(500);
                die('{"status":"error", "msg":"Error executing statement one in waiting list."}');
            }
            
            $result = $stmt->get_result();
            if($result->num_rows > 0) {
                http_response_code(400);
                die('{"status":"error", "msg":"Email already in waiting list."}');
            }
            $stmt->close();

            $query = "INSERT INTO waiting_list (email, remove_code) VALUES( ?, ? )";
            $stmt = $mysqli->prepare($query);

            if(!$stmt) {
                http_response_code(500);
                die('{"status":"error", "msg":"Error creating statement two in waiting list."}');
            }

            $stmt->bind_param('ss', $email, $remove_code);
            if(!$stmt->execute()) {
                http_response_code(500);
                die('{"status":"error", "msg":"Error executing statement two in waiting list."}');
            }
            
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
                    "template"=>"welcome",
                    "substitutionData"=>array(
                        "CODE"=>$remove_code
                    ),
                    "trackClicks"=>false,
                    "campaign"=>"waiting_list"
                ));
            } catch (\Exception $exception) {
                http_response_code(500);
                die('{"status":"error", "msg":"Problem sending email.", "exception":"' . $exception->getMessage() . '"}');
            }

            die('{"status":"success", "msg":"Successfully added to waiting list."}');

        } else {
            http_response_code(400);
            die('{"status":"error", "msg":"That does not appear to be a valid email address."}');
        }
    } else {
        http_response_code(400);
        die('{"status":"error", "msg":"Missing required fields."}');
    }
}

