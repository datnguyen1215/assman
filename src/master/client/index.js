import { EventEmitter } from "jscommon/events";

const emitter = new EventEmitter();
emitter.on("event", (data) => {
  console.log("event 1", data);
});

emitter.emit("event", "hello world");
