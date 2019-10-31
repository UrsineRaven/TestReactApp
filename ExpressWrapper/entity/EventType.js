const EntitySchema = require("typeorm").EntitySchema;
const EventType = require("../model/EventType").EventType;

module.exports = new EntitySchema({
  name: "EventType",
  target: EventType,
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true
    },
    name: {
      type: "varchar",
      length: 25
    },
    formatting: {
      type: "text"
    },
    lastModified: {
        type: "int"
    },
    hidden: {
      type: "boolean",
      default: "false"
    }
  }
});