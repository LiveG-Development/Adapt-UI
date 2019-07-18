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
        new Label([
            new Text("Text input (primary)"),
            new TextInput("", "Write something here..."),
            new Button("Do that action")
        ]),
        new Label([
            new Text("Text input (secondary)"),
            new TextInput("", "Looking camouflaged!", true),
            new Button("Do that other action", true)
        ]),
        new Label([
            new Text("Selection input"),
            new SelectionInput({
                "apple": "Apple",
                "liveg": "LiveG",
                "microsoft": "Microsoft",
                "google": "Google"
            }, "liveg")
        ])
    ]),
    new Container([
        new Heading("Selections", 2),
        new Container([
            new Label([
                new Text("Fruits"),
                new CheckboxInput("groceries", true)
            ]),
            new Label([
                new Text("Vegetables"),
                new CheckboxInput("groceries")
            ])
        ]),
        new Container([
            new Label([
                new Text("Pasta"),
                new RadioButtonInput("food")
            ]),
            new Label([
                new Text("Pizza"),
                new RadioButtonInput("food", true)
            ]),
            new Label([
                new Text("Steak"),
                new RadioButtonInput("food")
            ])
        ])
    ]),
    new Container([
        new Heading("Sign in test", 2),
        new Label([
            new Text("Username"),
            new TextInput()
        ]),
        new Label([
            new Text("Password"),
            new PasswordInput()
        ]),
        new Label([
            new Text(),
            new Label([
                new CheckboxInput(),
                new Text("Remember me")
            ]),
        ]),
        new Container([
            new Button("Sign in")
        ])
    ])
];