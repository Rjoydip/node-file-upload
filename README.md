# node-file-upload

> Upload file in node.js

## Running Locally

```bash
$ git clone https://github.com/Rjoydip/node-file-upload.git # or clone your own fork
$ cd node-file-upload
$ npm install
$ npm start
```

Your app should now be running on [localhost:3000](http://localhost:3000).

## Server API

### `app.get('/');`

Render index.html

### `app.post('/multiparty_file_upload');`

Upload file using multiparty.

#### `Response:`

* 200: Success. Payload: file name as object.
* 422: Error. Payload: error object.


### `app.post('/multer_file_upload');`

Upload file using multer.

#### `Response:`

* 200: Success. Payload: file name as object.
* 422: Error. Payload: error object.

***Note***

> In Both api you get progress amount as object.
```
{"bytesReceived":65536,"bytesExpected":6061951}
```