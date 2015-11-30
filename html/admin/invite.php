<?php 

include_once '/var/www/php/include/db_connect.php';
include_once '/var/www/php/include/functions.php';
include_once '/var/www/php/include/composer/include.php';

use SparkPost\SparkPost;
use SparkPost\Transmission;

sec_session_start();
$logged_in = login_check($mysqli);

$allow = array("108.3.175.118");

if(!$logged_in || $_SESSION['user_id'] != 1 || !in_array($_SERVER['REMOTE_ADDR'], $allow) || !is_ajax()) {
    die('{"msg":"This is not the right place for you!"}');
} 

if (empty($_POST["seasurf"]) || $_POST["seasurf"] != $_SESSION["csrf_token"]) {
    http_response_code(401);
    die('{"status":"error", "msg":"Missing or invalid CSRF token! If you\'re not a hacker you should probably contact us."}');
}

if (empty($_POST["ids"])) {
    http_response_code(400);
    die('{"status":"error", "msg":"Missing ids."}');
}

function invite($mysqli, $id) {
    $query = "SELECT email, remove_code FROM waiting_list WHERE invited IS NULL AND id = ?";
    $stmt = $mysqli->prepare($query);
    if($stmt) {
        $stmt->bind_param('i', $id);
        $stmt->execute();    
        $stmt->store_result();

        $stmt->bind_result($email, $remove_code);
        $stmt->fetch();
        if($stmt->num_rows == 1) {
            $stmt->close();

            // check exists
            $exists = true;
            while($exists) {
                // create invite code
                $invite = strtoupper(secure_random_string(32));

                $query = "SELECT * from invites WHERE invite_code = ?";
                $stmt = $mysqli->prepare($query);

                if(!$stmt) {
                    error_log(__FILE__ . ":" . __LINE__);
                    return false;
                }
        
                $stmt->bind_param('s', $invite);
                if(!$stmt->execute()){
                    error_log(__FILE__ . ":" . __LINE__);
                    return false;
                }
                $stmt->store_result();

                if($stmt->num_rows == 0) {
                    $exists = false;
                }

                $stmt->close();

            }

            // insert invite code 
            $query = "INSERT INTO invites (invite_code, wait_id) VALUES (?, ?)";            
            $stmt = $mysqli->prepare($query);

            if(!$stmt) {
                error_log(__FILE__ . ":" . __LINE__);
                return false;
            }
    
            $stmt->bind_param('si', $invite, $id);
            if(!$stmt->execute()){
                $stmt->close();
                error_log(__FILE__ . ":" . __LINE__);
                return false;
            }

            $stmt->close();

            // send email
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
                    "template"=>"invite",
                    "substitutionData"=>array(
                        "REMOVE"=>$remove_code,
                        "INVITE"=>$invite
                    ),
                    "trackClicks"=>false,
                    "campaign"=>"invites"
                ));
            } catch (\Exception $exception) {
                error_log(__FILE__ . ":" . __LINE__);
                return false;
            }

            // mark user as invited
            $query = "UPDATE waiting_list SET invited = now() WHERE id = ?";
            $stmt = $mysqli->prepare($query);
            if(!$stmt) {
                error_log(__FILE__ . ":" . __LINE__);
                return false;
            }

            $stmt->bind_param('i', $id);
            if(!$stmt->execute()) {
                error_log(__FILE__ . ":" . __LINE__);
                return false;
            }
            
            $stmt->close();

        } else {
            $stmt->close();
            error_log(__FILE__ . ":" . __LINE__);
            return false;
        }
    } else {
        error_log(__FILE__ . ":" . __LINE__);
        return false;
    }

    return true;
}

$successes = 0;
$failures = 0;

foreach($_POST["ids"] as $id) {
    if(invite($mysqli, $id)) {
        $successes += 1;
    } else {
        $failures += 1;
    }
}

die('{"successes": ' . $successes . ', "failures": ' . $failures . '}');

?>