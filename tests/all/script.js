// @import ../../src/ui
// @import https://opensource.liveg.tech/ZaprCoreLibs/src/core/core
// @import https://opensource.liveg.tech/ZaprCoreLibs/src/dom/dom
// @import https://opensource.liveg.tech/ZaprCoreLibs/src/importer/importer
// @import https://opensource.liveg.tech/ZaprCoreLibs/src/l10n/l10n

// Locale integration configuration

// @asset locale/en_GB.json
// @asset locale/fr_FR.json
// @asset locale/zh_CN.json
// @asset locale/ar_EG.json

l10n.load("en_GB", importer.getString(_assets["en_GB.json"]));
l10n.load("fr_FR", importer.getString(_assets["fr_FR.json"]));
l10n.load("zh_CN", importer.getString(_assets["zh_CN.json"]));
l10n.load("ar_EG", importer.getString(_assets["ar_EG.json"]));

var lang = l10n.getBrowserLocale();

function _() {
    return l10n.translate(...arguments);
}

if (core.parameter("lang") != null) {
    lang = core.parameter("lang");
}

if (!(lang in l10n.locales)) {
    lang = "en_GB";
}

l10n.use(lang);

ui.mirroringDirection = l10n.languageData.direction;
ui.language = lang;

// UI design

core.unpack(ui.components);

ui.screen = [
    new Container([
        new Heading(_("h1"), 1),
        new Heading(_("h2"), 2),
        new Heading(_("h3"), 3),
        new Heading(_("h4"), 4),
        new Heading(_("h5"), 5),
        new Heading(_("h6"), 6),
        new Paragraph(_("p")),
    ]),
    new Container([
        new Label([
            new Text(_("labelTextPrimary")),
            new TextInput("", _("textPrimary")),
            new Button(_("textPrimaryButton"))
        ]),
        new Label([
            new Text(_("labelTextSecondary")),
            new TextInput("", _("textSecondary"), true),
            new Button(_("textSecondaryButton"), true)
        ]),
        new Label([
            new Text(_("labelSelectionInput")),
            new SelectionInput({
                "apple": _("selectionInputApple"),
                "liveg": _("selectionInputLiveG"),
                "microsoft": _("selectionInputMicrosoft"),
                "google": _("selectionInputGoogle")
            }, "liveg")
        ]),
        new Label([
            new Text(_("labelSliderInput")),
            new SliderInput()
        ])
    ]),
    new Container([
        new Heading(_("labelSelections"), 2),
        new GroupContainer([
            new Label([
                new Text(_("selectionsFruits")),
                new CheckboxInput("groceries", true)
            ]),
            new Label([
                new Text(_("selectionsVegetables")),
                new CheckboxInput("groceries")
            ]),
            new Label([
                new Text(_("selectionsMeats")),
                new CheckboxInput("groceries", null)
            ])
        ]),
        new GroupContainer([
            new Label([
                new Text(_("selectionsPasta")),
                new RadioButtonInput("food")
            ]),
            new Label([
                new Text(_("selectionsPizza")),
                new RadioButtonInput("food", true)
            ]),
            new Label([
                new Text(_("selectionsSteak")),
                new RadioButtonInput("food")
            ])
        ]),
        new GroupContainer([
            new Label([
                new Text(_("togglesConnect")),
                new ToggleSwitch("connect")
            ]),
            new Label([
                new Text(_("togglesGoThere")),
                new ToggleSwitch("goThere", true)
            ])
        ])
    ]),
    new Container([
        new Heading(_("labelTextFormats"), 2),
        new Label([
            new Text(_("formatsText")),
            new FormattedInput(ui.enums.formats.TEXT)
        ]),
        new Label([
            new Text(_("formatsEmail")),
            new FormattedInput(ui.enums.formats.EMAIL)
        ]),
        new Label([
            new Text(_("formatsNumber")),
            new FormattedInput(ui.enums.formats.NUMBER)
        ]),
        new Label([
            new Text(_("formatsPhone")),
            new FormattedInput(ui.enums.formats.PHONE)
        ]),
        new Label([
            new Text(_("formatsURL")),
            new FormattedInput(ui.enums.formats.URL)
        ])
    ]),
    new Container([
        new Heading(_("labelSITest"), 2),
        new Label([
            new Text(_("siTestUsername")),
            new TextInput()
        ]),
        new Label([
            new Text(_("siTestPassword")),
            new PasswordInput()
        ]),
        new Label([
            new Text(),
            new Label([
                new CheckboxInput(),
                new Text(_("siTestRememberMe"))
            ]),
        ]),
        new Container([
            new Button(_("siTestSignIn"))
        ])
    ])
];