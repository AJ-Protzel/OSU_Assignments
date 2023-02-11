(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['contactPost'] = template({"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=container.hooks.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "\r\n<div class=\"contact-post\">\r\n  <div class=\"contact-post-contents\">\r\n    <ul class=\"contactlist\">\r\n      <li style=\"list-style-type: none;\" id=\"contact-name\">"
    + alias4(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"name","hash":{},"data":data,"loc":{"start":{"line":5,"column":59},"end":{"line":5,"column":67}}}) : helper)))
    + "</li>\r\n      <li id=\"contact-title\">"
    + alias4(((helper = (helper = helpers.title || (depth0 != null ? depth0.title : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"title","hash":{},"data":data,"loc":{"start":{"line":6,"column":29},"end":{"line":6,"column":38}}}) : helper)))
    + "</li>\r\n      <li id=\"contact-address\">"
    + alias4(((helper = (helper = helpers.address || (depth0 != null ? depth0.address : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"address","hash":{},"data":data,"loc":{"start":{"line":7,"column":31},"end":{"line":7,"column":42}}}) : helper)))
    + "</li>\r\n      <li id=\"contact-phone\">Phone: "
    + alias4(((helper = (helper = helpers.phone || (depth0 != null ? depth0.phone : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"phone","hash":{},"data":data,"loc":{"start":{"line":8,"column":36},"end":{"line":8,"column":45}}}) : helper)))
    + "</li>\r\n      <li id=\"contact-email\">Email: "
    + alias4(((helper = (helper = helpers.email || (depth0 != null ? depth0.email : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"email","hash":{},"data":data,"loc":{"start":{"line":9,"column":36},"end":{"line":9,"column":45}}}) : helper)))
    + "</li>\r\n    </ul>\r\n  </div>\r\n</div>\r\n";
},"useData":true});
})();