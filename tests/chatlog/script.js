// @import ../../src/ui
// @import https://opensource.liveg.tech/ZaprCoreLibs/src/core/core

core.unpack(ui.components);

var chat = new Container();

var usernameInput = new TextInput("", "Username");
var messageInput = new TextInput("", "Message");

ui.screen = [
    chat,
    new Container([
        usernameInput,
        messageInput,
        new Button("Post", false, {}, {}, {
            click: function() {
                chat.children.push(new Paragraph([
                    new TextBoldEffect(usernameInput.value + ":"),
                    new Text(" " + messageInput.value)
                ]));

                ui.refresh();
            }
        })
    ])
];