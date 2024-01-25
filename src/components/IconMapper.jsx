// load json of all icons and create a map of them

import savedIcons from "../lib/fa-icons-map.json"

// TODO: consider moving these to global level
import { library } from "@fortawesome/fontawesome-svg-core"
import { fab } from "@fortawesome/free-brands-svg-icons"
import { fas } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

// This exports the whole icon packs for Brand and Solid.
library.add(fab, fas)

const iconMappings = savedIcons.icons

// take url and try to match with an entry in iconMappings based on 'regexOfUrl'
function IconMapper({ url }) {
  const icon = iconMappings.find((icon) => {
    // TODO: add better logic for when regexOfUrl is not defined
    const regexDefintion =
      icon.regexToMatch != null ? icon.regexToMatch : "NONE"
    const regex = new RegExp(regexDefintion)
    return regex.test(url)
  })

  return (
    <>
      {icon ? (
        <FontAwesomeIcon icon={[icon.iconPrefix, icon.iconName]} />
      ) : (
        <></>
      )}
    </>
  )
}

export { IconMapper }
