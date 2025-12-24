'use client'

import { useRouter } from 'next/navigation';
import Heading from './Heading';
import { Button } from './ui/button';


interface EmptyStateProps {
    title?: string;
    subtitle?: string;
    showReset?: boolean;
}

const EmptyState = ({title= 'No exact matches', subtitle='Try changing or removing some of your filtres', showReset}: EmptyStateProps) => {
    const router = useRouter()

    return (
        <div className='h-[60vh] flex flex-col gap-2 justify-center items-center '>
            <Heading center title={title} subtitle={subtitle} />
            {showReset && (
                <Button variant='outline' label='Remove all filters' className="w-auto px-6 cursor-pointer hover:bg-neutral-200" onClick={() => router.push('/')} />
            )}
        </div>
    )
}

export default EmptyState
