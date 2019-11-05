const EntitySchema = require("typeorm").EntitySchema;
const EventType = require("../model/EventType").EventType;

module.exports = new EntitySchema({
  name: "EventType",
  target: EventType,
  columns: {
    id: {
      primary: true,
      type: "int",
      unique: true
    },
    name: {
      type: "varchar",
      length: 25
    },
    formatting: {
      type: "text",
      nullable: true
    },
    lastModified: {
        type: "int",
        nullable: true
    },
    hidden: {
      type: "boolean",
      default: false,
      nullable: true
    }
  }
});