<?php 

include_once '/var/www/php/include/db_connect.php';
include_once '/var/www/php/include/functions.php';
 
sec_session_start();
$logged_in = login_check($mysqli);

$allow = array("100.16.69.104");

if(!$logged_in || $_SESSION['user_id'] != 1 || !in_array($_SERVER['REMOTE_ADDR'], $allow)) {
    die('{"msg":"This is not the right place for you!"}');
} 


function get_invite_list($mysqli) {
    $stmt = $mysqli->prepare("SELECT id, requested, email FROM waiting_list WHERE invited IS NULL");
    if($stmt) {
        $stmt->execute();    
        $stmt->store_result();

        $stmt->bind_result($user_id, $timestamp, $email);
        while($stmt->fetch()) {
            echo "                <tr>\n";
            printf("                    <td><input type='checkbox' name='id' value='%d'/></td>\n", $user_id);
            printf("                    <td>%s</td>\n", $timestamp);
            printf("                    <td>%s</td>\n", $email);
            echo "                </tr>\n";

        }

        $stmt->close();
    }

    return 0;
}
?>

<html>
    <head>
        <script type='text/javascript' src='/js/lib/jquery-2.1.3.min.js'></script>
        <script>
<?php
echo "            seasurf = '" . $_SESSION['csrf_token'] . "';\n";
?>

            function inviteSuccess(data, status, xhr) {
                console.log(data);
                var response = $.parseJSON(data);
            }

            function inviteError(xhr, status, error) {
                console.log(xhr.responseText);
                var error = $.parseJSON(xhr.responseText);
            }


            function invite() {
                var ids = $('input:checked').map(function() { return parseInt(this.value); }).get();
                console.log(ids);
                var data = {"ids": ids, "seasurf": seasurf};
                console.log(data);
                $.ajax({
                    'type': 'POST',
                    'url': '/admin/invite.php',
                    'data': $.param(data),
                    'success': inviteSuccess,
                    'error': inviteError });
                return false;
            }
        </script>
    </head>
    <body>
        <form>
            <table>
                <tbody id='invitees'>

<?php
get_invite_list($mysqli);
?>

                </tbody>
            </table>
            <button onclick='return invite();'>INVITE</button>
        </form>
    </body>
</html>
