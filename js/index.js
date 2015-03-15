(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  (function($, moment, _, window) {
    'use strict';
    var Calendar, cal;
    if (Modernizr.csstransitions) {
      $('.no-js').hide();
      $('.js').show();
    }
    Calendar = (function() {
      function Calendar(path, deliveryDays) {
        this.start = __bind(this.start, this);
        this.clean = __bind(this.clean, this);
        this.addall = __bind(this.addall, this);
        this.additem = __bind(this.additem, this);
        this.tryAdd = __bind(this.tryAdd, this);
        this.refreshSelectedDays = __bind(this.refreshSelectedDays, this);
        this.isDeliveryDay = __bind(this.isDeliveryDay, this);
        this.refreshDays = __bind(this.refreshDays, this);
        this.refreshDate = __bind(this.refreshDate, this);
        this.cal = $(path);
        this.content = $(".content", this.cal);
        this.prevBtn = $(".btn.prev", this.cal);
        this.nextBtn = $(".btn.next", this.cal);
        this.deliveryDays = deliveryDays;
        this.currentmonthstiles = [];
        this.currentdate = moment();
        this.refreshDate();
        this.selectedDays = [];
      }

      Calendar.prototype.refreshDate = function() {
        var $month, $year;
        $month = $(".month", this.cal);
        $month.text(this.currentdate.format("MMMM"));
        $year = $(".year", this.cal);
        $year.text(this.currentdate.format("YYYY"));
        return this.refreshDays();
      };

      Calendar.prototype.refreshDays = function() {
        var i, monthday, queue, rec, wrapper, _i, _ref,
          _this = this;
        wrapper = $("<div class='wrapper'></div>");
        this.content.append(wrapper);
        monthday = this.currentdate.date(1).clone();
        queue = [];
        for (i = _i = 1, _ref = monthday.day(); _i <= _ref; i = _i += 1) {
          queue.push(void 0);
        }
        while (monthday.month() === this.currentdate.month()) {
          queue.push(monthday.clone());
          monthday.add(1, "day");
        }
        queue = queue.reverse();
        rec = function() {
          return setTimeout(function() {
            var d;
            if (queue.length) {
              rec();
              d = queue.pop();
              return _this.additem(wrapper, d);
            }
          }, 10);
        };
        rec();
        return this.wrapper = wrapper;
      };

      Calendar.prototype.isDeliveryDay = function(day) {
        var d, flag, _i, _len, _ref;
        flag = false;
        _ref = this.deliveryDays;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          d = _ref[_i];
          if (d === day) {
            flag = true;
          }
        }
        return flag;
      };

      Calendar.prototype.refreshSelectedDays = function() {
        var _this = this;
        return _.each(this.currentmonthstiles, function($div) {
          var date;
          date = $div.data("date");
          if (!date) {
            return;
          }
          if (_.some(_this.selectedDays, function(d) {
            return d.format("DD-MM-YYYY") === date.format("DD-MM-YYYY");
          })) {
            return $div.addClass("selected");
          } else {
            return $div.removeClass("selected");
          }
        });
      };

      Calendar.prototype.tryAdd = function(date) {
        var alreadyExists, sameWeek;
        alreadyExists = function(d) {
          return d.format("DD-MM-YYYY") === date.format("DD-MM-YYYY");
        };
        sameWeek = function(d) {
          return d.format("WW-YYYY") === date.format("WW-YYYY");
        };
        if (_.some(this.selectedDays, alreadyExists)) {
          _.remove(this.selectedDays, alreadyExists);
        } else {
          if (_.some(this.selectedDays, sameWeek)) {
            _.remove(this.selectedDays, sameWeek);
          }
          this.selectedDays.push(date);
        }
        return this.refreshSelectedDays();
      };

      Calendar.prototype.additem = function(wrapper, date) {
        var $div, cl, content, isDeliveryDay, parsedDay,
          _this = this;
        cl = "tile";
        content = "";
        isDeliveryDay = false;
        if (date === void 0) {
          cl += " invalid";
        } else {
          content = date.format("D");
          parsedDay = date.format("dddd");
          cl += " valid";
          if (this.isDeliveryDay(parsedDay) && moment().add(6, "days").diff(date) < 0) {
            cl += " delivery-day";
            isDeliveryDay = true;
          }
        }
        $div = $('<div class="' + cl + '">' + content + '</div>');
        $div.data("date", date);
        this.currentmonthstiles.push($div);
        wrapper.append($div);
        if (date) {
          if (isDeliveryDay) {
            $div.click(function() {
              return _this.tryAdd(date);
            });
          }
          return setTimeout(function() {
            $div.css("opacity", 1);
            return _this.refreshSelectedDays();
          }, 100);
        }
      };

      Calendar.prototype.addall = function() {
        var wrapper, x,
          _this = this;
        wrapper = $("<div class='wrapper'></div>");
        this.content.append(wrapper);
        x = function(max) {
          if (max === 0) {
            return;
          }
          _this.additem(wrapper);
          return setTimeout(function() {
            return x(max - 1);
          }, 20);
        };
        x(5 * 7);
        return this.wrapper = wrapper;
      };

      Calendar.prototype.clean = function() {
        var d, _i, _len, _ref;
        this.wrapper.remove();
        _ref = this.currentmonthstiles;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          d = _ref[_i];
          d.remove();
        }
        return this.currentmonthstiles = [];
      };

      Calendar.prototype.start = function() {
        var _this = this;
        console.log(this.cal);
        this.prevBtn.click(function() {
          _this.clean();
          _this.currentdate.subtract(1, "month");
          return _this.refreshDate();
        });
        return this.nextBtn.click(function() {
          _this.clean();
          _this.currentdate.add(1, "month");
          return _this.refreshDate();
        });
      };

      return Calendar;

    })();
    cal = new Calendar(".calendar", ["Wednesday", "Friday"]);
    cal.start();
    return window.cal = cal;
  })(jQuery, moment, _, this);

}).call(this);
