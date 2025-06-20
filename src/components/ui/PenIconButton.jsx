import { Button } from "@/components/ui/button"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons"

function PenIconButton() {
  return (
    <span
      // variant="default"
      className=""
    >
      <FontAwesomeIcon
        icon={faPenToSquare}
        className="fas fa-pen-to-square text-xs"
      ></FontAwesomeIcon>
    </span>
  )
}

export { PenIconButton }
