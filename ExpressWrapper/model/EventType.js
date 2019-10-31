class EventType {
    constructor(id, name, formatting, show, lastModified) {
      this.id = id;
      this.name = name;
      this.formatting = formatting;
      this.show = show;
      this.lastModified = lastModified;
    }
  }
  
  module.exports = {
    EventType: EventType
  };