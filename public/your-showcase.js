document.getElementById('headeruser').addEventListener('click', function(event) {
    event.preventDefault();
});
document.getElementById('nav_edit').addEventListener('click', function(event) {
    event.preventDefault();
    window.location = 'edit-showcase.html';
});
document.getElementById('home').addEventListener('click', function(event) {
    event.preventDefault();
    window.location = 'index.html';
});


let linkSet = new Set();
let links = {}
let uid;
let auth = firebase.auth();
let setRef = {}
let count = 0;
let link = window.location.href;

setTimeout(function() {
    uid = auth.currentUser.uid;
    firebase.database().ref().child('users').child(uid).child('name').on('value', function(snapshot) {
        document.getElementById('headeruser').innerHTML = snapshot.val();
    });

}, 1200);

setTimeout(function() {
    let numm;
    let bg_style;
    db.child(uid).child('links').child('background').on('value', s => {
        numm = s.val();
        console.log('Position', numm);
        bg_style = `background:url('logos/bg/` + numm + `.jpg') no-repeat fixed center; background-size:cover;`
        document.getElementById('bodys').style = bg_style;
        console.log(bg_style);

    });
}, 1200);

document.getElementById('createbtn').addEventListener('click', function() {
    document.getElementById('createlink').style.display = 'flex';

});




let db = firebase.database().ref('users');


document.getElementById('links-ul').style.display = 'flex';

//Main read db 
db.on('value', function(snapshot) {
    document.getElementById('links-ul').style.display = 'flex';
    if (snapshot.child(uid).child('links').child('count').val() > 0 || count > 0) {
        let s = snapshot.child(uid).child('links');
        let set = {};
        // let pos = 0;
        if (s.child('link').exists()) {

            for (const link in s.child('link').val()) {
                let pos = s.child('link').child(link).child('position').val();
                set[pos] = link;
                setRef[pos] = 'link';
                // pos++;
            }
        }
        if (s.child('video').exists()) {

            for (const link in s.child('video').val()) {
                let pos = s.child('video').child(link).child('position').val();
                set[pos] = link;
                setRef[pos] = 'video';
                // pos++;
            }
        }
        //ordering by position
        const set_ordered = Object.keys(set).sort().reduce(
            (obj, key) => {
                obj[key] = set[key];
                return obj;
            }, {}
        );
        // set_ordered = set;
        linkSet.clear();
        for (const l in set_ordered) {
            if (setRef[l] == 'link') {
                let turl = s.child('link').child(set_ordered[l]).child('url').val();
                const ul = document.querySelector('#links-ul');
                let li = document.createElement('li');
                li.setAttribute('class', 'link-link');
                li.onclick = function() {
                    window.open(turl, '_blank');
                }
                li.innerHTML = set_ordered[l];
                linkSet.add(li);
            } else {
                let turl = s.child('video').child(set_ordered[l]).child('url').val();
                const ul = document.querySelector('#links-ul');
                let li = document.createElement('li');
                let embedd = document.createElement('iframe');
                let e_container = document.createElement('div');
                e_container.setAttribute('class', 'iframe-container');
                e_container.setAttribute('id', 'iframe_');
                embedd.setAttribute('id', 'video' + l);
                embedd.setAttribute('class', 'embed-video');

                function getId(url) {
                    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
                    const match = url.match(regExp);

                    return (match && match[2].length === 11) ?
                        match[2] :
                        null;
                }
                let videoId = getId(turl);
                embedd.setAttribute('src', src = "https://www.youtube.com/embed/" + videoId);
                embedd.setAttribute('allowfullscreen', '');
                embedd.setAttribute('frameborder', 0);
                li.setAttribute('class', 'link-link-yt');
                li.onclick = function() {
                    if (e_container.getAttribute('style') == 'display:none') {
                        e_container.setAttribute('style', 'display:block');

                    } else {
                        e_container.setAttribute('style', 'display:none');
                    }
                }
                let d = document.createElement('div');
                d.innerHTML = set[l];
                e_container.appendChild(embedd);
                d.appendChild(e_container);
                li.appendChild(d);

                linkSet.add(li);
            }

        }
        document.getElementById('links-ul').innerHTML = '';
        for (const i of linkSet) {
            document.getElementById('links-ul').appendChild(i);
        }

    } else {
        alerts("No Links in you Showcase!")

    }
});