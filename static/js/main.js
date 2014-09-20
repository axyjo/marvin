$(function (){

  var Uber = Backbone.Model.extend({

  })



  var MicView = Backbone.View.extend({
    witAiClientKey: 'SEQIOU2HL5YXX3DIPEPTAAPRDU6NM6V5',
    el: $('.body'),
    template: $("#mic-template").html(),
    uberTemplate: $('#uber-template').html(),
    shotsFiredTemplate: $('#shots-fired-template').html(),
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
        self.determineIntent(intent, entities, response);
      };
      this.mic.connect(this.witAiClientKey);
    },
    determineIntent: function (intent, entities){
      var self = this;
      if(intent === 'shots_fired'){
        this.showPewPew();
      } else {
        $.ajax({
          url: "/callback/wit",
          type: "POST",
          data: JSON.stringify(response),
          dataType: "json",
          contentType: "application/json",
          success: function(result) {
            console.log(result);
            if (intent === 'uber_get_ride'){
              self.getUberRide(entities, result);
            }
            else if (intent === 'remind'){
              self.remindUs(entities);
            }
            else if (intent === 'person_search'){
              self.searchPerson(entities);
            }

            self.$el.find('.error').text(result.response);
          }
        });
      }
    },
    badConfidence: function (){
      this.$el.find(".error").text("Sorry, we couldn't make out what you said. Can you try again?");
    },
    showPewPew: function (){
      var compiled = Handlebars.compile(this.shotsFiredTemplate);
      this.$el.css('width', '700px');
      this.$el.append(compiled());
    },
    getUberRide: function (entities, response){
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
      );
    },
    searchPerson:function (entities){
      var self = this;
      $.ajax('/')
    },
    getInfoDiv: function (msg) {
      document.getElementById("info").innerHTML = msg;
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
