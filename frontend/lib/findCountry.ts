import countries from "world-countries"
import { haversineDistance } from "./distance"

interface CountryResult {
  value: string
  label: string
  flag: string
  region: string
  latlng: number[]
}

export function findCountryFromCoords(lat: number, lng: number): CountryResult | null {
  let closest = null
  let minDistance = Infinity

  for (const country of countries) {
    if (!country.latlng) continue

    const [clat, clng] = country.latlng

    const dist = haversineDistance([lat, lng], [clat, clng])

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
