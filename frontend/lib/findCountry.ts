import countries from "world-countries"

export function findCountryFromCoords(lat: number, lng: number) {
  let closest = null
  let minDistance = Infinity

  for (const country of countries) {
    if (!country.latlng) continue

    const [clat, clng] = country.latlng

    // Distance simple au centre du pays
    const dist = Math.sqrt((lat - clat) ** 2 + (lng - clng) ** 2)

    if (dist < minDistance) {
      minDistance = dist
      closest = country
    }
  }

  if (!closest) return null

  return {
    value: closest.cca2,
    label: closest.translations?.fra?.common || closest.name.common,
    flag: closest.flag,
    region: closest.region,
    latlng: closest.latlng
  }
}
