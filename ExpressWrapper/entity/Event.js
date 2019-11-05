const EntitySchema = require("typeorm").EntitySchema;
const Event = require("../model/Event").Event;

module.exports = new EntitySchema({
  name: "Event",
  target: Event,
  columns: {
    id: {
      primary: true,
      type: "int",
      unique: true
    },
    datetime: {
      type: "int"
    },
    typeId: {
      type: "int",
      nullable: true
    }
  },
  relations: {
    type: {
      target: "EventType",
      type: "many-to-one",
      nullable: false
    }
  }
});