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

const today = new Date()

const Calendar = ({onChange, value, disabledDates }: CalendarProps) => {
  return (
    <DateRange 
        rangeColors={["#262626"]}
        ranges={[value]}
        date={today}
        onChange={onChange}
        direction='vertical'
        // months={2}
        showDateDisplay={false}
        minDate={today}
        disabledDates={disabledDates}
    />
  )
}

export default Calendar
