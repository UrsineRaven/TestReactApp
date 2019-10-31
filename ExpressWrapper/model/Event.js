class Event {
  constructor(id, datetime, type) {
    this.id = id;
    this.datetime = datetime;
    this.type = type;
  }
}
  
module.exports = {
  Event: Event
};