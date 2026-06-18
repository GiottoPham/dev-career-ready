import { useTranslation } from "react-i18next"

import { Switch } from "../ui/switch"

export const LanguageSwitch = () => {
  const { i18n } = useTranslation()

  return (
    <Switch
      size="lg"
      checked={i18n.language === "vn"}
      onCheckedChange={() => {
        i18n.changeLanguage(i18n.language === "vn" ? "en" : "vn")
      }}
      uncheckedIcon={
        <div className="-mt-0.5">
          <span className="text-xs">US</span>
        </div>
      }
      checkedIcon={
        <div className="-mt-0.5">
          <span className="text-xs">VI</span>
        </div>
      }
    />
  )
}
