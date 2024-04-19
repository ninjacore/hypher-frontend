export function announce(announcement, objectToLog, colorName) {
  let colorCode = ""

  switch (colorName) {
    case "titanium yellow":
      colorCode = "#eee600" // titanium yellow
      break

    case "bisque":
      colorCode = "#ffe4c4" // bisque
      break

    case "lime":
      colorCode = "#00ff00" // lime
      break

    case "orchid":
      colorCode = "#da70d6" // orchid
      break

    case "cyan":
      colorCode = "#00ffff" // cyan
      break

    case "green":
      colorCode = "#7fffd4" // green
      break

    default:
      colorCode = "#7fffd4" // green
      break
  }

  console.log(`%c /////////////////`, `color: ${colorCode}; font-size: 20px;`)
  console.log(`%c ${announcement}`, `color: ${colorCode};`)

  if (objectToLog != null) {
    console.log(
      `%c objectToLog type => ${typeof objectToLog}`,
      `color: ${colorCode};`
    )
    console.log(`%c objectToLog => ${objectToLog}`, `color: ${colorCode};`)
    console.log(`%c as a table:`, `color: ${colorCode};`)
    console.table(objectToLog)
  } else {
    console.log(`%c alert: no object to log!!`, `color: ${colorCode};`)
  }
}
