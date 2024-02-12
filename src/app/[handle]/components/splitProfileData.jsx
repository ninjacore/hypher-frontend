function splitProfileData(profileData) {
  let mainProfileData = {
    contentType: "main",
    position: 0, // Default value for position
    contentBox: [],
  }
  let linkCollectionData = {
    contentType: "linkCollection",
    position: 1, // Default value for position
    contentBox: [],
  }
  let featuredContentData = {
    shortTitle: "",
    contentType: "featuredContent",
    position: 2, // Default value for position
    contentBox: [],
  }

  profileData.forEach((item) => {
    console.log(`\n%c NEW ROUND!`, "color: green; font-weight: bold;")

    switch (item.contentType) {
      case "main": {
        mainProfileData.contentType = item.contentType
        mainProfileData.position = item.position
        mainProfileData.contentBox = item.contentBox

        console.log("is main profile data:")
        console.table(mainProfileData.contentBox)
        break
      }

      case "linkCollection": {
        linkCollectionData.contentType = item.contentType
        linkCollectionData.position = item.position
        linkCollectionData.contentBox = item.contentBox

        console.log("is linkCollection data:")
        console.table(linkCollectionData.contentBox)
        break
      }

      case "featuredContent": {
        featuredContentData.contentType = item.contentType
        featuredContentData.position = item.position
        featuredContentData.shortTitle = item.shortTitle
        featuredContentData.contentBox = item.contentBox

        console.log("is featuredContent data:")
        console.table(featuredContentData.contentBox)
        break
      }

      default: {
        console.log("contentBox data cannot be categorized:")
        console.table(item.contentBox)
        throw new Error(
          "contentBox data cannot be categorized. Data: " + item.contentBox
        )
      }
    }
  })

  return {
    mainProfileData,
    linkCollectionData,
    featuredContentData,
  }
}

export default splitProfileData
