$(function (){

  var Uber = Backbone.Model.extend({

  })



  var MicView = Backbone.View.extend({
    witAiClientKey: 'SEQIOU2HL5YXX3DIPEPTAAPRDU6NM6V5',
    el: $('.body'),
    template: $("#mic-template").html(),
    uberTemplate: $('#uber-template').html(),
    callbackServices: Robot,
    createMic: function (){
      var self = this;
      this.mic = new Wit.Microphone(document.getElementById("microphone"));

      this.mic.onready = function () {
        self.getInfoDiv("Microphone is ready to record");
      };
      this.mic.onaudiostart = function () {
        self.getInfoDiv("Recording started");
        self.$el.find(".error").empty();
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
          self.badConfidence();
          return;
        }
        self.determineIntent(intent, entities);

        //self.$el.find("#result").html(intent + "<br />");
        //self.$el.find("#msgBody").html('You said "' + response.msg_body + '"');


        // if (self.callbackServices[intent]) {
        //   self.callbackServices[intent].run(entities, self.$el);
        // }
      };
      this.mic.connect(this.witAiClientKey);
    },
    badConfidence: function (){
      this.$el.find(".error").text("Sorry, we couldn't make out what you said. Can you try again?");
    },
    showPewPew: function (){
      this.$el.find('#result').append('Pew Pew.');
    },
    getUberRide: function (entities){
      var self = this;
      $.ajax('/api/uber/eta').done(
        function (response) {
          var times = response.times;
          if (entities.uber_types && false) {
            times = _.filter(times, {});
          }
          var collection  = [];
          _.each(times, function (time) {
            var model = {};
            model.ride = time.localized_display_name
            model.time = self.formatMins(time.estimate);
            collection.push(model);
          });
          self.renderUber(collection);
        }
      );
    },
    getInfoDiv: function (msg) {
      document.getElementById("info").innerHTML = msg;
    },
    determineIntent: function (intent, entities){
      var self = this;
      if(intent === 'shots_fired')
        this.showPewPew();
      else if (intent === 'uber_get_ride')
        this.getUberRide(entities);
      else if (intent === 'remind')
        this.remindUs(entities);
    },
    formatMins: function(seconds) {
      return Math.ceil(seconds / 60);
    },
    render: function (){
      this.createMic();
      return this;
    },
    renderUber: function (collection){

      var compiled = Handlebars.compile(this.uberTemplate);
      this.$el.hide();
      this.$el.css('width', '400px');
      this.$el.append(compiled({collection: collection}));
      this.$el.slideDown();
    },
    removeIntent: function (){

    }
  });


  var app = new MicView();
  app.render();
  Backbone.history.start();

});
