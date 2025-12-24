import { RegisterFormValues } from '@/lib/types';
import { cn } from '@/lib/utils';
import React from 'react'
import {FieldErrors, FieldValues, Path, UseFormRegister, RegisterOptions} from 'react-hook-form'
import { BiDollar } from 'react-icons/bi';


interface InputProps<T extends FieldValues> {
    id: Path<T>;
    label: string;
    type?: string;
    disabled?: boolean;
    formatPrice?: boolean;
    required: boolean;
    register: UseFormRegister<T>;
    errors: FieldErrors<T>;
    rules?: RegisterOptions<T, Path<T>>;
}

const Input = <T extends FieldValues>({id, label, type="text", disabled, formatPrice, required=false, register, errors, rules}: InputProps<T>) => {
    return (
        <div className='w-full relative'>
            {formatPrice && (
                < BiDollar size={24} className='text-neutral-700 absolute top-5 left-2'/>
            )}

            <input 
                id={id} 
                type={type}
                min={type === 'number' ? 1 : undefined}
                disabled={disabled} 
                {...register(id, {required, ...rules})} 
                placeholder=' '
                className={cn(
                    "peer w-full p-4 pt-6 font-light bg-white border-2 rounded-md outline-none transition disabled:cursor-not-allowed",
                    formatPrice ? " pl-9" : "pl-4",
                    errors[id] ? "border-rose-500" : "border-neutral-300",
                    errors[id] ? "focus:border-rose-500" : "focus:border-black"
                )}
            />
            
            <label
                className={cn("absolute text-md duration-150 transform -translate-y-3 top-5 z-10 origin-left",
                    formatPrice ? "left-9" : "left-4",
                    "peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75", 
                    "peer-focus:-translate-y-4", errors[id] ? 'text-rose-500' : "text-zinc-400"
                )} >
                {label}
            </label>
        </div>
    )
}

export default Input
