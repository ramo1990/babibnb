'use client'

import Select from "react-select"


export interface CitySelectValue {
    name: string,
    latlng: number[]
}

interface CitySelectProps {
  cities: CitySelectValue[];
  value?: CitySelectValue | null;
  onChange: (city: CitySelectValue | null) => void;
}

interface CityOption {
  label: string
  value: CitySelectValue
}
// TODO: transformer ce composant en un select multi‑villes (multi-select), ajouter un debounce / search
const CitySelect = ({ cities, value, onChange }: CitySelectProps) => {
  const options: CityOption[]  = cities.map((city) => ({
    label: city.name,
    value: city,
  }))

  return (
    <Select
      placeholder="Select a city"
      options={options}
      value={ value ? {label : value.name, value} : null}
      onChange={(option: CityOption | null) => onChange(option?.value ?? null)}
      isClearable
    />
  )
}

export default CitySelect
