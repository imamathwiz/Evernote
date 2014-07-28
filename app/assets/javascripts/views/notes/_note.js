/*global Evernote, JST */
Evernote.Views.NoteView = Backbone.View.extend({
  events: {
    "click .note-item": "makeActive"
  },
  template: JST["notes/_note"],
  
  initialize: function (options) {
    this.notes = options.notes;
    
    this.listenTo(this.model, "sync change:title", this.render);
  },
  
  makeActive: function () {
    _(this.notes).each(function (note) {
      note.model.set("active", false);
    });
    
    this.model.set("active", true);
    this.render();
  },
  
  remove: function () {
    this.model.set("active", false);
    Backbone.View.prototype.remove.call(this);
  },
  
  render: function () {
    var renderedContent = this.template({
      makeActive: this.model.get("active") ? "active" : "",
      note: this.model
    });
    
    this.$el.html(renderedContent);
    
    return this;
  }
});