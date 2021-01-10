document.getElementById('btn').addEventListener('click', function(event) {
    event.preventDefault();
});


function signUp(uname, uemail, upwd) {
    firebase.auth().createUserWithEmailAndPassword(uemail, upwd)
        .then((user) => {
            let uid = firebase.auth().currentUser.uid;
            firebase.database().ref().child('users').child(uid).set({
                name: uname,
                links: {
                    count: 0
                }
            });
            firebase.database().ref().child('users').child(uid).child('links').child('background').set(1);

            alert("Created user successfully");
            setTimeout(function() {
                window.location = 'index.html';
            }, 900);
        })
        .catch((error) => {
            var errorCode = error.code;
            var errorMessage = error.message;
            alert(errorMessage);
            firebase.auth().currentUser.delete();
        });
}

document.getElementById('signup-button').addEventListener('click', function() {
    event.preventDefault();
    let vname = document.getElementById('name-signup').value;
    let vemail = document.getElementById('email-signup').value;
    let vpwd1 = document.getElementById('password1-signup').value;
    let vpwd2 = document.getElementById('password2-signup').value;
    if (vname.trim() == '' || vemail.trim() == '' || vpwd1.trim() == '' || vpwd2.trim() == '') {
        alert('Please fill all fields');
    } else {
        if (vpwd2 != vpwd1) {
            alert("Passwords do not match");
        } else {
            signUp(vname, vemail, vpwd1);
        }
    }
});
document.getElementById('btn').addEventListener('click', function() {
    firebase.database().ref().child('lfl').set({
        name: 'dummy'
    });
});