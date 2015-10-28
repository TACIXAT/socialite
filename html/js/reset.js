function resetSuccess(data, status, xhr) {
    var jsonData = $.parseJSON(data);
    Materialize.toast(jsonData['success'], 3000);
}

function resetError(xhr, status, error) {
    var error = $.parseJSON(xhr.responseText);
    Materialize.toast(error['error'], 3000);
}

function requestReset(username, email) {
    console.log(username, email);
    var data = {"username": username, "email": email};
    $.ajax({
        'type': 'POST',
        'url': '/api/reset.php',
        'data': $.param(data),
        'success': resetSuccess,
        'error': resetError });
    return false;
}

function resetformhash(form, password, repeat, reset_key) {
    if (repeat.value == ''     ||
          password.value == ''  ||
          reset_key.value == '') {

        alert('You must provide all the requested details. Please try again');
        return false;
    }

    if(password.value != repeat.value) {
        alert('Passwords do not match!');
        form.password.focus();
        return false;
    }

    if (password.value.length < 6 || repeat.value.length < 6) {
        alert('Passwords must be at least 6 characters long.  Please try again');
        form.password.focus();
        return false;
    }

    var re = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
    if (!re.test(password.value) || !re.test(repeat.value)) {
        alert('Passwords must contain at least one number, one lowercase and one uppercase letter.  Please try again');
        return false;
    }

    var p = document.createElement("input");

    form.appendChild(p);
    p.name = "p";
    p.type = "hidden";
    p.value = hex_sha512(password.value);

    password.value = "";
    repeat.value = "";

    form.submit();
    return true;
}
