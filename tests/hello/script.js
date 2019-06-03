// @import ../../src/ui
// @import https://opensource.liveg.tech/ZaprCoreLibs/src/core/core
// @import https://opensource.liveg.tech/ZaprCoreLibs/src/dom/dom

core.unpack(ui.components);

dom.loaded(function() {
    dom.element().newChild(
        new Container([
            new Text("Hello, world!")
        ]).generateDOMElement()
    );
});