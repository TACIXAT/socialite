<?php
include_once 'db_connect.php';
include_once 'graph_config.php';
include_once 'functions.php';
include_once '/var/www/php/include/composer/include.php';

use SparkPost\SparkPost;
use SparkPost\Transmission;

$error_msg = "";

if (isset($_POST['username'], $_POST['email'], $_POST['p'])) {
    if (!is_ajax()) {
        http_response_code(400);
        die('{"status":"error", "msg":"Must be an AJAX request."}');
    }
 
    // Sanitize and validate the data passed in
    $username = filter_input(INPUT_POST, 'username', FILTER_SANITIZE_STRING);
    // $invite_code = filter_input(INPUT_POST, 'invite', FILTER_SANITIZE_STRING);
    $email = filter_input(INPUT_POST, 'email', FILTER_SANITIZE_EMAIL);
    $email = filter_var($email, FILTER_VALIDATE_EMAIL);
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        // Not a valid email
        http_response_code(400);
        die('{"status":"error", "msg":"The email address you entered does not appear to be valid."}');
    }
 
    $password = filter_input(INPUT_POST, 'p', FILTER_SANITIZE_STRING);
    if (strlen($password) != 128) {
        // The hashed pwd should be 128 characters long.
        // If it's not, something really odd has happened
        http_response_code(400);
        die('{"status":"error", "msg":"Invalid password configuration."}');
    }
 
    // Username validity and password validity have been checked client side.
    // This should should be adequate as nobody gains any advantage from
    // breaking these rules.
    //
 
    $prep_stmt = "SELECT id FROM members WHERE email = ? LIMIT 1";
    $stmt = $mysqli->prepare($prep_stmt);
 
    // check existing email  
    if ($stmt) {
        $stmt->bind_param('s', $email);
        $stmt->execute();
        $stmt->store_result();
 
        if ($stmt->num_rows == 1) {
            // A user with this email address already exists
            $stmt->close();
            http_response_code(400);
            die('{"status":"error", "msg":"A user with this email address already exists."}');
        }
        $stmt->close();
    } else {
        $stmt->close();
        http_response_code(500);
        die('{"status":"error", "msg":"Database error (39)"}');
    }
 
    // check existing username
    $prep_stmt = "SELECT id FROM members WHERE username = ? LIMIT 1";
    $stmt = $mysqli->prepare($prep_stmt);
 
    if ($stmt) {
        $stmt->bind_param('s', $username);
        $stmt->execute();
        $stmt->store_result();
 
        if ($stmt->num_rows == 1) {
            // A user with this username already exists
            $stmt->close();
            http_response_code(400);
       	    die('{"status":"error", "msg":"A user with this username already exists"}');
        }
        $stmt->close();
    } else {
    	$stmt->close();
        http_response_code(500);
        die('{"status":"error", "msg":"Database error (55)"}');
    }

    // $prep_stmt = "SELECT user_id FROM invites WHERE invite_code = ? LIMIT 1";
    // $stmt = $mysqli->prepare($prep_stmt);

    // if ($stmt) {
    //     $stmt->bind_param('s', $invite_code);
    //     $stmt->execute();
    //     $stmt->store_result();

    //     if($stmt->num_rows == 1) {
    //         $stmt->bind_result($invite_id);
    //         $stmt->fetch();
    //         if($invite_id != 0) {
    //             $stmt->close();
    //             http_response_code(400);
    //             die('{"status":"error", "msg":"Invite has been used!"}');
    //         }
    //     } else {
    //         $stmt->close();
    //         http_response_code(400);
    //         die('{"status":"error", "msg":"Invalid invite code!"}');
    //     }
    //     $stmt->close();
    // } else {
    //     $stmt->close();
    //     http_response_code(500);
    //     die('{"status":"error", "msg":"Database error (89)"}');

    // }
 
    // Create a random salt
    //$random_salt = hash('sha512', uniqid(openssl_random_pseudo_bytes(16), TRUE)); // Did not work
    $random_salt = hash('sha512', uniqid(mt_rand(1, mt_getrandmax()), true));

    // Create salted password 
    $password = hash('sha512', $password . $random_salt);

    // Insert the new user into the database 
    if ($insert_stmt = $mysqli->prepare("INSERT INTO members (username, email, password, salt) VALUES (?, ?, ?, ?)")) {
        $insert_stmt->bind_param('ssss', $username, $email, $password, $random_salt);
        // Execute the prepared query.
        if (! $insert_stmt->execute()) {
            http_response_code(500);
            die('{"status":"error", "msg":"Registration failure: INSERT"}');
        }
    }
    
    $api_key = create_api_key($email, $mysqli);
    if(strlen($api_key) != 32) {
        // remove member
        if($remove_stmt = $mysqli->prepare("DELETE FROM members WHERE email = ?")) {
            $remove_stmt->bind_param('s', $email);
            if(!$remove_stmt->execute()) {
                http_response_code(500);
                die('{"status":"error", "msg":"Registration failure: API KEY CLEANUP"}');
            }
        }
        
        http_response_code(500);
        die('{"status":"error", "msg":"Registration failure: API KEY CREATE"}');
    }

    $result = add_user_to_graph($email, $api_key, $mysqli);
    $user_id = get_user_info('user_id', $email, $mysqli);
    if($result === true) {
        //UPDATE invites SET user_id = ? WHERE invite_code = ?; 
        // if($invite_stmt = $mysqli->prepare("UPDATE invites SET user_id = ? WHERE invite_code = ?")) {
        //     $invite_stmt->bind_param('is', $user_id, $invite_code);
        //     $invite_stmt->execute();
        //     // don't really care if it worked
        // }

        $confirmation_code = secure_random_string(32);
        $query = "INSERT INTO confirmations VALUES( ?, ? )";
        $stmt = $mysqli->prepare($query);
        if(!$stmt) {
            http_response_code(500);
            die('{"status":"error", "msg":"Failure creating statement confirmations."}');
        }

        $stmt->bind_param('is', $user_id, $confirmation_code);
        if(!$stmt->execute()) {
            http_response_code(500);
            die('{"status":"error", "msg":"Failure executing statement confirmations."}');
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
                "template"=>"confirm",
                "substitutionData"=>array(
                    "CONFIRM"=>$confirmation_code
                ),
                "trackClicks"=>false,
                "campaign"=>"confirmations"
            ));
        } catch (\Exception $exception) {
            error_log(__FILE__ . ":" . __LINE__);
            http_response_code(500);
            die('{"status":"error", "msg":"Failure sending email."}');
        }


        die('{"status":"success", "msg":"Success! Check your email to confirm your account!"}');
    } else {
        // remove member
        if($remove_stmt = $mysqli->prepare("DELETE FROM members WHERE email = ?")) {
            $remove_stmt->bind_param('s', $email);
            if(!$remove_stmt->execute()) {
                http_response_code(500);
                die('{"status":"error", "msg":"Registration failure: GRAPH USER CLEANUP"}');
            }
        }
        
         // remove api key
        if($remove_stmt = $mysqli->prepare("DELETE FROM api_keys WHERE user_id = ?")) {
            $remove_stmt->bind_param('s', $user_id);
            if(!$remove_stmt->execute()) {
                http_response_code(500);
                die('{"status":"error", "msg":"Registration failure: GRAPH KEY CLEANUP"}');
            }
        }

        http_response_code(500);
        die('{"status":"error", "msg":"Registration failure: ADD USER TO GRAPH"}');
    }
}
