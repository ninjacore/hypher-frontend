import { uuidv4 } from "@/lib/utils"

export class TagNode {
  // if next or previous is null, then there is
  // no other node in that directin of the chain

  constructor(text) {
    this.id = uuidv4()
    this.text = text
    this.position = 0
    this.previousTag = null
    this.nextTag = null
    this.isVisible = true
    this.isMarkedForDeletion = false
  }

  insertBefore(newPrevTag) {
    // handle link with previous tag
    if (this.previousTag != null) {
      this.previousTag.nextTag = newPrevTag
      newPrevTag.previousTag = this.previousTag
    }

    // basic operation
    newPrevTag.nextTag = this
    this.previousTag = newPrevTag
  }

  insertAfter(newNextTag) {
    // handle link with next tag
    if (this.nextTag != null) {
      this.nextTag.previousTag = newNextTag
      newNextTag.nextTag = this.nextTag
    }

    // basic operation
    newNextTag.previousTag = this
    this.nextTag = newNextTag
  }

  removeSelf() {
    // handle link with previous tag
    if (this.previousTag != null) {
      this.previousTag.nextTag = this.nextTag
    }

    // handle link with next tag
    if (this.nextTag != null) {
      this.nextTag.previousTag = this.previousTag
    }
  }
}
