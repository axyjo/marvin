var Robot = Robot || {};

Robot.uber_get_ride = {
  run: function (entities, $el) {
    "use strict";
    var self = this;

    $.ajax('/api/uber/eta').done(
      function(response) {
        var times = response.times;
        if (entities.uber_types && false) {
          times = _.filter(times, {});
        }
        _.each(times, function(time) {
          var str = [
            time.localized_display_name,
            'in',
            self.formatMins(time.estimate),
            'mins'
          ].join(' ');
          $el.find("#result").append(str + '<br />');
        });
      }
    );
  },

  formatMins: function(seconds) {
    return Math.ceil(seconds / 60);
  }
};
