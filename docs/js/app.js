$(document).ready(function() {
    $('.navigation_contain').show();

    // Navigation Menu opener for small screens...
    $(".nav_trigger").click(function(e) {
        e.preventDefault();
        $("html").toggleClass("nav--on");
        $(".bar").toggleClass("animate");
    });
});

// var current = $('.docs_sidebar ul').find('li a[href="' + window.location.pathname + '"]');

// if (current.length) {
//     current.parent().parent().parent().addClass('sub--on');

//     current.parent().addClass('active');
// }

$(".docs_sidebar h2").click(function(e) {
    e.preventDefault();
    let currenty_active = $(this).parent().hasClass('sub--on');
    $(".navigation_contain ul .laravel").removeClass("sub--on");
    if (!currenty_active) {
        $(this).parent().addClass("sub--on");
    }
});

// $('#version_switcher').change(function(e) {
//     window.location = $('#version_switcher').val();
// });

$('.docs_main blockquote p').each(function() {
    var str = $(this).html();
    var match = str.match(/\{(.*?)\}/);
    var img, color;

    if (match) {
        var type = match[1] || false;
    }

    if (type) {
        switch (type) {
            case "note":
                img = 'img/callouts/exclamation.min.svg';
                color = 'red';
                break;
            case "tip":
                img = 'img/callouts/lightbulb.min.svg';
                color = 'purple';
                break;
        }

        $(this).wrap('<div></div>');
        $(this).before('<div class="icon ' + color + '"><img src="' + img + '"></div>');
        $(this).html(str.replace(/\{(.*?)\}/, ''));
        $(this).addClass('content');
        $(this).parent().addClass('callout');
    }
});

function replacer(match, p1, offset, string) {
    return "<a href='https://github.com/LycheeOrg/Lychee/issues/" + p1 + "'>&sharp;" + p1 + "</a>";
}

function replacer_v3(match, p1, offset, string) {
    return "<a href='https://github.com/LycheeOrg/Lychee-v3/issues/" + p1 + "'>&sharp;" + p1 + "</a>";
}

function replacer_e(match, p1, offset, string) {
    return "<a onclick=\"alert('Destination is dead (404).');\" style=\"cursor: pointer;\">&sharp;" + p1 + "</a>";
}

$('.docs_main ul li, .issuelinks').each(function() {
    var str = $(this).html();
    str = str.replace(/e\#([0-9]+)/g, replacer_e);
    str = str.replace(/3\#([0-9]+)/g, replacer_v3);
    str = str.replace(/\#([0-9]+)/g, replacer);
    $(this).html(str);
});
