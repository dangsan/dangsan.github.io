
root = document.body;

// Content

// Fancy animation
var Home = {
    oncreate: function(vnode) {
        // Get canvas element
        var canvas = vnode.dom;
        var doResize = function() {
            canvas.width = canvas.parentElement.clientWidth;
            canvas.height = canvas.parentElement.clientHeight;
        };
        window.addEventListener('resize', doResize);

        doResize();
        vnode.state.canvas = canvas;

        var ball = {
            radius: 10,
            x: 10,
            y: 10,
            vx: 10,
            vy: 10
        };

        var r = 127, g = 127, b = 127;
        var counter = 0;
        var rate = 0.01;

        // Start updating
        vnode.state.frameTimeout = setInterval(function() {
            var ctx = canvas.getContext('2d');
            
            r = Math.round(127 + 127 * Math.sin(counter * rate));
            g = Math.round(127 + 127 * Math.sin(counter * rate + 0.5));
            b = Math.round(127 + 127 * Math.sin(counter * rate + 1.5));
            counter++;

            // Draw
            //ctx.clearRect(0, 0, canvas.width, canvas.height);
            var colorString = 'rgb(' + r + ', ' + g + ', ' + b + ')';
            ctx.fillStyle = colorString;
            ctx.strokeStyle = colorString;
            console.log(colorString);

            ctx.beginPath();
            ctx.arc(ball.x, ball.y, ball.radius, 0, 2*Math.PI);
            ctx.fill();

            // Update
            ball.x += ball.vx;
            ball.y += ball.vy;
            if((ball.x >= canvas.width && ball.vx > 0) || (ball.x <= 0 && ball.vx < 0))
                ball.vx = -ball.vx;
            if((ball.y >= canvas.height && ball.vy > 0) || (ball.y <= 0 && ball.vy < 0))
                ball.vy = -ball.vy;

        }, 33)
    },
    onbeforeremove: function(vnode) {
        clearInterval(vnode.state.frameInterval);
    },
    view: function(vnode) {
        return m('canvas.home-canvas', {
            onresize: function(el) {
                console.log('Resizing...');
                el.width = el.parentElement.clientWidth;
                el.height = el.parentElement.clientHeight;
            }
        });
    }
};

var About = {
    view: function() {
        return [
            `
            I'm in my final year pursuing a B.S. in Computer Science at the 
            University of Illinois Urbana-Champaign.
            `,
            `
            testing testing
            `].map(function(item) {
                return m('p', item);
            });
    }
};

var Links = {
    view: function() {
        return m('p', 'links here');
    }
};


// Layout and utility components
var NavLink = {
    view: function(vnode) {
        return m('button.btn.btn-link.navbar-link.rounded', {
                type: 'button',
                onclick: function() {
                    location.href = '#!/' + vnode.attrs.href;
                }
            },
            vnode.attrs.label
        );
    }
};

var Sidebar = {
    view: function(vnode) {
        return m('div.col-sm-3.rounded.ianwells-sidebar',
            m('div',
                m('h1', 'Ian Wells'),
                m('p', m('i', 'I write software'))
            ),

            [
                {href: '', label: 'Home'},
                {href: 'about', label: 'About me'},
                {href: 'links', label: 'Links'}
            ].map(function(item) {
                return m(NavLink, item);
            })
        );
    }
};

var Layout = {
    view: function(vnode) {
        return m('div.row.h-100',
            m(Sidebar),
            m('div.col-sm-9.h-100', vnode.children)
        );
    }
};


// Set up routing
var makeLayout = function(component) {
    return {view: function() {return m(Layout, m(component));}};
};

m.route(root, '/', {
    '/': makeLayout(Home),
    '/about': makeLayout(About),
    '/links': makeLayout(Links)
});

