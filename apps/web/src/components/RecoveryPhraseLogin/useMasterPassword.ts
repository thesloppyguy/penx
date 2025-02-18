import { atom, useAtom } from 'jotai'

type MasterPassword = {
  value: string
  blur: boolean
}

const masterPasswordAtom = atom<MasterPassword>({
  value: '',
  blur: true,
})

export function useMasterPassword() {
  const [masterPassword, setMasterPassword] = useAtom(masterPasswordAtom)

  function setBlur(blur: boolean) {
    setMasterPassword((state) => ({ ...state, blur }))
  }

  return {
    blur: masterPassword.blur,
    setBlur,
    masterPassword,
    setMasterPassword,
  }
}
