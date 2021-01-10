//Nav buttons prevent reload
document.getElementById('nav_your_showcase').addEventListener('click', function(event) {
    event.preventDefault();
    window.location = 'showcase.html';
});

document.getElementById('nav_edit').addEventListener('click', function(event) {
    event.preventDefault();
});
document.getElementById('headeruser').addEventListener('click', function(event) {
    event.preventDefault();
});
document.getElementById('sign').addEventListener('click', function(event) {
    event.preventDefault();
});
document.onscroll = function() {
    let currentScrollPos = window.pageYOffset;
    let prevScrollpos;
    console.log(currentScrollPos);
    if (screen.width < 594) {
        if (currentScrollPos > 24) {
            document.getElementById('main-name-left').style.display = 'none';

            document.getElementById('headers').style.height = '40px';

        } else {
            document.getElementById('main-name-left').style.display = 'flex';
            document.getElementById('headers').style.height = '68px';

        }
        prevScrollpos = currentScrollPos;
    }
}
let database = firebase.database().ref();
let auth = firebase.auth();
auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL);
//Sign In button if user is null
if (auth.currentUser == null) {
    nullUser();
    document.getElementById('sign').addEventListener('click', function() {
        signInDiv();
    });

} else {
    userExists();

}

document.getElementById('nav_edit').addEventListener('click', function() {
    try {
        console.log(auth.currentUser.uid);
        window.location = 'edit-showcase.html'

    } catch (e) {
        console.log('error:' + e.message);
    }
});
document.getElementById('logout').style.display = 'none';

document.getElementById('headeruser').addEventListener('click', function() {
    if (document.getElementById('logout').style.display == 'none') {
        document.getElementById('logout').style.display = 'block';
    } else {
        document.getElementById('logout').style.display = 'none';
    }

});

document.getElementById('logoutuser').addEventListener('click', function() {
    auth.signOut();
    window.location.reload();
});



setTimeout(function() {
    if (auth.currentUser != null) {
        userExists();
    } else {
        nullUser();
    }
}, 1000);




function signInDiv() {
    document.getElementById('login-div').style.display = 'flex';

    //close btn
    document.getElementById('close').addEventListener('click', function() {
        event.preventDefault();

        document.getElementById('login-div').style.display = 'none';
    });
    //login btn refresh page prevention
    document.getElementById('login-btn').addEventListener('click', function(event) {
        event.preventDefault();
    });
    //sign-up
    document.getElementById('signup-btn').addEventListener('click', function() {
        event.preventDefault();

        window.location.href = 'signup.html';
    });

    //login-btn
    document.getElementById('login-btn').addEventListener('click', function() {
        event.preventDefault();

        var email = document.getElementById('email-login').value;
        var password = document.getElementById('pwd-login').value;


        auth.signInWithEmailAndPassword(email, password)
            .then((user) => {

                alert("Signed in as" + email);
                userExists();

            })
            .catch((error) => {
                var errorCode = error.code;
                var errorMessage = error.message;
                alert(errorMessage);
            });

    });
}

function nullUser() {
    document.getElementById('nav_edit').style.display = 'none';
    document.getElementById('nav_your_showcase').style.display = 'none';
    document.getElementById('headeruser').style.display = 'none';
    document.getElementById('sign').style.display = 'block';
}

function userExists() {
    document.getElementById('nav_edit').style.display = 'block';
    document.getElementById('nav_your_showcase').style.display = 'block';
    document.getElementById('headeruser').style.display = 'block';
    let uid = auth.currentUser.uid;
    firebase.database().ref().child('users').child(uid).child('name').on('value', function(snapshot) {
        document.getElementById('headeruser').innerHTML = snapshot.val();
    });
    document.getElementById('sign').style.display = 'none';
    document.getElementById('login-div').style.display = 'none';
}