# Ghostlight

The basic idea is that a Raspberry Pi opens an access point and runs a websocket server that the sensors (and flashlights and actuators) connect to.

## Just running

### Raspberry Pi prep

Use the Raspberry Pi Imager and flash a fresh Raspberry OS image to the SD card. In the advanced settings, fill in Wifi credentials to be used to install stuff and enable ssh access.

Boot up the Pi and

- install NodeJS and
- clone the repository (that can be wherever, just remember where).
- run `npm install` on the repository root and
- run `npm install` in the `frontend` folder
- run `npm install -g pm2` to install pm2 globally as process manager

I'd also start both to see if things work. For that run

- `pm2 start app.js` in the repository root folder
- `pm2 start app.py --interpreter python3` in the `frontend/dist` folder (not sure if the app.py script is copied during build process. Maybe you need to do it manually...)

With `pm2 status` you can see if processes are running. You should see the webfrontend in the browser. Alternatively you can connect a webclient from your computer to just the server on the PI. That's up to you.

### RaspAP

For access point configuration I'm using [raspAP](). Run the installation steps outlined on the website.

Use the default configuration to login into the admin page and configure the access point.

Defintiely change the admin password.

You will need SSID and password to put it into the microcontroller sketches so that all the eESPs can connect to the network.

### Finishing up

Once the server process is running you can start connecting the peripherals. Happy lighting!

## Development

The server is a Node+Express app. The REST routes are used to fill the webclient, all other communication happens over websocket.

There is no database, all clients are only stored in memory. So if the Pi goes offline or the process crashes, all clients need to reconnect. At some point I thought this was smart, but it's just impractial and if I had time I would change it now.

The webclient is a Vue3 app and pretty standard. The socket connection is `provide`d on app level and can be `inject`ed into components that need it.

The code grew a little out of hand and there is lots of duplication, but a lot had to happen in the last few weeks and quite a few things changed.

@todo cleanup and dry code
@todo write nicer 'deployment' and automation scripts
