// @import ../../src/ui
// @import https://opensource.liveg.tech/ZaprCoreLibs/src/core/core

core.unpack(ui.components);

ui.screen = [
    new Container([
        new Heading("All UI components", 1),
        new Heading("Testing all of them", 2),
        new Heading("As you can see", 3),
        new Heading("There's a lot", 4),
        new Heading("So many headings", 5),
        new Heading("There's loads", 6),
        new Paragraph("As you can see, there are a lot of headings. This is just some of the UI components featured. More are below!"),
    ]),
    new Container([
        new TextInput("", "Write something here..."),
        new Button("Do that action")
    ]),
    new Container([
        new TextInput("", "Looking camouflaged!", true),
        new Button("Do that other action", true)
    ])
];