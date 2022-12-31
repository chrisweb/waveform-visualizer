# waveform-visualizer - simple waveform-visualizer example

## build

first, use your favorite command line tool and go into the root of this project:

```shell
cd /waveform-visualizer
```

then use the follwing command in the root of this repository to build the waveform-visualizer itself:  

`npm run build`

Note: for more instructions about the waveform-visualizer itself check out the [waveform-visualizer README](../../README.md)  

then, build the example (server & client) itself:  

go into the example folder:  

```shell
cd /waveform-visualizer/examples/simple-waveform
```

install the latest nodejs (if you haven't already) [nodejs](https://nodejs.org)  

update npm to latest version  

`npm install npm@latest -g`

install the server dependencies  

### client

#### go into the client folder

```shell
cd client
```

#### install the client dependencies

```shell
npm i
```

### build the client

```shell
npm run build
```

### server

#### go into the server folder

```shell
cd server
```

#### install the server dependencies

```shell
npm i
```

#### build the server

```shell
npm run build
```

#### start the server

start the server

`npm run start`

## usage

open the project in your browser:  

`http://127.0.0.1:35000/`

* click the play button to launch the song
* the stop button (you guessed it) stops the song from playing
* click into the waveform to change the song position
* you can adjust the volume using the volume bar at the bottom

check out the `/waveform-visualizer/examples/simple-waveform/client/src/` source code, especially `/client/src/library/visualizer.ts` to get an idea of how you can use the visualizer in your own projects  

* the audio player I used for the demo, is another of my projects and is available on npm too: <https://www.npmjs.com/package/web-audio-api-player>
* the waveform data for the song was generated using another of my projects, the "waveform data generator" and the source code to build create your own data can be found on github: <https://github.com/chrisweb/waveform-data-generator>

## linting

the linting is now done via the npm run lint command of the main project
