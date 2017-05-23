'use strict'

const noble = require('noble')
let ledState = false
let writeChara

noble.on('stateChange', state => {
  console.log('state change', state)
  if (state === 'poweredOn') {
    noble.startScanning()
  } else {
    noble.stopScanning()
  }
})

noble.on('discover', peri => {
  noble.stopScanning()
  const ad = peri.advertisement
  console.log("ad name: ", ad.localName)
  if (ad.localName == "ESP_GATTS_CAR" || ad.localName == "ESP_GATTS_SWITCH") {
    console.log("found target esp")
    peri.connect(error => {
      console.log("conected")
      //console.log("connection error:", error)
      peri.discoverServices([], (error, services) => {
        //console.log("discovered", services)
        services.forEach(service => {
          console.log("service uuid: ", service.uuid)
          if (service.uuid == "ff") {
            console.log("ff")
            service.discoverCharacteristics([], (error, charas) => {
              charas.forEach(chara => {
                console.log("found chara: ", chara.uuid)
                if (chara.uuid == "ff01") {
                  writeChara = chara
                  chara.notify(true, (err) => {
                    console.log('notify err', err)
                  })
                  chara.on('data', (data, isNotif) => {
                    console.log('receoved', data, isNotif)
                  })
                }
              })
            })
          }
        })
      })
    })
  }
})

setInterval(() => {
  ledState = !ledState
  updateLed(ledState)
}, 2000)

const updateLed = (value) => {
  if (!writeChara) {
    console.log('write characteristic is not found')
    return
  }
  if (value) {
    console.log('led on')
    writeChara.write(Buffer([0xff,0,0,0]))
  } else {
    console.log('led off')
    writeChara.write(Buffer([0,0,0,0]))
  }
}
