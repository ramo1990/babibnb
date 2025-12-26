import React from 'react'
import { Range } from 'react-date-range'
import Calendar from '../inputs/Calendar'
import { Button } from '../ui/button'


interface ListingReservationProps {
  price: number
  dateRange: Range
  totalPrice: number
  onChangeDate: (value: Range) => void
  onSubmit: () => void
  disabled?: boolean
  disabledDates: Date[]
}

const ListingReservation = ({price, dateRange, totalPrice, onChangeDate, onSubmit, disabled, disabledDates} : ListingReservationProps) => {
  return (
    <div className='bg-white rounded-xl border border-neutral-200 overflow-hidden'>
      
      {/* Affichage du prix par nuit */}
      <div className='flex flex-row items-center gap-1 p-4'>
        <div className='text-2xl font-semibold'>
          $ {price}
        </div>
        <div className='font-light text-neutral-600'>
          per night
        </div>
      </div>
      <hr />

      {/* Le calendrier */}
      <Calendar 
        value={dateRange}
        disabledDates={disabledDates}
        onChange={(value) => onChangeDate(value.selection)}
      />
      <hr />

      {/* Le bouton “Reserve” */}
      <div className='p-4'>
        <Button disabled={disabled} label='Reserve' onClick={onSubmit} />
      </div>

      {/* Affichage du total */}
      <div className='p-4 flex flex-row items-center justify-between font-semibold text-lg'>
        <div>Total</div>
        <div>$ {totalPrice}</div>
      </div>
    </div>
  )
}

export default ListingReservation
