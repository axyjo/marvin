$(function (){

  var MicView = Backbone.View.extend({
    witAiClientKey: 'SEQIOU2HL5YXX3DIPEPTAAPRDU6NM6V5',
    el: $('.container'),
    template: _.template($("#mic-template").html()),
    callbackServices: Robot,

    initialize: function (){

    },

    createMic: function (){
      var self = this;
      this.mic = new Wit.Microphone(document.getElementById("microphone"));

      this.mic.onready = function () {
        self.getInfoDiv("Microphone is ready to record");
      };
      this.mic.onaudiostart = function () {
        self.getInfoDiv("Recording started");
      };
      this.mic.onaudioend = function () {
        self.getInfoDiv("Recording stopped, processing started");
      };
      this.mic.onerror = function (err) {
        self.getInfoDiv("Error: " + err);
      };
      this.mic.onresult = function (intent, entities, response) {
        // If we're very unsure of the message, ignore it.
        if (response.outcome.confidence < 0.5) {
          return;
        }

        self.$el.find("#result").html(intent + "<br />");
        self.$el.find("#msgBody").html('You said "' + response.msg_body + '"');

        if (self.callbackServices[intent]) {
          self.callbackServices[intent].run(entities, self.$el);
        }
      };
      this.mic.connect(this.witAiClientKey);
    },

    getInfoDiv: function (msg) {
      document.getElementById("info").innerHTML = msg;
    },

    render: function (){
      this.$el.html(this.template()).trigger('create');
      this.createMic();
      return this;
    }
  });

  var app = new MicView();
  app.render();
  Backbone.history.start();

});
