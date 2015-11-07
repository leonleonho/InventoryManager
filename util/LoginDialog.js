sap.ui.define([
   "sap/m/MessageToast",
   "./Service",
   "sap/m/Dialog",
   "sap/m/Input",
   "sap/m/Button",
   "sap/m/CheckBox"
], function (MessageToast, Service, Dialog, Input, Button, Checkbox) {
    "use strict";
    
    function LoginDialog(core) {
        var validate;
        var saved = localStorage.getItem("userName");
        var userNameInput = new Input({
            placeholder: "Username",
            value: saved
        });

        var passwordInput = new Input({
            placeholder: "Password",
            type: "Password"
        });
        var loginButton = new Button({
            text: "Login",
            width: "100%",
            press: function() {
                console.log("Pressed");
                validate();
            }
        });
        var rememberMe = new Checkbox({
            name: "Remember Me",
            text: "Remember Me",
            selected: saved ? true : false
        });

        var loginDialog = new Dialog({
            title: "Login",
            content: [userNameInput, passwordInput, rememberMe, loginButton]
        });
        
        function setErrorState() {
            userNameInput.setValueState("Error");
            passwordInput.setValueState("Error");
        }
        function clearErrorState() {
            userNameInput.setValueState("None");
            userNameInput.setValueState("None");
        }

        loginDialog.attachBrowserEvent("keypress", function (event) {
            if (event.keyCode === 13) {
                validate.call(this);
            }
        }.bind(this));

        var fireLoggedIn = function() {
            if(rememberMe.getSelected()) {
                localStorage.setItem("userName", userNameInput.getValue());
            } else {
                localStorage.setItem("userName", "");
            }
            setTimeout(function() {
                core.getEventBus().publish("app", "loggedin");
            });
        };

        validate = function() {
            clearErrorState();
            var username = userNameInput.getValue();
            var password = passwordInput.getValue();
            Service.init(APP_CONFIG.oDataService, username, password);
            loginDialog.setBusyIndicatorDelay(0);
            loginDialog.setBusy(true);
            Service.ajax({
                type: "Post",
                path: "api/Registration/Login"
            }).always(function(xhr){
                loginDialog.setBusy(false);
                if(xhr.status === 200) {
                    loginDialog.close();
                    fireLoggedIn();
                } else {
                    setErrorState();
                }
            });
        };

        
        this.show = function(){
            loginDialog.open();
        };

        sap.ui.getCore().getEventBus().subscribe("app", "authFailure", this.show, this);
    }

    return LoginDialog;
});
