/*global EpicEditor, Evernote, JST */
Evernote.Views.NoteShow = Backbone.CompositeView.extend({
  events: {
    "click .save":"saveContent",
    "click .delete": "deleteContent"
  },
  template: JST["notes/show"],
  
  afterRender: function () {
    Evernote.editor = new EpicEditor({
      clientSideStorage: false
    });
    
    Evernote.editor.load();
    Evernote.editor.importFile(this.model.escape("title"),
                               this.model.escape("content"));
    Evernote.editor.on("autosave", this.autoSave.bind(this));
  },
  
  autoSave: function () {
    var view = this;
    
    this.timeout && clearTimeout(this.timeout);
    this.timeout = setTimeout(function () {
      view.saveContent();
    }, 2000);
  },
  
  deleteContent: function () {
    this.model.destroy();
    this.model = null;
  },
  
  remove: function () {
    this.model && this.saveContent();
    Backbone.CompositeView.prototype.remove.call(this);
    Evernote.editor.removeListener("autosave");
  },
  
  render: function () {
    var renderedContent = this.template({
      note: this.model
    });
    
    this.$el.html(renderedContent);
    this.renderTitle();
    
    return this;
  },
  
  renderTitle: function () {
    var noteTitleView = new Evernote.Views.NoteTitle({
      model: this.model
    });
    
    this.addSubview("#noteShowTitle", noteTitleView);
  },
  
  saveContent: function (event) {
    var content = Evernote.editor.exportFile();
    this.model.save({ "content": content });
  }
});