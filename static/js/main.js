$(function (){
  
  function kv (k, v) {
    if (toString.call(v) !== "[object String]") {
      v = JSON.stringify(v);
    }
    return k + "=" + v + "\n";
  }

  var MicView = Backbone.View.extend({
    el: $('.container'),
    template: _.template($("#mic-template").html()),
    initialize: function (){
           
    },
    createMic: function (){
      var that = this;
      this.mic = new Wit.Microphone(document.getElementById("microphone"));
      
      this.mic.onready = function () {
        that.getInfoDiv("Microphone is ready to record");
      };
      this.mic.onaudiostart = function () {
        that.getInfoDiv("Recording started");
      };
      this.mic.onaudioend = function (hey) {
        console.log(hey)
        that.getInfoDiv("Recording stopped, processing started");
      };
      this.mic.onerror = function (err) {
        that.getInfoDiv("Error: " + err);
      };
      this.mic.onresult = function (intent, entities, response) {
        var r = kv("intent", intent);

        for (var k in entities) {
          var e = entities[k];

          if (!(e instanceof Array)) {
            r += kv(k, e.value);
          } else {
            for (var i = 0; i < e.length; i++) {
              r += kv(k, e[i].value);
            }
          }
        }

        document.getElementById("result").innerHTML = r;
        document.getElementById("msgBody").innerHTML = 'You said "' + response.msg_body + '"';
      };
      this.mic.connect("SEQIOU2HL5YXX3DIPEPTAAPRDU6NM6V5");
      // mic.start();
      // mic.stop();
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

  var AppView = Backbone.View.extend({
    el: $('.container')

  });

  var micView = new MicView();
  var appView = new AppView();

  micView.render();
});