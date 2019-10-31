const EntitySchema = require("typeorm").EntitySchema;
const Event = require("../model/Event").Event;

module.exports = new EntitySchema({
  name: "Event",
  target: Event,
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true
    },
    datetime: {
      type: "int"
    }
  },
  relations: {
    type: {
      target: "EventType",
      type: "many-to-one",
      eager: true
    }
  }
});