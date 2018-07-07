/**
 * @author J. Djimitry Riviere
 * @name Main.JS
 * @version 0.1.0
 * @description Runs the Server side of the application.
 */

let update = document.getElementById('update');
let del = document.getElementById('delete');

update.addEventListener('click', () => {
    // PUT request
    fetch('quotes', {
        method: 'put',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            'name': 'The Forgotten Prince',
            'quote': 'Coffeemakers are like friendships, for they filter relationships.'
        })
    })
    .then((res) => {
        if (res.ok) return res.json();
    })
    .then((data) => {
        console.log(data);
        window.location.reload(true);
    });
});

del.addEventListener('click', () => {
    // PUT request
    fetch('quotes', {
        method: 'delete',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 'name': 'The Forgotten Prince' })
    })
    .then((res) => {
        if (res.ok) return res.json();
    })
    .then((data) => {
        console.log(data);
        window.location.reload(true);
    });
});