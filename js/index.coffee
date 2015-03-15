(($, moment, _, window) ->
    'use strict'

    # INIT
    if Modernizr.csstransitions
        $('.no-js').hide()
        $('.js').show()

    class Calendar

        constructor: (path, deliveryDays) ->
            @cal = $(path)
            @content = $(".content", @cal)
            @prevBtn = $(".btn.prev", @cal)
            @nextBtn = $(".btn.next", @cal)
            @deliveryDays = deliveryDays
            @currentmonthstiles = []
            @currentdate = moment()
            @refreshDate()
            @selectedDays = []

        refreshDate: =>
            $month = $(".month", @cal)
            $month.text(@currentdate.format("MMMM"))
            $year = $(".year", @cal)
            $year.text(@currentdate.format("YYYY"))
            @refreshDays()

        refreshDays: =>
            wrapper = $("<div class='wrapper'></div>")
            @content.append(wrapper)
            monthday = @currentdate.date(1).clone()
            queue = []
            for i in [1..monthday.day()] by 1
                queue.push undefined
            while monthday.month() is @currentdate.month()
                queue.push monthday.clone()
                monthday.add(1, "day")
            queue = queue.reverse()
            rec = () =>
                setTimeout(() =>
                    if queue.length
                        rec()
                        d = queue.pop()
                        @additem wrapper, d
                , 10)
            rec()
            @wrapper = wrapper

        isDeliveryDay: (day) =>
            flag = false
            for d in @deliveryDays
                if d is day
                    flag = true
            flag

        refreshSelectedDays: =>
            _.each(@currentmonthstiles, ($div) =>
                date = $div.data("date")
                if not date
                    return;
                if _.some(@selectedDays, (d) => d.format("DD-MM-YYYY") is date.format("DD-MM-YYYY"))
                    $div.addClass("selected")
                else
                    $div.removeClass("selected")
            )

        tryAdd: (date) =>
            alreadyExists = (d) -> d.format("DD-MM-YYYY") is date.format("DD-MM-YYYY")
            sameWeek =  (d) -> d.format("WW-YYYY") is date.format("WW-YYYY")
            if _.some(@selectedDays, alreadyExists)
                _.remove(@selectedDays, alreadyExists)
            else
                if _.some(@selectedDays, sameWeek)
                    _.remove(@selectedDays, sameWeek)
                @selectedDays.push date
            @refreshSelectedDays()

        additem: (wrapper, date) =>
            cl = "tile"
            content = ""
            isDeliveryDay = false
            if date is undefined
                cl += " invalid"
            else
                content = date.format("D")
                parsedDay = date.format("dddd")
                cl += " valid"
                if @isDeliveryDay(parsedDay) and moment().diff(date) < 0
                    cl += " delivery-day"
                    isDeliveryDay = true
            $div = $('<div class="' + cl + '">' + content + '</div>')
            $div.data("date", date)
            @currentmonthstiles.push $div
            wrapper.append($div)
            if date
                if isDeliveryDay
                    $div.click () =>
                        @tryAdd date
                setTimeout(() =>
                    $div.css("opacity", 1)
                    @refreshSelectedDays()
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
            # @addall()
            @prevBtn.click () =>
                @clean()
                # @addall()
                @currentdate.subtract(1, "month")
                @refreshDate()
            @nextBtn.click () =>
                @clean()
                # @addall()
                @currentdate.add(1, "month")
                @refreshDate()

    cal = new Calendar ".calendar", ["Wednesday", "Friday"]
    cal.start()
    window.cal = cal


)(jQuery, moment, _, this)
