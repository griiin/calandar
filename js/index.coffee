(($, window) ->
    'use strict'

    # INIT
    if Modernizr.csstransitions
        $('.no-js').hide()
        $('.js').show()

    class Calendar

        constructor: (path) ->
            @cal = $(path)
            @content = $(".content", @cal)
            @prevBtn = $(".btn.prev", @cal)
            @nextBtn = $(".btn.next", @cal)
            @days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
            @months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
            @currentmonthstiles = []
            @wrapper = $("<div class='wrapper'></div>", @content)

        additem: (wrapper) =>
            $div = $('<div class="tile"></div>')
            @currentmonthstiles.push $div
            wrapper.append($div)
            setTimeout(() ->
                $div.css("opacity", 1)
            , 100)

        addall: =>
            wrapper = $("<div class='wrapper'></div>")
            @content.append(wrapper)
            x = (max) =>
                if max is 0
                    return;
                @additem wrapper
                setTimeout(() =>
                    x(max - 1)
                , 20)
            x(5*7)
            @wrapper = wrapper

        clean: =>
            @wrapper.remove()
            for d in @currentmonthstiles
                d.remove()
            @currentmonthstiles = []

        start: =>
            console.log @cal
            @addall()
            @prevBtn.click () =>
                @clean()
                @addall()
            @nextBtn.click () =>
                @clean()
                @addall()

    cal = new Calendar ".calendar"
    cal.start()
    window.cal = cal


)(jQuery, this)
