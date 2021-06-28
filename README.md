## broker-test
This NodeJS project sends fake sensorial data via MQTT to the broker. <br>
The config is edited on the `.env` file. The script will only send data when connected to the MQTT broker.

### How to Run
Requirements: NodeJS 14
- Clone the repo
- Run `npm install`
- Rename the file `.env.example` to `.env` and edit the values
- Run `npm start`

### Data Sent
```
{"ref":"optod","temp":"23.3","oxSat":"71.6","oxMg":" 6.1","oxPpm":" 6.1"}
```
`ref` - `optod` - Oxygen Sensor <br>
`temp` - random between `15` and `27` <br>
`oxSat` - random between `0` and `100` <br>
`oxMg` - random between `0` and `100` <br>
`oxPpm` - random between `0` and `100` <br>

```
{"ref":"ph","temp":"23.4","pH":" 7.6","redox":" 0.0"}
```
`ref` - `ph` - ph Sensor <br>
`temp` - random between `15` and `27` <br>
`pH` - random between `0` and `14` <br>
`redox` - random between `0` and `1` <br>

```
{"ref":"c4e","temp":"23.2","condutivity":"342.9","salinity":" 0.2","tds":"173.1"}
```
`ref` - `c4e` - Conductivity Sensor <br>
`temp` - random between `15` and `27` <br>
`condutivity` - random between `0` and `800` <br>
`salinity` - random between `0` and `35` <br>
`tds` - random between `0` and `200` <br>

### .env File
```
MQTT_HOST=
MQTT_PORT=
MQTT_USER=
MQTT_PASS=
MQTT_TOPIC=
```