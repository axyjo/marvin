var Robot = Robot || {};

Robot.remind = {
  run: function (entities, $el) {
    "use strict";
    if (entities.duration) {
      var str = "You asked me to remind you ";
      if (entities.message_subject) {
        str += "to \"" + entities.message_subject.value + "\" ";
      }
      str += entities.duration.value + " seconds ago.";

      setTimeout(function() {
        window.alert(str);
      }, entities.duration.value * 1000);
    }
  }
};
