

module.exports = function(RED) {
    "use strict";
    
    var DEBUG   = false;
    var MAXLEN  = 160;
    var request = require('request');

    function ClickatellNode(n) {
        // Send SMS to Clickatell

            // Helper functions
            // Function for http post
            function http_post(req_url){
                           request.post(
                               req_url,
                               function(error, response, body) {
                                   console.log("Clickatel POST:")
                                   node.send("Clickatel POST:");
                                   if (!error && response.statusCode == 200) {
                                    if (DEBUG){
                                       console.log(body, response)
                                    }
                                    console.log(req_url)
                                    console.log(body)
                                    node.send(body);
                                   }
                               }
                           );
            }
           
            // Function for http get
            function http_get(req_url){
                           request.get(
                               bal_query,
                               function(error, response, body) {
                                   console.log("Clickatel GET:")
                                   node.send("Clickatel GET:");
                                   if (!error && response.statusCode == 200) {
                                    if (DEBUG){
                                       console.log(body, response)
                                    }
                                    console.log(req_url)
                                    console.log(body)
                                    node.send(body);
                                   }
                               }
                           );
            }

        var node = this;
        var msg = {};

        RED.nodes.createNode(this, n);

        var bal_query   = "http://api.clickatell.com/http/getbalance?api_id="+n.api_id+"&user="+n.username+"&password="+n.password;
        this.sms_default = n.sms_default;
        this.mobile_default = n.mobile_default;
        this.sms_default = n.sms_default;
        this.mobile_default = n.mobile_default;

        node.on('input', function(msg) {
            var number = (msg.topic == null) ? n.mobile_default : msg.topic;
            var text = (msg.payload == null) ? n.sms_default : msg.payload;

            if (/\D/.test(number)) {
                node.warn("Destination Number: " + numvalidator + "  contains invalid characters. Please enter a valid mobile number");
                return;
            }
            
            if (text.length > MAXLEN) {
               node.warn("Message length is: " + text.length + ", which exceeds the max SMS message length ("+MAXLEN+") by : " + (text.length - MAXLEN));
               return; 
            } 

            var url = "http://api.clickatell.com/http/sendmsg?user="+n.username+"&password="+n.password+"&api_id="+n.api_id+"&to="+number+"&text="+encodeURIComponent(text);
            if (DEBUG){
                console.log("Clickatel : "+number+" & sms : "+text);
            }
            http_post(url);
//            http_get(bal_query);
        });

    }

    RED.nodes.registerType("sms-out", ClickatellNode);
}
