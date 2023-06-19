# File Transfer

To support file transfers, we need to support these 2 cases:

1. Master -> Slave
2. Slave -> Master

Every messages follow the request/response or event concept described [here](./websocket.md).

## Master to Slave

#### How it works

The Master can choose to mass transfer files to all the connected Slaves.

1. The Master copies the files into `upload/` folder.
1. The Master sends a message to the Slave
1. The Slave downloads the files into their machines, putting them in: downloads/ folder.\

#### FilesDownloadPayload

Sending files payload:

```js
{
  "command": "files:download",
  "data": {
    "files": [
      "http://localhost:3000/upload/1.txt",
      "http://localhost:3000/upload/2.txt"
    ]
  }
}
```

Response:

```js
{
  "success": true, // or false
  "error": { // if success is false
    "code": 1000,
    "message": "File URL is not accessible"
  }
}
```

Error codes:

- `10000`: File URL is not accessible

## Slave -> Master

We can't use the steps above because the Slaves aren't supposed to send files. The Master will be requesting them instead.

1. The Master sends a message to the Slave. Please see info about this message here.
1. The Slave exposes the requested file by copying the files to their upload/ folder.
1. The Slave responds back to the Master with the URL that exposes the file.
1. The Master downloads the file and put it into downloads/ folder.

#### FilesExposePayload

Getting file payload:

```js
{
  "command": "files:expose",
  "data": {
    "files": [
      "C:\\Users\\Test\\Downloads\\1.txt",
      "C:\\Users\\Test\\Downloads\\2.txt"
    ]
  }
}
```

Response:

```js
{
  "success": true, // or false
  "error": { // if success is false
    "code": 1100,
    "message": "File not found"
  }
}
```

Error codes:

- `1100`: File URL not found
- `1101`: Unable to copy file
