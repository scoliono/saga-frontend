const Routes = {
    '/': {
        slug: '/',
        label: 'Home',
        protected: false,
        guest: true,
        hidden: true
    },
    '/dashboard': {
        slug: '/dashboard',
        label: 'Home',
        icon: 'home',
        protected: true
    },
    /*
    '/wallet': {
        slug: '/wallet',
        label: 'Wallet',
        icon: 'wallet',
        subitems: {
            '/fiat': {
                slug: '/fiat',
                label: 'Local Fiat'
            },
            '/btc': {
                slug: '/btc',
                label: 'Bitcoin'
            },
            '/eth': {
                slug: '/eth',
                label: 'Ethereum'
            },
            '/usd': {
                slug: '/usd',
                label: 'SUSD'
            },
            '/ntd': {
                slug: '/ntd',
                label: 'SNTD'
            },
        }
    },
    */
    '/payrequest': {
        slug: '/payrequest',
        label: 'Pay or Request',
        icon: 'file-invoice-dollar',
        protected: true
    },
    '/convertexchange': {
        slug: '/convertexchange',
        label: 'Convert or Exchange',
        icon: 'exchange-alt',
        protected: true
    },
    /*
    '/points': {
        slug: '/points',
        label: 'Points Back',
        icon: 'file-powerpoint'
    },
    */
    '/history': {
        slug: '/history',
        label: 'History',
        icon: 'file-alt',
        protected: true
    },
    '/profile': {
        slug: '/profile',
        label: 'Profile',
        icon: 'user-alt',
        protected: true
    },
    /*
    '/payment': {
        slug: '/payment',
        label: 'Payment Methods',
        icon: 'hand-holding-usd'
    },
    */
    '/support': {
        slug: '/support',
        label: 'Support',
        icon: 'question-circle',
        protected: false
        /*
        subitems: {
            '/terms': {
                slug: '/terms',
                label: 'Terms & Conditions'
            }
        }
        */
    },
    '/login': {
        slug: '/login',
        label: 'Login',
        hidden: true,
        protected: false,
        guest: true
    },
    '/register': {
        slug: '/register',
        label: 'Register',
        hidden: true,
        protected: false,
        guest: true
    },
    '/email/verify': {
        slug: '/email/verify',
        label: 'Verify Email',
        hidden: true,
        protected: true
    }
};

module.exports = Routes;
