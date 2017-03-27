'use strict'

const noble = require('noble')

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
  if (ad.localName == "ESP_GATTS_LED") {
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
                chara.write(Buffer([1,0,0,0]))
              })
            })
          }
        })
      })
    })
  }
})
