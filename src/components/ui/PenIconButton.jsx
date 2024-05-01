import { Button } from "@/components/ui/button"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons"

function PenIconButton() {
  return (
    <span
      // variant="default"
      className="rounded p-0.5 bg-konkikyou-blue"
    >
      <FontAwesomeIcon
        icon={faPenToSquare}
        className="fas fa-pen-to-square text-xs px-1.5 my-auto my-2.45 ml-1 py-0"
      ></FontAwesomeIcon>
    </span>
  )
}

export { PenIconButton }
