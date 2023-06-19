# WebSocket

The communication between Master and Slaves is WebSocket. Therefore, we need to define the protocols for the communication. Otherwise, it'd be hard to know which one is which.

### Message Types

There will be 2 different message types for the communication:

1. **Request**: A request from Master to Slave.
1. **Response**: A response from Slave to Master.

### Message Format

##### REQUEST

A request is a message type that requires a response. Therefore, the `id` field is to determine which request the response is for.

A `REQUEST` is usually used for actions for anything that requires a feedback from the receiver.

```json
{
  "type": "REQUEST",
  "id": "1234567890",
  "payload": {}
}
```

Response:

```json
{
  "type": "RESPONSE",
  "id": "1234567890",
  "payload": {}
}
```

##### EVENT

This is a bit different from `REQUEST`. It sends and forgets. Therefore, we don't need the `id` field for identification.

An `EVENT` is usually used for notifications.

```json
{
  "type": "EVENT",
  "payload": {}
```
}
