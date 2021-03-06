// @import ../../src/ui
// @import ../../src/models/applayout/model

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

// Asset imports

// @asset assets/placeholder.png

var placeholderImage = importer.generateLink(_assets["placeholder.png"], "image/png");

// UI design

core.unpack(ui.components);
core.unpack(ui.models);

var menu = new appLayout.Menu([
    new appLayout.MenuTitle(_("menuTitle")),
    new appLayout.MenuContent([
        new appLayout.MenuText(_("menuDescription")),
        new appLayout.MenuButton(_("menuHome"), true),
        new appLayout.MenuButton(_("menuInstall")),
        new appLayout.MenuButton(_("menuLearnMore")),
        new appLayout.MenuButton(_("menuQuestion")),
        new appLayout.MenuDivider(),
        new appLayout.MenuButton(_("menuViewCode"), false, {}, {}, {
            "click": function() {
                menu.isOpen = false;

                ui.refresh();

                setTimeout(function() {
                    window.open("https://github.com/LiveG-Development/Adapt-UI/blob/master/tests/all/script.js");
                }, 500);
            }
        })
    ])
]);

var dialog = new appLayout.Dialog([
    new appLayout.DialogTitle(_("dialogTitle")),
    new appLayout.DialogContent([
        new appLayout.ButtonedContent([
            new Paragraph(_("dialogContent")),
            new Label([
                new Text(_("labelTextPrimary")),
                new TextInput("", _("textPrimary"))
            ]),
            new Label([
                new Text(_("labelTextSecondary")),
                new TextInput("", _("textSecondary"), true)
            ])
        ]),
        new appLayout.ButtonedFooter([
            new Button(_("dialogOK"), false, {}, {}, {
                click: function() {
                    dialog.isOpen = false;

                    ui.refresh();
                }
            }),
            new Button(_("dialogCancel"), true, {}, {}, {
                click: function() {
                    dialog.isOpen = false;

                    ui.refresh();
                }
            })
        ])
    ])
]);

var sidebar = new HTML("");

var sidebarSwitch = new ToggleSwitch("sidebar", false, {}, {}, {
    change: function() {
        if (sidebarSwitch.selected) {
            sidebar = new appLayout.Sidebar([
                new appLayout.MenuText(_("sidebarDescription")),
                new appLayout.MenuButton(_("sidebarHome"), true),
                new appLayout.MenuButton(_("sidebarAbout")),
                new appLayout.MenuButton(_("sidebarContact")),
                new appLayout.MenuDivider(),
                new appLayout.MenuButton(_("sidebarSignIn")),
                new appLayout.MenuButton(_("sidebarSignUp"))
            ]);
        } else {
            sidebar = new HTML("");
        }

        setScreen();
        ui.refresh();
    }
});

var sliderInputSet = new SliderInput(0.33, 0.01, {}, {
    id: "slider"
});
var progressBarResult = new ProgressBar(0.33);

var sliderInputSetCard = new SliderInput(0.33, 0.01, {}, {
    id: "sliderCard"
});
var progressBarResultCard = new ProgressBar(0.33);

sliderInputSetCard.attributes["id"] = "sliderCard"

function progressBarResultUpdate(value) {
    progressBarResult.value = value;

    ui.refresh();

    dom.element("#slider").reference[0].focus();
}

function progressBarResultUpdateCard(value) {
    progressBarResultCard.value = value;

    ui.refresh();

    dom.element("#sliderCard").reference[0].focus();
}

sliderInputSet.events.change = function() {
    progressBarResultUpdate(sliderInputSet.value);
};

sliderInputSetCard.events.change = function() {
    progressBarResultUpdateCard(sliderInputSetCard.value);
};

function setScreen() {
    ui.screen = [
        new appLayout.ActionButton([new Icon("code", _("menuViewCode"))], {}, {}, {
            "click": function() {
                window.open("https://github.com/LiveG-Development/Adapt-UI/blob/master/tests/all/script.js");
            }
        }),
        new appLayout.MenuBar([
            new appLayout.MenuBarButton([new Icon("menu", _("menuOpen"))], {}, {}, {
                "click": function() {
                    menu.isOpen = true;

                    ui.refresh();
                }
            }),
            new Text(_("h1"))
        ]),
        menu,
        dialog,
        sidebar,
        new appLayout.Content([
            new Container([
                new Heading(_("h1"), 1),
                new Heading(_("h2"), 2),
                new Heading(_("h3"), 3),
                new Heading(_("h4"), 4),
                new Heading(_("h5"), 5),
                new Heading(_("h6"), 6),
                new Paragraph([
                    new Text(_("p")),
                    new Link(_("a"), "https://github.com/LiveG-Development/Adapt-UI/blob/master/tests/all/script.js")
                ]),
                new Image(placeholderImage, _("placeholderImageDescription"), {
                    display: "block",
                    marginLeft: "auto",
                    marginRight: "auto"
                })
            ]),
            new Container([
                new Label([
                    new Text(_("labelTextPrimary")),
                    new TextInput("", _("textPrimary")),
                    new Button(_("textPrimaryButton"), false, {}, {}, {
                        click: function() {
                            dialog.isOpen = true;

                            ui.refresh();
                        }
                    })
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
                    }, "liveg"),
                    new NavigationButton(_("textNavigationButton"))
                ]),
                new Label([
                    new Text(_("labelSliderInput")),
                    sliderInputSet
                ]),
                new Label([
                    new Text(_("labelProgressBarResult")),
                    progressBarResult
                ]),
                new Container([
                    new Paragraph(_("labelSpinnerLoader")),
                    new SpinnerLoader()
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
                new Heading(_("labelPills"), 2),
                new Label([
                    new Text(_("labelPillsFilters")),
                    new Pill(_("pillsFavourites")),
                    new Pill(_("pillsUnread"), true),
                    new Pill(_("pillsSpam"))
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
                new GroupContainer([
                    new Button(_("siTestSignIn"))
                ])
            ]),
            new Container([
                new Heading(_("labelTextTest"), 2),
                new Paragraph([
                    new Text(_("textTestNormal")),
                    new TextBoldEffect(_("textTestBold")),
                    new TextItalicsEffect(_("textTestItalics")),
                    new TextBoldEffect(new TextItalicsEffect(_("textTestBoldItalics"))),
                    new TextCode(_("textTestTextCode"))
                ], 2),
                new UnorderedList([
                    new ListItem(_("selectionsPasta")),
                    new ListItem(_("selectionsPizza")),
                    new ListItem(_("selectionsSteak"))
                ]),
                new OrderedList([
                    new ListItem(_("selectionInputLiveG")),
                    new ListItem(_("selectionInputGoogle")),
                    new ListItem(_("selectionInputMicrosoft")),
                    new ListItem(_("selectionInputApple"))
                ]),
                new CodeBlock(_("textTestCodeBlock")),
                new MultilineTextInput("", _("textTestMultilineTextInput")),
                new Accordion([
                    new AccordionSummary(_("textTestAccordionOpen")),
                    new Paragraph(_("textTestAccordionOpenContent"))
                ], true),
                new Accordion([
                    new AccordionSummary(_("textTestAccordionClosed")),
                    new Paragraph(_("textTestAccordionClosedContent"))
                ])
            ]),
            new Container([
                new Heading(_("labelCardTest"), 2),
                new Card([
                    new Heading(_("cTestComponents"), 3),
                    new Label([
                        new Text(_("labelTextPrimary")),
                        new TextInput("", _("textPrimary")),
                        new Button(_("textPrimaryButton"), false, {}, {}, {
                            click: function() {
                                dialog.isOpen = true;
    
                                ui.refresh();
                            }
                        })
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
                        }, "liveg"),
                        new NavigationButton(_("textNavigationButton"))
                    ]),
                    new Label([
                        new Text(_("labelSliderInput")),
                        sliderInputSetCard
                    ]),
                    new Label([
                        new Text(_("labelProgressBarResult")),
                        progressBarResultCard
                    ]),
                    new Label([
                        new Text(_("selectionsFruits")),
                        new CheckboxInput("groceriesCard", true)
                    ]),
                    new Label([
                        new Text(_("selectionsVegetables")),
                        new CheckboxInput("groceriesCard")
                    ]),
                    new Label([
                        new Text(_("selectionsMeats")),
                        new CheckboxInput("groceriesCard", null)
                    ]),
                    new Label([
                        new Text(_("selectionsPasta")),
                        new RadioButtonInput("foodCard")
                    ]),
                    new Label([
                        new Text(_("selectionsPizza")),
                        new RadioButtonInput("foodCard", true)
                    ]),
                    new Label([
                        new Text(_("selectionsSteak")),
                        new RadioButtonInput("foodCard")
                    ]),
                    new Label([
                        new Text(_("togglesConnect")),
                        new ToggleSwitch("connectCard")
                    ]),
                    new Label([
                        new Text(_("togglesGoThere")),
                        new ToggleSwitch("goThereCard", true)
                    ]),
                    new Label([
                        new Text(_("labelPillsFilters")),
                        new Pill(_("pillsFavourites")),
                        new Pill(_("pillsUnread"), true),
                        new Pill(_("pillsSpam"))
                    ]),
                    new SpinnerLoader()
                ]),
                new Card([
                    new Image(placeholderImage),
                    new Heading(_("cTestContent"), 3),
                    new Paragraph(_("cTestContentParagraph")),
                    new Button(_("cTestContentButton"))
                ], 4),
                new Card([
                    new Image(placeholderImage),
                    new Heading(_("cTestContent"), 3),
                    new Paragraph(_("cTestContentParagraph")),
                    new Button(_("cTestContentButton"))
                ], 4),
                new Card([
                    new Image(placeholderImage),
                    new Heading(_("cTestContent"), 3),
                    new Paragraph(_("cTestContentParagraph")),
                    new Button(_("cTestContentButton"))
                ], 4),
                new Card([
                    new Heading(l10n.formatLocale(new Number(6), l10n.language), 3)
                ], 6),
                new Card([
                    new Heading(l10n.formatLocale(new Number(3), l10n.language), 3)
                ], 3),
                new Card([
                    new Heading(l10n.formatLocale(new Number(2), l10n.language), 3)
                ], 2),
                new Card([
                    new Heading(l10n.formatLocale(new Number(1), l10n.language), 3)
                ], 1),
                new Container([
                    new Container([
                        new Heading(l10n.formatLocale(new Number(1), l10n.language), 3)                    
                    ], 1),
                    new Container([
                        new Heading(l10n.formatLocale(new Number(2), l10n.language), 3)                    
                    ], 2),
                    new Container([
                        new Heading(l10n.formatLocale(new Number(3), l10n.language), 3)                    
                    ], 3),
                    new Container([
                        new Heading(l10n.formatLocale(new Number(6), l10n.language), 3)                    
                    ], 6)
                ])
            ]),
            new Container([
                new Heading(_("labelSidebarTest"), 2),
                new Label([
                    new Text(_("sidebarSwitch")),
                    sidebarSwitch
                ])
            ])
        ])
    ];
}

setScreen();