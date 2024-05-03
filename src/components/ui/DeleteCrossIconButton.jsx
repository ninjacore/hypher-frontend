import { Button } from "@/components/ui/button"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
// import { faPenToSquare } from "@fortawesome/free-solid-svg-icons"
import { faXmark } from "@fortawesome/free-solid-svg-icons"

function DeleteCrossIconButton() {
  return (
    <span
      // variant="default"
      className=""
    >
      <FontAwesomeIcon
        icon={faXmark}
        className="fas fa-pen-to-square text-xs"
      ></FontAwesomeIcon>
    </span>
  )
}

export { DeleteCrossIconButton }
