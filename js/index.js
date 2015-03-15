(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  (function($, window) {
    'use strict';
    var Calendar, cal;
    if (Modernizr.csstransitions) {
      $('.no-js').hide();
      $('.js').show();
    }
    Calendar = (function() {
      function Calendar(path) {
        this.start = __bind(this.start, this);
        this.clean = __bind(this.clean, this);
        this.addall = __bind(this.addall, this);
        this.additem = __bind(this.additem, this);
        this.cal = $(path);
        this.content = $(".content", this.cal);
        this.prevBtn = $(".btn.prev", this.cal);
        this.nextBtn = $(".btn.next", this.cal);
        this.days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        this.months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        this.currentmonthstiles = [];
        this.wrapper = $("<div class='wrapper'></div>", this.content);
      }

      Calendar.prototype.additem = function(wrapper) {
        var $div;
        $div = $('<div class="tile"></div>');
        this.currentmonthstiles.push($div);
        wrapper.append($div);
        return setTimeout(function() {
          return $div.css("opacity", 1);
        }, 100);
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
        this.addall();
        this.prevBtn.click(function() {
          _this.clean();
          return _this.addall();
        });
        return this.nextBtn.click(function() {
          _this.clean();
          return _this.addall();
        });
      };

      return Calendar;

    })();
    cal = new Calendar(".calendar");
    cal.start();
    return window.cal = cal;
  })(jQuery, this);

}).call(this);
