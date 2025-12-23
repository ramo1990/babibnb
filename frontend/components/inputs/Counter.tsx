import React, { useCallback } from 'react'
import {AiOutlineMinus, AiOutlinePlus} from 'react-icons/ai'


interface CounterProps {
    title: string;
    subtitle: string;
    value: number;
    onChange: (value: number) => void;
}

// TODO : Empêcher la valeur de dépasser un maximum
const Counter = ({title, subtitle, value, onChange}: CounterProps) => {
    const onAdd = useCallback(() => {
        onChange(value + 1);
    },[onChange, value])
    
    const onReduce = useCallback(() => {
        if (value === 1) {
            return;
        }
        onChange(value - 1);
    },[onChange, value])

    return (
        <div className='flex flex-row items-center justify-between'>
            <div className='flex flex-col'>
                <div className='font-medium'>
                    {title}
                </div>
                <div className='font-light text-gray-600'>
                    {subtitle}
                </div>
            </div>
            <div className='flex flex-row items-center gap-4'>
                <button 
                    onClick={onReduce} 
                    type='button' 
                    aria-label="Decrease value" 
                    className='w-10 h-10 rounded-full border border-neutral-400 flex items-center justify-center text-neutral-600
                        cursor-pointer hover:opacity-80 transition disabled:opacity-50 disabled:cursor-not-allowed' disabled={value <= 1}>
                    <AiOutlineMinus />
                </button>
                <div className='font-light text-xl text-neutral-600'>
                    {value}
                </div>
                <button 
                    onClick={onAdd} 
                    type='button' 
                    aria-label="Increase value" 
                    className='w-10 h-10 rounded-full border border-neutral-400 flex items-center justify-center text-neutral-600
                        cursor-pointer hover:opacity-80 transition disabled:opacity-50 disabled:cursor-not-allowed'>
                    <AiOutlinePlus />
                </button>
            </div>
        </div>
    )
}

export default Counter
