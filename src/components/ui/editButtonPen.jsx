import { Button } from "@/components/ui/button"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons"

function EditButton() {
  return (
    <Button
      // variant="default"
      className="invisible group-hover/edit:visible group-hover/edit:bg-accent group-hover/edit:text-accent-foreground text-black rounded p-0.5"
    >
      <FontAwesomeIcon
        icon={faPenToSquare}
        className="fas fa-pen-to-square text-xs px-1.5 my-auto my-2.45 ml-1 py-0"
      ></FontAwesomeIcon>
    </Button>
  )
}

export { EditButton }
