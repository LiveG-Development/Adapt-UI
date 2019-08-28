// Adapt UI
// 
// Copyright (C) LiveG. All Rights Reserved.
// Copying is not a victimless crime. Anyone caught copying LiveG software may
// face sanctions.
// 
// https://liveg.tech
// Licensed by the LiveG Open-Source Licence, which can be found at LICENCE.md.

ui.models.appLayout = {};

/*
    @name ui.models.appLayout.Component

    @param children any Children or content to include in component. Default: `[]`.
    @param style object Styling to use on component. Default: `{}`.
    @param attributes object HTML attributes to use on component. Default: `{}`.
    @param events object Events to listen to on component. Default: `{}`.

    @shortDescription Component class, extends `ui.components.Component`.
*/
ui.models.appLayout.Component = class extends ui.components.Component {
    constructor(children = [], style = {}, attributes = {}, events = {}) {
        super(children, style, attributes, events);

        this.HTMLTagName = "div";

        // @asset style.css
                
        dom.element("head").newChild(importer.generateLinkDOMElement(_assets["style.css"]));
    }
};

/*
    @name ui.models.appLayout.MenuBar

    @param children any Children or content to include in component. Default: `[]`.
    @param style object Styling to use on component. Default: `{}`.
    @param attributes object HTML attributes to use on component. Default: `{}`.
    @param events object Events to listen to on component. Default: `{}`.

    @shortDescription MenuBar class, extends `ui.models.appLayout.Component`.
    @longDescription Has similar properties to an HTML `div` element with attribute `menubar`.
*/
ui.models.appLayout.MenuBar = class extends ui.models.appLayout.Component {
    precompute(domObject) {
        this.attributes["menubar"] = "";

        return domObject;
    }
};

/*
    @name ui.models.appLayout.Menu

    @param children any Children or content to include in component. Default: `[]`.
    @param style object Styling to use on component. Default: `{}`.
    @param attributes object HTML attributes to use on component. Default: `{}`.
    @param events object Events to listen to on component. Default: `{}`.

    @shortDescription Menu class, extends `ui.models.appLayout.Component`.
    @longDescription Has similar properties to an HTML `div` element with attribute `menu`.
*/
ui.models.appLayout.Menu = class extends ui.models.appLayout.Component {
    constructor(children = [], style = {}, attributes = {}, events = {}) {
        super(children, style, attributes, events);
    }

    precompute(domObject) {
        this.attributes["menu"] = "";

        domObject.newChild(dom.new("div")
            .attribute("menublur").set("")
            .events.listen("click", function() {
                dom.element("div[menu]").attribute("open").delete()
            })
        );

        return domObject;
    }
};

/*
    @name ui.models.appLayout.Content

    @param children any Children or content to include in component. Default: `[]`.
    @param style object Styling to use on component. Default: `{}`.
    @param attributes object HTML attributes to use on component. Default: `{}`.
    @param events object Events to listen to on component. Default: `{}`.

    @shortDescription Content class, extends `ui.models.appLayout.Component`.
    @longDescription Has similar properties to an HTML `div` element with attribute `appcontent`.
*/
ui.models.appLayout.Content = class extends ui.models.appLayout.Component {
    precompute(domObject) {
        this.attributes["appcontent"] = "";

        return domObject;
    }
};