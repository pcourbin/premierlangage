function getSearchTerm()
{
    var sPageURL = window.location.search.substring(1);
    var sURLVariables = sPageURL.split('&');
    for (var i = 0; i < sURLVariables.length; i++)
    {
        var sParameterName = sURLVariables[i].split('=');
        if (sParameterName[0] == 'q')
        {
            return sParameterName[1];
        }
    }
}

$(function() {
    $('h1').on('reached', function() {
        var bol = false;
        var h1 = this;

        $('li').each(function() {
            if ($(this).find("a").html() === $(h1).html()) {
                bol = true;
                return false;
            }
        });
        if (bol) {
            $('li').each(function() {
                if ($(this).find("a").html() === $(h1).html())
                    $(this).addClass("active-toc");
                else
                    $(this).removeClass("active-toc");
            });
        }
    });
    $(document).on('scroll', function() {
        $('h1').each(function() {
            var wt = $(window).scrollTop();
            var at = $(this).position().top;
            var dt = at - wt;
            if( dt >= 0 && dt < 100)
                $(this).trigger('reached');
                
        });
    });
})

$(function() {
    $('h2').on('reached', function() {
        var bol = false;
        var h2 = this;

        $('li').each(function() {
            if ($(this).find("a").html() === $(h2).html()) {
                bol = true;
                return false;
            }
        });
        if (bol) {
            $('li').each(function() {
                if ($(this).find("a").html() === $(h2).html())
                    $(this).addClass("active-toc");
                else
                    $(this).removeClass("active-toc");
            });
        }
    });
    $(document).on('scroll', function() {
        $('h2').each(function() {
            var wt = $(window).scrollTop();
            var at = $(this).position().top;
            var dt = at - wt;
            if( dt >= 0 && dt < 100)
                $(this).trigger('reached');
                
        });
    });
})

$(function() {
    $('h3').on('reached', function() {
        var bol = false;
        var h3 = this;

        $('li').each(function() {
            if ($(this).find("a").html() === $(h3).html()) {
                bol = true;
                return false;
            }
        });
        if (bol) {
            $('li').each(function() {
                if ($(this).find("a").html() === $(h3).html())
                    $(this).addClass("active-toc");
                else
                    $(this).removeClass("active-toc");
            });
        }
    });
    $(document).on('scroll', function() {
        $('h3').each(function() {
            var wt = $(window).scrollTop();
            var at = $(this).position().top;
            var dt = at - wt;
            if( dt >= 0 && dt < 100)
                $(this).trigger('reached');
                
        });
    });
})

$(function() {
    $('h4').on('reached', function() {
        var bol = false;
        var h4 = this;

        $('li').each(function() {
            if ($(this).find("a").html() === $(h4).html()) {
                bol = true;
                return false;
            }
        });
        if (bol) {
            $('li').each(function() {
                if ($(this).find("a").html() === $(h4).html())
                    $(this).addClass("active-toc");
                else
                    $(this).removeClass("active-toc");
            });
        }
    });
    $(document).on('scroll', function() {
        $('h4').each(function() {
            var wt = $(window).scrollTop();
            var at = $(this).position().top;
            var dt = at - wt;
            if( dt >= 0 && dt < 100)
                $(this).trigger('reached');
                
        });
    });
})

$(document).ready(function() {

    var search_term = getSearchTerm(),
        $search_modal = $('#mkdocs_search_modal'),
        $keyboard_modal = $('#mkdocs_keyboard_modal');

    if(search_term){
        $search_modal.modal();
    }

    // make sure search input gets autofocus everytime modal opens.
    $search_modal.on('shown.bs.modal', function () {
        $search_modal.find('#mkdocs-search-query').focus();
    });

    // Keyboard navigation
    document.addEventListener("keydown", function(e) {
        if ($(e.target).is(':input')) return true;
        var key = e.which || e.keyCode || window.event && window.event.keyCode;
        var page;
        switch (key) {
            case 39:   // right arrow
                page = $('[role="navigation"] a:contains(Next):first').prop('href');
                break;
            case 37:   // left arrow
                page = $('[role="navigation"] a:contains(Previous):first').prop('href');
                break;
            case 83:   // s
                e.preventDefault();
                $keyboard_modal.modal('hide');
                $search_modal.modal('show');
                $search_modal.find('#mkdocs-search-query').focus();
                break;
            case 191:  // ?
                $keyboard_modal.modal('show');
                break;
            default: break;
        }
        if (page) {
            $keyboard_modal.modal('hide');
            window.location.href = page;
        }
    });

    // Highlight.js
    hljs.initHighlightingOnLoad();
    $('table').addClass('table table-striped table-hover');

    // Improve the scrollspy behaviour when users click on a TOC item.
    $(".bs-sidenav a").on("click", function() {
        var clicked = this;
        setTimeout(function() {
            var active = $('.nav li.active a');
            active = active[active.length - 1];
            if (clicked !== active) {
                $(active).parent().removeClass("active");
                $(clicked).parent().addClass("active");
            }
        }, 50);
    });

});


$('body').scrollspy({
    target: '.bs-sidebar',
});

/* Toggle the `clicky` class on the body when clicking links to let us
   retrigger CSS animations. See ../css/base.css for more details. */
$('a').click(function(e) {
    $('body').toggleClass('clicky');
});

/* Prevent disabled links from causing a page reload */
$("li.disabled a").click(function() {
    event.preventDefault();
});
