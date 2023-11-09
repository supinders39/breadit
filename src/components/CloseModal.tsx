"use client"
import { useRouter } from 'next/navigation'
import { Button } from './ui/Button'
import { X } from 'lucide-react'

const CloseModal = () => {
    const router = useRouter();
    return <Button onClick={() => router.back()} variant='subtle' className='h-6 w-6 p-0 rounded-md' area-label='close modal'>
        <X className='h-4 w-4' />
    </Button>
}

export default CloseModal