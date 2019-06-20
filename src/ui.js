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
    @name ui.components.Component

    @param children object Children to include in component. Default: `[]`.

    @shortDescription Blank component class.
*/
ui.components.Component = class {
    constructor(children = []) {
        this.HTMLTagName = "div";
        this.HTMLAttributes = {};
        
        this.children = children;
    }

    /*
        @name ui.components.Component( ... ).generateDOMElement

        @return object Dictionary of available functions and values for generated DOM element.

        @shortDescription Generate DOM element for component.
    */
    generateDOMElement() {
        var currentDOMElement = dom.new(this.HTMLTagName);

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

    @param children object Children to include in component. Default: `[]`.

    @shortDescription Container class, extends `ui.components.Component`.
    @longDescription Has similar properties to a HTML `div` element.
*/
ui.components.Container = class extends ui.components.Component {
    constructor(children = []) {
        super(children);

        this.HTMLTagName = "div";
    }
};

/*
    @name ui.components.Paragraph

    @param children object Children to include in component. Default: `[]`.

    @shortDescription Paragraph class, extends `ui.components.Component`.
    @longDescription Has similar properties to a HTML `p` element.
*/
ui.components.Paragraph = class extends ui.components.Component {
    constructor(children = []) {
        super(children);

        this.HTMLTagName = "p";
    }
}

/*
    @name ui.components.Heading

    @param children object Children to include in component. Default: `[]`.
    @param level number Level number to use for heading. Must be between 1 and 6 inclusive. Default: `1`.

    @shortDescription Heading class, extends `ui.components.Component`.
    @longDescription Has similar properties to the HTML `h1`, `h2`, `h3`, `h4`, `h5` and `h6` elements.
*/
ui.components.Heading = class extends ui.components.Component {
    constructor(children = [], level = 1) {
        super(children);

        if (typeof(level) == "number" && Number.isInteger(level) && level >= 1 && level <= 6) {
            this.HTMLTagName = "h" + String(level);
        } else {
            throw "`level` is either not a number, is not an integer, or is not between 1 and 6 inclusive";
        }
    }
}

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
}

ui.events.loaded(function() {});