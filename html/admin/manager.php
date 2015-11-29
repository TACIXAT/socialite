<?php 

include_once '/var/www/php/include/db_connect.php';
include_once '/var/www/php/include/functions.php';
 
sec_session_start();
$logged_in = login_check($mysqli);

$allow = array("108.3.175.118");

if(!$logged_in || $_SESSION['user_id'] != 1 || !in_array($_SERVER['REMOTE_ADDR'], $allow)) {
    die('{"msg":"Fuck off!"}');
} 


echo "<html>\n";
echo "    <head>\n";
echo "        <script type='text/javascript' src='/js/lib/jquery-2.1.3.min.js'></script>\n";
echo "        <script>\n";
echo "            function invite() {\n";
echo "                console.log('YUS');\n";
echo "            }\n";
echo "        </script>\n";
echo "    </head>\n";
echo "    <body>\n";
echo "        <form>\n";
echo "            <table>\n";
echo "                <tbody>\n";

function get_invite_list($mysqli) {
    $stmt = $mysqli->prepare("SELECT id, requested, email FROM waiting_list WHERE invited IS NULL");
    if($stmt) {
        $stmt->execute();    
        $stmt->store_result();

        $stmt->bind_result($user_id, $timestamp, $email);
        while($stmt->fetch()) {
            echo "                <tr id='invitees'>\n";
            printf("                    <td><input type='checkbox' name='id' value='%d'/></td>\n", $user_id);
            printf("                    <td>%s</td>\n", $timestamp);
            printf("                    <td>%s</td>\n", $email);
            echo "                </tr>\n";

        }

        $stmt->close();
    }

    return 0;
}

get_invite_list($mysqli);

echo "                </tbody>\n";
echo "            </table>\n";
echo "            <button onclick='invite'>INVITE</button>\n";
echo "        </form>\n";
echo "    </body>\n";
echo "</html>\n";

?>