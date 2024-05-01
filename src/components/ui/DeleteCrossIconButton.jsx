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
        className="fas fa-pen-to-square text-xs px-1.5 my-auto my-2.45 ml-1 py-0"
      ></FontAwesomeIcon>
    </span>
  )
}

export { DeleteCrossIconButton }
