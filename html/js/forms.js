function checkSubmit(form, evt) {
    if(evt && evt.keyCode == 13) {
        formhash(form, form.password);
        //document.forms[0].submit();
    }
}

function loginSuccess(data, status, xhr) {
    var success = $.parseJSON(data);
    if("status" in success && success["status"] == "success") {
        var check = false;
        (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4)))check = true})(navigator.userAgent||navigator.vendor||window.opera);
        if(check)
            window.location = '/mobile.php';
        else
            window.location = '/lifegraph.php';
    } else {
        Materialize.toast('An error (success) occured! Please contact us directly!', 3000);
    }
}

function loginError(xhr, status, error) {
    var error = $.parseJSON(xhr.responseText);
    if("status" in error && error["status"] == "error" && "msg" in error) {
        Materialize.toast(error['msg'], 3000);
    } else {
        Materialize.toast('An error occured! Please contact us directly!', 3000);
    }
}


function formhash(form, password) {
    // Create a new element input, this will be our hashed password field. 
    var p = document.createElement("input");
 
    // Add the new element to our form. 
    form.appendChild(p);
    p.name = "p";
    p.type = "hidden";
    p.value = hex_sha512(password.value);
 
    // Make sure the plaintext password doesn't get sent. 
    password.value = "";
 
    // Finally submit the form. 
    //form.submit();

    var data = {"p": p.value, "email": form.email.value};
    $.ajax({
        'type': 'POST',
        'url': '/process_login.php',
        'data': $.param(data),
        'success': loginSuccess,
        'error': loginError });

    return false;

}
 
function regformhash(form, username, email, password, conf) {
     // Check each field has a value
    if (username.value == ''         || 
          email.value == ''     || 
          password.value == ''  || 
          conf.value == '') {
 
        Materialize.toast('You must provide all the requested details. Please try again', 4000);
        return false;
    }
 
    // Check the username
 
    re = /^\w+$/; 
    if(!re.test(form.username.value)) { 
        Materialize.toast("Username must contain only letters, numbers and underscores. Please try again", 4000); 
        form.username.focus();
        return false; 
    }
 
    // Check that the password is sufficiently long (min 6 chars)
    // The check is duplicated below, but this is included to give more
    // specific guidance to the user
    if (password.value.length < 8) {
        Materialize.toast('Passwords must be at least 8 characters long.  Please try again', 4000);
        form.password.focus();
        return false;
    }
 
    // At least one number, one lowercase and one uppercase letter 
    // At least six characters 
 
    var re = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/; 
    if (!re.test(password.value)) {
        Materialize.toast('Passwords must contain at least one number, one lowercase and one uppercase letter.  Please try again', 4000);
        return false;
    }
 
    // Check password and confirmation are the same
    if (password.value != conf.value) {
        Materialize.toast('Your password and confirmation do not match. Please try again', 4000);
        form.password.focus();
        return false;
    }
 
    // Create a new element input, this will be our hashed password field. 
    var p = document.createElement("input");
 
    // Add the new element to our form. 
    form.appendChild(p);
    p.name = "p";
    p.type = "hidden";
    p.value = hex_sha512(password.value);
 
    // Make sure the plaintext password doesn't get sent. 
    password.value = "";
    conf.value = "";
 
    // Finally submit the form. 
    var data = {"p": p.value, "email": email.value, "username": username.value};
    $.ajax({
        'type': 'POST',
        'url': '/login.php',
        'data': $.param(data),
        'success': regSuccess,
        'error': regError });

    return false;
}

function regSuccess(data, status, xhr) {
    var success = $.parseJSON(data);
    console.log(success);
    if("status" in success && success["status"] == "success") {
        var fields = ["registration_username", "registration_email", "registration_password", "registration_confirmpwd"];
        for(var idx in fields) {
            $("#" + fields[idx]).val("");
        }
        Materialize.toast('Success! Redirecting to the tutorial in 3 seconds!', 4000);
        setTimeout(function() { window.location = "https://socialite.ooo/tutorial.php?registered=true"; }, 3000);
        //$('ul.tabs').tabs('select_tab', 'loginDiv');
    } else {
        console.log(success);
        Materialize.toast('An error (success) occured! Please contact us directly!', 3000);
    }
}

function regError(xhr, status, error) {
    var error = $.parseJSON(xhr.responseText);
    if("status" in error && error["status"] == "error") {
        Materialize.toast(error['msg'], 3000);
    } else { 
        console.log(error);
        Materialize.toast('An error occured! Please contact us directly!', 3000);
    }
}

function resetSuccess(data, status, xhr) {
    var success = $.parseJSON(data);
    if("success" in success) {
        Materialize.toast(success["success"], 3000);;
    } else {
        Materialize.toast('An error (success) occured! Please contact us directly!', 3000);
    }
}

function resetError(xhr, status, error) {
    var error = $.parseJSON(xhr.responseText);
    if("error" in error) {
        Materialize.toast(error['error'], 3000);
    } else { 
        Materialize.toast('An error occured! Please contact us directly!', 3000);
    }
}

function reset(form, username, email) {
    var data = { "username": username, "email": email };
    $.ajax({
        'type': 'POST',
        'url': 'api/reset.php',
        'data': $.param(data),
        'success': resetSuccess,
        'error': resetError });
}
