class EventType {
    constructor(id, name, formatting, hidden, lastModified) {
      this.id = id;
      this.name = name;
      this.formatting = formatting;
      this.hidden = hidden;
      this.lastModified = lastModified;
    }
  }
  
  module.exports = {
    EventType: EventType
  };