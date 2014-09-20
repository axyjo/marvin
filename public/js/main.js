(function ($){
  var mic = new Wit.Microphone(document.getElementById("microphone"));
    var info = function (msg) {
      document.getElementById("info").innerHTML = msg;
    };
    mic.onready = function () {
      info("Microphone is ready to record");
    };
    mic.onaudiostart = function () {
      info("Recording started");
    };
    mic.onaudioend = function (hey) {
      console.log(hey)
      info("Recording stopped, processing started");
    };
    mic.onerror = function (err) {
      info("Error: " + err);
    };
    mic.onresult = function (intent, entities, response) {
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
    mic.connect("SEQIOU2HL5YXX3DIPEPTAAPRDU6NM6V5");
    // mic.start();
    // mic.stop();

    function kv (k, v) {
      if (toString.call(v) !== "[object String]") {
        v = JSON.stringify(v);
      }
      return k + "=" + v + "\n";
    }

})()