import { IconMapper } from "@/components/iconMapper"

import { EditButton } from "@/components/ui/editButtonPen"
import { PenIconButton } from "@/components/ui/penIconButton"

function EditableLinkItem({ linkPosition, linkUrl, linkText }) {
  return (
    <>
      {/* <div className="group/edit">
        <div
          key={"pos-" + linkPosition + "-editable"}
          className="my-4 mx-2 py-0.5 px-3 bg-konkikyou-blue group/edit"
        >
          <a>
            <IconMapper url={linkUrl} />
            <span id={"linkText-" + linkPosition} className="mx-2">
              {linkText.length > 0 ? linkText : linkUrl}
            </span>
          </a>
        </div>
        <EditButton />

      </div> */}

      <div
        key={"pos-" + linkPosition + "-editable"}
        className="group/edit flex my-4 mx-2"
      >
        <div className="w-3/4 bg-konkikyou-blue py-0.5 px-3 mx-2">
          <a>
            <IconMapper url={linkUrl} />
            <span id={"linkText-" + linkPosition} className="mx-2">
              {linkText.length > 0 ? linkText : linkUrl}
            </span>
          </a>
        </div>
        <div className="bg-konkikyou-blue">
          <PenIconButton />
        </div>
      </div>
    </>
  )
}
export { EditableLinkItem }
