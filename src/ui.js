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

// @asset src/style.css

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

                dom.element("head").append(importer.generateLinkDOMElement("style.css"));

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

        this.HTMLTagName = "span";
    }
};

ui.events.loaded(function() {});