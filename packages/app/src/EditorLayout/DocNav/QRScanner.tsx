import React, { useEffect, useRef, useState } from 'react'
import { Box } from '@fower/react'
import { Html5Qrcode } from 'html5-qrcode'
import { ScanLine, X } from 'lucide-react'
import { db, getNewSpace } from '@penx/local-db'
import { User } from '@penx/model'
import { store } from '@penx/store'
import { trpc } from '@penx/trpc-client'

export const QRScanner: React.FC = () => {
  const [visible, setVisible] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const ref = useRef<Html5Qrcode | null>(null)

  useEffect(() => {
    let html5QrcodeScanner = new Html5Qrcode('reader')
    ref.current = html5QrcodeScanner
  }, [])

  async function syncSpaces(address: string) {
    const data = await trpc.user.byAddress.query({ address })
    const user = new User(data)
    store.setUser(user)

    db.space.insert(
      getNewSpace({
        id: user.spaceIds[0],
        name: 'FOOO',
        isActive: true,
      }),
    )
  }

  const startScanner = async () => {
    // This method will trigger user permissions
    try {
      setVisible(true)

      console.log('device....')

      const devices = await Html5Qrcode.getCameras()

      /**
       * devices would be an array of objects of type:
       * { id: "id", label: "label" }
       */
      if (devices && devices.length) {
        var cameraId = devices[0].id
        console.log('cameraId:', cameraId, 'devices:', devices)

        ref
          .current!.start(
            { facingMode: 'environment' },
            {
              fps: 10, // sets the framerate to 10 frame per second
              qrbox: 300, // sets only 250 X 250 region of viewfinder to
              // scannable, rest shaded.
            },
            (qrCodeMessage) => {
              // do something when code is read. For example:
              try {
                const data = JSON.parse(qrCodeMessage)
                alert(data.address)
                console.log(`QR Code detected: ${qrCodeMessage}`)
                syncSpaces(data.address)
              } catch (error) {
                //
              }
            },
            (errorMessage) => {
              // parse error, ideally ignore it. For example:
              console.log(`QR Code no longer in front of camera.`)
            },
          )
          .catch((err) => {
            // Start failed, handle it. For example,
            console.log(`Unable to start scanning, error: ${err}`)
          })
      }
    } catch (error) {
      console.log('error:', error)
    }
  }

  function stopScanner() {
    ref
      .current!.stop()
      .then((ignore) => {
        // QR Code scanning is stopped.
        console.log('QR Code scanning stopped.')
        setVisible(false)
      })
      .catch((err) => {
        // Stop failed, handle it.
        console.log('Unable to stop scanning.')
      })
  }

  return (
    <Box>
      <Box
        bgRed100
        px4
        fixed
        zIndex-100
        bottom0
        left0
        right0
        top0
        bgBlack
        toCenter
        display={visible ? 'block' : 'none'}
      >
        <Box
          roundedFull
          square8
          bgWhite
          toCenter
          absolute
          top2
          left2
          onClick={stopScanner}
        >
          <X />
        </Box>
        <Box
          absolute
          top="20%"
          left="50%"
          translateX="-50%"
          id="reader"
          ref={videoRef.current}
          w-300
          h-300
        />
      </Box>

      <Box inlineFlex onClick={startScanner}>
        <ScanLine />
      </Box>
    </Box>
  )
}
