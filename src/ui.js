// Adapt UI
// 
// Copyright (C) LiveG. All Rights Reserved.
// Copying is not a victimless crime. Anyone caught copying LiveG software may
// face sanctions.
// 
// https://liveg.tech
// Licensed by the LiveG Open-Source Licence, which can be found at LICENCE.md.

// @import https://opensource.liveg.tech/ZaprCoreLibs/src/dom/dom
// @import https://opensource.liveg.tech/ZaprCoreLibs/src/importer/importer

var ui = {
    mirroringDirection: "ltr",
    language: "en_GB",

    components: {},
    models: {},
    colour: {},
    enums: {},
    screen: [],

    events: {
        /*
            @name ui.events.loaded

            @param callback function Callback function to call when main UI container has loaded.

            @shortDescription Call callback function when main UI container has loaded.
        */
        loaded: function(callback) {
            dom.loaded(function() {
                callback();

                // @asset imports.css

                dom.element("head").newChild(importer.generateLinkDOMElement(_assets["imports.css"]));

                // @asset style.css
                
                dom.element("head").newChild(importer.generateLinkDOMElement(_assets["style.css"]));

                ui.refresh();
            });
        }
    },

    utilities: {},

    /*
        @name ui.refresh

        @shortDescription Regenerate the DOM to reflect the UI layout in `ui.screen`.
    */
    refresh: function() {
        dom.element().children().delete();
        dom.element().attribute("dir").set(ui.mirroringDirection);
        
        if (ui.language.length < 2) {
            throw "Invalid UI language"
        }

        if (["zh_HK", "zh_MO", "zh_TW"].includes(ui.language)) {
            dom.element().attribute("lang").set("zh-Hant");
        } else if (ui.language.substring(0, 2) == "zh") {
            dom.element().attribute("lang").set("zh-Hans");
        } else {
            dom.element().attribute("lang").set(ui.language.substring(0, 2));
        }

        if (_manifest != undefined && _manifest.name != undefined) {
            if (ui.language in _manifest.name) {
                dom.element("title").html.set(_manifest.name[ui.language]);
            } else if (_manifest.defaultLocale in _manifest.name) {
                dom.element("title").html.set(_manifest.name[_manifest.defaultLocale]);
            } else {
                throw "Invalid manifest name specification";
            }
        }

        for (var i = 0; i < ui.screen.length; i++) {
            dom.element().newChild(ui.screen[i].generateDOMElement());
        }

        dom.element().events.listen("keydown", function(event) {
            if (event.keyCode == 9) {
                dom.element("style[data-ui-helper='focus']").delete();

                dom.element().newChild(
                    dom.new("style")
                        .attribute("data-ui-helper").set("focus")
                        .html.set(`
                            *:focus {
                                outline: -webkit-focus-ring-color auto 1px!important;
                            }
                        `)
                );
            }
        });

        dom.element().events.listen("click", function() {
            dom.element("style[data-ui-helper='focus']").delete();
        });
    }
};

/*
    @name ui.colour.RGBA

    @param red number Amount of red to use in colour. Must be between 0 and 255 inclusive.
    @param green number Amount of green to use in colour. Must be between 0 and 255 inclusive.
    @param blue number Amount of blue to use in colour. Must be between 0 and 255 inclusive.
    @param alpha number Amount of alpha transparency colour should have. Must be between 0 and 1 inclusive. Default: `1`.

    @shortDescription RGBA class for use with colours.
*/
ui.colour.RGBA = class {
    constructor(red, green, blue, alpha = 1) {
        if (typeof(red) == "number" && red >= 0 && red <= 255) {
            this.red = red;
        } else {
            throw "`red` is either not a number, or is not between 0 and 255 inclusive";
        }

        if (typeof(green) == "number" && green >= 0 && green <= 255) {
            this.green = green;
        } else {
            throw "`green` is either not a number, or is not between 0 and 255 inclusive";
        }

        if (typeof(blue) == "number" && blue >= 0 && blue <= 255) {
            this.blue = blue;
        } else {
            throw "`blue` is either not a number, or is not between 0 and 255 inclusive";
        }

        if (typeof(alpha) == "number" && alpha >= 0 && alpha <= 1) {
            this.alpha = alpha;
        } else {
            throw "`alpha` is either not a number, or is not between 0 and 1 inclusive";
        }
    }

    generateCSS() {
        return "rgba(" + this.red + ", " + this.green + ", " + this.blue + ", " + this.alpha + ")";
    }
};

ui.enums.formats = {
    TEXT: "text",
    EMAIL: "email",
    NUMBER: "number",
    PHONE: "tel",
    URL: "url"
};

/*
    @name ui.Vector

    @param x X position or width of vector.
    @param y Y position or height of vector.

    @shortDescription Vector class for use with dimensions in terms of position and size.
*/
ui.Vector = class {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
};

/*
    @name ui.utilities.getScreenSize

    @return object Vector class of screen size.

    @shortDescription Get the screen (viewport)'s size in pixels.
*/
ui.utilities.getScreenSize = function() {
    return new ui.Vector(window.innerWidth, window.innerHeight);
};

ui.theming = {
    primaryBackground: new ui.colour.RGBA(255, 255, 255),
    primaryText: new ui.colour.RGBA(0, 0, 0),
    primaryUI: new ui.colour.RGBA(80, 145, 247),
    primaryUIText: new ui.colour.RGBA(255, 255, 255),
    primaryUIPress: new ui.colour.RGBA(113, 162, 240),
    secondaryBackground: new ui.colour.RGBA(229, 229, 229),
    secondaryText: new ui.colour.RGBA(0, 0, 0),
    secondaryUI: new ui.colour.RGBA(150, 184, 247),
    secondaryUIText: new ui.colour.RGBA(255, 255, 255),
    secondaryUIPress: new ui.colour.RGBA(180, 196, 224)
};

/*
    @name ui.components.Component

    @param children any Children or content to include in component. Default: `[]`.
    @param style object Styling to use on component. Default: `{}`.
    @param attributes object HTML attributes to use on component. Default: `{}`.
    @param events object Events to listen to on component. Default: `{}`.

    @shortDescription Blank component class.
*/
ui.components.Component = class {
    constructor(children = [], style = {}, attributes = {}, events = {}) {
        this.HTMLTagName = "div";
        
        this.children = children;
        this.style = style;
        this.attributes = attributes;
        this.events = events;
    }

    /*
        @name ui.components.Component( ... ).precompute

        @param domObject object DOM object to use for precomputing.

        @return object Newly computed DOM object.

        @shortDescription Precompute DOM values for generation.
    */
    precompute(domObject) {
        return domObject;
    }

    /*
        @name ui.components.Component( ... ).generateDOMElement

        @return object Dictionary of available functions and values for generated DOM element.

        @shortDescription Generate DOM element for component.
    */
    generateDOMElement() {
        if (typeof(this.children) == "string" || typeof(this.children) == "number") {
            this.children = [new ui.components.Text(this.children)];
        }

        var currentDOMElement = dom.new(this.HTMLTagName);

        currentDOMElement = this.precompute(currentDOMElement);

        for (var i = 0; i < Object.keys(this.style).length; i++) {
            currentDOMElement.style.set(Object.keys(this.style)[i], (
                typeof(this.style[Object.keys(this.style)[i]]) == "object" ?
                this.style[Object.keys(this.style)[i]].generateCSS() :
                this.style[Object.keys(this.style)[i]]
            ));
        }

        for (var i = 0; i < Object.keys(this.attributes).length; i++) {
            currentDOMElement.attribute(Object.keys(this.attributes)[i]).set(this.attributes[Object.keys(this.attributes)[i]]);
        }

        for (var i = 0; i < Object.keys(this.events).length; i++) {
            currentDOMElement.events.listen(Object.keys(this.events)[i], this.events[Object.keys(this.events)[i]]);
        }

        for (var i = 0; i < this.children.length; i++) {
            currentDOMElement.newChild(this.children[i].generateDOMElement());
        }

        return currentDOMElement;
    }

    /*
        @name ui.components.Component( ... ).generateHTML

        @return string HTML contents of component.

        @shortDescription Generate HTML contents for component.
    */
    generateHTML() {
        return this.generateDOMElement().html.get();
    }
};

/*
    @name ui.components.Text

    @param text string Text to use. Default: `""`.

    @shortDescription Text class, extends `ui.components.Component`.
*/
ui.components.Text = class extends ui.components.Component {
    constructor(text = "") {
        super();

        this.HTMLTagName = "span";

        this.text = text;
    }

    generateDOMElement() {
        var currentDOMElement = dom.new(this.HTMLTagName);

        currentDOMElement.text.set(this.text);

        return currentDOMElement;
    }
};

/*
    @name ui.components.HTML

    @param html text HTML contents to use. Default: `""`.

    @shortDescription HTML class, extends `ui.components.Component`.
*/
ui.components.HTML = class extends ui.components.Component {
    constructor(html = "") {
        super();

        this.HTMLTagName = "span";

        this.html = html;
    }

    generateDOMElement() {
        var currentDOMElement = dom.new(this.HTMLTagName);

        currentDOMElement.html.set(this.html);

        return currentDOMElement;
    }
};

/*
    @name ui.components.Container

    @param children any Children or content to include in component. Default: `[]`.
    @param split number Numerator of a twelth fraction used to split container by width. Must be between 1 and 12 inclusive. Default: `12`.
    @param style object Styling to use on component. Default: `{}`.
    @param attributes object HTML attributes to use on component. Default: `{}`.
    @param events object Events to listen to on component. Default: `{}`.

    @shortDescription Container class, extends `ui.components.Component`.
    @longDescription Has similar properties to an HTML `div` element.
*/
ui.components.Container = class extends ui.components.Component {
    constructor(children = [], split = 12, style = {}, attributes = {}, events = {}) {
        super(children, style, attributes, events);

        this.HTMLTagName = "div";

        if (typeof(split) == "number" && split >= 1 && split <= 12) {
            this.split = split;
        } else {
            throw "`split` is either not a number, or is not between 1 and 12 inclusive";
        }
        
        this.split = split;
    }

    precompute(domObject) {
        this.attributes["split"] = this.split;

        return domObject;
    }
};

/*
    @name ui.components.GroupContainer

    @param children any Children or content to include in component. Default: `[]`.
    @param style object Styling to use on component. Default: `{}`.
    @param attributes object HTML attributes to use on component. Default: `{}`.
    @param events object Events to listen to on component. Default: `{}`.

    @shortDescription GroupContainer class, extends `ui.components.Container`.
    @longDescription Has similar properties to an HTML `div` element with attribute `group`.
    @longDescription Designed to group alike form elements already in a `Container`.
*/
ui.components.GroupContainer = class extends ui.components.Container {
    constructor(children = [], style = {}, attributes = {}, events = {}) {
        super(children, 12, style, attributes, events);

        this.HTMLTagName = "div";
    }

    precompute(domObject) {
        this.attributes["group"] = "";

        return domObject;
    }
};

/*
    @name ui.components.Card

    @param children any Children or content to include in component. Default: `[]`.
    @param split number Numerator of a twelth fraction used to split card by width. Must be between 1 and 12 inclusive. Default: `12`.
    @param style object Styling to use on component. Default: `{}`.
    @param attributes object HTML attributes to use on component. Default: `{}`.
    @param events object Events to listen to on component. Default: `{}`.

    @shortDescription Card class, extends `ui.components.Container`.
    @longDescription Has similar properties to an HTML `div` element with attribute `card`.
    @longDescription Designed to hold elements in a more contextual setting.
*/
ui.components.Card = class extends ui.components.Container {
    precompute(domObject) {
        this.attributes["card"] = "";
        this.attributes["split"] = this.split;

        return domObject;
    }
}

/*
    @name ui.components.Paragraph

    @param children any Children or content to include in component. Default: `[]`.
    @param style object Styling to use on component. Default: `{}`.
    @param attributes object HTML attributes to use on component. Default: `{}`.
    @param events object Events to listen to on component. Default: `{}`.

    @shortDescription Paragraph class, extends `ui.components.Component`.
    @longDescription Has similar properties to an HTML `p` element.
*/
ui.components.Paragraph = class extends ui.components.Component {
    constructor(children = [], style = {}, attributes = {}, events = {}) {
        super(children, style, attributes, events);

        this.HTMLTagName = "p";
    }
};

/*
    @name ui.components.Heading

    @param children any Children or content to include in component. Default: `[]`.
    @param level number Level number to use for heading. Must be an integer between 1 and 6 inclusive. Default: `1`.
    @param style object Styling to use on component. Default: `{}`.
    @param attributes object HTML attributes to use on component. Default: `{}`.
    @param events object Events to listen to on component. Default: `{}`.

    @shortDescription Heading class, extends `ui.components.Component`.
    @longDescription Has similar properties to the HTML `h1`, `h2`, `h3`, `h4`, `h5` and `h6` elements.
*/
ui.components.Heading = class extends ui.components.Component {
    constructor(children = [], level = 1, style = {}, attributes = {}, events = {}) {
        super(children, style, attributes, events);

        if (typeof(level) == "number" && Number.isInteger(level) && level >= 1 && level <= 6) {
            this.HTMLTagName = "h" + String(level);
        } else {
            throw "`level` is either not a number, is not an integer, or is not between 1 and 6 inclusive";
        }
    }
};

/*
    @name ui.components.Icon

    @param name string Name of icon to use.
    @param description string Description of icon for accessibility. Default: `""`.

    @shortDescription Icon class, extends `ui.components.Component`.
    @longDescription Uses icons from from the Clarity icon set. An `i` element is generated.
*/
ui.components.Icon = class extends ui.components.Component {
    constructor(name, description = "") {
        super();

        this.HTMLTagName = "icon";

        this.name = name;
        this.description = description;
    }

    generateDOMElement() {
        var currentDOMElement = dom.new(this.HTMLTagName);

        currentDOMElement
            .text.set(this.name)
            .attribute("aria-label").set(this.description)
        ;

        return currentDOMElement;
    }
};

/*
    @name ui.components.TextBoldEffect

    @param children any Children or content to include in component. Default: `[]`.
    @param style object Styling to use on component. Default: `{}`.
    @param attributes object HTML attributes to use on component. Default: `{}`.
    @param events object Events to listen to on component. Default: `{}`.

    @shortDescription TextBoldEffect class, extends `ui.components.Component`.
    @longDescription Displays text in bold. Has similar properties to an HTML `strong` element. 
*/
ui.components.TextBoldEffect = class extends ui.components.Component {
    constructor(children = [], style = {}, attributes = {}, events = {}) {
        super(children, style, attributes, events);

        this.HTMLTagName = "strong";
    }
};

/*
    @name ui.components.TextItalicsEffect

    @param children any Children or content to include in component. Default: `[]`.
    @param style object Styling to use on component. Default: `{}`.
    @param attributes object HTML attributes to use on component. Default: `{}`.
    @param events object Events to listen to on component. Default: `{}`.

    @shortDescription TextItalicsEffect class, extends `ui.components.Component`.
    @longDescription Displays text in italics. Has similar properties to an HTML `em` element. 
*/
ui.components.TextItalicsEffect = class extends ui.components.Component {
    constructor(children = [], style = {}, attributes = {}, events = {}) {
        super(children, style, attributes, events);

        this.HTMLTagName = "em";
    }
};

/*
    @name ui.components.Link

    @param text string Text to use in link. Default: `""`.
    @param destination string Destination that link goes to. Default: `"#"`.
    @param detach boolean Whether to make link destination open in new window or browser tab. Default: `true`. 

    @shortDescription Link class, extends `ui.components.Component`.
*/
ui.components.Link = class extends ui.components.Component {
    constructor(text = "", destination = "#", detach = true) {
        super();

        this.HTMLTagName = "a";

        this.text = text;
        this.destination = destination;
        this.detach = true;
    }

    generateDOMElement() {
        var currentDOMElement = dom.new(this.HTMLTagName);

        currentDOMElement.text.set(this.text);
        currentDOMElement.attribute("href").set(this.destination);

        if (this.detach) {
            currentDOMElement.attribute("target").set("_blank");
        }

        return currentDOMElement;
    }
};

/*
    @name ui.components.Image

    @param source string Source that image is taken from.
    @param description string Alternative description of image if it doesn't load or can't be seen by the user. Default: `""`.
    @param style object Styling to use on component. Default: `{}`.
    @param attributes object HTML attributes to use on component. Default: `{}`.
    @param events object Events to listen to on component. Default: `{}`.

    @shortDescription Image class, extends `ui.components.Component`.
    @longDescription Has similar properties to an HTML `img` element.
*/
ui.components.Image = class extends ui.components.Component {
    constructor(source, description = "", style = {}, attributes = {}, events = {}) {
        super([], style, attributes, events);

        this.HTMLTagName = "img";

        this.source = source;
        this.description = description;
    }

    precompute(domObject) {
        this.attributes["src"] = this.source;
        this.attributes["alt"] = this.description;

        return domObject;
    }
}

/*
    @name ui.components.Label

    @param children any Children or content to include in component. Default: `[]`.
    @param style object Styling to use on component. Default: `{}`.
    @param attributes object HTML attributes to use on component. Default: `{}`.
    @param events object Events to listen to on component. Default: `{}`.

    @shortDescription Label class, extends `ui.components.Component`.
    @longDescription Has similar properties to an HTML `label` element.
*/
ui.components.Label = class extends ui.components.Component {
    constructor(children = [], style = {}, attributes = {}, events = {}) {
        super(children, style, attributes, events);

        this.HTMLTagName = "label";
    }
};

/*
    @name ui.components.Button

    @param children any Children or content to include in component. Default: `[]`.
    @param secondary boolean Whether to make the button secondary. Use `true` to enable. Default: `false`.
    @param style object Styling to use on component. Default: `{}`.
    @param attributes object HTML attributes to use on component. Default: `{}`.
    @param events object Events to listen to on component. Default: `{}`.

    @shortDescription Button class, extends `ui.components.Component`.
    @longDescription Has similar properties to an HTML `button` element.
*/
ui.components.Button = class extends ui.components.Component {
    constructor(children = [], secondary = false, style = {}, attributes = {}, events = {}) {
        super(children, style, attributes, events);

        this.HTMLTagName = "button";

        this.secondary = secondary;
    }

    precompute(domObject) {
        if (this.secondary) {
            this.attributes["secondary"] = this.secondary;
        } else {
            delete this.attributes["secondary"];
        }

        return domObject;
    }
};

/*
    @name ui.components.TextInput

    @param value string Initial value to store in input. Default: `""`.
    @param placeholder string Value to show in input if it is empty. Default: `""`.
    @param secondary boolean Whether to make the input secondary. Use `true` to enable. Default: `false`.
    @param style object Styling to use on component. Default: `{}`.
    @param attributes object HTML attributes to use on component. Default: `{}`.
    @param events object Events to listen to on component. Default: `{}`.

    @shortDescription TextInput class, extends `ui.components.Component`.
    @longDescription Has similar properties to an HTML `input` element.
*/
ui.components.TextInput = class extends ui.components.Component {
    constructor(value = "", placeholder = "", secondary = false, style = {}, attributes = {}, events = {}) {
        super([], style, attributes, events);

        this.HTMLTagName = "input";

        this.value = value;
        this.placeholder = placeholder;
        this.secondary = secondary;
    }

    precompute(domObject) {
        this.attributes["value"] = this.value;
        this.attributes["placeholder"] = this.placeholder;

        if (this.secondary) {
            this.attributes["secondary"] = this.secondary;
        } else {
            delete this.attributes["secondary"];
        }

        var thisScope = this;

        domObject.events.listen("change", function(event) {
            thisScope.value = event.target.value;
        });

        return domObject;
    }
};

/*
    @name ui.components.PasswordInput

    @param value string Initial value to store in input. Default: `""`.
    @param placeholder string Value to show in input if it is empty. Default: `""`.
    @param secondary boolean Whether to make the input secondary. Use `true` to enable. Default: `false`.
    @param style object Styling to use on component. Default: `{}`.
    @param attributes object HTML attributes to use on component. Default: `{}`.
    @param events object Events to listen to on component. Default: `{}`.

    @shortDescription PasswordInput class, extends `ui.components.TextInput`.
    @longDescription Has similar properties to an HTML `input` element with attribute `type` as `"password"`.
*/
ui.components.PasswordInput = class extends ui.components.TextInput {
    precompute(domObject) {
        this.attributes["type"] = "password";

        this.attributes["value"] = this.value;
        this.attributes["placeholder"] = this.placeholder;

        if (this.secondary) {
            this.attributes["secondary"] = this.secondary;
        } else {
            delete this.attributes["secondary"];
        }

        var thisScope = this;

        domObject.events.listen("change", function(event) {
            thisScope.value = event.target.value;
        });

        return domObject;
    }
};

/*
    @name ui.components.FormattedInput

    @param value string Initial value to store in input. Default: `""`.
    @param placeholder string Value to show in input if it is empty. Default: `""`.
    @param secondary boolean Whether to make the input secondary. Use `true` to enable. Default: `false`.
    @param style object Styling to use on component. Default: `{}`.
    @param attributes object HTML attributes to use on component. Default: `{}`.
    @param events object Events to listen to on component. Default: `{}`.

    @shortDescription FormattedInput class, extends `ui.components.TextInput`.
    @longDescription Has similar properties to an HTML `input` element.
*/
ui.components.FormattedInput = class extends ui.components.TextInput {
    constructor(format = ui.enums.formats.TEXT, value = "", placeholder = "", secondary = false, style = {}, attributes = {}, events = {}) {
        super([], style, attributes, events);

        this.HTMLTagName = "input";

        this.format = format;
        this.value = value;
        this.placeholder = placeholder;
        this.secondary = secondary;
    }

    precompute(domObject) {
        if (Object.values(ui.enums.formats).indexOf(this.format) > -1) {
            this.attributes["type"] = this.format;
        } else {
            throw "Invalid format";
        }

        this.attributes["value"] = this.value;
        this.attributes["placeholder"] = this.placeholder;

        if (this.secondary) {
            this.attributes["secondary"] = this.secondary;
        } else {
            delete this.attributes["secondary"];
        }

        var thisScope = this;

        domObject.events.listen("change", function(event) {
            thisScope.value = event.target.value;
        });

        return domObject;
    }
};

/*
    @name ui.components.SelectionInput

    @param candidates object Candidates to display in input. Default: `{}`.
    @param selected string Candidate key for selected candidate. Default: `""`.
    @param secondary boolean Whether to make the input secondary. Use `true` to enable. Default: `false`.
    @param style object Styling to use on component. Default: `{}`.
    @param attributes object HTML attributes to use on component. Default: `{}`.
    @param events object Events to listen to on component. Default: `{}`
    @shortDescription SelectionInput class, extends `ui.components.Component`.
    @longDescription Has similar properties to an HTML `select` element with `option` children.

    @shortDescription SelectionInput class, extends `ui.components.Component`.
    @longDescription Has similar properties to an HTML `select` element with children as element `option`.
*/
ui.components.SelectionInput = class extends ui.components.Component {
    constructor(candidates = {}, selected = "", secondary = false, style = {}, attributes = {}, events = {}) {
        super([], style, attributes, events);

        this.HTMLTagName = "select";

        this.candidates = candidates;
        this.selected = selected;
        this.secondary = secondary;
    }

    precompute(domObject) {
        if (this.secondary) {
            this.attributes["secondary"] = this.secondary;
        } else {
            delete this.attributes["secondary"];
        }

        for (var i = 0; i < Object.keys(this.candidates).length; i++) {
            var key = Object.keys(this.candidates)[i];
            var content = this.candidates[key];

            var child = dom.new("option");

            child.attribute("value").set(key);
            child.text.set(content);

            if (this.selected == key) {
                child.attribute("selected").set("");
            }

            domObject.newChild(child);
        }

        var thisScope = this;

        domObject.events.listen("change", function(event) {
            thisScope.selected = event.target.options[event.target.selectedIndex].value;
        });

        return domObject;
    }
};

/*
    @name ui.components.CheckboxInput

    @param group string Name of group to group checkboxes in. Default: `""`.
    @param selected boolean Whether to make the input selected. Use `true` to enable, or `null` to make indeterminate. Default: `false`.
    @param style object Styling to use on component. Default: `{}`.
    @param attributes object HTML attributes to use on component. Default: `{}`.
    @param events object Events to listen to on component. Default: `{}`.

    @shortDescription CheckboxInput class, extends `ui.components.Component`.
    @longDescription Has similar properties to an HTML `input` element with attribute `type` as `"checkbox"`.
*/
ui.components.CheckboxInput = class extends ui.components.Component {
    constructor(group = "", selected = false, style = {}, attributes = {}, events = {}) {
        super([], style, attributes, events);

        this.HTMLTagName = "input";

        this.group = group;
        this.selected = selected;
    }

    precompute(domObject) {
        this.attributes["type"] = "checkbox";

        this.attributes["name"] = this.group;

        if (this.selected == true) {
            domObject.reference[0].checked = true;
            domObject.reference[0].indeterminate = false;
        } else if (this.selected == null) {
            domObject.reference[0].checked = true;
            domObject.reference[0].indeterminate = true;
        } else {
            domObject.reference[0].checked = false;
            domObject.reference[0].indeterminate = false;
        }

        var thisScope = this;

        domObject.events.listen("change", function(event) {
            if (event.target.checked) {
                thisScope.selected = true;
            } else if (event.target.indeterminate) {
                thisScope.selected = null;
            } else {
                thisScope.selected = false;
            }
        });

        return domObject;
    }
};

/*
    @name ui.components.RadioButtonInput

    @param group string Name of group to group radio buttons in. Default: `""`.
    @param selected boolean Whether to make the input selected. Use `true` to enable. Default: `false`.
    @param style object Styling to use on component. Default: `{}`.
    @param attributes object HTML attributes to use on component. Default: `{}`.
    @param events object Events to listen to on component. Default: `{}`.

    @shortDescription RadioButtonInput class, extends `ui.components.Component`.
    @longDescription Has similar properties to an HTML `input` element with attribute `type` as `"radio"`.
*/
ui.components.RadioButtonInput = class extends ui.components.Component {
    constructor(group = "", selected = false, style = {}, attributes = {}, events = {}) {
        super([], style, attributes, events);

        this.HTMLTagName = "input";

        this.group = group;
        this.selected = selected;
    }

    precompute(domObject) {
        this.attributes["type"] = "radio";

        this.attributes["name"] = this.group;

        if (this.selected) {
            this.attributes["checked"] = this.selected;
        } else {
            delete this.attributes["checked"];
        }

        var thisScope = this;

        setInterval(function() {
            thisScope.selected = domObject.reference[0].checked;
        });

        return domObject;
    }
};

/*
    @name ui.components.ToggleSwitch

    @param group string Name of group to group toggle switches in. Default: `""`.
    @param selected boolean Whether to make the switch selected. Use `true` to enable. Default: `false`.
    @param style object Styling to use on component. Default: `{}`.
    @param attributes object HTML attributes to use on component. Default: `{}`.
    @param events object Events to listen to on component. Default: `{}`.

    @shortDescription ToggleSwitch class, extends `ui.components.Component`.
    @longDescription Has similar properties to an HTML `input` element with attribute `type` as `"checkbox"` and `role` as `"switch"`.
*/
ui.components.ToggleSwitch = class extends ui.components.Component {
    constructor(group = "", selected = false, style = {}, attributes = {}, events = {}) {
        super([], style, attributes, events);

        this.HTMLTagName = "input";

        this.group = group;
        this.selected = selected;
    }

    precompute(domObject) {
        this.attributes["type"] = "checkbox";
        this.attributes["role"] = "switch";

        this.attributes["name"] = this.group;

        if (this.selected) {
            this.attributes["checked"] = this.selected;
        } else {
            delete this.attributes["checked"];
        }

        var thisScope = this;

        domObject.events.listen("change", function(event) {
            thisScope.selected = event.target.checked;
        });

        return domObject;
    }
};

/*
    @name ui.components.SliderInput

    @param value number Initial value to store in input. Must be between 0 and 1 inclusive. Default: `0`.
    @param step number Amount to step when slider is moved. Must be between 0 and 1 inclusive. Default: `1`.
    @param style object Styling to use on component. Default: `{}`.
    @param attributes object HTML attributes to use on component. Default: `{}`.
    @param events object Events to listen to on component. Default: `{}`.

    @shortDescription SliderInput class, extends `ui.components.Component`.
    @longDescription Has similar properties to an HTML `input` element with attribute `type` as `"range"`.
*/
ui.components.SliderInput = class extends ui.components.Component {
    constructor(value = 0, step = 0.01, style = {}, attributes = {}, events = {}) {
        super([], style, attributes, events);

        this.HTMLTagName = "input";

        if (typeof(value) == "number" && value >= 0 && value <= 1) {
            this.value = value;
        } else {
            throw "`value` is either not a number, or is not between 0 and 1 inclusive";
        }

        if (typeof(step) == "number" && step >= 0 && step <= 1) {
            this.step = step;
        } else {
            throw "`step` is either not a number, or is not between 0 and 1 inclusive";
        }
    }

    precompute(domObject) {
        this.attributes["type"] = "range";

        this.attributes["value"] = this.value * 100;
        this.attributes["minimum"] = 0;
        this.attributes["maximum"] = 1;
        this.attributes["step"] = this.step * 100;

        var thisScope = this;

        domObject.events.listen("change", function(event) {
            thisScope.value = event.target.value / 100;
        });

        return domObject;
    }
};

/*
    @name ui.components.ProgressBar

    @param value number Initial value to store in input. Must be between 0 and 1 inclusive. Default: `0`.
    @param style object Styling to use on component. Default: `{}`.
    @param attributes object HTML attributes to use on component. Default: `{}`.
    @param events object Events to listen to on component. Default: `{}`.

    @shortDescription ProgressBar class, extends `ui.components.Component`.
    @longDescription Has similar properties to an HTML `progress` element.
*/
ui.components.ProgressBar = class extends ui.components.Component {
    constructor(value = 0, style = {}, attributes = {}, events = {}) {
        super([], style, attributes, events);

        this.HTMLTagName = "progress";

        if (typeof(value) == "number" && value >= 0 && value <= 1) {
            this.value = value;
        } else {
            throw "`value` is either not a number, or is not between 0 and 1 inclusive";
        }
    }

    precompute(domObject) {
        this.attributes["value"] = this.value;

        return domObject;
    }
};

/*
    @name ui.components.SpinnerLoader

    @param style object Styling to use on component. Default: `{}`.
    @param attributes object HTML attributes to use on component. Default: `{}`.
    @param events object Events to listen to on component. Default: `{}`.

    @shortDescription SpinnerLoader class, extends `ui.components.Component`.
    @longDescription Used for when an object has no definite final loading time.
*/
ui.components.SpinnerLoader = class extends ui.components.Component {
    constructor(style = {}, attributes = {}, events = {}) {
        super([], style, attributes, events);

        this.HTMLTagName = "div";
    }

    precompute(domObject) {
        this.attributes["loader"] = "";

        return domObject;
    }
}

/*
    @name ui.components.Pill

    @param children any Children or content to include in component. Default: `[]`.
    @param selected boolean Whether to make the pill selected. Use `true` to enable. Default: `false`.
    @param style object Styling to use on component. Default: `{}`.
    @param attributes object HTML attributes to use on component. Default: `{}`.
    @param events object Events to listen to on component. Default: `{}`.

    @shortDescription Pill class, extends `ui.components.Component`.
    @longDescription Has similar properties to an HTML `button` element with attribute `role` as `"tab"`.
*/
ui.components.Pill = class extends ui.components.Component {
    constructor(children = [], selected = false, style = {}, attributes = {}, events = {}) {
        super(children, style, attributes, events);

        this.HTMLTagName = "button";

        this.selected = selected;
    }

    precompute(domObject) {
        this.attributes["role"] = "tab";

        if (this.selected) {
            this.attributes["aria-selected"] = "true";
        } else {
            this.attributes["aria-selected"] = "false";
        }

        return domObject;
    }
};

ui.events.loaded(function() {});