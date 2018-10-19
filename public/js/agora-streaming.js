if (!AgoraRTC.checkSystemRequirements()) {
    alert("Your browser does not support WebRTC!");
}
var client, localstream;
function join() {
    client = AgoraRTC.createClient({ mode: 'live', codec: "h264" });
    let channelKey = "";
    client.init("e61ee7f807d04f46a4edc53af7b8a3fd", function () {
        console.log("AgoraRTC client initialized");
        client.join(null, getCookie('CourseId'), parseInt(getCookie('UserId')), function (uid) {
            console.log("User " + uid + " join channel successfully");

            localStream = AgoraRTC.createStream({
                streamID: uid,
                audio: true,
                video: true,
                screen: false
            }
            );
            localStream.on("accessAllowed", function () {
                console.log("accessAllowed");
            });

            // The user has denied access to the camera and mic.
            localStream.on("accessDenied", function () {
                console.log("accessDenied");
            });

            localStream.init(function () {
                console.log("getUserMedia successfully");
                localStream.play('agora_local');

                client.publish(localStream, function (err) {
                    console.log("Publish local stream error: " + err);
                });

                client.on('stream-published', function (evt) {
                    console.log("Publish local stream successfully");
                });

            }, function (err) {
                console.log("getUserMedia failed", err);
            });

        }, function (err) {
            console.log("Join channel failed", err);
        });

    }, function (err) {
        console.log("AgoraRTC client init failed", err);
    });



    client.on('error', function (err) {
        console.log("Got error msg:", err.reason);
        if (err.reason === 'DYNAMIC_KEY_TIMEOUT') {
          client.renewChannelKey(channelKey, function () {
            console.log("Renew channel key successfully");
          }, function (err) {
            console.log("Renew channel key failed: ", err);
          });
        }
      });
      client.on('stream-added', function (evt) {
        var stream = evt.stream;
        console.log("New stream added: " + stream.getId());
        console.log("Subscribe ", stream);
        client.subscribe(stream, function (err) {
          console.log("Subscribe stream failed", err);
        });
      });

      client.on('stream-subscribed', function (evt) {
        var stream = evt.stream;
        console.log("Subscribe remote stream successfully: " + stream.getId());
        console.log("User joined" + evt.uid)
        console.log("Tutor cookie" +getCookie("TutorId"))
        if (stream.getId() == parseInt(getCookie("TutorId")) ) {
          stream.play('agora_tutor');
        } else {
          if ($('.other-views #' + stream.getId()).length === 0) {
            $('.other-views').append('<div style="float:left; width:210px;height:147px;display:inline-block;" id="' + stream.getId() + '"></div>');
          }
          stream.play('' + stream.getId());
        }

      });

      client.on('stream-removed', function (evt) {
        var stream = evt.stream;
        stream.stop();
        if (stream.getId() != parseInt(getCookie("TutorId")) ) {
            $('#' + stream.getId()).remove();
        }
      });

      client.on('peer-leave', function (evt) {
        var stream = evt.stream;
        if (stream) {
          stream.stop();
          // if (stream.getId() != getCookie("TutorId")) {
            if (stream.getId() != parseInt(getCookie("TutorId")) ) {
            $('#' + stream.getId()).remove();
        }
          console.log(evt.uid + " leaved from this channel");
        }
      });

}


function leave() {
    client.leave(function () {
        console.log("Leavel channel successfully");
    }, function (err) {
        console.log("Leave channel failed");
    });
}

function publish() {
    client.publish(localStream, function (err) {
        console.log("Publish local stream error: " + err);
    });
}

function unpublish() {
    client.unpublish(localStream, function (err) {
        console.log("Unpublish local stream failed" + err);
    });
}
