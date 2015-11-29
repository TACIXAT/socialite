<?php 

include_once '/var/www/php/include/db_connect.php';
include_once '/var/www/php/include/functions.php';
 
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
    $stmt = $mysqli->prepare("SELECT email FROM waiting_list WHERE invited IS NULL AND id = ?");
    if($stmt) {
        $stmt->bind_param('i', $id);
        $stmt->execute();    
        $stmt->store_result();
        $stmt->fetch();

        $stmt->bind_result($email);
        if($stmt->num_rows == 1) {
            echo $email;
        }

        $stmt->close();
    }

    return 0;
}

foreach($_POST["ids"] as $id) {
    invite($mysqli, $id);
}

?>