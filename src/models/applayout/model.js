// Adapt UI
// 
// Copyright (C) LiveG. All Rights Reserved.
// Copying is not a victimless crime. Anyone caught copying LiveG software may
// face sanctions.
// 
// https://liveg.tech
// Licensed by the LiveG Open-Source Licence, which can be found at LICENCE.md.

// @import https://opensource.liveg.tech/ZaprCoreLibs/src/l10n/l10n

ui.models.appLayout = {};

var appLayoutFunctions = {
    dialogs: {
        focusStack: []
    },

    scrollPosition: new ui.Vector(0, 0)
};

/*
    @name appLayoutFunctions.dialogs.register

    @param domObject object DOM object of menu to register. Default: `dom.element("div[menu]")`.

    @shortDescription Register any menu for events and accessibility which is an instance of `ui.models.appLayout.Menu`.
*/
appLayoutFunctions.dialogs.register = function(domObject = dom.element("div[menu]")) {
    domObject.newChild(dom.new("div")
        .attribute("menublur").set("")
        .events.listen("click", function() {
            appLayoutFunctions.dialogs.close(domObject);
        })
    );

    domObject.newChild(dom.new("button")
        .attribute("menuclose").set("")
        .text.set(l10n.translate("ui_appLayout_closeMenu") || "Close menu")
        .events.listen("click", function() {
            appLayoutFunctions.dialogs.close(domObject);
        })
    );

    dom.element().events.listen("keyup", function(event) {
        if (event.keyCode == 27) {
            appLayoutFunctions.dialogs.close(domObject);
        }
    });

    setInterval(function() {
        if (!domObject.reference[0].contains(document.activeElement) && domObject.attribute("open").get() != null && document.activeElement != document.body) {
            domObject.children(1).reference[0].focus();
        }
    });

    domObject.children()
        .attribute("tabindex").set("-1")
        .attribute("aria-hidden").set("true")
    ;

    try {
        domObject.children(3).children()
            .attribute("tabindex").set("-1")
            .attribute("aria-hidden").set("true")
        ;
    } catch (error) {
        domObject.children(1).children()
            .attribute("tabindex").set("-1")
            .attribute("aria-hidden").set("true")
        ;
    }

    dom.element("div[menublur], div[menutitle], div[menucontent], div[menutext], hr[menudivider]").attribute("aria-hidden").set("true");
};

/*
    @name appLayoutFunctions.dialogs.open

    @param domObject object DOM object of menu to open. Default: `dom.element("div[menu]")`.

    @shortDescription Open any menu which is an instance of `ui.models.appLayout.Menu`.
*/
appLayoutFunctions.dialogs.open = function(domObject = dom.element("div[menu]")) {
    appLayoutFunctions.dialogs.focusStack.push(document.activeElement);

    domObject.attribute("open").set("");
    domObject.children()
        .attribute("tabindex").set("0")
        .attribute("aria-hidden").delete()
    ;

    try {
        domObject.children(3).children()
            .attribute("tabindex").set("0")
            .attribute("aria-hidden").delete()
        ;
    } catch (error) {
        domObject.children(1).children()
            .attribute("tabindex").set("0")
            .attribute("aria-hidden").delete()
        ;
    }

    dom.element("div[menublur], div[menutitle], div[menucontent], div[menutext], hr[menudivider]")
        .attribute("tabindex").set("-1")
        .attribute("aria-hidden").delete()
    ;

    try {
        domObject.children(3).reference[0].focus();
    } catch (error) {
        domObject.children(1).reference[0].focus();
    }
};

/*
    @name appLayoutFunctions.dialogs.close

    @param domObject object DOM object of menu to close. Default: `dom.element("div[menu]")`.

    @shortDescription Close any menu which is an instance of `ui.models.appLayout.Menu`.
*/
appLayoutFunctions.dialogs.close = function(domObject = dom.element("div[menu]")) {
    domObject.attribute("open").delete();
    domObject.children().attribute("tabindex").set("-1");
    domObject.children().attribute("aria-hidden").set("true");

    try {
        domObject.children(3).children()
            .attribute("tabindex").set("-1")
            .attribute("aria-hidden").set("true")
        ;
    } catch (error) {
        domObject.children(1).children()
            .attribute("tabindex").set("-1")
            .attribute("aria-hidden").set("true")
        ;
    }

    dom.element("div[menublur], div[menutitle], div[menucontent], div[menutext], hr[menudivider]").attribute("aria-hidden").set("true");

    appLayoutFunctions.dialogs.focusStack.pop().focus();
};

/*
    @name appLayoutFunctions.scrollContent

    @param scrollTo object Vector class to scroll content to. Default: `new ui.Vector(0, 0)`.

    @shortDescription Scroll the main UI content to the specified vector.
*/
appLayoutFunctions.scrollContent = function(scrollTo = new ui.Vector(0, 0)) {
    if (dom.element("div[appcontent]").reference.length > 0) {
        dom.element("div[appcontent]").reference[0].scrollLeft = scrollTo.x;
        dom.element("div[appcontent]").reference[0].scrollTop = scrollTo.y;
    }
};

/*
    @name appLayoutFunctions.getContentScrollPosition

    @return object Vector class of scroll position.

    @shortDescription Get the vector of the scroll position of the main UI content.
*/
appLayoutFunctions.getContentScrollPosition = function() {
    if (dom.element("div[appcontent]").reference.length > 0) {
        return new ui.Vector(dom.element("div[appcontent]").reference[0].scrollLeft, dom.element("div[appcontent]").reference[0].scrollTop);
    } else {
        return new ui.Vector(0, 0);
    }
};

/*
    @name ui.models.appLayout._preRefresh

    @shortDescription Save any volatile component properties before refresh.
*/
ui.models.appLayout._preRefresh = function() {
    if (dom.element("div[appcontent]").reference.length > 0) {
        appLayoutFunctions.scrollPosition.x = dom.element("div[appcontent]").reference[0].scrollLeft;
        appLayoutFunctions.scrollPosition.y = dom.element("div[appcontent]").reference[0].scrollTop;
    }
};

/*
    @name ui.models.appLayout._postRefresh

    @shortDescription Restore any volatile component properties after refresh.
*/
ui.models.appLayout._postRefresh = function() {
    if (dom.element("div[appcontent]").reference.length > 0) {
        dom.element("div[appcontent]").reference[0].scrollLeft = appLayoutFunctions.scrollPosition.x;
        dom.element("div[appcontent]").reference[0].scrollTop = appLayoutFunctions.scrollPosition.y;
    }
};

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
    @name ui.models.appLayout.MenuBarButton

    @param children any Children or content to include in component. Default: `[]`.
    @param style object Styling to use on component. Default: `{}`.
    @param attributes object HTML attributes to use on component. Default: `{}`.
    @param events object Events to listen to on component. Default: `{}`.

    @shortDescription MenuBarButton class, extends `ui.models.appLayout.Component`.
    @longDescription Has similar properties to an HTML `button` element with attribute `menubarbutton`.
    @longDescription It is recommended to only have an icon representing the button.
*/
ui.models.appLayout.MenuBarButton = class extends ui.models.appLayout.Component {
    constructor(children = [], style = {}, attributes = {}, events = {}) {
        super(children, style, attributes, events);

        this.HTMLTagName = "button";
    }

    precompute(domObject) {
        this.attributes["menubarbutton"] = "";

        return domObject;
    }
};

/*
    @name ui.models.appLayout.ActionButton

    @param children any Children or content to include in component. Default: `[]`.
    @param style object Styling to use on component. Default: `{}`.
    @param attributes object HTML attributes to use on component. Default: `{}`.
    @param events object Events to listen to on component. Default: `{}`.

    @shortDescription ActionButton class, extends `ui.models.appLayout.Component`.
    @longDescription Has similar properties to an HTML `button` element with attribute `menubaractionbutton`.
    @longDescription It is recommended to only have an icon representing the button.
*/
ui.models.appLayout.ActionButton = class extends ui.models.appLayout.Component {
    constructor(children = [], style = {}, attributes = {}, events = {}) {
        super(children, style, attributes, events);

        this.HTMLTagName = "button";
    }

    precompute(domObject) {
        this.attributes["actionbutton"] = "";

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
    @longDescription Should have children `ui.models.appLayout.MenuTitle` and `ui.models.appLayout.MenuContent`.
*/
ui.models.appLayout.Menu = class extends ui.models.appLayout.Component {
    constructor(children = [], style = {}, attributes = {}, events = {}) {
        super(children, style, attributes, events);

        this._isDetectedOpen = false;
        this._programmaticOpenClose = null;
        this._openChecker = setInterval(function() {});
    }

    set isOpen(value) {
        this._programmaticOpenClose = value;
    }

    get isOpen() {
        return this._isDetectedOpen;
    }

    precompute(domObject) {
        this.attributes["menu"] = "";

        appLayoutFunctions.dialogs.register(domObject);

        clearInterval(this._openChecker);

        var thisScope = this;

        this._openChecker = setInterval(function() {
            thisScope._isDetectedOpen = domObject.attribute("open").get() != null;
        });

        if (this._isDetectedOpen) {
            this.attributes["open"] = "";
        } else {
            delete this.attributes["open"];
        }

        // We want this section to run after this method, so we run it in the next available frame
        setTimeout(function() {
            if (thisScope._programmaticOpenClose != null) {
                if (thisScope._programmaticOpenClose) {
                    appLayoutFunctions.dialogs.open(domObject);
                } else {
                    appLayoutFunctions.dialogs.close(domObject);  
                }

                thisScope._programmaticOpenClose = null;
            }
        });

        return domObject;
    }
};

/*
    @name ui.models.appLayout.MenuTitle

    @param children any Children or content to include in component. Default: `[]`.
    @param style object Styling to use on component. Default: `{}`.
    @param attributes object HTML attributes to use on component. Default: `{}`.
    @param events object Events to listen to on component. Default: `{}`.

    @shortDescription MenuTitle class, extends `ui.models.appLayout.Component`.
    @longDescription Has similar properties to an HTML `div` element with attribute `menutitle`.
*/
ui.models.appLayout.MenuTitle = class extends ui.models.appLayout.Component {
    constructor(children = [], style = {}, attributes = {}, events = {}) {
        super(children, style, attributes, events);
    }

    precompute(domObject) {
        this.attributes["menutitle"] = "";

        return domObject;
    }
};

/*
    @name ui.models.appLayout.MenuContent

    @param children any Children or content to include in component. Default: `[]`.
    @param style object Styling to use on component. Default: `{}`.
    @param attributes object HTML attributes to use on component. Default: `{}`.
    @param events object Events to listen to on component. Default: `{}`.

    @shortDescription MenuContent class, extends `ui.models.appLayout.Component`.
    @longDescription Has similar properties to an HTML `div` element with attribute `menucontent`.
*/
ui.models.appLayout.MenuContent = class extends ui.models.appLayout.Component {
    constructor(children = [], style = {}, attributes = {}, events = {}) {
        super(children, style, attributes, events);
    }

    precompute(domObject) {
        this.attributes["menucontent"] = "";

        return domObject;
    }
};

/*
    @name ui.models.appLayout.MenuButton

    @param children any Children or content to include in component. Default: `[]`.
    @param style object Styling to use on component. Default: `{}`.
    @param attributes object HTML attributes to use on component. Default: `{}`.
    @param events object Events to listen to on component. Default: `{}`.

    @shortDescription MenuButton class, extends `ui.models.appLayout.Component`.
    @longDescription Has similar properties to an HTML `button` element with attribute `menubutton`.
*/
ui.models.appLayout.MenuButton = class extends ui.models.appLayout.Component {
    constructor(children = [], style = {}, attributes = {}, events = {}) {
        super(children, style, attributes, events);

        this.HTMLTagName = "button";
    }

    precompute(domObject) {
        this.attributes["menubutton"] = "";
        this.attributes["tabindex"] = "-1";
        this.attributes["aria-hidden"] = "true";

        return domObject;
    }
};

/*
    @name ui.models.appLayout.MenuText

    @param children any Children or content to include in component. Default: `[]`.
    @param style object Styling to use on component. Default: `{}`.
    @param attributes object HTML attributes to use on component. Default: `{}`.
    @param events object Events to listen to on component. Default: `{}`.

    @shortDescription MenuText class, extends `ui.models.appLayout.Component`.
    @longDescription Has similar properties to an HTML `div` element with attribute `menutext`.
*/
ui.models.appLayout.MenuText = class extends ui.models.appLayout.Component {
    constructor(children = [], style = {}, attributes = {}, events = {}) {
        super(children, style, attributes, events);
    }

    precompute(domObject) {
        this.attributes["menutext"] = "";

        return domObject;
    }
};

/*
    @name ui.models.appLayout.MenuDivider

    @param style object Styling to use on component. Default: `{}`.
    @param attributes object HTML attributes to use on component. Default: `{}`.
    @param events object Events to listen to on component. Default: `{}`.

    @shortDescription MenuDivider class, extends `ui.models.appLayout.Component`.
    @longDescription Has similar properties to an HTML `hr` element with attribute `menudivider`.
*/
ui.models.appLayout.MenuDivider = class extends ui.models.appLayout.Component {
    constructor(style = {}, attributes = {}, events = {}) {
        super([], style, attributes, events);

        this.HTMLTagName = "hr";
    }

    precompute(domObject) {
        this.attributes["menudivider"] = "";

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

    get scrollPosition() {
        return appLayoutFunctions.getContentScrollPosition();
    }
    
    set scrollPosition(vector) {
        appLayoutFunctions.scrollContent(vector);
    }
};

setInterval(function() {
    dom.element("div[menu]:not([open]) div[menublur], div[menu]:not([open]) div[menutitle], div[menu]:not([open]) div[menucontent], div[menu]:not([open]) div[menutext], div[menu]:not([open]) hr[menudivider]").attribute("aria-hidden").set("true");    
});