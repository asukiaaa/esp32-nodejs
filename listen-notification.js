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
  if (ad.localName == "ESP_GATTS_SWITCH") {
    console.log("found target esp")
    peri.connect(error => {
      console.log("conected")
      if (error) {
        console.log("connection error:", error)
      }
      peri.discoverServices([], (error, services) => {
        if (error) {
          console.log("discover service error", error)
        }
        services.forEach(service => {
          console.log("service uuid: ", service.uuid)
          if (service.uuid == "ff") {
            console.log("ff")
            service.discoverCharacteristics([], (error, charas) => {
              if (error) {
                console.log("discover characteristics error", error)
              }
              charas.forEach(chara => {
                console.log("found chara: ", chara.uuid)
                if (chara.uuid == "ff01") {
                  chara.notify(true, (error) => {
                    if (error) {
                      console.log('listen notif error', error)
                    } else {
                      console.log('listen notif')
                    }
                  })
                  chara.on('data', (data, isNotif) => {
                    console.log('receoved notif', data, isNotif)
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
