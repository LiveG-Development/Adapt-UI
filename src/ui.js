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
    components: {},
    colour: {},
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

    /*
        @name ui.refresh

        @shortDescription Regenerate the DOM to reflect the UI layout in `ui.screen`.
    */
    refresh: function() {
        dom.element().children().delete();

        for (var i = 0; i < ui.screen.length; i++) {
            dom.element().newChild(ui.screen[i].generateDOMElement());
        }
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
            throw "`red` is either not a number, or is not between 1 and 6 inclusive";
        }

        if (typeof(green) == "number" && green >= 0 && green <= 255) {
            this.green = green;
        } else {
            throw "`green` is either not a number, or is not between 1 and 6 inclusive";
        }

        if (typeof(blue) == "number" && blue >= 0 && blue <= 255) {
            this.blue = blue;
        } else {
            throw "`blue` is either not a number, or is not between 1 and 6 inclusive";
        }

        if (typeof(alpha) == "number" && alpha >= 0 && alpha <= 1) {
            this.alpha = alpha;
        } else {
            throw "`alpha` is either not a number, or is not between 1 and 6 inclusive";
        }
    }

    generateCSS() {
        return "rgba(" + this.red + ", " + this.green + ", " + this.blue + ", " + this.alpha + ")";
    }
};

ui.theming = {
    primaryBackground: new ui.colour.RGBA(255, 255, 255),
    primaryText: new ui.colour.RGBA(20, 20, 20),
    primaryUI: new ui.colour.RGBA(80, 145, 247),
    primaryUIText: new ui.colour.RGBA(255, 255, 255),
    secondaryBackground: new ui.colour.RGBA(229, 229, 229),
    secondaryText: new ui.colour.RGBA(20, 20, 20),
    secondaryUI: new ui.colour.RGBA(150, 184, 247),
    secondaryUIText: new ui.colour.RGBA(255, 255, 255)
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
        this.HTMLAttributes = {};
        
        this.children = children;
        this.style = style;
        this.attributes = attributes;
        this.events = events;
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

    @param text string Text to use.

    @shortDescription Text class, extends `ui.components.Component`.
*/
ui.components.Text = class extends ui.components.Component {
    constructor(text) {
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

    @param html text HTML contents to use.

    @shortDescription HTML class, extends `ui.components.Component`.
*/
ui.components.HTML = class extends ui.components.Component {
    constructor(html) {
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
    @param style object Styling to use on component. Default: `{}`.
    @param attributes object HTML attributes to use on component. Default: `{}`.
    @param events object Events to listen to on component. Default: `{}`.

    @shortDescription Container class, extends `ui.components.Component`.
    @longDescription Has similar properties to a HTML `div` element.
*/
ui.components.Container = class extends ui.components.Component {
    constructor(children = [], style = {}, attributes = {}, events = {}) {
        super(children, style, attributes, events);

        this.HTMLTagName = "div";
    }
};

/*
    @name ui.components.Paragraph

    @param children any Children or content to include in component. Default: `[]`.
    @param style object Styling to use on component. Default: `{}`.
    @param attributes object HTML attributes to use on component. Default: `{}`.
    @param events object Events to listen to on component. Default: `{}`.

    @shortDescription Paragraph class, extends `ui.components.Component`.
    @longDescription Has similar properties to a HTML `p` element.
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

    @shortDescription Icon class, extends `ui.components.Component`.
    @longDescription Uses icons from from the Clarity icon set. An `i` element is generated.
*/
ui.components.Icon = class extends ui.components.Component {
    constructor(name) {
        super();

        this.HTMLTagName = "i";

        this.name = name;
    }

    generateDOMElement() {
        var currentDOMElement = dom.new(this.HTMLTagName);

        currentDOMElement.text.set(this.name);

        return currentDOMElement;
    }
};

ui.events.loaded(function() {});