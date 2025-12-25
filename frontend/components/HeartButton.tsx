import useFavorite from '@/lib/useFavorite';
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai';


interface HeartButtonProps {
    listingId: string;
}

const HeartButton = ({listingId}: HeartButtonProps) => {
    const {hasFavorited, toggleFavorite} = useFavorite({listingId})

    return (
        <div onClick={toggleFavorite} className='relative hover:opacity-80 transition cursor-pointer'>
            <AiOutlineHeart size={28} className='fill-white absolute -top-0.5 -right-0.5'/>
            <AiFillHeart size={24} className={hasFavorited ? 'fill-rose-500' : 'fill-neutral-500/70'} />
        </div>
    )
}

export default HeartButton
