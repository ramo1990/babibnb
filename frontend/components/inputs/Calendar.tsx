import React from 'react'
import { DateRange, RangeKeyDict } from 'react-date-range'
import type { Range } from 'react-date-range'
import 'react-date-range/dist/styles.css'
import 'react-date-range/dist/theme/default.css'


interface CalendarProps {
    value: Range
    onChange: (value: RangeKeyDict) => void
    disabledDates?: Date[]
}

// gerer plusieurs plages de dates c'est à dire 29 dec - 2 jan: glissement sur le mois
const Calendar = ({onChange, value, disabledDates }: CalendarProps) => {
  return (
    <DateRange 
        rangeColors={["#262626"]}
        ranges={[value]}
        date={new Date()}
        onChange={onChange}
        direction='vertical'
        // months={2}
        showDateDisplay={false}
        minDate={new Date()}
        disabledDates={disabledDates}
    />
  )
}

export default Calendar
