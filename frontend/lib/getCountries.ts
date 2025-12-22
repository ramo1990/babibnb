import countries from 'world-countries'

const formattedCountries = countries.map((country) => ({
    value: country.cca2,
    label: country.translations?.fra?.common || country.name.common,
    flag: country.flag,
    latlng: country.latlng,
    region: country.region
}))

const getCountries = () => {
    const getAll = () => formattedCountries;

    const getByValue = (value: string) => {
        return formattedCountries.find((item) => item.value === value)
    }
    return {
        getAll, getByValue
    }
}

export default getCountries