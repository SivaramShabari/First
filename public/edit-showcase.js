document.getElementById('headeruser').addEventListener('click', function(event) {
    event.preventDefault();
});
document.getElementById('your_showcase').addEventListener('click', function(event) {
    event.preventDefault();
    window.location = 'showcase.html';
});
document.getElementById('home').addEventListener('click', function(event) {
    event.preventDefault();
    window.location = 'index.html';
});
document.getElementById('link-add-form').addEventListener('click', function(event) {
    event.preventDefault();
});





let linkSet = new Set();
let links = {}
let uid;
let auth = firebase.auth();
let setRef = {}
let count = 0;
let num = 1;

setTimeout(function() {
    uid = auth.currentUser.uid;
    firebase.database().ref().child('users').child(uid).child('name').on('value', function(snapshot) {
        document.getElementById('headeruser').innerHTML = snapshot.val();
    });
}, 1200);



document.getElementById('createbtn').addEventListener('click', function() {
    document.getElementById('createlink').style.display = 'flex';

});




let db = firebase.database().ref('users');


document.getElementById('links-ul').style.display = 'flex';


// Main read db 
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
        console.log(setRef);
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
                    editLink(set[l], turl);
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
                    editVideo(set[l], turl);
                }
                let d = document.createElement('div');
                d.innerHTML = set[l];
                e_container.appendChild(embedd);
                d.appendChild(e_container);
                li.appendChild(d);

                linkSet.add(li);
            }

        }
        console.log('set:', linkSet);
        document.getElementById('links-ul').innerHTML = '';
        for (const i of linkSet) {
            document.getElementById('links-ul').appendChild(i);
        }







    } else {
        // document.getElementById('createbtn').style.display = 'flex';

        // document.getElementById('create-showcase').addEventListener('click', function() {
        //     document.getElementById('linkbtn').addEventListener('click', function() {
        //         let _url = document.getElementById('url-input').value;
        //         let name = document.getElementById('url-name').value;
        //         if (validURL(_url) && name.trim() !== '') {

        //             document.getElementById('createbtn').style.display = 'none';
        //             document.getElementById('createlink').style.display = 'none';
        //         } else {
        //             alerts('Please enter a valid url and name');
        //         }
        //     });
        // });
        let li = document.createElement('li');
        li.innerHTML = 'No links to display.'
        document.getElementById('links-ul').appendChild(li);

    }
});


//embed video form
document.getElementById('embedform').addEventListener('click', function() {
    embedLink();
});
//embed video


//edit link function
function editLink(name, url) {
    document.getElementById('edit-link').style.display = 'flex';
    document.getElementById('links-ul').style.display = 'none';

    document.getElementById('edit-name').value = name;
    document.getElementById('edit-url').value = url;
    let oldname = name;
    //edit and save changes
    document.getElementById('editbtn').addEventListener('click', function() {

        let _url = document.getElementById('edit-url').value;
        let _name = document.getElementById('edit-name').value;
        if (validURL(_url) && _name.trim() !== '') {
            db.child(uid).child('links').child('link').child(oldname).set(null);
            db.child(uid).child('links').child('link').child(_name).child('url').set(_url);
            window.location.reload();
        } else {
            alert('Please enter a valid url and name');
        }
    });

    document.getElementById('closes').addEventListener('click', function() {
        document.getElementById('edit-link').style.display = 'none';
        document.getElementById('links-ul').style.display = 'flex';

    });

    //deletelink
    document.getElementById('editdel').addEventListener('click', function() {
        document.getElementById('edit-name').value = name;
        document.getElementById('edit-url').value = url;
        deleteLink(name);

    });


}




function editVideo(name, url) {
    document.getElementById('edit-link').style.display = 'flex';
    document.getElementById('links-ul').style.display = 'none';

    document.getElementById('edit-name').value = name;
    document.getElementById('edit-url').value = url;
    let oldname = name;
    //edit and save changes
    document.getElementById('editbtn').addEventListener('click', function() {

        let _url = document.getElementById('edit-url').value;
        let _name = document.getElementById('edit-name').value;
        if (validURL(_url) && _name.trim() !== '') {
            db.child(uid).child('links').child('video').child(oldname).set(null);
            db.child(uid).child('links').child('video').child(_name).child('url').set(_url);
            window.location.reload();
        } else {
            alert('Please enter a valid url and name');
        }
    });

    document.getElementById('closes').addEventListener('click', function() {
        document.getElementById('edit-link').style.display = 'none';
        document.getElementById('links-ul').style.display = 'flex';

    });

    //deletelink
    document.getElementById('editdel').addEventListener('click', function() {
        document.getElementById('edit-name').value = name;
        document.getElementById('edit-url').value = url;
        deleteVideo(name);

    });


}

let bg_style = `background:url('logos/bg/` + num + `.jpg') no-repeat fixed center; background-size:cover;`
document.getElementById('bodys').style = bg_style;
document.getElementById('edit-theme').addEventListener('click', function() {
    num++;
    if (num > 7) {
        num = 1;
    }
    db.child(uid).child('links').child('background').set(num);
    let bg_style = `background:url('logos/bg/` + num + `.jpg') no-repeat fixed center; background-size:cover;`
    document.getElementById('bodys').style = bg_style;

})




//edit link



//Add link button 
document.getElementById('ex-add').addEventListener('click', function() {
    document.getElementById('createlink').style.display = 'flex';
    document.getElementById('links-ul').style.display = 'none';

    document.getElementById('close').addEventListener('click', function() {
        document.getElementById('createlink').style.display = 'none';
    });
    document.getElementById('linkbtn').addEventListener('click', function() {
        let _url = document.getElementById('url-input').value;
        let name = document.getElementById('url-name').value;
        if (validURL(_url) && name.trim() !== '') {
            createLink(name, _url);
        } else {
            alerts('Please enter a valid url and name');
        }
    });
    document.getElementById('close').addEventListener('click', function() {
        document.getElementById('createlink').style.display = 'none';
        document.getElementById('links-ul').style.display = 'flex';

    });

});

// validation of url using regex
function validURL(str) {
    var pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
        '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
        '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
    return !!pattern.test(str);
}





//embed video function
function embedLink() {
    document.getElementById('embed-link').style.display = 'flex';
    document.getElementById('links-ul').style.display = 'none';

    let emurl, emname;
    console.log(emurl);
    document.getElementById('embedbtn').addEventListener('click', function() {
        emname = document.getElementById('embed-name').value;
        emurl = document.getElementById('embed-url').value;
        if (validURL(emurl) && emname.trim() !== '') {
            createVideo(emname, emurl);
        } else {
            alerts('Please enter a valid url and name');
        }
    });
    document.getElementById('close-embed').addEventListener('click', function() {
        document.getElementById('embed-link').style.display = 'none';
        document.getElementById('links-ul').style.display = 'flex';

    });
}


function createLink(name, url) {
    let u;
    let flag;
    db.child(uid).child('links').on('value', s => {
        if (s.child('link').child(name).exists() || s.child('video').child(name).exists()) {
            flag = true;
            console.log(flag)
        } else {
            flag = false;
            u = s.child('count').val();
        }

    });
    if (!flag) {
        u++;
        db.child(uid).child('links').child('link').child(name).child('url').set(url);
        db.child(uid).child('links').child('count').set(u);
        db.child(uid).child('links').child('link').child(name).child('position').set(u);
        window.location.reload();
    } else {
        alerts('Duplicate Names. You have a link with a similar name. Kindly enter a different name for your link');

    }

}

function createVideo(name, url) {
    let u;
    let flag;
    db.child(uid).child('links').on('value', s => {
        if (s.child('video').child(name).exists() || s.child('link').child(name).exists()) {
            flag = true;
        } else {
            flag = false;
            u = s.child('count').val();
        }

    });
    if (!flag) {
        u++;
        db.child(uid).child('links').child('video').child(name).child('url').set(url);
        db.child(uid).child('links').child('count').set(u);
        db.child(uid).child('links').child('video').child(name).child('position').set(u);
        window.location.reload();
    } else {
        document.getElementById('links-ul').style.display = 'none';
        alerts('Duplicate Names. You have a video with a similar name. Kindly enter a different name for your link');

    }


}

function deleteLink(name) {
    let position;
    db.child(uid).child('links').once('value').then(function(s) {
        position = s.child('link').child(name).child('position').val();
        for (const loop in s.child('link').val()) {
            let pos = s.child('link').child(loop).child('position').val();
            console.log('delete  ' + name, pos);
            console.log('change pos' + loop, pos);
            if (pos > position) {
                console.log('change pos' + loop, pos);
                db.child(uid).child('links').child('link').child(loop).child('position').set(pos - 1);
            }
        }
        for (const loop in s.child('video').val()) {
            let pos = s.child('video').child(loop).child('position').val();
            if (pos > position) {
                db.child(uid).child('links').child('video').child(loop).child('position').set(pos - 1);
            }
        }
    });
    db.child(uid).child('links').child('link').child(name).set(null);
    setTimeout(() => { window.location.reload(); }, 1000);

}



function deleteVideo(name) {
    let position;
    db.child(uid).child('links').once('value').then(function(s) {
        position = s.child('video').child(name).child('position').val();
        console.log('del-item-pos :', position);

        for (const loop in s.child('link').val()) {
            let pos = s.child('link').child(loop).child('position').val();
            if (pos > position) {
                console.log('if', pos + '>' + position);
                db.child(uid).child('links').child('link').child(loop).child('position').set(pos - 1);
            }
        }
        for (const loop in s.child('video').val()) {
            let pos = s.child('video').child(loop).child('position').val();
            if (pos > position) {
                db.child(uid).child('links').child('video').child(loop).child('position').set(pos - 1);
            }
        }
    });
    alerts('deleted');
    db.child(uid).child('links').child('video').child(name).set(null);
    setTimeout(() => { window.location.reload(); }, 1000);



}

function alerts(msg) {
    document.getElementById('alerts').style.display = 'flex'
    document.getElementById('links-ul').style.display = 'none';

    document.getElementById('alert-box').innerHTML = msg;
    document.getElementById('alerts').addEventListener('click', function() {
        document.getElementById('alerts').style.display = 'none';


    })
}

//update count of links automatically
setTimeout(() => {
    db.child(uid).child('links').child('background').on('value', s => {
        num = s.val();
        let bg_style = `background:url('logos/bg/` + num + `.jpg') no-repeat fixed center; background-size:cover;`
        document.getElementById('bodys').style = bg_style;
    });
    db.child(uid).child('links').on('value', s => {
        let u;
        u = s.child('link').numChildren() + s.child('video').numChildren();
        console.log(u);
        db.child(uid).child('links').child('count').set(u);
        count = u;
    });
}, 1400);