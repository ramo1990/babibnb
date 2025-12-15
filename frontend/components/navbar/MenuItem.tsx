import React from 'react'


interface MenuItemProps{
    onClick: () => void;
    label: string
}

// TODO: utiliser un button au lieu de div
const MenuItem: React.FC<MenuItemProps> = ({onClick, label}) => {
  return (
//     <button
//       type="button"
//       onClick={onClick}
//       className="px-4 py-3 w-full text-left hover:bg-neutral-100 transition font-semibold"
//     >
    <div 
        onClick={onClick}
        className='px-4 py-3 hover:bg-neutral-100 transition font-semibold'>
      {label}
    </div>
  )
}

export default MenuItem
