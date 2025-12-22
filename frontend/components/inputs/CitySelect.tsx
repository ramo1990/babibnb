'use client'

import Select from "react-select"

interface CitySelectProps {
  cities: string[];
  value?: string;
  onChange: (value: string) => void;
}

// transformer ce composant en un select multi‑villes (multi-select)
const CitySelect = ({ cities, value, onChange }: CitySelectProps) => {
  const options = cities.map((city) => ({
    label: city,
    value: city
  }))

  return (
    <Select
      placeholder="Select a city"
      options={options}
      value={options.find((o) => o.value === value)}
      onChange={(option) => onChange(option?.value || "")}
      isClearable
    />
  )
}

export default CitySelect
