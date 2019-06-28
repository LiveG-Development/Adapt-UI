// @import ../../src/ui
// @import https://opensource.liveg.tech/ZaprCoreLibs/src/core/core

core.unpack(ui.components);

ui.screen = [
    new Heading("Hello, world!"),
    new Paragraph("This is a test of Adapt UI, the user interface design language by LiveG Technologies."),
    new Button("View on GitHub", false, {}, {}, {
        click: function() {
            window.open("https://github.com/LiveG-Development/Adapt-UI");
        }
    })
];