var Robot = Robot || {};

Robot.shots_fired = {
  run: function (entities, $el) {
    "use strict";
    $el.find("#result").append("Pew pew.");
  }
};
