

import { useRouter } from 'next/router';
import { useEffect } from 'react';

export const useAuth = () => {
    const router = useRouter();

    useEffect(() => {
        if (typeof window !== 'undefined') {

            const accessToken = localStorage.getItem('accesToken');

            
            if (!accessToken) {
                router.push('/');
            }
        }
    }, []);

    

    return {
        isAuthenticated: typeof window !== 'undefined' && !!localStorage.getItem('accesToken'),
        
    };
};
